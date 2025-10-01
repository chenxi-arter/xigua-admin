## 后端部署

1. 进入后端目录

```bash
cd backend
npm install
```

- 可在 `.env` 中配置后端端口等环境变量
- 后端有两个服务：客户端 API 和 管理端 API（同一项目的不同入口）

### 单独启动客户端 API（端口读取自 `.env` 的 `CLIENT_PORT`）

```bash
pm2 start /your/deploy/path/backend/ecosystem.client.config.js
```

### 单独启动管理端 API（端口读取自 `.env` 的 `ADMIN_PORT`）

```bash
pm2 start /your/deploy/path/backend/ecosystem.admin.config.js
```

### 同一环境同时启动两个服务（分别读取 `CLIENT_PORT` 和 `ADMIN_PORT`）

```bash
pm2 start /your/deploy/path/backend/ecosystem.config.js
```

---

## 管理端（前端）

- 访问端口默认：`4173`
- 默认读取后端地址：`127.0.0.1:9090/api`
- 如果不在同一台机器，需要替换为实际域名后重新打包

启动示例：

```bash
cd ./admin/dist
npx serve -s . -l 4173
```

---
请勿修改
# JWT
JWT_SECRET=very-secret-key
JWT_EXPIRES_IN=7d

# Telegram Bot（找 @BotFather 获取）
TELEGRAM_BOT_TOKEN=8326325358:AAF-0oUGqae0X34i35PgD7Q7nctyc9LCNBI

后端具体env配置已在我这边希望管理后端的 API 能够通过域名访问，并且对特定的ip能开白名单



