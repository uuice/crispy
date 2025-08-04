module.exports = {
  apps: [
    // Development server - Bun version
    {
      name: 'crispy-dev-bun',
      script: 'bun',
      args: 'run --env-file ./.env ng serve',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 4200,
        RUNTIME: 'bun'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4200,
        RUNTIME: 'bun'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-dev-bun.log',
      out_file: './logs/crispy-dev-bun-out.log',
      error_file: './logs/crispy-dev-bun-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    // Development server - Node.js version
    {
      name: 'crispy-dev-node',
      script: 'node',
      args: '--max-old-space-size=1024 ./node_modules/@angular/cli/bin/ng serve',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 4200,
        RUNTIME: 'node'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4200,
        RUNTIME: 'node'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-dev-node.log',
      out_file: './logs/crispy-dev-node-out.log',
      error_file: './logs/crispy-dev-node-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    // SSR server - Bun version (optimized for Bun's memory characteristics)
    {
      name: 'crispy-ssr-bun',
      script: 'bun',
      args: '--env-file ./.env dist/crispy/server/server.mjs',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        RUNTIME: 'bun',
        // Bun-specific optimizations
        BUN_GC_INTERVAL: '30000',
        BUN_MAX_HEAP_SIZE: '512'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        RUNTIME: 'bun',
        BUN_GC_INTERVAL: '30000',
        BUN_MAX_HEAP_SIZE: '512'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M', // Higher threshold for Bun
      log_file: './logs/crispy-ssr-bun.log',
      out_file: './logs/crispy-ssr-bun-out.log',
      error_file: './logs/crispy-ssr-bun-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Health check for Bun
      health_check_grace_period: 5000,
      health_check_fatal_exceptions: true
    },
    // SSR server - Node.js version (optimized for Node.js memory management)
    {
      name: 'crispy-ssr-node',
      script: 'node',
      args: '--expose-gc --max-old-space-size=512 --env-file ./.env dist/crispy/server/server.mjs',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        RUNTIME: 'node',
        // Node.js-specific optimizations
        NODE_OPTIONS: '--max-old-space-size=512 --expose-gc',
        GC_INTERVAL: '30000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        RUNTIME: 'node',
        NODE_OPTIONS: '--max-old-space-size=512 --expose-gc',
        GC_INTERVAL: '30000'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '600M', // Lower threshold for Node.js
      log_file: './logs/crispy-ssr-node.log',
      out_file: './logs/crispy-ssr-node-out.log',
      error_file: './logs/crispy-ssr-node-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Health check for Node.js
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    },
    // Watch build - Bun version
    {
      name: 'crispy-watch-bun',
      script: 'bun',
      args: 'run --env-file ./.env ng build --watch --configuration development',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        RUNTIME: 'bun'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-watch-bun.log',
      out_file: './logs/crispy-watch-bun-out.log',
      error_file: './logs/crispy-watch-bun-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    // Watch build - Node.js version
    {
      name: 'crispy-watch-node',
      script: 'node',
      args: '--max-old-space-size=1024 ./node_modules/@angular/cli/bin/ng build --watch --configuration development',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        RUNTIME: 'node'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/crispy-watch-node.log',
      out_file: './logs/crispy-watch-node-out.log',
      error_file: './logs/crispy-watch-node-error.log',
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
