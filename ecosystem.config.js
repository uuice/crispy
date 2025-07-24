module.exports = {
  apps: [
    {
      name: 'crispy-dev',
      script: 'bun',
      args: 'run --env-file ./.env ng serve',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 4200
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4200
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-dev.log',
      out_file: './logs/crispy-dev-out.log',
      error_file: './logs/crispy-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'crispy-ssr',
      script: 'bun',
      args: 'run --env-file ./.env dist/crispy/server/server.mjs',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-ssr.log',
      out_file: './logs/crispy-ssr-out.log',
      error_file: './logs/crispy-ssr-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'crispy-watch',
      script: 'bun',
      args: 'run --env-file ./.env ng build --watch --configuration development',
      cwd: './',
      env: {
        NODE_ENV: 'development'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-watch.log',
      out_file: './logs/crispy-watch-out.log',
      error_file: './logs/crispy-watch-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:username/crispy.git',
      path: '/var/www/production',
      'pre-deploy-local': '',
      'post-deploy': 'bun install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
