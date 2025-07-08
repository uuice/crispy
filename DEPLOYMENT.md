# 部署说明

## 构建项目

### 构建所有项目

```bash
# 构建web-pc项目（支持SSR）
npm run build

# 构建backstage项目
npm run build:backstage
```

### 构建输出目录

- **web-pc**: `dist/web-pc/`
- **backstage**: `dist/backstage/`

## 部署配置

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;

    # Web-PC 前台网站 (根路径)
    location / {
        try_files $uri $uri/ /index.html;
        root /var/www/html/web-pc;
    }

    # Backstage 管理后台 (/backstage路径)
    location /backstage {
        alias /var/www/html/backstage;
        try_files $uri $uri/ /backstage/index.html;
    }

    # API接口
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache配置示例

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html

    # Web-PC 前台网站
    Alias / /var/www/html/web-pc/
    <Directory /var/www/html/web-pc>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Backstage 管理后台
    Alias /backstage /var/www/html/backstage
    <Directory /var/www/html/backstage>
        RewriteEngine On
        RewriteBase /backstage/
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /backstage/index.html [L]
    </Directory>

    # API代理
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</VirtualHost>
```

## PM2部署

### 开发环境

```bash
# 启动web-pc开发服务器
npm run pm2:start:dev

# 启动backstage开发服务器
npm run pm2:start:backstage

# 启动web-pc SSR服务器
npm run pm2:start:ssr
```

### 生产环境

```bash
# 构建项目
npm run build
npm run build:backstage

# 启动所有服务
npm run pm2:start:prod
```

## 目录结构

部署后的目录结构应该是：

```
/var/www/html/
├── web-pc/              # 前台网站
│   ├── index.html
│   ├── browser/
│   ├── server/
│   └── assets/
└── backstage/           # 管理后台
    ├── index.html
    ├── browser/
    └── assets/
```

## 访问地址

- **前台网站**: http://your-domain.com/
- **管理后台**: http://your-domain.com/backstage/
- **API接口**: http://your-domain.com/api/

## 注意事项

1. **路径配置**: backstage项目配置了 `baseHref: "/backstage/"`，确保部署到正确的路径
2. **路由重写**: 需要配置服务器重写规则，支持Angular的客户端路由
3. **静态资源**: 确保静态资源（图片、文件等）能正确访问
4. **API代理**: 配置API接口的代理，避免跨域问题
5. **缓存策略**: 对静态资源设置适当的缓存策略
6. **HTTPS**: 生产环境建议使用HTTPS
