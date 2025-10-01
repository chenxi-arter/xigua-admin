// PM2 配置：客户端 API 独立进程
// 特性：
// - 使用配置文件所在目录作为运行目录（与部署路径无关）
// - 预加载 dotenv 并从同级 .env 读取环境变量
// - 客户端日志单独文件

const path = require('path');
const baseDir = __dirname;

module.exports = {
  apps: [
    {
      name: 'short-drama-client-api',
      script: 'dist/src/main.client.js',
      cwd: baseDir,
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        CLIENT_PORT: 8080,
        DOTENV_CONFIG_PATH: path.join(baseDir, '.env'),
      },
      node_args: ['-r', 'dotenv/config'],
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      log_file: './logs/client.combined.log',
      out_file: './logs/client.out.log',
      error_file: './logs/client.error.log',
      merge_logs: true,
      max_memory_restart: '1G',
    },
  ],
};


