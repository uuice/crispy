-- Initial database schema migration
-- This migration creates all the basic tables for the Crispy CMS

-- Access token table for content API calls
CREATE TABLE IF NOT EXISTS `access_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `app_name` varchar(20) NOT NULL DEFAULT '' COMMENT '应用名称',
  `channel` varchar(20) NOT NULL DEFAULT '' COMMENT '渠道',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `status` tinyint(2) NOT NULL DEFAULT 10 COMMENT '启用状态 10 启用 -10 未启用',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `token` varchar(32) NOT NULL COMMENT 'Token',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='access token 用于content api 调用';

-- Ad items table
CREATE TABLE IF NOT EXISTS `ad_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `image_url` varchar(500) NOT NULL DEFAULT '' COMMENT '图片列表',
  `ad_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '广告位id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '链接',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '内容',
  `method` varchar(10) NOT NULL DEFAULT '' COMMENT '打开方式',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='广告位单条记录';

-- Additions table
CREATE TABLE IF NOT EXISTS `additions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `primary_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '主表id',
  `fields_json` longtext NOT NULL COMMENT 'json对象字符串',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='附加表';

-- Ads table
CREATE TABLE IF NOT EXISTS `ads` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '类型id',
  `alias` varchar(255) NOT NULL DEFAULT '' COMMENT '别名',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `start_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '开始时间',
  `end_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '结束时间',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除',
  `content` varchar(255) NOT NULL DEFAULT '',
  `status` tinyint NOT NULL DEFAULT 0,
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`) COMMENT 'alias唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='广告位列表';

-- API logs table
CREATE TABLE IF NOT EXISTS `api_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `method` varchar(10) NOT NULL DEFAULT '' COMMENT '打开方式',
  `query` longtext NOT NULL COMMENT 'query请求',
  `body` longtext NOT NULL COMMENT 'post请求',
  `ip` varchar(20) NOT NULL DEFAULT '' COMMENT '来源ip',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='api接口日志';

-- Articles table
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '栏目id',
  `type_ids` varchar(255) NOT NULL DEFAULT '' COMMENT '栏目id',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '标题',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '路由美化',
  `sub_title` varchar(100) NOT NULL DEFAULT '' COMMENT '短标题',
  `content` longtext NOT NULL COMMENT '文章内容',
  `abstract` varchar(5000) NOT NULL DEFAULT '' COMMENT '摘要',
  `redirect_url` varchar(500) NOT NULL DEFAULT '' COMMENT '跳转链接',
  `author_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '作者id',
  `remark` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '10已发布 -10待发布 -100已删除 -20草稿箱',
  `is_review` tinyint(2) NOT NULL DEFAULT 0 COMMENT '是否需要审核 10需要 -10不需要',
  `image_list` varchar(500) NOT NULL DEFAULT '' COMMENT '文章配图',
  `image` varchar(255) NOT NULL DEFAULT '' COMMENT '缩略图',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `attrs` varchar(255) NOT NULL DEFAULT '' COMMENT '特殊标签属性',
  `click` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '点击量',
  `tags` varchar(255) NOT NULL DEFAULT '' COMMENT '标签',
  `seo_title` varchar(255) NOT NULL DEFAULT '' COMMENT 'seo标题',
  `seo_keywords` varchar(255) NOT NULL DEFAULT '' COMMENT '关键词',
  `seo_description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '操作用户id',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='文章，文档';

-- Attrs table
CREATE TABLE IF NOT EXISTS `attrs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `alias` varchar(255) NOT NULL DEFAULT '' COMMENT '别名',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='特殊属性';

-- Caches table
CREATE TABLE IF NOT EXISTS `caches` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `hash` varchar(64) NOT NULL DEFAULT '' COMMENT 'hash',
  `cache_data` longtext NOT NULL COMMENT '缓存数据',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='缓存';

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `parent_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '父级id',
  `alias` varchar(32) NOT NULL DEFAULT '' COMMENT '别名',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `des` varchar(255) NOT NULL COMMENT '备注描述',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='分类表';

-- Comments table
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(128) NOT NULL DEFAULT '' COMMENT '评论标题',
  `content` longtext NOT NULL COMMENT '评论内容',
  `parent_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '上级评论',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '评论者Id',
  `good_article` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '好评',
  `bad_article` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '差评',
  `not_article` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '中立',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='评论';

-- Configs table
CREATE TABLE IF NOT EXISTS `configs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '标题',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '设置分类',
  `type_ids` varchar(255) NOT NULL DEFAULT '',
  `alias` varchar(64) NOT NULL DEFAULT '' COMMENT '别名',
  `value` varchar(5000) NOT NULL DEFAULT '' COMMENT '值',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int(11) unsigned NOT NULL DEFAULT 0,
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='配置项';

-- Enums table
CREATE TABLE IF NOT EXISTS `enums` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '标题',
  `alias` varchar(64) NOT NULL DEFAULT '' COMMENT '别名',
  `value` varchar(64) NOT NULL DEFAULT '' COMMENT '值',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `code` varchar(64) NOT NULL DEFAULT '' COMMENT 'code',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='枚举';

-- Holidays table
CREATE TABLE IF NOT EXISTS `holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `value` varchar(500) NOT NULL,
  `sort` int(11) unsigned NOT NULL DEFAULT 0,
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- Jobs table
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '职位名称',
  `branch` varchar(255) NOT NULL DEFAULT '' COMMENT '所在部门',
  `typeName` varchar(255) NOT NULL DEFAULT '' COMMENT '职位类别',
  `nature` varchar(255) NOT NULL DEFAULT '' COMMENT '工作性质',
  `address` varchar(255) NOT NULL DEFAULT '' COMMENT '工作地址',
  `content` longtext NOT NULL COMMENT '招聘信息',
  `num` int NOT NULL COMMENT '招聘人数',
  `email` varchar(255) NOT NULL DEFAULT '0' COMMENT '简历发送邮箱',
  `sort` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='菜单设置';

-- Keywords table
CREATE TABLE IF NOT EXISTS `keywords` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `alias` varchar(100) NOT NULL DEFAULT '' COMMENT '别名',
  `value` varchar(255) NOT NULL DEFAULT '' COMMENT '值',
  `count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '点击数',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '链接',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '标题',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='关键词';

-- Links table
CREATE TABLE IF NOT EXISTS `links` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `site_name` varchar(100) NOT NULL DEFAULT '' COMMENT '站点名称',
  `des` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '链接',
  `method` varchar(10) NOT NULL DEFAULT '' COMMENT '打开方式',
  `logo` varchar(255) NOT NULL DEFAULT '' COMMENT 'logo',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='友情链接';

-- Menus table
CREATE TABLE IF NOT EXISTS `menus` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `parent_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '父级id',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '链接',
  `method` varchar(10) NOT NULL DEFAULT '' COMMENT '打开方式',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `icon` varchar(255) NOT NULL DEFAULT '' COMMENT '图标',
  `alias` varchar(255) NOT NULL DEFAULT '',
  `image_url` varchar(255) NOT NULL DEFAULT '' COMMENT '图片列表',
  `sort` int(11) unsigned NOT NULL DEFAULT 0,
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='菜单设置';

-- Notices table
CREATE TABLE IF NOT EXISTS `notices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `from_user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '发布者id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '内容',
  `publish_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '发布时间',
  `tolds` varchar(255) NOT NULL DEFAULT '' COMMENT '接收者id列表',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='通知';

-- Operate logs table
CREATE TABLE IF NOT EXISTS `operate_logs` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `code` varchar(64) NOT NULL DEFAULT '' COMMENT '操作code',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '用户id',
  `content` longtext NOT NULL COMMENT '操作内容',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='操作日志';

-- Pages table
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '栏目id',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '标题',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '路由美化',
  `alias` varchar(255) NOT NULL DEFAULT '',
  `sub_title` varchar(100) NOT NULL DEFAULT '' COMMENT '短标题',
  `content` longtext NOT NULL COMMENT '页面内容',
  `abstract` varchar(5000) NOT NULL DEFAULT '' COMMENT '摘要',
  `author_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '作者id',
  `remark` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '10已发布 -10待发布 -100已删除 -20草稿箱',
  `image_list` varchar(500) NOT NULL DEFAULT '' COMMENT '页面轮播配图',
  `click` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '点击量',
  `tags` varchar(255) NOT NULL DEFAULT '' COMMENT '标签',
  `seo_title` varchar(255) NOT NULL DEFAULT '' COMMENT 'seo标题',
  `seo_keywords` varchar(255) NOT NULL DEFAULT '' COMMENT '关键词',
  `seo_description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `user_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '操作用户id',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='文章，文档';

-- Roles table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `des` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `rule_ids` text NOT NULL COMMENT '规则列表',
  `module_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '所属模块',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '类型id',
  `sort` int unsigned NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='角色表';

-- Rules table
CREATE TABLE IF NOT EXISTS `rules` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '规则名称',
  `des` varchar(255) NOT NULL DEFAULT '' COMMENT '规则描述',
  `alias` varchar(255) NOT NULL DEFAULT '',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `icon` varchar(255) NOT NULL DEFAULT '',
  `parent_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '父级id',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` int(11) unsigned NOT NULL DEFAULT 0,
  `module_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '模块Id',
  `condition` varchar(255) NOT NULL DEFAULT '' COMMENT '规则',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='规则表';

-- Tags table
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '标题',
  `value` varchar(255) NOT NULL DEFAULT '' COMMENT '值',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '所属分类',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `sort` int(11) unsigned NOT NULL DEFAULT 0,
  `des` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='标签';

-- Todos table
CREATE TABLE IF NOT EXISTS `todos` (
  `id` int(13) NOT NULL AUTO_INCREMENT COMMENT '发布者id',
  `publish_id` int(11) unsigned NOT NULL DEFAULT 0,
  `user_ids` varchar(100) NOT NULL COMMENT '用户ids',
  `title` varchar(100) NOT NULL,
  `content` tinytext NOT NULL,
  `start_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `end_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `complete` tinyint NOT NULL,
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `status` tinyint NOT NULL,
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0,
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- User types table
CREATE TABLE IF NOT EXISTS `user_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `type_name` varchar(64) NOT NULL DEFAULT '' COMMENT '用户类型名称',
  `remark` varchar(128) NOT NULL DEFAULT '' COMMENT '说明',
  `alias` varchar(64) NOT NULL DEFAULT '' COMMENT '别名',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='用户分类';

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_name` varchar(32) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(100) NOT NULL DEFAULT '' COMMENT '密码',
  `nick_name` varchar(50) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `real_name` varchar(30) NOT NULL DEFAULT '' COMMENT '用户名',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱',
  `phone` varchar(11) NOT NULL DEFAULT '' COMMENT '手机号',
  `last_login_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '登录时间',
  `last_login_ip` varchar(100) NOT NULL DEFAULT '' COMMENT '登录ip',
  `is_super_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否系统管理员 10 -10',
  `is_black` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否黑名单 10 -10',
  `role_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '角色Id',
  `type_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '分类id',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `is_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否管理员',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='用户表';

-- Vote items table
CREATE TABLE IF NOT EXISTS `vote_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `vote_id` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '所属投票id',
  `title` varchar(128) NOT NULL DEFAULT '' COMMENT '标题',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='投票单个项目';

-- Votes table
CREATE TABLE IF NOT EXISTS `votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '标题',
  `start_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '开始时间',
  `end_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '结束时间',
  `count` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '投票总数',
  `vote_items` varchar(5000) NOT NULL DEFAULT '' COMMENT '投票项列表',
  `is_multiple` tinyint NOT NULL DEFAULT 0 COMMENT '是否多选 10 多选 -10 单选',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态',
  `create_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '创建时间',
  `update_time` bigint(13) unsigned NOT NULL DEFAULT 0 COMMENT '更新时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='投票列表';
