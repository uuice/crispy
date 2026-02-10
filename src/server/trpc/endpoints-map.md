# API 端点映射文档

> ✅ **已完成**: 所有 admin 路由的 tRPC 实现已完成
> ✅ **已完成**: content 路由基础框架已建立
> 🔄 **进行中**: content 路由具体业务逻辑实现

## Admin 路由端点 (需要 JWT 认证) - ✅ 已完成

## Admin 路由端点 (需要 JWT 认证)

### 用户管理

- `POST /admin/login` -> `auth.login`
- `POST /admin/logout` -> `auth.logout`
- `GET /admin/users` -> `user.list`
- `GET /admin/users/:id` -> `user.getById`
- `POST /admin/users` -> `user.create`
- `PUT /admin/users/:id` -> `user.update`
- `DELETE /admin/users/:id` -> `user.delete`
- `POST /admin/users/:id/reset-password` -> `auth.resetPassword`

### 文章管理

- `GET /admin/articles` -> `article.list`
- `GET /admin/articles/:id` -> `article.getById`
- `POST /admin/articles` -> `article.create`
- `PUT /admin/articles/:id` -> `article.update`
- `DELETE /admin/articles/:id` -> `article.delete`

### 分类管理

- `GET /admin/categories` -> `category.list`
- `GET /admin/categories/tree` -> `category.tree`
- `GET /admin/categories/:id` -> `category.getById`
- `POST /admin/categories` -> `category.create`
- `PUT /admin/categories/:id` -> `category.update`
- `DELETE /admin/categories/:id` -> `category.delete`

### 标签管理

- `GET /admin/tags` -> `tag.list`
- `GET /admin/tags/:id` -> `tag.getById`
- `POST /admin/tags` -> `tag.create`
- `PUT /admin/tags/:id` -> `tag.update`
- `DELETE /admin/tags/:id` -> `tag.delete`

### 评论管理

- `GET /admin/comments` -> `comment.list`
- `GET /admin/comments/:id` -> `comment.getById`
- `POST /admin/comments` -> `comment.create`
- `PUT /admin/comments/:id` -> `comment.update`
- `DELETE /admin/comments/:id` -> `comment.delete`
- `POST /admin/comments/batch-update-status` -> `comment.batchUpdateStatus`
- `POST /admin/comments/batch-delete` -> `comment.batchDelete`
- `GET /admin/comments/stats` -> `comment.stats`

### 配置管理

- `GET /admin/configs` -> `config.list`
- `GET /admin/configs/:id` -> `config.getById`
- `GET /admin/configs/alias/:alias` -> `config.getByAlias`
- `POST /admin/configs` -> `config.create`
- `POST /admin/configs/upsert` -> `config.upsert`
- `PUT /admin/configs/:id` -> `config.update`
- `DELETE /admin/configs/:id` -> `config.delete`

### 链接管理

- `GET /admin/links` -> `link.list`
- `GET /admin/links/:id` -> `link.getById`
- `POST /admin/links` -> `link.create`
- `PUT /admin/links/:id` -> `link.update`
- `DELETE /admin/links/:id` -> `link.delete`

### 菜单管理

- `GET /admin/menus` -> `menu.list`
- `GET /admin/menus/tree` -> `menu.tree`
- `GET /admin/menus/:id` -> `menu.getById`
- `POST /admin/menus` -> `menu.create`
- `PUT /admin/menus/:id` -> `menu.update`
- `DELETE /admin/menus/:id` -> `menu.delete`

### 页面管理

- `GET /admin/pages` -> `page.list`
- `GET /admin/pages/:id` -> `page.getById`
- `POST /admin/pages` -> `page.create`
- `PUT /admin/pages/:id` -> `page.update`
- `DELETE /admin/pages/:id` -> `page.delete`

### 角色管理

- `GET /admin/roles` -> `role.list`
- `GET /admin/roles/:id` -> `role.getById`
- `POST /admin/roles` -> `role.create`
- `PUT /admin/roles/:id` -> `role.update`
- `DELETE /admin/roles/:id` -> `role.delete`

### 权限规则管理

- `GET /admin/rules` -> `rule.list`
- `GET /admin/rules/tree` -> `rule.tree`
- `GET /admin/rules/:id` -> `rule.getById`
- `POST /admin/rules` -> `rule.create`
- `PUT /admin/rules/:id` -> `rule.update`
- `DELETE /admin/rules/:id` -> `rule.delete`

### 用户类型管理

- `GET /admin/user-types` -> `userType.list`
- `GET /admin/user-types/:id` -> `userType.getById`
- `POST /admin/user-types` -> `userType.create`
- `PUT /admin/user-types/:id` -> `userType.update`
- `DELETE /admin/user-types/:id` -> `userType.delete`

### 投票管理

- `GET /admin/votes` -> `vote.list`
- `GET /admin/votes/:id` -> `vote.getById`
- `POST /admin/votes` -> `vote.create`
- `PUT /admin/votes/:id` -> `vote.update`
- `DELETE /admin/votes/:id` -> `vote.delete`

### 投票项管理

- `GET /admin/vote-items` -> `voteItem.list`
- `GET /admin/vote-items/:id` -> `voteItem.getById`
- `POST /admin/vote-items` -> `voteItem.create`
- `PUT /admin/vote-items/:id` -> `voteItem.update`
- `DELETE /admin/vote-items/:id` -> `voteItem.delete`

### 属性管理

- `GET /admin/attrs` -> `attr.list`
- `GET /admin/attrs/:id` -> `attr.getById`
- `POST /admin/attrs` -> `attr.create`
- `PUT /admin/attrs/:id` -> `attr.update`
- `DELETE /admin/attrs/:id` -> `attr.delete`

### 缓存管理

- `GET /admin/caches` -> `cache.list`
- `GET /admin/caches/:id` -> `cache.getById`
- `POST /admin/caches` -> `cache.create`
- `PUT /admin/caches/:id` -> `cache.update`
- `DELETE /admin/caches/:id` -> `cache.delete`
- `GET /admin/page-cache/stats` -> `cache.stats`
- `GET /admin/page-cache/memory/list` -> `cache.memoryList`
- `DELETE /admin/page-cache/memory/:hash` -> `cache.deleteMemory`
- `GET /admin/page-cache/memory/:hash` -> `cache.getMemoryInfo`
- `POST /admin/page-cache/memory/cleanup` -> `cache.cleanupMemory`
- `GET /admin/page-cache/database/list` -> `cache.databaseList`
- `POST /admin/page-cache/database/cleanup` -> `cache.cleanupDatabase`
- `DELETE /admin/page-cache/database/:hash` -> `cache.deleteDatabase`
- `GET /admin/page-cache/database/:hash` -> `cache.getDatabaseInfo`

### 枚举管理

- `GET /admin/enums` -> `enum.list`
- `GET /admin/enums/:id` -> `enum.getById`
- `POST /admin/enums` -> `enum.create`
- `PUT /admin/enums/:id` -> `enum.update`
- `DELETE /admin/enums/:id` -> `enum.delete`

### 节假日管理

- `GET /admin/holidays` -> `holiday.list`
- `GET /admin/holidays/:id` -> `holiday.getById`
- `POST /admin/holidays` -> `holiday.create`
- `PUT /admin/holidays/:id` -> `holiday.update`
- `DELETE /admin/holidays/:id` -> `holiday.delete`

### 工作职位管理

- `GET /admin/jobs` -> `job.list`
- `GET /admin/jobs/:id` -> `job.getById`
- `POST /admin/jobs` -> `job.create`
- `PUT /admin/jobs/:id` -> `job.update`
- `DELETE /admin/jobs/:id` -> `job.delete`

### 关键词管理

- `GET /admin/keywords` -> `keyword.list`
- `GET /admin/keywords/:id` -> `keyword.getById`
- `POST /admin/keywords` -> `keyword.create`
- `PUT /admin/keywords/:id` -> `keyword.update`
- `DELETE /admin/keywords/:id` -> `keyword.delete`

### 通知管理

- `GET /admin/notices` -> `notice.list`
- `GET /admin/notices/:id` -> `notice.getById`
- `POST /admin/notices` -> `notice.create`
- `PUT /admin/notices/:id` -> `notice.update`
- `DELETE /admin/notices/:id` -> `notice.delete`

### 操作日志管理

- `GET /admin/operate-logs` -> `operateLog.list`
- `GET /admin/operate-logs/:id` -> `operateLog.getById`
- `POST /admin/operate-logs` -> `operateLog.create`
- `PUT /admin/operate-logs/:id` -> `operateLog.update`
- `DELETE /admin/operate-logs/:id` -> `operateLog.delete`

### API 日志管理

- `GET /admin/api-logs` -> `apiLog.list`
- `GET /admin/api-logs/:id` -> `apiLog.getById`
- `POST /admin/api-logs` -> `apiLog.create`
- `PUT /admin/api-logs/:id` -> `apiLog.update`
- `DELETE /admin/api-logs/:id` -> `apiLog.delete`

### 附件管理

- `POST /admin/upload/image` -> `upload.image`

### 系统信息

- `GET /admin/system/getSystemInfo` -> `system.getInfo`

### 仪表盘

- `GET /admin/dashboard/overview` -> `dashboard.overview`

### 静态页面生成

- `POST /admin/static-generation/generate` -> `staticGeneration.generate`
- `GET /admin/static-generation/status` -> `staticGeneration.status`
- `POST /admin/static-generation/clear` -> `staticGeneration.clear`

### 访问令牌管理

- `GET /admin/access-token` -> `accessToken.list`
- `GET /admin/access-token/:id` -> `accessToken.getById`
- `POST /admin/access-token` -> `accessToken.create`
- `PUT /admin/access-token/:id` -> `accessToken.update`
- `DELETE /admin/access-token/:id` -> `accessToken.delete`

## Content 路由端点 (需要 Access Token 认证) - 🔄 进行中

### 用户管理

- `GET /content/users` -> `publicUser.list`
- `GET /content/users/:id` -> `publicUser.getById`

### 文章管理

- `GET /content/articles` -> `publicArticle.list`
- `GET /content/articles/:id` -> `publicArticle.getById`
- `GET /content/articles/url/:url` -> `publicArticle.getByUrl`

### 分类管理

- `GET /content/categories` -> `publicCategory.list`
- `GET /content/categories/tree` -> `publicCategory.tree`
- `GET /content/categories/with-count` -> `publicCategory.withCount`
- `GET /content/categories/:id` -> `publicCategory.getById`
- `GET /content/categories/alias/:alias` -> `publicCategory.getByAlias`

### 标签管理

- `GET /content/tags` -> `publicTag.list`
- `GET /content/tags/:id` -> `publicTag.getById`
- `GET /content/tags/value/:value` -> `publicTag.getByValue`

### 评论管理

- `GET /content/comments` -> `publicComment.list`
- `GET /content/comments/:id` -> `publicComment.getById`

### 配置管理

- `GET /content/configs` -> `publicConfig.list`
- `GET /content/configs/:id` -> `publicConfig.getById`
- `GET /content/configs/alias/:alias` -> `publicConfig.getByAlias`
- `GET /content/configs/site-settings` -> `siteSettings.get`

### 链接管理

- `GET /content/links` -> `publicLink.list`
- `GET /content/links/:id` -> `publicLink.getById`

### 菜单管理

- `GET /content/menus` -> `publicMenu.list`
- `GET /content/menus/tree` -> `publicMenu.tree`
- `GET /content/menus/:id` -> `publicMenu.getById`

### 页面管理

- `GET /content/pages` -> `publicPage.list`
- `GET /content/pages/:id` -> `publicPage.getById`
- `GET /content/pages/url/:url` -> `publicPage.getByUrl`

### 角色管理

- `GET /content/roles` -> `publicRole.list`
- `GET /content/roles/:id` -> `publicRole.getById`

### 权限规则管理

- `GET /content/rules` -> `publicRule.list`
- `GET /content/rules/tree` -> `publicRule.tree`
- `GET /content/rules/:id` -> `publicRule.getById`

### 配置管理

- `GET /content/configs` -> `publicConfig.list`
- `GET /content/configs/:id` -> `publicConfig.getById`
- `GET /content/configs/alias/:alias` -> `publicConfig.getByAlias`
- `GET /content/configs/site-settings` -> `publicConfig.siteSettings`

### 链接管理

- `GET /content/links` -> `publicLink.list`
- `GET /content/links/:id` -> `publicLink.getById`

### 菜单管理

- `GET /content/menus` -> `publicMenu.list`
- `GET /content/menus/tree` -> `publicMenu.tree`
- `GET /content/menus/:id` -> `publicMenu.getById`

### 页面管理

- `GET /content/pages` -> `publicPage.list`
- `GET /content/pages/:id` -> `publicPage.getById`
- `GET /content/pages/url/:url` -> `publicPage.getByUrl`

### 广告管理

- `GET /content/ads` -> `publicAd.list`
- `GET /content/ads/:id` -> `publicAd.getById`

### 广告项管理

- `GET /content/ad-items` -> `publicAdItem.list`
- `GET /content/ad-items/:id` -> `publicAdItem.getById`

### 角色管理

- `GET /content/roles` -> `publicRole.list`
- `GET /content/roles/:id` -> `publicRole.getById`

### 权限规则管理

- `GET /content/rules` -> `publicRule.list`
- `GET /content/rules/tree` -> `publicRule.tree`
- `GET /content/rules/:id` -> `publicRule.getById`

### 用户类型管理

- `GET /content/user-types` -> `publicUserType.list`
- `GET /content/user-types/:id` -> `publicUserType.getById`

### 属性管理

- `GET /content/attrs` -> `publicAttr.list`
- `GET /content/attrs/:id` -> `publicAttr.getById`

### 缓存管理

- `GET /content/caches` -> `publicCache.list`
- `GET /content/caches/:id` -> `publicCache.getById`

### 枚举管理

- `GET /content/enums` -> `publicEnum.list`
- `GET /content/enums/:id` -> `publicEnum.getById`

### 节假日管理

- `GET /content/holidays` -> `publicHoliday.list`
- `GET /content/holidays/:id` -> `publicHoliday.getById`

### 工作职位管理

- `GET /content/jobs` -> `publicJob.list`
- `GET /content/jobs/:id` -> `publicJob.getById`

### 关键词管理

- `GET /content/keywords` -> `publicKeyword.list`
- `GET /content/keywords/:id` -> `publicKeyword.getById`

### 通知管理

- `GET /content/notices` -> `publicNotice.list`
- `GET /content/notices/:id` -> `publicNotice.getById`

### 操作日志管理

- `GET /content/operate-logs` -> `publicOperateLog.list`
- `GET /content/operate-logs/:id` -> `publicOperateLog.getById`

### API 日志管理

- `GET /content/api-logs` -> `publicApiLog.list`
- `GET /content/api-logs/:id` -> `publicApiLog.getById`

### 访问令牌管理

- `GET /content/access-token` -> `publicAccessToken.list`
- `GET /content/access-token/:id` -> `publicAccessToken.getById`
- `POST /content/access-token/check` -> `publicAccessToken.check`

### 系统信息

- `GET /content/system/getSystemInfo` -> `publicSystem.getInfo`

### 搜索功能

- `GET /content/search/articles` -> `search.articles`
- `GET /content/search/pages` -> `search.pages`
- `GET /content/search/daily` -> `search.daily`

### AI 功能

- `GET /content/ai/test` -> `ai.test`
- `POST /content/ai/summary` -> `ai.summary`
- `POST /content/ai/tags` -> `ai.tags`
- `POST /content/ai/seo-description` -> `ai.seoDescription`
- `POST /content/ai/translate` -> `ai.translate`
- `POST /content/ai/explain-code` -> `ai.explainCode`
- `POST /content/ai/titles` -> `ai.titles`
- `POST /content/ai/chat` -> `ai.chat`

### 属性管理

- `GET /content/attrs` -> `publicAttr.list`
- `GET /content/attrs/:id` -> `publicAttr.getById`

### 缓存管理

- `GET /content/caches` -> `publicCache.list`
- `GET /content/caches/:id` -> `publicCache.getById`

### 枚举管理

- `GET /content/enums` -> `publicEnum.list`
- `GET /content/enums/:id` -> `publicEnum.getById`

### 节假日管理

- `GET /content/holidays` -> `publicHoliday.list`
- `GET /content/holidays/:id` -> `publicHoliday.getById`

### 工作职位管理

- `GET /content/jobs` -> `publicJob.list`
- `GET /content/jobs/:id` -> `publicJob.getById`

### 关键词管理

- `GET /content/keywords` -> `publicKeyword.list`
- `GET /content/keywords/:id` -> `publicKeyword.getById`

### 通知管理

- `GET /content/notices` -> `publicNotice.list`
- `GET /content/notices/:id` -> `publicNotice.getById`

### 操作日志管理

- `GET /content/operate-logs` -> `publicOperateLog.list`
- `GET /content/operate-logs/:id` -> `publicOperateLog.getById`

### API 日志管理

- `GET /content/api-logs` -> `publicApiLog.list`
- `GET /content/api-logs/:id` -> `publicApiLog.getById`

### 访问令牌管理

- `GET /content/access-token` -> `publicAccessToken.list`
- `GET /content/access-token/:id` -> `publicAccessToken.getById`
- `POST /content/access-token/check` -> `publicAccessToken.check`

### 系统信息

- `GET /content/system/getSystemInfo` -> `publicSystem.getInfo`

### 搜索功能

- `GET /content/search/articles` -> `search.articles`
- `GET /content/search/pages` -> `search.pages`
- `GET /content/search/daily` -> `search.daily`

### AI 功能

- `GET /content/ai/test` -> `ai.test`
- `POST /content/ai/summary` -> `ai.summary`
- `POST /content/ai/tags` -> `ai.tags`
- `POST /content/ai/seo-description` -> `ai.seoDescription`
- `POST /content/ai/translate` -> `ai.translate`
- `POST /content/ai/explain-code` -> `ai.explainCode`
- `POST /content/ai/titles` -> `ai.titles`
- `POST /content/ai/chat` -> `ai.chat`
