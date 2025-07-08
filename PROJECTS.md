# 项目拆分说明

本项目已拆分为两个独立的Angular应用：

## 项目结构

- **web-pc**: 前台网站，支持SSR（服务端渲染）
- **backstage**: 管理后台，仅客户端渲染

## 开发命令

### Web-PC (前台网站)

```bash
# 开发模式启动
npm run start
# 或
ng serve web-pc

# 构建项目
npm run build
# 或
ng build web-pc

# 启动SSR服务器
npm run serve:ssr:web-pc
```

### Backstage (管理后台)

```bash
# 开发模式启动
npm run start:backstage
# 或
ng serve backstage

# 构建项目
npm run build:backstage
# 或
ng build backstage
```

## PM2 部署

### 启动所有服务

```bash
npm run pm2:start
```

### 启动特定服务

```bash
# 启动web-pc开发服务器
npm run pm2:start:dev

# 启动web-pc SSR服务器
npm run pm2:start:ssr

# 启动backstage开发服务器
npm run pm2:start:backstage
```

### 端口配置

- **web-pc**: http://localhost:4200 (开发) / http://localhost:4000 (SSR)
- **backstage**: http://localhost:4201/backstage (开发)

## 项目特点

### Web-PC

- ✅ 支持SSR（服务端渲染）
- ✅ SEO友好
- ✅ 前台用户界面
- ✅ 使用 `wp-` 前缀的组件选择器
- ✅ 打包输出到 `dist/web-pc`

### Backstage

- ✅ 仅客户端渲染
- ✅ 管理后台界面
- ✅ 使用 `bs-` 前缀的组件选择器
- ✅ 包含完整的后台管理功能
- ✅ 所有路由以 `/backstage` 开头
- ✅ 打包输出到 `dist/backstage`

## 文件结构

```
src/
├── app/
│   ├── web-pc/          # 前台网站
│   │   ├── main.ts      # 入口文件
│   │   ├── app.ts       # 根组件
│   │   ├── app.config.ts # 应用配置
│   │   ├── app.routes.ts # 路由配置
│   │   ├── server.ts    # SSR服务器
│   │   ├── main.server.ts # 服务器端入口
│   │   └── ...
│   └── backstage/       # 管理后台
│       ├── main.ts      # 入口文件
│       ├── app.ts       # 根组件
│       ├── app.config.ts # 应用配置
│       ├── app.routes.ts # 路由配置
│       └── ...
├── libs/                # 共享库
├── db/                  # 数据库相关
└── server/              # 后端API
```

## 注意事项

1. 两个项目共享相同的依赖和配置
2. 共享的代码放在 `src/libs/` 目录下
3. 数据库和API服务是共享的
4. 每个项目都有独立的构建输出目录：
   - web-pc: `dist/web-pc`
   - backstage: `dist/backstage`
5. 使用不同的组件前缀避免冲突
6. backstage项目打包后部署到 `/backstage` 路径
7. web-pc项目打包后部署到根路径 `/`
