import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Access token table
  await db.schema
    .createTable('access_token')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '用户id'`)
    )
    .addColumn('app_name', 'varchar(20)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '应用名称'`)
    )
    .addColumn('channel', 'varchar(20)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '渠道'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(10)
        .modifyEnd(sql`COMMENT '启用状态 10 启用 -10 未启用'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addColumn('token', 'varchar(32)', (col) => col.notNull().modifyEnd(sql`COMMENT 'Token'`))
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='access token 用于content api 调用'`
    )
    .execute()

  // Ad items table
  await db.schema
    .createTable('ad_items')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('image_url', 'varchar(500)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '图片列表'`)
    )
    .addColumn('ad_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '广告位id'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '链接'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('content', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '内容'`)
    )
    .addColumn('method', 'varchar(10)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '打开方式'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='广告位单条记录'`
    )
    .execute()

  // Additions table
  await db.schema
    .createTable('additions')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('primary_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '主表id'`)
    )
    .addColumn('fields_json', 'text', (col) =>
      col.notNull().modifyEnd(sql`COMMENT 'json对象字符串'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='附加表'`
    )
    .execute()

  // Ads table
  await db.schema
    .createTable('ads')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '类型id'`)
    )
    .addColumn('alias', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('start_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '开始时间'`)
    )
    .addColumn('end_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '结束时间'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addColumn('content', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '内容'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addUniqueConstraint('ads_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='广告位列表'`
    )
    .execute()

  // API logs table
  await db.schema
    .createTable('api_logs')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '用户id'`)
    )
    .addColumn('method', 'varchar(10)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '打开方式'`)
    )
    .addColumn('query', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT 'query请求'`))
    .addColumn('body', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT 'post请求'`))
    .addColumn('ip', 'varchar(20)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '来源ip'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='api接口日志'`
    )
    .execute()

  // Articles table
  await db.schema
    .createTable('articles')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '栏目id'`)
    )
    .addColumn('type_ids', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '栏目id'`)
    )
    .addColumn('title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '路由美化'`)
    )
    .addColumn('sub_title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '短标题'`)
    )
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '文章内容'`))
    .addColumn('abstract', 'varchar(5000)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '摘要'`)
    )
    .addColumn('redirect_url', 'varchar(500)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '跳转链接'`)
    )
    .addColumn('author_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '作者id'`)
    )
    .addColumn('remark', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '备注'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '10已发布 -10待发布 -100已删除 -20草稿箱'`)
    )
    .addColumn('is_review', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否需要审核 10需要 -10不需要'`)
    )
    .addColumn('image_list', 'varchar(500)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '文章配图'`)
    )
    .addColumn('image', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '缩略图'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('attrs', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '特殊标签属性'`)
    )
    .addColumn('click', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '点击量'`)
    )
    .addColumn('tags', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标签'`)
    )
    .addColumn('seo_title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'seo标题'`)
    )
    .addColumn('seo_keywords', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '关键词'`)
    )
    .addColumn('seo_description', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '操作用户id'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='文章，文档'`
    )
    .execute()

  // Attrs table
  await db.schema
    .createTable('attrs')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('alias', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('attrs_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='特殊属性'`
    )
    .execute()

  // Caches table
  await db.schema
    .createTable('caches')
    .addColumn('id', 'integer', (col) =>
      col
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('hash', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'hash'`)
    )
    .addColumn('cache_data', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '缓存数据'`))
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='缓存'`
    )
    .execute()

  // Categories table
  await db.schema
    .createTable('categories')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('parent_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '父级id'`)
    )
    .addColumn('alias', 'varchar(32)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('des', 'varchar(255)', (col) => col.notNull().modifyEnd(sql`COMMENT '备注描述'`))
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('categories_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='分类表'`
    )
    .execute()

  // Comments table
  await db.schema
    .createTable('comments')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(128)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '评论标题'`)
    )
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '评论内容'`))
    .addColumn('parent_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '上级评论'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '评论者Id'`)
    )
    .addColumn('good_article', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '好评'`)
    )
    .addColumn('bad_article', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '差评'`)
    )
    .addColumn('not_article', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '中立'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='评论'`
    )
    .execute()

  // Configs table
  await db.schema
    .createTable('configs')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '设置分类'`)
    )
    .addColumn('type_ids', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '类型ids'`)
    )
    .addColumn('alias', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('value', 'varchar(5000)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '值'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('configs_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='配置项'`
    )
    .execute()

  // Enums table
  await db.schema
    .createTable('enums')
    .addColumn('id', 'integer', (col) =>
      col
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('alias', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('value', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '值'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('code', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'code'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('enums_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='枚举'`
    )
    .execute()

  // Holidays table
  await db.schema
    .createTable('holidays')
    .addColumn('id', 'integer', (col) =>
      col
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(100)', (col) => col.notNull().modifyEnd(sql`COMMENT '标题'`))
    .addColumn('value', 'varchar(500)', (col) => col.notNull().modifyEnd(sql`COMMENT '值'`))
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='节假日'`
    )
    .execute()

  // Jobs table
  await db.schema
    .createTable('jobs')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '职位名称'`)
    )
    .addColumn('branch', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '所在部门'`)
    )
    .addColumn('typeName', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '职位类别'`)
    )
    .addColumn('nature', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '工作性质'`)
    )
    .addColumn('address', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '工作地址'`)
    )
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '招聘信息'`))
    .addColumn('num', 'integer', (col) => col.notNull().modifyEnd(sql`COMMENT '招聘人数'`))
    .addColumn('email', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('0')
        .modifyEnd(sql`COMMENT '简历发送邮箱'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='招聘职位'`
    )
    .execute()

  // Keywords table
  await db.schema
    .createTable('keywords')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('alias', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('value', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '值'`)
    )
    .addColumn('count', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '点击数'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类id'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '链接'`)
    )
    .addColumn('title', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('keywords_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='关键词'`
    )
    .execute()

  // Links table
  await db.schema
    .createTable('links')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类id'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('site_name', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '站点名称'`)
    )
    .addColumn('des', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '链接'`)
    )
    .addColumn('method', 'varchar(10)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '打开方式'`)
    )
    .addColumn('logo', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'logo'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='友情链接'`
    )
    .execute()

  // Menus table
  await db.schema
    .createTable('menus')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('parent_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '父级id'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '链接'`)
    )
    .addColumn('method', 'varchar(10)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '打开方式'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('icon', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '图标'`)
    )
    .addColumn('alias', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('image_url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '图片列表'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('menus_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='菜单设置'`
    )
    .execute()

  // Notices table
  await db.schema
    .createTable('notices')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('from_user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '发布者id'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('content', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '内容'`)
    )
    .addColumn('publish_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '发布时间'`)
    )
    .addColumn('tolds', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '接收者id列表'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='通知'`
    )
    .execute()

  // Operate logs table
  await db.schema
    .createTable('operate_logs')
    .addColumn('id', 'integer', (col) =>
      col
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('code', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '操作code'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类id'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '用户id'`)
    )
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '操作内容'`))
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='操作日志'`
    )
    .execute()

  // Pages table
  await db.schema
    .createTable('pages')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '栏目id'`)
    )
    .addColumn('title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '路由美化'`)
    )
    .addColumn('alias', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('sub_title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '短标题'`)
    )
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '页面内容'`))
    .addColumn('abstract', 'varchar(5000)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '摘要'`)
    )
    .addColumn('author_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '作者id'`)
    )
    .addColumn('remark', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '备注'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '10已发布 -10待发布 -100已删除 -20草稿箱'`)
    )
    .addColumn('image_list', 'varchar(500)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '页面轮播配图'`)
    )
    .addColumn('click', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '点击量'`)
    )
    .addColumn('tags', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标签'`)
    )
    .addColumn('seo_title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'seo标题'`)
    )
    .addColumn('seo_keywords', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '关键词'`)
    )
    .addColumn('seo_description', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .addColumn('user_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '操作用户id'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('pages_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='页面'`
    )
    .execute()

  // Roles table
  await db.schema
    .createTable('roles')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .addColumn('des', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .addColumn('rule_ids', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '规则列表'`))
    .addColumn('module_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '所属模块'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '类型id'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='角色表'`
    )
    .execute()

  // Rules table
  await db.schema
    .createTable('rules')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '规则名称'`)
    )
    .addColumn('des', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '规则描述'`)
    )
    .addColumn('alias', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类id'`)
    )
    .addColumn('icon', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '图标'`)
    )
    .addColumn('parent_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '父级id'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('module_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '模块Id'`)
    )
    .addColumn('condition', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '规则'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('rules_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='规则表'`
    )
    .execute()

  // Tags table
  await db.schema
    .createTable('tags')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('value', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '值'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '所属分类'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addColumn('sort', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '排序'`)
    )
    .addColumn('des', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '描述'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='标签'`
    )
    .execute()

  // Todos table
  await db.schema
    .createTable('todos')
    .addColumn('id', 'integer', (col) =>
      col
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '发布者id'`)
    )
    .addColumn('publish_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '发布者id'`)
    )
    .addColumn('user_ids', 'varchar(100)', (col) => col.notNull().modifyEnd(sql`COMMENT '用户ids'`))
    .addColumn('title', 'varchar(100)', (col) => col.notNull().modifyEnd(sql`COMMENT '标题'`))
    .addColumn('content', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '内容'`))
    .addColumn('start_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '开始时间'`)
    )
    .addColumn('end_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '结束时间'`)
    )
    .addColumn('complete', 'smallint', (col) => col.notNull().modifyEnd(sql`COMMENT '是否完成'`))
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类'`)
    )
    .addColumn('remark', 'varchar(500)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '备注'`)
    )
    .addColumn('status', 'smallint', (col) => col.notNull().modifyEnd(sql`COMMENT '状态'`))
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='待办事项'`
    )
    .execute()

  // User types table
  await db.schema
    .createTable('user_types')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('type_name', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '用户类型名称'`)
    )
    .addColumn('remark', 'varchar(128)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '说明'`)
    )
    .addColumn('alias', 'varchar(64)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '别名'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addUniqueConstraint('user_types_alias_unique', ['alias'])
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='用户分类'`
    )
    .execute()

  // Users table
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('user_name', 'varchar(32)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '用户名'`)
    )
    .addColumn('password', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '密码'`)
    )
    .addColumn('nick_name', 'varchar(50)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '昵称'`)
    )
    .addColumn('avatar_url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '头像'`)
    )
    .addColumn('real_name', 'varchar(30)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '用户名'`)
    )
    .addColumn('email', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '邮箱'`)
    )
    .addColumn('phone', 'varchar(11)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '手机号'`)
    )
    .addColumn('last_login_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '登录时间'`)
    )
    .addColumn('last_login_ip', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '登录ip'`)
    )
    .addColumn('is_super_admin', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否系统管理员 10 -10'`)
    )
    .addColumn('is_black', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否黑名单 10 -10'`)
    )
    .addColumn('role_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '角色Id'`)
    )
    .addColumn('type_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '分类id'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('is_admin', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否管理员'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='用户表'`
    )
    .execute()

  // Vote items table
  await db.schema
    .createTable('vote_items')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('vote_id', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '所属投票id'`)
    )
    .addColumn('title', 'varchar(128)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='投票单个项目'`
    )
    .execute()

  // Votes table
  await db.schema
    .createTable('votes')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('title', 'varchar(100)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '标题'`)
    )
    .addColumn('start_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '开始时间'`)
    )
    .addColumn('end_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '结束时间'`)
    )
    .addColumn('count', 'integer', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '投票总数'`)
    )
    .addColumn('vote_items', 'varchar(5000)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '投票项列表'`)
    )
    .addColumn('is_multiple', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否多选 10 多选 -10 单选'`)
    )
    .addColumn('status', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='投票列表'`
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop all tables in reverse order
  const tables = [
    'votes',
    'vote_items',
    'users',
    'user_types',
    'todos',
    'tags',
    'rules',
    'roles',
    'pages',
    'operate_logs',
    'notices',
    'menus',
    'links',
    'keywords',
    'jobs',
    'holidays',
    'enums',
    'configs',
    'comments',
    'categories',
    'caches',
    'attrs',
    'articles',
    'api_logs',
    'ads',
    'additions',
    'ad_items',
    'access_token'
  ]

  for (const table of tables) {
    await db.schema.dropTable(table).ifExists().execute()
  }
}
