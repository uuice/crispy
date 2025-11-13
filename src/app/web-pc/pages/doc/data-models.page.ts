import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'

// 数据模型，严格根据 migrations/migrations/001_initial_schema.sql 文件生成，所有注释与 SQL 文件 COMMENT 保持一致
const TABLES = [
  {
    name: 'access_token',
    comment: 'access token 用于content api 调用',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'app_name',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '应用名称'
      },
      {
        name: 'channel',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '渠道'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'status',
        type: 'tinyint(2)',
        nullable: false,
        default: '10',
        comment: '启用状态 10 启用 -10 未启用'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: ''
      },
      {
        name: 'token',
        type: 'varchar(32)',
        nullable: false,
        default: null,
        comment: 'Token'
      }
    ]
  },
  {
    name: 'ad_items',
    comment: '广告位单条记录',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'image_url',
        type: 'varchar(500)',
        nullable: false,
        default: "''",
        comment: '图片列表'
      },
      {
        name: 'ad_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '广告位id'
      },
      {
        name: 'url',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '链接'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'content',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '内容'
      },
      {
        name: 'method',
        type: 'varchar(10)',
        nullable: false,
        default: "''",
        comment: '打开方式'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      },
      {
        name: 'sort',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '排序'
      }
    ]
  },
  {
    name: 'additions',
    comment: '附加表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'primary_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '主表id'
      },
      {
        name: 'fields_json',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: 'json对象字符串'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'ads',
    comment: '广告位列表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'type_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '类型id'
      },
      {
        name: 'alias',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '别名'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'start_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '开始时间'
      },
      {
        name: 'end_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '结束时间'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      },
      {
        name: 'content',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: ''
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: ''
      },
      {
        name: 'sort',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '排序'
      }
    ]
  },
  {
    name: 'api_logs',
    comment: 'api接口日志',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'method',
        type: 'varchar(10)',
        nullable: false,
        default: "''",
        comment: '打开方式'
      },
      {
        name: 'query',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: 'query请求'
      },
      {
        name: 'body',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: 'post请求'
      },
      {
        name: 'ip',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '来源ip'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: ''
      }
    ]
  },
  {
    name: 'articles',
    comment: '文章列表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'content',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: '内容'
      },
      {
        name: 'author_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '作者id'
      },
      {
        name: 'category_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '分类id'
      },
      {
        name: 'view_count',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '浏览量'
      },
      {
        name: 'like_count',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '点赞数'
      },
      {
        name: 'comment_count',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '评论数'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'attrs',
    comment: '属性表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '属性名称'
      },
      {
        name: 'value',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '属性值'
      },
      {
        name: 'type',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '属性类型'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'caches',
    comment: '缓存表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'key',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '缓存键'
      },
      {
        name: 'value',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: '缓存值'
      },
      {
        name: 'expire_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '过期时间'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'categories',
    comment: '分类表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '分类名称'
      },
      {
        name: 'parent_id',
        type: 'int(11) unsigned',
        nullable: true,
        default: null,
        comment: '父分类id'
      },
      {
        name: 'level',
        type: 'tinyint unsigned',
        nullable: false,
        default: '0',
        comment: '分类层级'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'comments',
    comment: '评论表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'article_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '文章id'
      },
      {
        name: 'content',
        type: 'varchar(500)',
        nullable: false,
        default: "''",
        comment: '评论内容'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'configs',
    comment: '配置表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'key',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '配置键'
      },
      {
        name: 'value',
        type: 'longtext',
        nullable: false,
        default: null,
        comment: '配置值'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'enums',
    comment: '枚举表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '枚举名称'
      },
      {
        name: 'value',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '枚举值'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'holidays',
    comment: '节假日表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'date',
        type: 'date',
        nullable: false,
        default: null,
        comment: '日期'
      },
      {
        name: 'type',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '类型'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'jobs',
    comment: '任务表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '任务名称'
      },
      {
        name: 'command',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '命令'
      },
      {
        name: 'schedule',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '调度'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'keywords',
    comment: '关键词表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '关键词'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'links',
    comment: '链接表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '链接名称'
      },
      {
        name: 'url',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '链接地址'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'menus',
    comment: '菜单表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '菜单名称'
      },
      {
        name: 'parent_id',
        type: 'int(11) unsigned',
        nullable: true,
        default: null,
        comment: '父菜单id'
      },
      {
        name: 'path',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '菜单路径'
      },
      {
        name: 'component',
        type: 'varchar(255)',
        nullable: true,
        default: null,
        comment: '组件路径'
      },
      {
        name: 'redirect',
        type: 'varchar(255)',
        nullable: true,
        default: null,
        comment: '重定向路径'
      },
      {
        name: 'meta',
        type: 'json',
        nullable: true,
        default: null,
        comment: '菜单元数据'
      },
      {
        name: 'sort',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '排序'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'notices',
    comment: '通知表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'content',
        type: 'varchar(500)',
        nullable: false,
        default: "''",
        comment: '内容'
      },
      {
        name: 'type',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '类型'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '接收用户id'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'operate_logs',
    comment: '操作日志表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'module',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '模块'
      },
      {
        name: 'action',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '操作'
      },
      {
        name: 'ip',
        type: 'varchar(20)',
        nullable: false,
        default: "''",
        comment: '来源ip'
      },
      {
        name: 'params',
        type: 'json',
        nullable: true,
        default: null,
        comment: '参数'
      },
      {
        name: 'result',
        type: 'json',
        nullable: true,
        default: null,
        comment: '结果'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'pages',
    comment: '页面表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '页面名称'
      },
      {
        name: 'path',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '页面路径'
      },
      {
        name: 'component',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '组件路径'
      },
      {
        name: 'redirect',
        type: 'varchar(255)',
        nullable: true,
        default: null,
        comment: '重定向路径'
      },
      {
        name: 'meta',
        type: 'json',
        nullable: true,
        default: null,
        comment: '页面元数据'
      },
      {
        name: 'sort',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '排序'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'roles',
    comment: '角色表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '角色名称'
      },
      {
        name: 'code',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '角色编码'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'rules',
    comment: '规则表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '规则名称'
      },
      {
        name: 'code',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '规则编码'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'tags',
    comment: '标签表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '标签名称'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'todos',
    comment: '待办事项表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'description',
        type: 'varchar(500)',
        nullable: true,
        default: null,
        comment: '描述'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'priority',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '优先级'
      },
      {
        name: 'due_date',
        type: 'bigint(13) unsigned',
        nullable: true,
        default: null,
        comment: '截止日期'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'user_types',
    comment: '用户类型表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'name',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '用户类型名称'
      },
      {
        name: 'code',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '用户类型编码'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'users',
    comment: '用户表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'username',
        type: 'varchar(50)',
        nullable: false,
        default: "''",
        comment: '用户名'
      },
      {
        name: 'password',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '密码'
      },
      {
        name: 'email',
        type: 'varchar(100)',
        nullable: true,
        default: null,
        comment: '邮箱'
      },
      {
        name: 'phone',
        type: 'varchar(20)',
        nullable: true,
        default: null,
        comment: '手机号'
      },
      {
        name: 'avatar_url',
        type: 'text',
        nullable: true,
        default: null,
        comment: '头像'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '10',
        comment: '启用状态 10 启用 -10 未启用'
      },
      {
        name: 'user_type_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户类型id'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'vote_items',
    comment: '投票项表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'vote_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '投票id'
      },
      {
        name: 'option',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '选项'
      },
      {
        name: 'votes',
        type: 'int unsigned',
        nullable: false,
        default: '0',
        comment: '投票数'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  },
  {
    name: 'votes',
    comment: '投票表',
    columns: [
      {
        name: 'id',
        type: 'int(11) unsigned',
        nullable: false,
        default: null,
        comment: '自增id'
      },
      {
        name: 'title',
        type: 'varchar(255)',
        nullable: false,
        default: "''",
        comment: '标题'
      },
      {
        name: 'description',
        type: 'varchar(500)',
        nullable: true,
        default: null,
        comment: '描述'
      },
      {
        name: 'user_id',
        type: 'int(11) unsigned',
        nullable: false,
        default: '0',
        comment: '用户id'
      },
      {
        name: 'status',
        type: 'tinyint',
        nullable: false,
        default: '0',
        comment: '状态'
      },
      {
        name: 'create_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '创建时间'
      },
      {
        name: 'update_time',
        type: 'bigint(13) unsigned',
        nullable: false,
        default: '0',
        comment: '更新时间'
      },
      {
        name: 'is_delete',
        type: 'tinyint(1) unsigned',
        nullable: false,
        default: '0',
        comment: '是否删除'
      }
    ]
  }
]

@Component({
  selector: 'cs-doc-data-models',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule, CommonModule],
  template: `
    <p-card header="数据模型 (Database Schema)" styleClass="system-card">
      <p-table
        [value]="tables"
        styleClass="p-datatable-sm beautify-table"
        dataKey="name"
        [expandedRowKeys]="expandedRows"
        (onRowExpand)="onRowExpand($event)"
        (onRowCollapse)="onRowCollapse($event)"
        [scrollable]="true"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 50px"></th>
            <th>表名</th>
            <th>说明</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-expanded="expanded">
          <tr>
            <td>
              <p-button
                type="button"
                pRipple
                [pRowToggler]="row"
                [text]="true"
                severity="secondary"
                [rounded]="true"
                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
              ></p-button>
            </td>
            <td>{{ row.name }}</td>
            <td>{{ row.comment }}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="expandedrow" let-row>
          <tr>
            <td colspan="3">
              <div class="expansion-content">
                <div class="expansion-header">
                  <h3 class="tag-title">{{ row.name }} 字段详情</h3>
                  <p class="tag-description">{{ row.comment }}</p>
                </div>
                <div class="parameters-section">
                  <div class="section-header">
                    <i class="pi pi-cog"></i>
                    <h4>字段列表</h4>
                  </div>
                  <div class="parameters-table">
                    <table>
                      <thead>
                        <tr>
                          <th>字段名</th>
                          <th>类型</th>
                          <th>可空</th>
                          <th>默认值</th>
                          <th>说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (col of row.columns; track col.name) {
                          <tr>
                            <td>
                              <span class="param-name">{{ col.name }}</span>
                            </td>
                            <td>
                              <span class="param-type">{{ col.type }}</span>
                            </td>
                            <td>
                              <span class="param-required" [class.required]="!col.nullable">{{
                                col.nullable ? '是' : '否'
                              }}</span>
                            </td>
                            <td>
                              <span class="param-default">{{ col.default ?? '-' }}</span>
                            </td>
                            <td>{{ col.comment }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [
    // 复用 templates.page.ts 的样式
    `
      .system-card {
        flex: 1;
        background: var(--p-content-background) !important;
        color: var(--p-content-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 10px;
        box-shadow: none;
        padding: 1.2rem 1.2rem 1rem 1.2rem;
        transition: border-color 0.2s;
      }
      .system-card:hover {
        border-color: var(--p-primary-color) !important;
      }
      .beautify-table th,
      .beautify-table td {
        padding: 0.5rem 1rem;
        font-size: 1.05rem;
        background: var(--p-content-background);
        border-bottom: 1px solid var(--p-content-border-color);
      }
      .beautify-table tr:hover {
        background: var(--p-primary-color) !important;
        color: var(--p-text-color) !important;
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
      .expansion-content {
        padding: 1.5rem;
        background: linear-gradient(
          135deg,
          var(--p-surface-section) 0%,
          var(--p-surface-ground) 100%
        );
        border-top: 2px solid var(--p-primary-color);
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .expansion-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--p-primary-color);
      }
      .tag-title {
        margin: 0 0 0.5rem 0;
        color: var(--p-primary-color);
        font-size: 1.5rem;
        font-weight: 700;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      .tag-description {
        margin: 0;
        color: var(--p-text-color-secondary);
        font-size: 1.1rem;
        line-height: 1.5;
      }
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        background: var(--p-primary-color);
        color: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .section-header i {
        font-size: 1.1rem;
      }
      .section-header h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
      .parameters-section {
        margin-bottom: 2rem;
      }
      .parameters-table table {
        width: 100%;
        border-collapse: collapse;
        background: var(--p-content-background);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--p-content-border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .parameters-table th,
      .parameters-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--p-content-border-color);
        font-size: 0.95rem;
      }
      .parameters-table th {
        font-weight: 600;
      }
      .parameters-table tr:hover {
        background: var(--p-surface-hover);
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
      .param-name {
        background: var(--p-primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .param-type {
        background: var(--p-success-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .param-required {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .param-required.required {
        background: var(--p-danger-color);
        color: white;
      }
      .param-required:not(.required) {
        background: var(--p-success-color);
        color: white;
      }
      .param-default {
        background: var(--p-warning-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
      }
    `
  ]
})
export class DocDataModelsPage {
  tables = TABLES
  expandedRows: any = Object.fromEntries(TABLES.map((t) => [t.name, true]))

  // Row expand event
  onRowExpand(event: any) {
    // English comment: Log expanded row
    console.log('Row expanded:', event.data)
  }

  // Row collapse event
  onRowCollapse(event: any) {
    // English comment: Log collapsed row
    console.log('Row collapsed:', event.data)
  }
}
