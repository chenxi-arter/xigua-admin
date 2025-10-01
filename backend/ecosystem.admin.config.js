// PM2 配置：管理端 API 独立进程
// 特性：
// - 使用配置文件所在目录作为运行目录（与部署路径无关）
// - 预加载 dotenv 并从同级 .env 读取环境变量
// - 管理端日志单独文件

const path = require('path');
const baseDir = __dirname;

module.exports = {
  apps: [
    {
      name: 'short-drama-admin-api',
      script: 'dist/src/main.admin.js',
      cwd: baseDir,
      instances: '1',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        ADMIN_PORT: 9090,
        DOTENV_CONFIG_PATH: path.join(baseDir, '.env'),
      },
      node_args: ['-r', 'dotenv/config'],
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      log_file: './logs/admin.combined.log',
      out_file: './logs/admin.out.log',
      error_file: './logs/admin.error.log',
      merge_logs: true,
      max_memory_restart: '1G',
    },
  ],
};


