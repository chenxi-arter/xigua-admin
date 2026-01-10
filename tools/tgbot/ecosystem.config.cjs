// PM2 配置文件
module.exports = {
  apps: [{
    name: 'telegram-bot',
    script: './bot.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    
    // 环境变量
    env: {
      NODE_ENV: 'production'
    },
    
    // 日志配置（精简版）
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    
    // 日志轮转配置（更严格）
    max_size: '5M',          // 单文件最大 5M（之前 10M）
    retain: 5,               // 只保留 5 个历史文件（之前 10 个）
    compress: true,
    
    // 进程管理
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // 自动重启策略
    exp_backoff_restart_delay: 100,
    
    // 监控
    listen_timeout: 10000,
    kill_timeout: 5000,
    
    // 环境检测
    node_args: '--max-old-space-size=512'
  }]
};

