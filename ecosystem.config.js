module.exports = {
  apps: [
    {
      name: 'web-pc-dev',
      script: 'npm',
      args: 'run start',
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
      log_file: './logs/web-pc-dev.log',
      out_file: './logs/web-pc-dev-out.log',
      error_file: './logs/web-pc-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'web-pc-ssr',
      script: 'npm',
      args: 'run serve:ssr:web-pc',
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
      log_file: './logs/web-pc-ssr.log',
      out_file: './logs/web-pc-ssr-out.log',
      error_file: './logs/web-pc-ssr-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'backstage-dev',
      script: 'npm',
      args: 'run start:backstage',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 4201
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4201
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/backstage-dev.log',
      out_file: './logs/backstage-dev-out.log',
      error_file: './logs/backstage-dev-error.log',
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
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
