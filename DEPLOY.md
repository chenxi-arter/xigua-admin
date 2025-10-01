# 西瓜短剧系统部署指南

## 环境要求
- Node.js 18+（建议 LTS）
- MySQL
- Redis（默认 6379）
- PM2（生产环境）

## 快速部署

### 1. 后端部署
```bash
cd backend
npm ci --no-audit --no-fund
npm i pm2 -g
```

创建 `backend/.env` 文件：
```bash
PORT=8080
API_PREFIX=api
NODE_ENV=production

JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# MySQL
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

启动后端：
```bash
pm2 start ecosystem.config.js --env production
```

### 2. 前端部署
```bash
cd frontend
npm ci
node server.js
# 或使用 PM2: pm2 start server.js --name "xigua-frontend"
```

## 验证部署
- 后端健康检查：`curl http://127.0.0.1:8080/api/health`
- 前端访问：`http://127.0.0.1:8081`
- API 代理测试：`http://127.0.0.1:8081/api/health`

## 常见问题
- 端口占用：`lsof -t -i :8080 | xargs kill -9`
- JWT_SECRET 错误：确保 `.env` 文件存在且配置正确
- 数据库连接失败：检查 MySQL 服务和端口配置
- 前端空白页面：检查 API 代理是否正常工作

## PM2 管理命令
```bash
pm2 status              # 查看状态
pm2 logs                # 查看日志
pm2 restart all         # 重启所有服务
pm2 stop all            # 停止所有服务
pm2 startup             # 设置开机自启
pm2 save                # 保存当前进程列表
```