## short-drama 部署指南

本项目包含后端 API 与前端构建产物。推荐端口分配：后端 8080，前端 8081（静态托管并代理 `/api` 到后端）。

## 环境要求
- Node.js 18+（建议 LTS）
- MySQL（你当前是 Docker 映射: 宿主 3307 → 容器 3306）
- Redis（默认 6379）

## 后端部署（backend）
1) 安装依赖
```bash
cd backend
npm ci --no-audit --no-fund
```

2) 配置环境变量（在 `backend/.env`）
```bash
PORT=8080
API_PREFIX=api
NODE_ENV=production

JWT_SECRET=devsecret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# MySQL（以下示例对齐 Docker 宿主端口 3307）
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASS=123456
DB_NAME=short_drama
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=0
REDIS_TTL=300
```

3) 启动后端（任选其一）
- 在 `backend` 目录直接启动（自动读取 `.env`）
```bash
node dist/src/main.js
```
- 显式指定 `.env`（不受当前目录影响）
```bash
node -r dotenv/config dist/src/main.js dotenv_config_path=$(pwd)/.env
```

4) 健康检查
```bash
curl http://127.0.0.1:8080/api/health
```

## 前端部署（frontend/dist）

### 方式 A：Node 代理静态服务（推荐，免改包）
静态托管 `frontend/dist`，并将 `/api/*` 转发到 `http://127.0.0.1:8080/api/*`。

1) 安装一次依赖（首次需要）
```bash
cd frontend
npm init -y
npm i express http-proxy-middleware
```

2) 创建 `frontend/server.js`
```js
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const DIST = path.join(__dirname, 'dist');

// 注意：因使用 app.use('/api', ...) 时 Express 会去掉前缀，
// 所以用 pathRewrite 再补上 /api，确保后端仍收到 /api/*
app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:8080',
  changeOrigin: true,
  pathRewrite: (path) => '/api' + path,
}));

app.use(express.static(DIST));

// SPA 回退：非 /api 且是 GET，返回 index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(DIST, 'index.html'));
  }
  next();
});

app.listen(8081, () => console.log('Frontend: http://127.0.0.1:8081'));
```

3) 启动前端服务
```bash
node server.js
# 打开 http://127.0.0.1:8081
# 通过代理验证： http://127.0.0.1:8081/api/health
```

### 方式 B：Nginx（生产推荐）
Nginx 静态托管 `frontend/dist`，将 `/api/` 反代到后端。

示例配置：
```nginx
server {
    listen 80;
    server_name your.domain.com;

    root /path/to/short-drama/frontend/dist;
    index index.html;

    # 前端静态资源
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反向代理 API 到后端 8080
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 常见问题排查（FAQ）
- 前端“没有数据”：
  - 确认访问的是 `http://127.0.0.1:8081`（而非随机端口如 60658）
  - `http://127.0.0.1:8081/api/health` 应返回 JSON
  - 浏览器 Network 中确认请求走 `8081/api/...` 并 200 返回

- 端口占用（EADDRINUSE）：
```bash
lsof -t -i :8080 | xargs -r kill -9
lsof -t -i :8081 | xargs -r kill -9
```

- 缺少 `JWT_SECRET`：
  - 在 `backend/.env` 填写 `JWT_SECRET=...`，并确保进程读取了该文件（从 `backend` 启动或用 `-r dotenv/config` 指定）

- SQLite 类型不兼容：
  - 代码实体使用 MySQL 的 `timestamp` 等类型，不兼容 sqlite。如需快速运行，请使用 MySQL，而非切到 sqlite。

- 数据库连接失败（ECONNREFUSED）：
  - 确认 MySQL 监听端口（本地 Docker 是 3307）与账号密码、库名
  - 示例探测：`nc -zv 127.0.0.1 3307`

## 验证清单
- 后端：`curl http://127.0.0.1:8080/api/health`
- 前端首页：`http://127.0.0.1:8081`
- 前端代理健康：`http://127.0.0.1:8081/api/health`


