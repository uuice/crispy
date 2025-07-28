# PM2 使用指南

本指南介绍如何使用 PM2 来管理 Crispy 项目的进程。

## 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 或者使用 bun
bun add -g pm2
```

## 快速开始

### 1. 使用 bun 脚本（推荐）

```bash
# 启动所有应用
bun run pm2:start

# 启动开发服务器
bun run pm2:start:dev

# 启动 SSR 服务器
bun run pm2:start:ssr

# 启动构建监听
bun run pm2:start:watch

# 启动生产环境
bun run pm2:start:prod
```

### 2. 直接使用 PM2 命令

```bash
# 启动开发服务器
pm2 start bun --name "crispy-dev" -- run start

# 启动 SSR 服务器
pm2 start bun --name "crispy-ssr" -- run serve:ssr:crispy

# 启动构建监听
pm2 start bun --name "crispy-watch" -- run watch
```

### 3. 使用配置文件

```bash
# 启动所有应用
pm2 start ecosystem.config.js

# 启动特定应用
pm2 start ecosystem.config.js --only crispy-dev

# 启动生产环境
pm2 start ecosystem.config.js --env production
```

## 管理命令

### 查看状态

```bash
# 查看所有进程状态
bun run pm2:status
# 或
pm2 status
pm2 list
```

### 停止进程

```bash
# 停止所有应用
bun run pm2:stop

# 停止特定应用
pm2 stop crispy-dev
pm2 stop crispy-ssr
```

### 重启进程

```bash
# 重启所有应用
bun run pm2:restart

# 重启特定应用
pm2 restart crispy-dev
```

### 重载进程（零停机重启）

```bash
# 重载所有应用
bun run pm2:reload

# 重载特定应用
pm2 reload crispy-dev
```

### 删除进程

```bash
# 删除所有应用
bun run pm2:delete

# 删除特定应用
pm2 delete crispy-dev
```

## 监控和日志

### 查看日志

```bash
# 查看所有日志
bun run pm2:logs

# 查看特定应用日志
pm2 logs crispy-dev
pm2 logs crispy-ssr

# 实时查看日志
pm2 logs --follow
```

### 监控面板

```bash
# 打开监控面板
bun run pm2:monit
# 或
pm2 monit
```

### 查看详细信息

```bash
# 查看应用详细信息
pm2 show crispy-dev
pm2 show crispy-ssr
```

## 配置文件说明

### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'crispy-dev', // 应用名称
      script: 'bun', // 执行脚本
      args: 'run --env-file ./.env ng serve', // 脚本参数
      cwd: './', // 工作目录
      env: {
        // 开发环境变量
        NODE_ENV: 'development',
        PORT: 4200
      },
      env_production: {
        // 生产环境变量
        NODE_ENV: 'production',
        PORT: 4200
      },
      instances: 1, // 实例数量
      autorestart: true, // 自动重启
      watch: false, // 文件监听
      max_memory_restart: '1G', // 内存限制
      log_file: './logs/crispy-dev.log', // 日志文件
      out_file: './logs/crispy-dev-out.log', // 输出日志
      error_file: './logs/crispy-dev-error.log', // 错误日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z' // 日志时间格式
    }
  ]
}
```

## 应用说明

### crispy-dev

- **用途**: 开发服务器
- **命令**: `bun run start`
- **端口**: 4200
- **环境**: development

### crispy-ssr

- **用途**: SSR 服务器
- **命令**: `bun run serve:ssr:crispy`
- **端口**: 4000
- **环境**: production

### crispy-watch

- **用途**: 构建监听
- **命令**: `bun run watch`
- **环境**: development

## 常用场景

### 开发环境

```bash
# 启动开发服务器
bun run pm2:start:dev

# 查看日志
pm2 logs crispy-dev --follow
```

### 生产环境

```bash
# 构建项目
bun run build

# 启动 SSR 服务器
bun run pm2:start:ssr

# 查看状态
bun run pm2:status
```

### 部署更新

```bash
# 重载应用（零停机）
bun run pm2:reload

# 或者重启
bun run pm2:restart
```

## 故障排除

### 进程无法启动

1. 检查端口是否被占用
2. 检查环境变量配置
3. 查看错误日志：`pm2 logs crispy-dev`

### 内存不足

1. 调整 `max_memory_restart` 配置
2. 检查应用内存使用：`pm2 monit`

### 日志文件过大

1. 配置日志轮转
2. 定期清理日志文件

## 高级配置

### 集群模式

```javascript
{
  name: 'crispy-ssr',
  script: 'bun',
  args: 'run --env-file ./.env dist/crispy/server/server.mjs',
  instances: 'max',  // 使用所有 CPU 核心
  exec_mode: 'cluster'
}
```

### 环境变量

```javascript
{
  env: {
    NODE_ENV: 'development',
    PORT: 4200,
    DB_HOST: 'localhost',
    DB_PORT: 3306
  }
}
```

### 健康检查

```javascript
{
  health_check_grace_period: 3000,
  health_check_fatal_exceptions: true
}
```
