module.exports = {
  apps: [
    {
      name: 'short-drama-api',
      script: 'dist/src/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        DOTENV_CONFIG_PATH: `${process.cwd()}/.env`,
      },
      env_production: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: `${process.cwd()}/.env`,
      },
      node_args: [
        '-r',
        'dotenv/config'
      ],
      cwd: process.cwd(),
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
    },
  ],
};
