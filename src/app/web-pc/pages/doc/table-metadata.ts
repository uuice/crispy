// Auto-aligned with src/db/db.d.ts (18 tables).
// Regenerate: bun run doc:tables (after db:generate).

export interface DocTableColumn {
  name: string
  type: string
  nullable: boolean
  default: string | null
  comment: string
}

export interface DocTable {
  name: string
  comment: string
  columns: DocTableColumn[]
}

export const DOC_TABLES: DocTable[] = [
  {
    "name": "access_token",
    "comment": "Content API 访问令牌",
    "columns": [
      {
        "name": "app_name",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "应用名称"
      },
      {
        "name": "channel",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "渠道"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "启用状态 10 启用 -10 未启用"
      },
      {
        "name": "token",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "Token"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "user_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "用户id"
      }
    ]
  },
  {
    "name": "ad_items",
    "comment": "广告位单条记录",
    "columns": [
      {
        "name": "ad_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "广告位id"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "内容"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "image_url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "图片列表"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "method",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "打开方式"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "链接"
      }
    ]
  },
  {
    "name": "ads",
    "comment": "广告位",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "内容"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "end_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "结束时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "start_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "开始时间"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "类型id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "api_logs",
    "comment": "API 请求日志",
    "columns": [
      {
        "name": "body",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "post请求"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "ip",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "来源ip"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "method",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "打开方式"
      },
      {
        "name": "query",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "query请求"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "user_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "用户id"
      }
    ]
  },
  {
    "name": "articles",
    "comment": "文章/新闻动态",
    "columns": [
      {
        "name": "abstract",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "摘要"
      },
      {
        "name": "attrs",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "特殊标签属性"
      },
      {
        "name": "author_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "作者id"
      },
      {
        "name": "click",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "点击量"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "文章内容"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "image",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "缩略图"
      },
      {
        "name": "image_list",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "文章配图"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "is_markdown",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否是markdown 内容"
      },
      {
        "name": "is_review",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否需要审核 1需要 0不需要"
      },
      {
        "name": "markdown_content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "markdown 内容"
      },
      {
        "name": "redirect_url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "跳转链接"
      },
      {
        "name": "remark",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "备注"
      },
      {
        "name": "seo_description",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "seo_keywords",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "关键词"
      },
      {
        "name": "seo_title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "seo标题"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "10已发布 -10待发布 -100已删除 -20草稿箱"
      },
      {
        "name": "sub_title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "短标题"
      },
      {
        "name": "tags",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标签"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "栏目id"
      },
      {
        "name": "type_ids",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "栏目id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "路由美化"
      },
      {
        "name": "user_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "操作用户id"
      }
    ]
  },
  {
    "name": "attrs",
    "comment": "文章特殊标签（置顶、推荐等）",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "caches",
    "comment": "页面缓存（遗留表，已不再写入）",
    "columns": [
      {
        "name": "cache_data",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "缓存数据"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "hash",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "hash"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "原始url"
      }
    ]
  },
  {
    "name": "categories",
    "comment": "内容分类",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "des",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "备注描述"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "parent_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "父级id"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "configs",
    "comment": "系统配置项",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "设置分类"
      },
      {
        "name": "type_ids",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "类型ids"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "value",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "值"
      }
    ]
  },
  {
    "name": "jobs",
    "comment": "招聘职位",
    "columns": [
      {
        "name": "address",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "工作地址"
      },
      {
        "name": "branch",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "所在部门"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "招聘信息"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "email",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "简历发送邮箱"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "nature",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "工作性质"
      },
      {
        "name": "num",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "招聘人数"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "职位名称"
      },
      {
        "name": "typeName",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "职位类别"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "links",
    "comment": "友情链接",
    "columns": [
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "des",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "logo",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "logo"
      },
      {
        "name": "method",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "打开方式"
      },
      {
        "name": "site_name",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "站点名称"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "分类id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "链接"
      }
    ]
  },
  {
    "name": "menus",
    "comment": "导航菜单",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "icon",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "图标"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "image_url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "图片列表"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "method",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "打开方式"
      },
      {
        "name": "parent_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "父级id"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "链接"
      }
    ]
  },
  {
    "name": "operate_logs",
    "comment": "后台操作审计日志",
    "columns": [
      {
        "name": "code",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "操作code"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "操作内容"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "分类id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "user_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "用户id"
      }
    ]
  },
  {
    "name": "pages",
    "comment": "单页（关于我们、产品页等）",
    "columns": [
      {
        "name": "abstract",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "摘要"
      },
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "author_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "作者id"
      },
      {
        "name": "click",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "点击量"
      },
      {
        "name": "content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "页面内容"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "image_list",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "页面轮播配图"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "is_markdown",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否是markdown 内容"
      },
      {
        "name": "markdown_content",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "markdown 内容"
      },
      {
        "name": "remark",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "备注"
      },
      {
        "name": "seo_description",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "seo_keywords",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "关键词"
      },
      {
        "name": "seo_title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "seo标题"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "10已发布 -10待发布 -100已删除 -20草稿箱"
      },
      {
        "name": "sub_title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "短标题"
      },
      {
        "name": "tags",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标签"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "栏目id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "路由美化"
      },
      {
        "name": "user_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "操作用户id"
      }
    ]
  },
  {
    "name": "roles",
    "comment": "后台角色",
    "columns": [
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "des",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "module_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "所属模块"
      },
      {
        "name": "rule_ids",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "规则列表"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "类型id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "rules",
    "comment": "后台权限规则/菜单",
    "columns": [
      {
        "name": "alias",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "别名"
      },
      {
        "name": "condition",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "规则"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "des",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "规则描述"
      },
      {
        "name": "icon",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "图标"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "module_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "模块Id"
      },
      {
        "name": "parent_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "父级id"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "规则名称"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "分类id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      }
    ]
  },
  {
    "name": "tags",
    "comment": "内容标签",
    "columns": [
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "des",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "描述"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "sort",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "排序"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "title",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "标题"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "所属分类"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "value",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "值"
      }
    ]
  },
  {
    "name": "users",
    "comment": "用户账号",
    "columns": [
      {
        "name": "avatar_url",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "头像"
      },
      {
        "name": "create_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "创建时间"
      },
      {
        "name": "email",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "邮箱"
      },
      {
        "name": "id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "自增id"
      },
      {
        "name": "is_admin",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否管理员 1是 0否"
      },
      {
        "name": "is_black",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否黑名单 1是 0否"
      },
      {
        "name": "is_delete",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否删除"
      },
      {
        "name": "is_super_admin",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "是否系统管理员 1是 0否"
      },
      {
        "name": "last_login_ip",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "登录ip"
      },
      {
        "name": "last_login_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "登录时间"
      },
      {
        "name": "nick_name",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "昵称"
      },
      {
        "name": "password",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "密码"
      },
      {
        "name": "phone",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "手机号"
      },
      {
        "name": "real_name",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "用户名"
      },
      {
        "name": "role_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "角色Id"
      },
      {
        "name": "status",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "状态"
      },
      {
        "name": "type_id",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "分类id"
      },
      {
        "name": "update_time",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "更新时间"
      },
      {
        "name": "user_name",
        "type": "—",
        "nullable": true,
        "default": null,
        "comment": "用户名"
      }
    ]
  }
]
