import { Kysely, sql } from 'kysely'

// Helper function to safely insert data with duplicate handling
async function safeInsert(db: Kysely<any>, tableName: string, data: any[], description: string) {
  try {
    await db.insertInto(tableName).values(data).execute()
  } catch (error) {
    console.log(`Some ${description} may already exist, skipping...`)
  }
}

export async function up(db: Kysely<any>): Promise<void> {
  // Insert default admin user (password: admin123)
  // First check if admin user already exists
  const existingAdmin = await db
    .selectFrom('users')
    .select('id')
    .where('user_name', '=', 'admin')
    .executeTakeFirst()

  if (!existingAdmin) {
    await db
      .insertInto('users')
      .values({
        user_name: 'admin',
        real_name: '系统管理员',
        nick_name: '管理员',
        password: '$2b$10$TaB9i6mj0PLmwDOjnLeMJeDSMcw/J9LlFdBWQHG7AvcsUY782B0IW', // bcrypt hash for 'admin123'
        email: 'admin@example.com',
        phone: '13800138000',
        avatar_url: '/assets/images/avatar.png',
        role_id: 1,
        type_id: 1,
        status: 10,
        is_admin: 1,
        is_super_admin: 1,
        is_black: 0,
        is_delete: 0,
        last_login_time: Date.now(),
        last_login_ip: '127.0.0.1',
        create_time: Date.now(),
        update_time: Date.now()
      })
      .execute()
  }

  // Insert user types (check if they exist first)
  const existingUserTypes = await db.selectFrom('user_types').select('alias').execute()

  const existingAliases = existingUserTypes.map((ut) => ut.alias)

  const userTypes = [
    {
      type_name: '管理员',
      remark: '系统管理员用户类型',
      alias: 'admin',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      type_name: '普通用户',
      remark: '普通用户类型',
      alias: 'user',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      type_name: 'VIP用户',
      remark: 'VIP用户类型',
      alias: 'vip',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  const newUserTypes = userTypes.filter((ut) => !existingAliases.includes(ut.alias))

  if (newUserTypes.length > 0) {
    await db.insertInto('user_types').values(newUserTypes).execute()
  }

  // Insert default role (with error handling for duplicates)
  try {
    await db
      .insertInto('roles')
      .values({
        title: '超级管理员',
        des: '拥有所有权限的超级管理员角色',
        module_id: 1,
        type_id: 1,
        rule_ids:
          '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51',
        sort: 0,
        status: 10,
        is_delete: 0,
        create_time: Date.now(),
        update_time: Date.now()
      })
      .execute()
  } catch (error) {
    // Ignore duplicate key errors
    console.log('Role may already exist, skipping...')
  }

  // Insert basic rules
  const rules = [
    {
      title: '仪表盘',
      alias: 'dashboard',
      des: '系统仪表盘管理',
      condition: '/backstage/dashboard',
      icon: 'pi pi-home',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '文章管理',
      alias: 'posts',
      des: '文章内容管理',
      condition: '/backstage/posts',
      icon: 'pi pi-file',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '分类管理',
      alias: 'categories',
      des: '文章分类管理',
      condition: '/backstage/categories',
      icon: 'pi pi-folder',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '标签管理',
      alias: 'tags',
      des: '文章标签管理',
      condition: '/backstage/tags',
      icon: 'pi pi-tags',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 4,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '页面管理',
      alias: 'pages',
      des: '静态页面管理',
      condition: '/backstage/pages',
      icon: 'pi pi-file-edit',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 5,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '评论管理',
      alias: 'comments',
      des: '用户评论管理',
      condition: '/backstage/comments',
      icon: 'pi pi-comments',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 6,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '用户管理',
      alias: 'users',
      des: '用户账户管理',
      condition: '/backstage/users',
      icon: 'pi pi-users',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 7,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '管理员管理',
      alias: 'admins',
      des: '管理员账户管理',
      condition: '/backstage/admins',
      icon: 'pi pi-user-plus',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 8,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '角色管理',
      alias: 'roles',
      des: '用户角色管理',
      condition: '/backstage/roles',
      icon: 'pi pi-shield',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 9,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '权限管理',
      alias: 'rules',
      des: '系统权限管理',
      condition: '/backstage/rules',
      icon: 'pi pi-key',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 10,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '系统设置',
      alias: 'settings',
      des: '系统基础设置',
      condition: '/backstage/settings',
      icon: 'pi pi-cog',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 11,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '配置管理',
      alias: 'configs',
      des: '系统配置管理',
      condition: '/backstage/configs',
      icon: 'pi pi-wrench',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 12,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '系统管理',
      alias: 'systems',
      des: '系统高级管理',
      condition: '/backstage/systems',
      icon: 'pi pi-server',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 13,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '菜单管理',
      alias: 'menus',
      des: '系统菜单管理',
      condition: '/backstage/menus',
      icon: 'pi pi-bars',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 14,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '链接管理',
      alias: 'links',
      des: '友情链接管理',
      condition: '/backstage/links',
      icon: 'pi pi-link',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 15,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '招聘管理',
      alias: 'jobs',
      des: '招聘信息管理',
      condition: '/backstage/jobs',
      icon: 'pi pi-briefcase',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 16,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '广告管理',
      alias: 'ads',
      des: '广告位管理',
      condition: '/backstage/ads',
      icon: 'pi pi-image',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 17,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '广告位详细列表',
      alias: 'ads-item-list',
      des: '广告位详细列表',
      condition: '/backstage/ads/item-list',
      icon: 'pi pi-image',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 18,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '节假日管理',
      alias: 'holidays',
      des: '节假日信息管理',
      condition: '/backstage/holidays',
      icon: 'pi pi-calendar',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 19,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '属性管理',
      alias: 'attrs',
      des: '特殊属性管理',
      condition: '/backstage/attrs',
      icon: 'pi pi-list',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 20,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '操作日志',
      alias: 'operate-logs',
      des: '系统操作日志',
      condition: '/backstage/operate-logs',
      icon: 'pi pi-history',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 21,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '缓存管理',
      alias: 'caches',
      des: '缓存管理',
      condition: '/backstage/caches',
      icon: 'pi pi-cog',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 22,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '应用管理',
      alias: 'apps',
      des: '应用管理',
      condition: '/backstage/apps',
      icon: 'pi pi-server',
      module_id: 1,
      type_id: 1,
      parent_id: 0,
      sort: 23,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  try {
    await db.insertInto('rules').values(rules).execute()
  } catch (error) {
    console.log('Some rules may already exist, skipping...')
  }

  // Insert basic categories (including system categories)
  const categories = [
    // System categories
    {
      title: '系统管理',
      alias: 'GOD_SYS_CAT',
      des: '系统管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '广告管理',
      alias: 'AD_SYS_CAT',
      des: '广告管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '文章管理',
      alias: 'POST_SYS_CAT',
      des: '文章管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '页面管理',
      alias: 'PAGE_SYS_CAT',
      des: '页面管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '链接管理',
      alias: 'LINK_SYS_CAT',
      des: '链接管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '评论管理',
      alias: 'COMMENT_SYS_CAT',
      des: '评论管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '标签管理',
      alias: 'TAG_SYS_CAT',
      des: '标签管理分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '网站配置',
      alias: 'SITE_CONFIG_SYS_CAT',
      des: '网站配置分类',
      parent_id: 0,
      sort: 0,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    // Regular categories
    {
      title: '技术',
      alias: 'tech',
      des: '技术相关文章',
      parent_id: 0,
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '编程',
      alias: 'programming',
      des: '编程技术文章',
      parent_id: 9, // 技术分类现在是第9个
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '前端开发',
      alias: 'frontend',
      des: '前端开发技术',
      parent_id: 9, // 技术分类现在是第9个
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '后端开发',
      alias: 'backend',
      des: '后端开发技术',
      parent_id: 9, // 技术分类现在是第9个
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '移动开发',
      alias: 'mobile',
      des: '移动应用开发',
      parent_id: 9, // 技术分类现在是第9个
      sort: 4,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '设计',
      alias: 'design',
      des: '设计相关文章',
      parent_id: 0,
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'UI设计',
      alias: 'ui-design',
      des: '用户界面设计',
      parent_id: 14, // 设计分类现在是第14个
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'UX设计',
      alias: 'ux-design',
      des: '用户体验设计',
      parent_id: 14, // 设计分类现在是第14个
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '生活',
      alias: 'life',
      des: '生活随笔',
      parent_id: 0,
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '随笔',
      alias: 'essay',
      des: '个人随笔',
      parent_id: 17, // 生活分类现在是第17个
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '分享',
      alias: 'share',
      des: '经验分享',
      parent_id: 17, // 生活分类现在是第17个
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  try {
    await db.insertInto('categories').values(categories).execute()
  } catch (error) {
    console.log('Some categories may already exist, skipping...')
  }

  // Insert basic tags
  const tags = [
    {
      title: 'JavaScript',
      value: 'javascript',
      des: 'JavaScript相关技术',
      type_id: 1,
      status: 10,
      sort: 1,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'TypeScript',
      value: 'typescript',
      des: 'TypeScript编程语言',
      type_id: 1,
      status: 10,
      sort: 2,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'Angular',
      value: 'angular',
      des: 'Angular框架',
      type_id: 1,
      status: 10,
      sort: 3,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'React',
      value: 'react',
      des: 'React框架',
      type_id: 1,
      status: 10,
      sort: 4,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'Vue',
      value: 'vue',
      des: 'Vue框架',
      type_id: 1,
      status: 10,
      sort: 5,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'Node.js',
      value: 'nodejs',
      des: 'Node.js运行时',
      type_id: 1,
      status: 10,
      sort: 6,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'MySQL',
      value: 'mysql',
      des: 'MySQL数据库',
      type_id: 1,
      status: 10,
      sort: 7,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'CSS',
      value: 'css',
      des: 'CSS样式技术',
      type_id: 1,
      status: 10,
      sort: 8,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'HTML',
      value: 'html',
      des: 'HTML标记语言',
      type_id: 1,
      status: 10,
      sort: 9,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'API',
      value: 'api',
      des: 'API开发技术',
      type_id: 1,
      status: 10,
      sort: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '前端',
      value: 'frontend',
      des: '前端开发',
      type_id: 1,
      status: 10,
      sort: 11,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '后端',
      value: 'backend',
      des: '后端开发',
      type_id: 1,
      status: 10,
      sort: 12,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '设计',
      value: 'design',
      des: '设计相关',
      type_id: 1,
      status: 10,
      sort: 13,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '生活',
      value: 'life',
      des: '生活随笔',
      type_id: 1,
      status: 10,
      sort: 14,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  try {
    await db.insertInto('tags').values(tags).execute()
  } catch (error) {
    console.log('Some tags may already exist, skipping...')
  }

  // Insert basic configurations
  const configs = [
    {
      title: '网站名称',
      alias: 'SITE_NAME',
      value: 'Crispy CMS',
      type_id: 1,
      type_ids: '1',
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '网站描述',
      alias: 'SITE_DESCRIPTION',
      value: '一个现代化的内容管理系统，基于Angular和Node.js构建',
      type_id: 1,
      type_ids: '1',
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '网站关键词',
      alias: 'SITE_KEYWORDS',
      value: 'CMS,Angular,Node.js,TypeScript,MySQL,内容管理系统',
      type_id: 1,
      type_ids: '1',
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '网站Logo',
      alias: 'SITE_LOGO',
      value: '/assets/images/logo.png',
      type_id: 1,
      type_ids: '1',
      sort: 4,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '网站图标',
      alias: 'SITE_FAVICON',
      value: '/favicon.ico',
      type_id: 1,
      type_ids: '1',
      sort: 5,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '每页文章数',
      alias: 'POSTS_PER_PAGE',
      value: '10',
      type_id: 2,
      type_ids: '2',
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '启用评论',
      alias: 'ENABLE_COMMENTS',
      value: 'true',
      type_id: 2,
      type_ids: '2',
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '启用注册',
      alias: 'ENABLE_REGISTRATION',
      value: 'false',
      type_id: 2,
      type_ids: '2',
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'SMTP服务器',
      alias: 'SMTP_HOST',
      value: 'smtp.example.com',
      type_id: 3,
      type_ids: '3',
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'SMTP端口',
      alias: 'SMTP_PORT',
      value: '587',
      type_id: 3,
      type_ids: '3',
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '备案信息',
      alias: 'ICP_BEIAN',
      value: '京ICP备12345678号',
      type_id: 1,
      type_ids: '1',
      sort: 6,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '版权信息',
      alias: 'COPYRIGHT',
      value: '© 2024 Crispy CMS. All rights reserved.',
      type_id: 1,
      type_ids: '1',
      sort: 7,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  try {
    await db.insertInto('configs').values(configs).execute()
  } catch (error) {
    console.log('Some configs may already exist, skipping...')
  }

  // Insert basic menus (with frontend navigation category)
  const menus = [
    // Frontend navigation menu category
    {
      title: '前端导航菜单',
      alias: 'frontend-nav',
      url: '',
      icon: 'pi pi-bars',
      image_url: '',
      method: '_self',
      parent_id: 0,
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    // Frontend navigation menu items (children of frontend-nav)
    {
      title: '首页',
      alias: 'home',
      url: '/',
      icon: 'pi pi-home',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '关于',
      alias: 'about',
      url: '/about',
      icon: 'pi pi-info-circle',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '归档',
      alias: 'archives',
      url: '/archives',
      icon: 'pi pi-calendar',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '分类',
      alias: 'categories',
      url: '/categories',
      icon: 'pi pi-folder',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 4,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '标签',
      alias: 'tags',
      url: '/tags',
      icon: 'pi pi-tags',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 5,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '作者',
      alias: 'author',
      url: '/author',
      icon: 'pi pi-user',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 6,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '链接',
      alias: 'links',
      url: '/links',
      icon: 'pi pi-link',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 7,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: '免责声明',
      alias: 'disclaimer',
      url: '/disclaimer',
      icon: 'pi pi-exclamation-triangle',
      image_url: '',
      method: '_self',
      parent_id: 1, // 前端导航菜单的子菜单
      sort: 8,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  try {
    await db.insertInto('menus').values(menus).execute()
  } catch (error) {
    console.log('Some menus may already exist, skipping...')
  }

  // Insert sample links
  const links = [
    {
      site_name: 'GitHub',
      url: 'https://github.com',
      logo: '/assets/images/github.png',
      des: 'GitHub - 全球最大的代码托管平台',
      type_id: 1,
      method: '_blank',
      sort: 1,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      site_name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      logo: '/assets/images/stackoverflow.png',
      des: 'Stack Overflow - 程序员问答社区',
      type_id: 1,
      method: '_blank',
      sort: 2,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      site_name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      logo: '/assets/images/mdn.png',
      des: 'MDN Web Docs - Web开发文档',
      type_id: 1,
      method: '_blank',
      sort: 3,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      site_name: 'Angular官网',
      url: 'https://angular.io',
      logo: '/assets/images/angular.png',
      des: 'Angular - 现代Web应用框架',
      type_id: 1,
      method: '_blank',
      sort: 4,
      status: 10,
      is_delete: 0,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  await safeInsert(db, 'links', links, 'links')

  // Insert sample articles
  const articles = [
    {
      title: '欢迎使用Crispy CMS',
      url: '/article/welcome-to-crispy-cms',
      sub_title: '开始使用您的新内容管理系统',
      abstract:
        '欢迎使用Crispy CMS，这是一个基于Angular和Node.js构建的现代化内容管理系统。本文将指导您完成基本设置和使用。',
      content:
        '<h1>欢迎使用Crispy CMS</h1><p>Crispy CMS是一个现代化、快速、灵活的内容管理系统，专为开发者和内容创作者设计。</p><h2>主要特性</h2><ul><li>现代化的Angular前端</li><li>Node.js后端</li><li>MySQL数据库</li><li>TypeScript支持</li><li>响应式设计</li><li>完整的权限管理</li><li>丰富的插件系统</li></ul><h2>快速开始</h2><p>安装完成后，您可以通过以下步骤开始使用：</p><ol><li>访问后台管理界面</li><li>创建您的第一篇文章</li><li>设置网站基本信息</li><li>自定义主题和样式</li></ol>',
      image: '/assets/images/welcome.jpg',
      image_list: '/assets/images/welcome.jpg,/assets/images/features.jpg',
      tags: 'cms,angular,nodejs,typescript',
      type_id: 1,
      type_ids: '1,2',
      author_id: 1,
      user_id: 1,
      status: 10,
      is_review: -10,
      is_delete: 0,
      click: 0,
      sort: 1,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'Angular开发入门指南',
      url: '/article/angular-development-guide',
      sub_title: '从零开始学习Angular开发',
      abstract: '学习Angular开发的基础知识，从设置第一个项目到构建组件和服务。',
      content:
        '<h1>Angular开发入门指南</h1><p>Angular是一个强大的Web应用开发框架。本指南将帮助您快速入门。</p><h2>前置条件</h2><p>在开始之前，请确保您的系统已安装Node.js。</p><h2>安装Angular CLI</h2><p>首先安装Angular命令行工具：</p><pre><code>npm install -g @angular/cli</code></pre><h2>创建新项目</h2><p>使用以下命令创建新的Angular项目：</p><pre><code>ng new my-app</code></pre><h2>运行项目</h2><p>进入项目目录并启动开发服务器：</p><pre><code>cd my-app\nng serve</code></pre>',
      image: '/assets/images/angular.jpg',
      image_list: '/assets/images/angular.jpg',
      tags: 'angular,typescript,前端开发',
      type_id: 2,
      type_ids: '1,3',
      author_id: 1,
      user_id: 1,
      status: 10,
      is_review: -10,
      is_delete: 0,
      click: 0,
      sort: 2,
      create_time: Date.now(),
      update_time: Date.now()
    },
    {
      title: 'TypeScript基础语法',
      url: '/article/typescript-basic-syntax',
      sub_title: '掌握TypeScript的核心概念',
      abstract:
        'TypeScript是JavaScript的超集，为JavaScript添加了类型系统。本文将介绍TypeScript的基础语法和核心概念。',
      content:
        '<h1>TypeScript基础语法</h1><p>TypeScript是Microsoft开发的开源编程语言，它是JavaScript的超集。</p><h2>基本类型</h2><p>TypeScript提供了多种基本类型：</p><ul><li>string - 字符串类型</li><li>number - 数字类型</li><li>boolean - 布尔类型</li><li>array - 数组类型</li><li>object - 对象类型</li></ul><h2>接口定义</h2><p>使用接口定义对象的结构：</p><pre><code>interface User {\n  name: string;\n  age: number;\n  email?: string;\n}</code></pre>',
      image: '/assets/images/typescript.jpg',
      image_list: '/assets/images/typescript.jpg',
      tags: 'typescript,javascript,编程',
      type_id: 2,
      type_ids: '1,2',
      author_id: 1,
      user_id: 1,
      status: 10,
      is_review: -10,
      is_delete: 0,
      click: 0,
      sort: 3,
      create_time: Date.now(),
      update_time: Date.now()
    }
  ]

  await safeInsert(db, 'articles', articles, 'articles')

  // Insert sample pages
  const pages = [
    {
      title: '关于我们',
      url: '/page/about-us',
      alias: 'about',
      sub_title: '了解我们的团队和使命',
      content:
        '<h1>关于我们</h1><p>我们是一个专注于Web技术开发的团队，致力于为用户提供最好的技术解决方案。</p><h2>我们的使命</h2><p>通过创新的技术和优质的服务，帮助客户实现数字化转型。</p><h2>我们的团队</h2><p>我们拥有经验丰富的开发团队，包括前端开发、后端开发、UI/UX设计等专业人才。</p>',
      abstract: '了解我们的团队背景、技术实力和服务理念',
      author_id: 1,
      user_id: 1,
      status: 10,
      image_list: '/assets/images/about.jpg',
      click: 0,
      tags: '关于,团队,技术',
      seo_title: '关于我们 - Crispy CMS',
      seo_keywords: '关于我们,团队介绍,技术团队',
      seo_description: '了解我们的团队背景、技术实力和服务理念',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '免责声明',
      url: '/page/disclaimer',
      alias: 'disclaimer',
      sub_title: '网站使用条款和免责声明',
      content:
        '<h1>免责声明</h1><p>本网站提供的信息仅供参考，我们不保证信息的准确性和完整性。</p><h2>版权声明</h2><p>本网站的所有内容均受版权法保护，未经许可不得转载或使用。</p><h2>隐私政策</h2><p>我们重视用户隐私，承诺保护用户的个人信息安全。</p>',
      abstract: '网站使用条款、版权声明和隐私政策',
      author_id: 1,
      user_id: 1,
      status: 10,
      image_list: '',
      click: 0,
      tags: '免责声明,版权,隐私',
      seo_title: '免责声明 - Crispy CMS',
      seo_keywords: '免责声明,版权声明,隐私政策',
      seo_description: '网站使用条款、版权声明和隐私政策',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'pages', pages, 'pages')

  // Insert sample ads
  const ads = [
    {
      type_id: 1,
      alias: 'home-banner',
      title: '首页横幅广告',
      start_time: Date.now(),
      end_time: Date.now() + 365 * 24 * 3600 * 1000,
      content: '首页顶部横幅广告位',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      type_id: 2,
      alias: 'sidebar-ad',
      title: '侧边栏广告',
      start_time: Date.now(),
      end_time: Date.now() + 365 * 24 * 3600 * 1000,
      content: '侧边栏广告位',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'ads', ads, 'ads')

  // Insert sample ad items
  const adItems = [
    {
      image_url: '/assets/images/banner1.jpg',
      ad_id: 1,
      url: 'https://example.com',
      status: 10,
      title: '示例广告1',
      content: '这是一个示例广告',
      method: '_blank',
      sort: 1,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      image_url: '/assets/images/banner2.jpg',
      ad_id: 1,
      url: 'https://example.com',
      status: 10,
      title: '示例广告2',
      content: '这是另一个示例广告',
      method: '_blank',
      sort: 2,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'ad_items', adItems, 'ad items')

  // Insert sample jobs
  const jobs = [
    {
      title: '前端开发工程师',
      branch: '技术部',
      typeName: '技术开发',
      nature: '全职',
      address: '北京',
      content:
        '<h2>岗位职责</h2><ul><li>负责公司产品的前端开发工作</li><li>与后端开发人员协作完成产品功能</li><li>优化前端性能，提升用户体验</li></ul><h2>任职要求</h2><ul><li>熟悉HTML、CSS、JavaScript</li><li>熟悉Vue、React或Angular等前端框架</li><li>有良好的代码风格和团队协作能力</li></ul>',
      num: 2,
      email: 'hr@example.com',
      sort: 1,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '后端开发工程师',
      branch: '技术部',
      typeName: '技术开发',
      nature: '全职',
      address: '北京',
      content:
        '<h2>岗位职责</h2><ul><li>负责公司产品的后端开发工作</li><li>设计并实现数据库结构</li><li>编写API接口文档</li></ul><h2>任职要求</h2><ul><li>熟悉Node.js、Java或Python</li><li>熟悉MySQL、MongoDB等数据库</li><li>有良好的问题解决能力</li></ul>',
      num: 1,
      email: 'hr@example.com',
      sort: 2,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'jobs', jobs, 'jobs')

  // Insert sample holidays
  const holidays = [
    {
      title: '元旦',
      value: '1月1日',
      sort: 1,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '春节',
      value: '农历正月初一',
      sort: 2,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '清明节',
      value: '4月5日',
      sort: 3,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '劳动节',
      value: '5月1日',
      sort: 4,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '端午节',
      value: '农历五月初五',
      sort: 5,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '中秋节',
      value: '农历八月十五',
      sort: 6,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '国庆节',
      value: '10月1日',
      sort: 7,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'holidays', holidays, 'holidays')

  // Insert sample attrs
  const attrs = [
    {
      alias: 'hot',
      title: '热门',
      status: 10,
      sort: 1,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'recommend',
      title: '推荐',
      status: 10,
      sort: 2,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'top',
      title: '置顶',
      status: 10,
      sort: 3,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'featured',
      title: '精选',
      status: 10,
      sort: 4,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'attrs', attrs, 'attrs')

  // Insert sample enums
  const enums = [
    {
      title: '启用',
      alias: 'enabled',
      value: '10',
      sort: 1,
      code: 'STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '禁用',
      alias: 'disabled',
      value: '-10',
      sort: 2,
      code: 'STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '已发布',
      alias: 'published',
      value: '10',
      sort: 1,
      code: 'ARTICLE_STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '待发布',
      alias: 'pending',
      value: '-10',
      sort: 2,
      code: 'ARTICLE_STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '草稿',
      alias: 'draft',
      value: '-20',
      sort: 3,
      code: 'ARTICLE_STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '已删除',
      alias: 'deleted',
      value: '-100',
      sort: 4,
      code: 'ARTICLE_STATUS',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'enums', enums, 'enums')

  // Insert sample access tokens
  const accessTokens = [
    {
      user_id: 1,
      app_name: 'WebApp',
      channel: 'web',
      token: 'web_token_123456789',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      app_name: 'MobileApp',
      channel: 'mobile',
      token: 'mobile_token_987654321',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      app_name: 'API',
      channel: 'api',
      token: 'api_token_abcdef123',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'access_token', accessTokens, 'access tokens')

  // Insert sample additions (extended fields for articles)
  const additions = [
    {
      primary_id: 1,
      fields_json:
        '{"reading_time": "5分钟", "difficulty": "初级", "author_bio": "资深前端开发工程师", "related_articles": [2, 3]}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      primary_id: 2,
      fields_json:
        '{"reading_time": "8分钟", "difficulty": "中级", "prerequisites": ["JavaScript基础", "HTML基础"], "code_examples": true}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      primary_id: 3,
      fields_json:
        '{"reading_time": "6分钟", "difficulty": "初级", "typescript_version": "5.0+", "playground_url": "https://typescript-playground.com"}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'additions', additions, 'additions')

  // Insert sample API logs
  const apiLogs = [
    {
      user_id: 1,
      method: 'GET',
      query: '{"page": "1", "pageSize": "20", "status": "10"}',
      body: '',
      ip: '127.0.0.1',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      method: 'POST',
      query: '',
      body: '{"title": "测试文章", "content": "测试内容"}',
      ip: '127.0.0.1',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      method: 'PUT',
      query: '',
      body: '{"id": 1, "title": "更新后的标题"}',
      ip: '127.0.0.1',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      method: 'DELETE',
      query: '',
      body: '',
      ip: '127.0.0.1',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'api_logs', apiLogs, 'API logs')

  // Insert sample caches
  const caches = [
    {
      hash: 'homepage_cache_123',
      cache_data: '{"articles": [1, 2, 3], "categories": [1, 2], "last_updated": "2024-01-01"}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      hash: 'categories_cache_456',
      cache_data: '{"categories": [{"id": 1, "title": "技术"}, {"id": 2, "title": "设计"}]}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      hash: 'tags_cache_789',
      cache_data: '{"tags": [{"id": 1, "title": "JavaScript"}, {"id": 2, "title": "TypeScript"}]}',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'caches', caches, 'caches')

  // Insert sample comments
  const comments = [
    {
      title: '很好的文章',
      content: '这篇文章写得非常详细，对我帮助很大！',
      parent_id: 0,
      user_id: 1,
      good_article: 1,
      bad_article: 0,
      not_article: 0,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '感谢分享',
      content: '感谢作者的分享，学到了很多新知识。',
      parent_id: 0,
      user_id: 1,
      good_article: 1,
      bad_article: 0,
      not_article: 0,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '回复：很好的文章',
      content: '谢谢你的支持，我会继续努力写更好的文章。',
      parent_id: 1,
      user_id: 1,
      good_article: 0,
      bad_article: 0,
      not_article: 0,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '有疑问',
      content: '文章中提到的方法在实际项目中是否适用？',
      parent_id: 0,
      user_id: 1,
      good_article: 0,
      bad_article: 0,
      not_article: 1,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'comments', comments, 'comments')

  // Insert sample keywords
  const keywords = [
    {
      alias: 'angular-development',
      value: 'Angular开发',
      count: 0,
      type_id: 0,
      url: '',
      title: 'Angular开发',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'typescript-tutorial',
      value: 'TypeScript教程',
      count: 0,
      type_id: 0,
      url: '',
      title: 'TypeScript教程',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'frontend-tech',
      value: '前端技术',
      count: 0,
      type_id: 0,
      url: '',
      title: '前端技术',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'web-development',
      value: 'Web开发',
      count: 0,
      type_id: 0,
      url: '',
      title: 'Web开发',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      alias: 'javascript',
      value: 'JavaScript',
      count: 0,
      type_id: 0,
      url: '',
      title: 'JavaScript',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'keywords', keywords, 'keywords')

  // Insert sample notices
  const notices = [
    {
      from_user_id: 1,
      title: '系统维护通知',
      content: '系统将于2024年1月15日凌晨2:00-4:00进行维护，期间可能无法正常访问，请提前做好准备。',
      publish_time: Date.now(),
      tolds: '',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      from_user_id: 1,
      title: '新功能上线',
      content: '我们新增了评论功能，现在用户可以对文章进行评论和互动了！',
      publish_time: Date.now(),
      tolds: '',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      from_user_id: 1,
      title: '安全更新',
      content: '为了保障用户数据安全，我们进行了安全更新，建议用户及时修改密码。',
      publish_time: Date.now(),
      tolds: '',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      from_user_id: 1,
      title: '招聘信息',
      content: '我们正在招聘前端开发工程师，欢迎有经验的朋友加入我们的团队！',
      publish_time: Date.now(),
      tolds: '',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'notices', notices, 'notices')

  // Insert sample operate logs
  const operateLogs = [
    {
      user_id: 1,
      code: 'CREATE',
      type_id: 1,
      content: '创建文章：欢迎使用Crispy CMS',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      code: 'UPDATE',
      type_id: 1,
      content: '更新文章：Angular开发入门指南',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      code: 'DELETE',
      type_id: 1,
      content: '删除用户：test_user',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      code: 'LOGIN',
      type_id: 1,
      content: '用户登录：admin',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      code: 'LOGOUT',
      type_id: 1,
      content: '用户登出：admin',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      user_id: 1,
      code: 'UPLOAD',
      type_id: 1,
      content: '上传文件：logo.png',
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'operate_logs', operateLogs, 'operate logs')

  // Insert sample todos
  const todos = [
    {
      publish_id: 1,
      user_ids: '1',
      title: '完成项目文档',
      content: '需要完成项目的技术文档和用户手册',
      start_time: Date.now(),
      end_time: Date.now() + 7 * 24 * 3600 * 1000,
      complete: 0,
      type_id: 1,
      remark: '优先级：高',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      publish_id: 1,
      user_ids: '1',
      title: '代码审查',
      content: '对新功能的代码进行审查和测试',
      start_time: Date.now(),
      end_time: Date.now() + 3 * 24 * 3600 * 1000,
      complete: 0,
      type_id: 1,
      remark: '需要仔细检查',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      publish_id: 1,
      user_ids: '1',
      title: '数据库优化',
      content: '优化数据库查询性能，添加必要的索引',
      start_time: Date.now(),
      end_time: Date.now() + 5 * 24 * 3600 * 1000,
      complete: 1,
      type_id: 1,
      remark: '已完成',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      publish_id: 1,
      user_ids: '1',
      title: '用户界面改进',
      content: '根据用户反馈改进界面设计和用户体验',
      start_time: Date.now(),
      end_time: Date.now() + 10 * 24 * 3600 * 1000,
      complete: 0,
      type_id: 2,
      remark: '设计相关',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'todos', todos, 'todos')

  // Insert sample votes
  const votes = [
    {
      title: '最喜欢的前端框架',
      start_time: Date.now(),
      end_time: Date.now() + 30 * 24 * 3600 * 1000,
      count: 0,
      vote_items: 'Angular,React,Vue,Svelte',
      is_multiple: -10,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '最常用的编程语言',
      start_time: Date.now(),
      end_time: Date.now() + 30 * 24 * 3600 * 1000,
      count: 0,
      vote_items: 'JavaScript,TypeScript,Python,Java,Go',
      is_multiple: 10,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      title: '最期待的新功能',
      start_time: Date.now(),
      end_time: Date.now() + 30 * 24 * 3600 * 1000,
      count: 0,
      vote_items: '实时聊天,文件管理,主题切换,移动端适配',
      is_multiple: 10,
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'votes', votes, 'votes')

  // Insert sample vote items
  const voteItems = [
    {
      vote_id: 1,
      title: 'Angular',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 1,
      title: 'React',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 1,
      title: 'Vue',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 1,
      title: 'Svelte',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 2,
      title: 'JavaScript',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 2,
      title: 'TypeScript',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 2,
      title: 'Python',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 2,
      title: 'Java',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 2,
      title: 'Go',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 3,
      title: '实时聊天',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 3,
      title: '文件管理',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 3,
      title: '主题切换',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    },
    {
      vote_id: 3,
      title: '移动端适配',
      status: 10,
      create_time: Date.now(),
      update_time: Date.now(),
      is_delete: 0
    }
  ]

  await safeInsert(db, 'vote_items', voteItems, 'vote items')
}

export async function down(db: Kysely<any>): Promise<void> {
  // Clear all data from tables (in reverse order to handle foreign key constraints)
  const tables = [
    'vote_items',
    'votes',
    'todos',
    'operate_logs',
    'notices',
    'keywords',
    'comments',
    'caches',
    'api_logs',
    'additions',
    'access_token',
    'enums',
    'attrs',
    'holidays',
    'jobs',
    'ad_items',
    'ads',
    'pages',
    'articles',
    'links',
    'menus',
    'configs',
    'tags',
    'categories',
    'rules',
    'roles',
    'user_types',
    'users'
  ]

  for (const table of tables) {
    await db.deleteFrom(table).execute()
  }
}
