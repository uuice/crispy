-- Initial data migration
-- This migration inserts basic data for the Crispy CMS

-- Insert default admin user (password: admin123)
INSERT INTO `users` (
  `user_name`, `real_name`, `nick_name`, `password`, `email`, `phone`, `avatar_url`,
  `role_id`, `type_id`, `status`, `is_admin`, `is_super_admin`, `is_black`, `is_delete`,
  `last_login_time`, `last_login_ip`, `create_time`, `update_time`
) VALUES (
  'admin', '系统管理员', '管理员',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'admin@example.com', '13800138000', '/assets/images/avatar.png',
  1, 1, 10, 10, 10, -10, 0,
  UNIX_TIMESTAMP() * 1000, '127.0.0.1',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
) ON DUPLICATE KEY UPDATE `update_time` = UNIX_TIMESTAMP() * 1000;

-- Insert user types
INSERT INTO `user_types` (`type_name`, `remark`, `alias`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('管理员', '系统管理员用户类型', 'admin', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('普通用户', '普通用户类型', 'user', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('VIP用户', 'VIP用户类型', 'vip', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert default role
INSERT INTO `roles` (
  `title`, `des`, `module_id`, `type_id`, `rule_ids`,
  `sort`, `status`, `is_delete`, `create_time`, `update_time`
) VALUES (
  '超级管理员', '拥有所有权限的超级管理员角色',
  1, 1, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50', 0, 10, 0,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
) ON DUPLICATE KEY UPDATE `update_time` = UNIX_TIMESTAMP() * 1000;

-- Insert basic rules based on backstage routes
INSERT INTO `rules` (`title`, `alias`, `des`, `condition`, `icon`, `module_id`, `type_id`, `parent_id`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
-- Dashboard
('仪表盘', 'dashboard', '系统仪表盘管理', 'dashboard', 'pi pi-home', 1, 1, 0, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),

-- Content Management
('文章管理', 'posts', '文章内容管理', 'posts', 'pi pi-file', 1, 1, 0, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('分类管理', 'categories', '文章分类管理', 'categories', 'pi pi-folder', 1, 1, 0, 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('标签管理', 'tags', '文章标签管理', 'tags', 'pi pi-tags', 1, 1, 0, 4, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('页面管理', 'pages', '静态页面管理', 'pages', 'pi pi-file-edit', 1, 1, 0, 5, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('评论管理', 'comments', '用户评论管理', 'comments', 'pi pi-comments', 1, 1, 0, 6, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),

-- User Management
('用户管理', 'users', '用户账户管理', 'users', 'pi pi-users', 1, 1, 0, 7, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('管理员管理', 'admins', '管理员账户管理', 'admins', 'pi pi-user-plus', 1, 1, 0, 8, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('角色管理', 'roles', '用户角色管理', 'roles', 'pi pi-shield', 1, 1, 0, 9, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('权限管理', 'rules', '系统权限管理', 'rules', 'pi pi-key', 1, 1, 0, 10, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),

-- System Management
('系统设置', 'settings', '系统基础设置', 'settings', 'pi pi-cog', 1, 1, 0, 11, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('配置管理', 'configs', '系统配置管理', 'configs', 'pi pi-wrench', 1, 1, 0, 12, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('系统管理', 'systems', '系统高级管理', 'systems', 'pi pi-server', 1, 1, 0, 13, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('菜单管理', 'menus', '系统菜单管理', 'menus', 'pi pi-bars', 1, 1, 0, 14, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),

-- Business Management
('链接管理', 'links', '友情链接管理', 'links', 'pi pi-link', 1, 1, 0, 15, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('招聘管理', 'jobs', '招聘信息管理', 'jobs', 'pi pi-briefcase', 1, 1, 0, 16, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('广告管理', 'ads', '广告位管理', 'ads', 'pi pi-image', 1, 1, 0, 17, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('节假日管理', 'holidays', '节假日信息管理', 'holidays', 'pi pi-calendar', 1, 1, 0, 18, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('属性管理', 'attrs', '特殊属性管理', 'attrs', 'pi pi-list', 1, 1, 0, 19, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),

-- Logs
('操作日志', 'operate-logs', '系统操作日志', 'operate-logs', 'pi pi-history', 1, 1, 0, 20, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert basic categories
INSERT INTO `categories` (`title`, `alias`, `des`, `parent_id`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
('技术', 'tech', '技术相关文章', 0, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('编程', 'programming', '编程技术文章', 1, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('前端开发', 'frontend', '前端开发技术', 1, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('后端开发', 'backend', '后端开发技术', 1, 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('移动开发', 'mobile', '移动应用开发', 1, 4, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('设计', 'design', '设计相关文章', 0, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('UI设计', 'ui-design', '用户界面设计', 6, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('UX设计', 'ux-design', '用户体验设计', 6, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('生活', 'life', '生活随笔', 0, 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('随笔', 'essay', '个人随笔', 9, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('分享', 'share', '经验分享', 9, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert basic tags
INSERT INTO `tags` (`title`, `value`, `des`, `type_id`, `status`, `sort`, `is_delete`, `create_time`, `update_time`) VALUES
('JavaScript', 'javascript', 'JavaScript相关技术', 1, 10, 1, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('TypeScript', 'typescript', 'TypeScript编程语言', 1, 10, 2, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Angular', 'angular', 'Angular框架', 1, 10, 3, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('React', 'react', 'React框架', 1, 10, 4, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Vue', 'vue', 'Vue框架', 1, 10, 5, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Node.js', 'nodejs', 'Node.js运行时', 1, 10, 6, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('MySQL', 'mysql', 'MySQL数据库', 1, 10, 7, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('CSS', 'css', 'CSS样式技术', 1, 10, 8, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('HTML', 'html', 'HTML标记语言', 1, 10, 9, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('API', 'api', 'API开发技术', 1, 10, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('前端', 'frontend', '前端开发', 1, 10, 11, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('后端', 'backend', '后端开发', 1, 10, 12, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('设计', 'design', '设计相关', 1, 10, 13, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('生活', 'life', '生活随笔', 1, 10, 14, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert basic configurations
INSERT INTO `configs` (`title`, `alias`, `value`, `type_id`, `type_ids`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
('网站名称', 'SITE_NAME', 'Crispy CMS', 1, '1', 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('网站描述', 'SITE_DESCRIPTION', '一个现代化的内容管理系统，基于Angular和Node.js构建', 1, '1', 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('网站关键词', 'SITE_KEYWORDS', 'CMS,Angular,Node.js,TypeScript,MySQL,内容管理系统', 1, '1', 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('网站Logo', 'SITE_LOGO', '/assets/images/logo.png', 1, '1', 4, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('网站图标', 'SITE_FAVICON', '/favicon.ico', 1, '1', 5, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('每页文章数', 'POSTS_PER_PAGE', '10', 2, '2', 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('启用评论', 'ENABLE_COMMENTS', 'true', 2, '2', 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('启用注册', 'ENABLE_REGISTRATION', 'false', 2, '2', 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('SMTP服务器', 'SMTP_HOST', 'smtp.example.com', 3, '3', 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('SMTP端口', 'SMTP_PORT', '587', 3, '3', 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('备案信息', 'ICP_BEIAN', '京ICP备12345678号', 1, '1', 6, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('版权信息', 'COPYRIGHT', '© 2024 Crispy CMS. All rights reserved.', 1, '1', 7, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert basic menus based on frontend routes
INSERT INTO `menus` (`title`, `alias`, `url`, `icon`, `image_url`, `method`, `parent_id`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
('首页', 'home', '/', 'pi pi-home', '', '_self', 0, 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('关于', 'about', '/about', 'pi pi-info-circle', '', '_self', 0, 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('归档', 'archives', '/archives', 'pi pi-calendar', '', '_self', 0, 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('分类', 'categories', '/categories', 'pi pi-folder', '', '_self', 0, 4, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('标签', 'tags', '/tags', 'pi pi-tags', '', '_self', 0, 5, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('作者', 'author', '/author', 'pi pi-user', '', '_self', 0, 6, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('链接', 'links', '/links', 'pi pi-link', '', '_self', 0, 7, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('免责声明', 'disclaimer', '/disclaimer', 'pi pi-exclamation-triangle', '', '_self', 0, 8, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert sample links
INSERT INTO `links` (`site_name`, `url`, `logo`, `des`, `type_id`, `method`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
('GitHub', 'https://github.com', '/assets/images/github.png', 'GitHub - 全球最大的代码托管平台', 1, '_blank', 1, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Stack Overflow', 'https://stackoverflow.com', '/assets/images/stackoverflow.png', 'Stack Overflow - 程序员问答社区', 1, '_blank', 2, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('MDN Web Docs', 'https://developer.mozilla.org', '/assets/images/mdn.png', 'MDN Web Docs - Web开发文档', 1, '_blank', 3, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Angular官网', 'https://angular.io', '/assets/images/angular.png', 'Angular - 现代Web应用框架', 1, '_blank', 4, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert sample articles
INSERT INTO `articles` (
  `title`, `sub_title`, `abstract`, `content`, `image`, `image_list`, `tags`,
  `type_id`, `type_ids`, `author_id`, `user_id`, `status`, `is_review`, `is_delete`,
  `click`, `sort`, `create_time`, `update_time`
) VALUES (
  '欢迎使用Crispy CMS',
  '开始使用您的新内容管理系统',
  '欢迎使用Crispy CMS，这是一个基于Angular和Node.js构建的现代化内容管理系统。本文将指导您完成基本设置和使用。',
  '<h1>欢迎使用Crispy CMS</h1><p>Crispy CMS是一个现代化、快速、灵活的内容管理系统，专为开发者和内容创作者设计。</p><h2>主要特性</h2><ul><li>现代化的Angular前端</li><li>Node.js后端</li><li>MySQL数据库</li><li>TypeScript支持</li><li>响应式设计</li><li>完整的权限管理</li><li>丰富的插件系统</li></ul><h2>快速开始</h2><p>安装完成后，您可以通过以下步骤开始使用：</p><ol><li>访问后台管理界面</li><li>创建您的第一篇文章</li><li>设置网站基本信息</li><li>自定义主题和样式</li></ol>',
  '/assets/images/welcome.jpg',
  '/assets/images/welcome.jpg,/assets/images/features.jpg',
  'cms,angular,nodejs,typescript',
  1, '1,2', 1, 1, 10, -10, 0, 0, 1,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'Angular开发入门指南',
  '从零开始学习Angular开发',
  '学习Angular开发的基础知识，从设置第一个项目到构建组件和服务。',
  '<h1>Angular开发入门指南</h1><p>Angular是一个强大的Web应用开发框架。本指南将帮助您快速入门。</p><h2>前置条件</h2><p>在开始之前，请确保您的系统已安装Node.js。</p><h2>安装Angular CLI</h2><p>首先安装Angular命令行工具：</p><pre><code>npm install -g @angular/cli</code></pre><h2>创建新项目</h2><p>使用以下命令创建新的Angular项目：</p><pre><code>ng new my-app</code></pre><h2>运行项目</h2><p>进入项目目录并启动开发服务器：</p><pre><code>cd my-app\nng serve</code></pre>',
  '/assets/images/angular.jpg',
  '/assets/images/angular.jpg',
  'angular,typescript,前端开发',
  2, '1,3', 1, 1, 10, -10, 0, 0, 2,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'TypeScript基础语法',
  '掌握TypeScript的核心概念',
  'TypeScript是JavaScript的超集，为JavaScript添加了类型系统。本文将介绍TypeScript的基础语法和核心概念。',
  '<h1>TypeScript基础语法</h1><p>TypeScript是Microsoft开发的开源编程语言，它是JavaScript的超集。</p><h2>基本类型</h2><p>TypeScript提供了多种基本类型：</p><ul><li>string - 字符串类型</li><li>number - 数字类型</li><li>boolean - 布尔类型</li><li>array - 数组类型</li><li>object - 对象类型</li></ul><h2>接口定义</h2><p>使用接口定义对象的结构：</p><pre><code>interface User {\n  name: string;\n  age: number;\n  email?: string;\n}</code></pre>',
  '/assets/images/typescript.jpg',
  '/assets/images/typescript.jpg',
  'typescript,javascript,编程',
  2, '1,2', 1, 1, 10, -10, 0, 0, 3,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
);

-- Insert sample pages
INSERT INTO `pages` (
  `title`, `alias`, `sub_title`, `content`, `abstract`, `author_id`, `user_id`,
  `status`, `image_list`, `click`, `tags`, `seo_title`, `seo_keywords`, `seo_description`,
  `create_time`, `update_time`, `is_delete`
) VALUES (
  '关于我们',
  'about',
  '了解我们的团队和使命',
  '<h1>关于我们</h1><p>我们是一个专注于Web技术开发的团队，致力于为用户提供最好的技术解决方案。</p><h2>我们的使命</h2><p>通过创新的技术和优质的服务，帮助客户实现数字化转型。</p><h2>我们的团队</h2><p>我们拥有经验丰富的开发团队，包括前端开发、后端开发、UI/UX设计等专业人才。</p>',
  '了解我们的团队背景、技术实力和服务理念',
  1, 1, 10, '/assets/images/about.jpg', 0, '关于,团队,技术',
  '关于我们 - Crispy CMS',
  '关于我们,团队介绍,技术团队',
  '了解我们的团队背景、技术实力和服务理念',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0
),
(
  '免责声明',
  'disclaimer',
  '网站使用条款和免责声明',
  '<h1>免责声明</h1><p>本网站提供的信息仅供参考，我们不保证信息的准确性和完整性。</p><h2>版权声明</h2><p>本网站的所有内容均受版权法保护，未经许可不得转载或使用。</p><h2>隐私政策</h2><p>我们重视用户隐私，承诺保护用户的个人信息安全。</p>',
  '网站使用条款、版权声明和隐私政策',
  1, 1, 10, '', 0, '免责声明,版权,隐私',
  '免责声明 - Crispy CMS',
  '免责声明,版权声明,隐私政策',
  '网站使用条款、版权声明和隐私政策',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0
);

-- Insert sample ads
INSERT INTO `ads` (`type_id`, `alias`, `title`, `start_time`, `end_time`, `content`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
(1, 'home-banner', '首页横幅广告', UNIX_TIMESTAMP() * 1000, (UNIX_TIMESTAMP() + 365 * 24 * 3600) * 1000, '首页顶部横幅广告位', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, 'sidebar-ad', '侧边栏广告', UNIX_TIMESTAMP() * 1000, (UNIX_TIMESTAMP() + 365 * 24 * 3600) * 1000, '侧边栏广告位', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample ad items
INSERT INTO `ad_items` (`image_url`, `ad_id`, `url`, `status`, `title`, `content`, `method`, `sort`, `create_time`, `update_time`, `is_delete`) VALUES
('/assets/images/banner1.jpg', 1, 'https://example.com', 10, '示例广告1', '这是一个示例广告', '_blank', 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('/assets/images/banner2.jpg', 1, 'https://example.com', 10, '示例广告2', '这是另一个示例广告', '_blank', 2, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample jobs
INSERT INTO `jobs` (`title`, `branch`, `typeName`, `nature`, `address`, `content`, `num`, `email`, `sort`, `create_time`, `update_time`, `is_delete`) VALUES
('前端开发工程师', '技术部', '技术开发', '全职', '北京', '<h2>岗位职责</h2><ul><li>负责公司产品的前端开发工作</li><li>与后端开发人员协作完成产品功能</li><li>优化前端性能，提升用户体验</li></ul><h2>任职要求</h2><ul><li>熟悉HTML、CSS、JavaScript</li><li>熟悉Vue、React或Angular等前端框架</li><li>有良好的代码风格和团队协作能力</li></ul>', 2, 'hr@example.com', 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('后端开发工程师', '技术部', '技术开发', '全职', '北京', '<h2>岗位职责</h2><ul><li>负责公司产品的后端开发工作</li><li>设计并实现数据库结构</li><li>编写API接口文档</li></ul><h2>任职要求</h2><ul><li>熟悉Node.js、Java或Python</li><li>熟悉MySQL、MongoDB等数据库</li><li>有良好的问题解决能力</li></ul>', 1, 'hr@example.com', 2, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample holidays
INSERT INTO `holidays` (`title`, `value`, `sort`, `create_time`, `update_time`, `is_delete`) VALUES
('元旦', '1月1日', 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('春节', '农历正月初一', 2, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('清明节', '4月5日', 3, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('劳动节', '5月1日', 4, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('端午节', '农历五月初五', 5, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('中秋节', '农历八月十五', 6, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('国庆节', '10月1日', 7, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample attrs
INSERT INTO `attrs` (`alias`, `title`, `status`, `sort`, `create_time`, `update_time`, `is_delete`) VALUES
('hot', '热门', 10, 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('recommend', '推荐', 10, 2, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('top', '置顶', 10, 3, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('featured', '精选', 10, 4, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample enums
INSERT INTO `enums` (`title`, `alias`, `value`, `sort`, `code`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('启用', 'enabled', '10', 1, 'STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('禁用', 'disabled', '-10', 2, 'STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('已发布', 'published', '10', 1, 'ARTICLE_STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('待发布', 'pending', '-10', 2, 'ARTICLE_STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('草稿', 'draft', '-20', 3, 'ARTICLE_STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('已删除', 'deleted', '-100', 4, 'ARTICLE_STATUS', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample access tokens
INSERT INTO `access_token` (`user_id`, `app_name`, `channel`, `token`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
(1, 'WebApp', 'web', 'web_token_123456789', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'MobileApp', 'mobile', 'mobile_token_987654321', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'API', 'api', 'api_token_abcdef123', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample additions (extended fields for articles)
INSERT INTO `additions` (`primary_id`, `fields_json`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
(1, '{"reading_time": "5分钟", "difficulty": "初级", "author_bio": "资深前端开发工程师", "related_articles": [2, 3]}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, '{"reading_time": "8分钟", "difficulty": "中级", "prerequisites": ["JavaScript基础", "HTML基础"], "code_examples": true}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(3, '{"reading_time": "6分钟", "difficulty": "初级", "typescript_version": "5.0+", "playground_url": "https://typescript-playground.com"}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample API logs
INSERT INTO `api_logs` (`user_id`, `method`, `query`, `body`, `ip`, `create_time`, `update_time`, `is_delete`) VALUES
(1, 'GET', '{"page": "1", "pageSize": "20", "status": "10"}', '', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'POST', '', '{"title": "测试文章", "content": "测试内容"}', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'PUT', '', '{"id": 1, "title": "更新后的标题"}', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'DELETE', '', '', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample caches
INSERT INTO `caches` (`hash`, `cache_data`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('homepage_cache_123', '{"articles": [1, 2, 3], "categories": [1, 2], "last_updated": "2024-01-01"}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('categories_cache_456', '{"categories": [{"id": 1, "title": "技术"}, {"id": 2, "title": "设计"}]}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('tags_cache_789', '{"tags": [{"id": 1, "title": "JavaScript"}, {"id": 2, "title": "TypeScript"}]}', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample comments
INSERT INTO `comments` (`title`, `content`, `parent_id`, `user_id`, `good_article`, `bad_article`, `not_article`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('很好的文章', '这篇文章写得非常详细，对我帮助很大！', 0, 1, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('感谢分享', '感谢作者的分享，学到了很多新知识。', 0, 1, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('回复：很好的文章', '谢谢你的支持，我会继续努力写更好的文章。', 1, 1, 0, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('有疑问', '文章中提到的方法在实际项目中是否适用？', 0, 1, 0, 0, 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample keywords
INSERT INTO `keywords` (`title`, `alias`, `des`, `sort`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('Angular开发', 'angular-development', 'Angular框架开发相关关键词', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('TypeScript教程', 'typescript-tutorial', 'TypeScript编程语言教程', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('前端技术', 'frontend-tech', '前端开发技术相关', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('Web开发', 'web-development', 'Web应用开发技术', 4, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('JavaScript', 'javascript', 'JavaScript编程语言', 5, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample notices
INSERT INTO `notices` (`title`, `content`, `type_id`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('系统维护通知', '系统将于2024年1月15日凌晨2:00-4:00进行维护，期间可能无法正常访问，请提前做好准备。', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('新功能上线', '我们新增了评论功能，现在用户可以对文章进行评论和互动了！', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('安全更新', '为了保障用户数据安全，我们进行了安全更新，建议用户及时修改密码。', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('招聘信息', '我们正在招聘前端开发工程师，欢迎有经验的朋友加入我们的团队！', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample operate logs
INSERT INTO `operate_logs` (`user_id`, `action`, `target`, `ip`, `create_time`, `update_time`, `is_delete`) VALUES
(1, 'CREATE', '创建文章：欢迎使用Crispy CMS', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'UPDATE', '更新文章：Angular开发入门指南', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'DELETE', '删除用户：test_user', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'LOGIN', '用户登录：admin', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'LOGOUT', '用户登出：admin', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'UPLOAD', '上传文件：logo.png', '127.0.0.1', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample todos
INSERT INTO `todos` (`title`, `content`, `user_id`, `status`, `priority`, `deadline`, `create_time`, `update_time`, `is_delete`) VALUES
('完成首页设计', '设计并实现网站首页的布局和样式', 1, 10, 1, (UNIX_TIMESTAMP() + 7 * 24 * 3600) * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('优化数据库查询', '优化文章列表页面的数据库查询性能', 1, 10, 2, (UNIX_TIMESTAMP() + 3 * 24 * 3600) * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('添加评论功能', '为文章添加评论和回复功能', 1, -10, 1, (UNIX_TIMESTAMP() + 14 * 24 * 3600) * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('修复登录bug', '修复用户登录时偶尔出现的错误', 1, 10, 3, (UNIX_TIMESTAMP() + 1 * 24 * 3600) * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('更新文档', '更新API文档和用户使用手册', 1, -10, 2, (UNIX_TIMESTAMP() + 5 * 24 * 3600) * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample votes
INSERT INTO `votes` (`title`, `des`, `type_id`, `start_time`, `end_time`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('最受欢迎的前端框架', '投票选出最受欢迎的前端开发框架', 1, UNIX_TIMESTAMP() * 1000, (UNIX_TIMESTAMP() + 30 * 24 * 3600) * 1000, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('最佳编程语言', '投票选出最适合Web开发的编程语言', 1, UNIX_TIMESTAMP() * 1000, (UNIX_TIMESTAMP() + 60 * 24 * 3600) * 1000, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('网站功能需求调查', '调查用户最希望网站添加的功能', 2, UNIX_TIMESTAMP() * 1000, (UNIX_TIMESTAMP() + 15 * 24 * 3600) * 1000, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert sample vote items
INSERT INTO `vote_items` (`vote_id`, `title`, `des`, `sort`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
(1, 'React', 'Facebook开发的JavaScript库', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'Vue', '渐进式JavaScript框架', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'Angular', 'Google开发的完整框架', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(1, 'Svelte', '编译时框架', 4, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, 'JavaScript', 'Web开发的基础语言', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, 'TypeScript', 'JavaScript的超集', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, 'Python', '通用编程语言', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(2, 'Go', 'Google开发的编程语言', 4, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(3, '在线聊天功能', '用户可以在线聊天交流', 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(3, '文章收藏功能', '用户可以收藏喜欢的文章', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(3, '用户积分系统', '用户可以通过活动获得积分', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
(3, '移动端APP', '开发移动端应用程序', 4, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert more sample users
INSERT INTO `users` (
  `user_name`, `real_name`, `nick_name`, `password`, `email`, `phone`, `avatar_url`,
  `role_id`, `type_id`, `status`, `is_admin`, `is_super_admin`, `is_black`, `is_delete`,
  `last_login_time`, `last_login_ip`, `create_time`, `update_time`
) VALUES
('editor', '内容编辑', '编辑小王',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'editor@example.com', '13800138001', '/assets/images/avatar2.png',
  1, 1, 10, 10, -10, -10, 0,
  UNIX_TIMESTAMP() * 1000, '127.0.0.1',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
('author', '文章作者', '作者小李',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'author@example.com', '13800138002', '/assets/images/avatar3.png',
  1, 2, 10, -10, -10, -10, 0,
  UNIX_TIMESTAMP() * 1000, '127.0.0.1',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
('vip_user', 'VIP用户', 'VIP用户',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'vip@example.com', '13800138003', '/assets/images/avatar4.png',
  1, 3, 10, -10, -10, -10, 0,
  UNIX_TIMESTAMP() * 1000, '127.0.0.1',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
('test_user', '测试用户', '测试用户',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'test@example.com', '13800138004', '/assets/images/avatar5.png',
  1, 2, -10, -10, -10, -10, 0,
  UNIX_TIMESTAMP() * 1000, '127.0.0.1',
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
);

-- Insert more sample articles
INSERT INTO `articles` (
  `title`, `sub_title`, `abstract`, `content`, `image`, `image_list`, `tags`,
  `type_id`, `type_ids`, `author_id`, `user_id`, `status`, `is_review`, `is_delete`,
  `click`, `sort`, `create_time`, `update_time`
) VALUES
(
  'React Hooks 深度解析',
  '掌握React Hooks的核心概念和最佳实践',
  'React Hooks是React 16.8引入的新特性，它让函数组件也能使用状态和其他React特性。本文将深入解析Hooks的使用方法和最佳实践。',
  '<h1>React Hooks 深度解析</h1><p>React Hooks是React 16.8版本引入的新特性，它让函数组件也能使用状态和其他React特性。</p><h2>基础Hooks</h2><h3>useState</h3><p>useState是最基础的Hook，用于在函数组件中添加状态：</p><pre><code>const [count, setCount] = useState(0);</code></pre><h3>useEffect</h3><p>useEffect用于处理副作用，相当于类组件的componentDidMount、componentDidUpdate和componentWillUnmount：</p><pre><code>useEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);</code></pre><h2>自定义Hooks</h2><p>自定义Hooks是复用状态逻辑的一种方式：</p><pre><code>function useCounter(initialValue) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(count + 1);\n  const decrement = () => setCount(count - 1);\n  return { count, increment, decrement };\n}</code></pre>',
  '/assets/images/react-hooks.jpg',
  '/assets/images/react-hooks.jpg,/assets/images/hooks-example.jpg',
  'react,hooks,javascript,前端开发',
  2, '1,2', 2, 2, 10, -10, 0, 0, 4,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'Vue 3 Composition API 实战',
  '使用Vue 3 Composition API构建现代化应用',
  'Vue 3的Composition API提供了更灵活的逻辑复用方式。本文将通过实际项目案例来展示Composition API的使用方法。',
  '<h1>Vue 3 Composition API 实战</h1><p>Vue 3的Composition API是Vue 3最重要的新特性之一，它提供了更灵活的逻辑复用方式。</p><h2>setup函数</h2><p>setup函数是Composition API的入口点：</p><pre><code>import { ref, reactive, onMounted } from \'vue\';\n\nexport default {\n  setup() {\n    const count = ref(0);\n    const user = reactive({\n      name: \'John\',\n      age: 30\n    });\n    \n    onMounted(() => {\n      console.log(\'Component mounted\');\n    });\n    \n    return { count, user };\n  }\n}</code></pre><h2>响应式API</h2><p>Vue 3提供了多种响应式API：</p><ul><li>ref - 用于基本类型</li><li>reactive - 用于对象</li><li>computed - 计算属性</li><li>watch - 侦听器</li></ul>',
  '/assets/images/vue3.jpg',
  '/assets/images/vue3.jpg',
  'vue3,composition-api,javascript,前端开发',
  2, '1,2', 3, 3, 10, -10, 0, 0, 5,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'Node.js 性能优化指南',
  '提升Node.js应用性能的实用技巧',
  'Node.js应用的性能优化是一个重要话题。本文将介绍多种优化技巧，包括内存管理、异步处理、缓存策略等。',
  '<h1>Node.js 性能优化指南</h1><p>Node.js应用的性能优化是每个开发者都需要关注的话题。</p><h2>内存管理</h2><p>合理管理内存是性能优化的基础：</p><pre><code>// 避免内存泄漏\nconst cache = new Map();\n\n// 定期清理缓存\nsetInterval(() => {\n  cache.clear();\n}, 60000);</code></pre><h2>异步处理优化</h2><p>使用Promise.all进行并发处理：</p><pre><code>const results = await Promise.all([\n  fetchUser(1),\n  fetchUser(2),\n  fetchUser(3)\n]);</code></pre><h2>缓存策略</h2><p>合理使用缓存可以显著提升性能：</p><ul><li>Redis缓存</li><li>内存缓存</li><li>CDN缓存</li></ul>',
  '/assets/images/nodejs.jpg',
  '/assets/images/nodejs.jpg',
  'nodejs,性能优化,后端开发',
  2, '1,3', 1, 1, 10, -10, 0, 0, 6,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'CSS Grid 布局完全指南',
  '掌握现代CSS Grid布局技术',
  'CSS Grid是CSS中最强大的布局系统。本文将详细介绍Grid布局的概念、属性和实际应用案例。',
  '<h1>CSS Grid 布局完全指南</h1><p>CSS Grid是CSS中最强大的布局系统，它提供了二维布局能力。</p><h2>Grid容器</h2><p>设置Grid容器：</p><pre><code>.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 100px);\n  gap: 20px;\n}</code></pre><h2>Grid项目</h2><p>控制Grid项目的位置：</p><pre><code>.grid-item {\n  grid-column: 1 / 3;\n  grid-row: 1 / 2;\n}</code></pre><h2>响应式Grid</h2><p>使用媒体查询创建响应式布局：</p><pre><code>@media (max-width: 768px) {\n  .grid-container {\n    grid-template-columns: 1fr;\n  }\n}</code></pre>',
  '/assets/images/css-grid.jpg',
  '/assets/images/css-grid.jpg',
  'css,grid,布局,前端开发',
  2, '1,4', 2, 2, 10, -10, 0, 0, 7,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
),
(
  'Docker 容器化部署实践',
  '使用Docker容器化部署Web应用',
  'Docker是现代应用部署的重要工具。本文将介绍如何使用Docker容器化部署Web应用，包括Dockerfile编写、镜像构建和容器编排。',
  '<h1>Docker 容器化部署实践</h1><p>Docker是现代应用部署的重要工具，它提供了轻量级的容器化解决方案。</p><h2>Dockerfile编写</h2><p>创建Node.js应用的Dockerfile：</p><pre><code>FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]</code></pre><h2>镜像构建</h2><p>构建Docker镜像：</p><pre><code>docker build -t my-app .</code></pre><h2>容器运行</h2><p>运行容器：</p><pre><code>docker run -p 3000:3000 my-app</code></pre><h2>Docker Compose</h2><p>使用Docker Compose编排多个服务：</p><pre><code>version: \'3\'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: mysql:8.0</code></pre>',
  '/assets/images/docker.jpg',
  '/assets/images/docker.jpg',
  'docker,容器化,部署,运维',
  2, '1,3', 1, 1, 10, -10, 0, 0, 8,
  UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000
);

-- Insert more sample comments
INSERT INTO `comments` (`title`, `content`, `parent_id`, `user_id`, `good_article`, `bad_article`, `not_article`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('React Hooks很棒', '这篇文章让我对React Hooks有了更深的理解，谢谢分享！', 0, 2, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('Vue 3学习笔记', '正在学习Vue 3，这篇文章对我很有帮助。', 0, 3, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('Node.js优化技巧', '这些优化技巧很实用，已经在项目中应用了。', 0, 4, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('CSS Grid太强大了', 'Grid布局确实比Flexbox更强大，学习了！', 0, 2, 1, 0, 0, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('Docker部署问题', '按照文章部署时遇到了一些问题，能详细说明一下吗？', 0, 3, 0, 0, 1, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert more sample links
INSERT INTO `links` (`site_name`, `url`, `logo`, `des`, `type_id`, `method`, `sort`, `status`, `is_delete`, `create_time`, `update_time`) VALUES
('Vue.js官网', 'https://vuejs.org', '/assets/images/vue.png', 'Vue.js - 渐进式JavaScript框架', 1, '_blank', 5, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('React官网', 'https://reactjs.org', '/assets/images/react.png', 'React - 用于构建用户界面的JavaScript库', 1, '_blank', 6, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Node.js官网', 'https://nodejs.org', '/assets/images/nodejs.png', 'Node.js - JavaScript运行时', 1, '_blank', 7, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('Docker官网', 'https://www.docker.com', '/assets/images/docker.png', 'Docker - 容器化平台', 1, '_blank', 8, 10, 0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert more sample jobs
INSERT INTO `jobs` (`title`, `branch`, `typeName`, `nature`, `address`, `content`, `num`, `email`, `sort`, `create_time`, `update_time`, `is_delete`) VALUES
('UI设计师', '设计部', '设计', '全职', '上海', '<h2>岗位职责</h2><ul><li>负责公司产品的UI设计工作</li><li>与产品经理和开发团队协作</li><li>设计用户友好的界面和交互</li></ul><h2>任职要求</h2><ul><li>熟悉Figma、Sketch等设计工具</li><li>有良好的审美能力和设计思维</li><li>有移动端和Web端设计经验</li></ul>', 1, 'hr@example.com', 3, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('产品经理', '产品部', '产品', '全职', '深圳', '<h2>岗位职责</h2><ul><li>负责产品规划和需求分析</li><li>制定产品路线图和功能规划</li><li>协调设计、开发、测试等团队</li></ul><h2>任职要求</h2><ul><li>有互联网产品管理经验</li><li>熟悉产品设计流程和方法</li><li>有良好的沟通和协调能力</li></ul>', 1, 'hr@example.com', 4, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('测试工程师', '测试部', '测试', '全职', '广州', '<h2>岗位职责</h2><ul><li>负责产品的功能测试和性能测试</li><li>编写测试用例和测试报告</li><li>参与自动化测试脚本开发</li></ul><h2>任职要求</h2><ul><li>熟悉测试理论和方法</li><li>了解Selenium、Jest等测试工具</li><li>有Web应用测试经验</li></ul>', 2, 'hr@example.com', 5, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);

-- Insert more sample notices
INSERT INTO `notices` (`title`, `content`, `type_id`, `status`, `create_time`, `update_time`, `is_delete`) VALUES
('网站改版完成', '我们的网站已经完成改版，新版本具有更好的用户体验和更快的加载速度，欢迎大家体验！', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('技术分享会', '我们将于本周五下午2点举办技术分享会，主题是"现代前端开发趋势"，欢迎参加！', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('API文档更新', '我们更新了API文档，新增了多个接口的详细说明和示例代码，开发者可以查看最新文档。', 2, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0),
('社区活动', '我们将在下个月举办开发者社区活动，包括技术分享、项目展示和 networking，敬请期待！', 3, 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, 0);
