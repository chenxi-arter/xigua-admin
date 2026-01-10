# 西瓜短剧 Telegram Bot

一个简单的 Telegram Bot，用于推广西瓜短剧平台。

## 功能特点

- ✅ 自动回复文字消息（带图片）
- ✅ Web App 按钮（在 Telegram 内打开网页）
- ✅ PM2 进程管理和健康检查

## 快速部署

### 1. 配置 Bot Token

从 @BotFather 获取 Bot Token，编辑 `.env` 文件：

```env
BOT_TOKEN=你的真实Bot_Token
```

**重要**：确保使用真实的 Bot Token，格式类似：`1234567890:ABCdefGhIJKlmNOPQRSTUVWXYZ`

### 2. 配置网站链接（可选）

如需修改网站地址，编辑 `config.js`：

```javascript
export default {
  website: 'm.xgshort.com'  // 修改为你的网站域名
};
```

### 3. 部署运行

```bash
# 一键部署（推荐）
./deploy.sh --pm2
```

## 管理命令

```bash
# 查看运行状态
pm2 status

# 查看日志
pm2 logs telegram-bot

# 重启 Bot
pm2 restart telegram-bot

# 停止 Bot
pm2 stop telegram-bot

# 监控面板
pm2 monit
```

## Bot 功能

用户可以使用以下命令：

- `/start` - 显示欢迎消息和网站链接
- `/help` - 显示帮助信息
- `/website` - 获取网站链接
- **发送任意文字** - Bot 自动回复推广消息

## 常见问题

### Bot 启动失败 "404: Not Found"

检查 `.env` 文件中的 `BOT_TOKEN` 是否为真实 Token：

```bash
# 检查 Token 是否有效
curl -s "https://api.telegram.org/bot你的Token/getMe"
```

如果返回 404，说明 Token 无效，需要从 @BotFather 重新获取。

### 端口冲突

如果默认端口 3000 被占用，在 `.env` 中设置：

```env
HEALTH_CHECK_PORT=3001
```

## 项目结构

```
tgbot/
├── bot.js                  # 主程序
├── config.js               # 网站配置
├── .env                    # Bot Token 配置
├── deploy.sh               # 部署脚本
├── ecosystem.config.cjs    # PM2 配置
└── package.json            # 依赖管理
```

## 注意事项

1. ⚠️ 保护好 Bot Token，不要泄露
2. ✅ 确保 `.env` 文件中使用真实 Token
3. ✅ 部署前测试 Token 有效性
