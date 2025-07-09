#!/usr/bin/env node

/**
 * 为 content 路由生成 Swagger 文档
 */

const fs = require('fs');
const path = require('path');

// Content 路由配置
const contentRouteConfigs = [
  {
    section: 'User routes',
    tag: 'ContentUsers',
    basePath: '/content/users',
    entityName: '用户',
    routes: [
      { method: 'get', path: '', action: 'getUsers', summary: '获取用户列表' },
      { method: 'get', path: '/{id}', action: 'getUser', summary: '获取用户详情' }
    ]
  },
  {
    section: 'Ad routes',
    tag: 'ContentAds',
    basePath: '/content/ads',
    entityName: '广告',
    routes: [
      { method: 'get', path: '', action: 'getAds', summary: '获取广告列表' },
      { method: 'get', path: '/{id}', action: 'getAd', summary: '获取广告详情' }
    ]
  },
  {
    section: 'Ad item routes',
    tag: 'ContentAdItems',
    basePath: '/content/ad-items',
    entityName: '广告项目',
    routes: [
      { method: 'get', path: '', action: 'getAdItems', summary: '获取广告项目列表' },
      { method: 'get', path: '/{id}', action: 'getAdItem', summary: '获取广告项目详情' }
    ]
  },
  {
    section: 'Addition routes',
    tag: 'ContentAdditions',
    basePath: '/content/additions',
    entityName: '附加信息',
    routes: [
      { method: 'get', path: '', action: 'getAdditions', summary: '获取附加信息列表' },
      { method: 'get', path: '/{id}', action: 'getAddition', summary: '获取附加信息详情' }
    ]
  },
  {
    section: 'API log routes',
    tag: 'ContentApiLogs',
    basePath: '/content/api-logs',
    entityName: 'API日志',
    routes: [
      { method: 'get', path: '', action: 'getApiLogs', summary: '获取API日志列表' },
      { method: 'get', path: '/{id}', action: 'getApiLog', summary: '获取API日志详情' }
    ]
  },
  {
    section: 'Article routes',
    tag: 'ContentArticles',
    basePath: '/content/articles',
    entityName: '文章',
    routes: [
      { method: 'get', path: '', action: 'getArticles', summary: '获取文章列表' },
      { method: 'get', path: '/{id}', action: 'getArticle', summary: '获取文章详情' }
    ]
  },
  {
    section: 'Category routes',
    tag: 'ContentCategories',
    basePath: '/content/categories',
    entityName: '分类',
    routes: [
      { method: 'get', path: '', action: 'getCategories', summary: '获取分类列表' },
      { method: 'get', path: '/tree', action: 'getCategoryTree', summary: '获取分类树形结构' },
      { method: 'get', path: '/{id}', action: 'getCategory', summary: '获取分类详情' }
    ]
  },
  {
    section: 'Attrs routes',
    tag: 'ContentAttrs',
    basePath: '/content/attrs',
    entityName: '属性',
    routes: [
      { method: 'get', path: '', action: 'getAttrs', summary: '获取属性列表' },
      { method: 'get', path: '/{id}', action: 'getAttr', summary: '获取属性详情' }
    ]
  },
  {
    section: 'Caches routes',
    tag: 'ContentCaches',
    basePath: '/content/caches',
    entityName: '缓存',
    routes: [
      { method: 'get', path: '', action: 'getCaches', summary: '获取缓存列表' },
      { method: 'get', path: '/{id}', action: 'getCache', summary: '获取缓存详情' }
    ]
  },
  {
    section: 'Configs routes',
    tag: 'ContentConfigs',
    basePath: '/content/configs',
    entityName: '配置',
    routes: [
      { method: 'get', path: '', action: 'getConfigs', summary: '获取配置列表' },
      { method: 'get', path: '/alias/{alias}', action: 'getConfigByAlias', summary: '根据别名获取配置' },
      { method: 'get', path: '/{id}', action: 'getConfig', summary: '获取配置详情' }
    ]
  },
  {
    section: 'Enums routes',
    tag: 'ContentEnums',
    basePath: '/content/enums',
    entityName: '枚举',
    routes: [
      { method: 'get', path: '', action: 'getEnums', summary: '获取枚举列表' },
      { method: 'get', path: '/{id}', action: 'getEnum', summary: '获取枚举详情' }
    ]
  },
  {
    section: 'Holidays routes',
    tag: 'ContentHolidays',
    basePath: '/content/holidays',
    entityName: '节假日',
    routes: [
      { method: 'get', path: '', action: 'getHolidays', summary: '获取节假日列表' },
      { method: 'get', path: '/{id}', action: 'getHoliday', summary: '获取节假日详情' }
    ]
  },
  {
    section: 'Job routes',
    tag: 'ContentJobs',
    basePath: '/content/jobs',
    entityName: '任务',
    routes: [
      { method: 'get', path: '', action: 'getJobs', summary: '获取任务列表' },
      { method: 'get', path: '/{id}', action: 'getJob', summary: '获取任务详情' }
    ]
  },
  {
    section: 'Keyword routes',
    tag: 'ContentKeywords',
    basePath: '/content/keywords',
    entityName: '关键词',
    routes: [
      { method: 'get', path: '', action: 'getKeywords', summary: '获取关键词列表' },
      { method: 'get', path: '/{id}', action: 'getKeyword', summary: '获取关键词详情' }
    ]
  },
  {
    section: 'Link routes',
    tag: 'ContentLinks',
    basePath: '/content/links',
    entityName: '链接',
    routes: [
      { method: 'get', path: '', action: 'getLinks', summary: '获取链接列表' },
      { method: 'get', path: '/{id}', action: 'getLink', summary: '获取链接详情' }
    ]
  },
  {
    section: 'Menu routes',
    tag: 'ContentMenus',
    basePath: '/content/menus',
    entityName: '菜单',
    routes: [
      { method: 'get', path: '', action: 'getMenus', summary: '获取菜单列表' },
      { method: 'get', path: '/tree', action: 'getMenuTree', summary: '获取菜单树形结构' },
      { method: 'get', path: '/{id}', action: 'getMenu', summary: '获取菜单详情' }
    ]
  },
  {
    section: 'Notice routes',
    tag: 'ContentNotices',
    basePath: '/content/notices',
    entityName: '通知',
    routes: [
      { method: 'get', path: '', action: 'getNotices', summary: '获取通知列表' },
      { method: 'get', path: '/{id}', action: 'getNotice', summary: '获取通知详情' }
    ]
  },
  {
    section: 'Operate log routes',
    tag: 'ContentOperateLogs',
    basePath: '/content/operate-logs',
    entityName: '操作日志',
    routes: [
      { method: 'get', path: '', action: 'getOperateLogs', summary: '获取操作日志列表' },
      { method: 'get', path: '/{id}', action: 'getOperateLog', summary: '获取操作日志详情' }
    ]
  },
  {
    section: 'Role routes',
    tag: 'ContentRoles',
    basePath: '/content/roles',
    entityName: '角色',
    routes: [
      { method: 'get', path: '', action: 'getRoles', summary: '获取角色列表' },
      { method: 'get', path: '/{id}', action: 'getRole', summary: '获取角色详情' }
    ]
  },
  {
    section: 'Rule routes',
    tag: 'ContentRules',
    basePath: '/content/rules',
    entityName: '规则',
    routes: [
      { method: 'get', path: '', action: 'getRules', summary: '获取规则列表' },
      { method: 'get', path: '/tree', action: 'getRuleTree', summary: '获取规则树形结构' },
      { method: 'get', path: '/{id}', action: 'getRule', summary: '获取规则详情' }
    ]
  },
  {
    section: 'Tag routes',
    tag: 'ContentTags',
    basePath: '/content/tags',
    entityName: '标签',
    routes: [
      { method: 'get', path: '', action: 'getTags', summary: '获取标签列表' },
      { method: 'get', path: '/{id}', action: 'getTag', summary: '获取标签详情' }
    ]
  },
  {
    section: 'Page routes',
    tag: 'ContentPages',
    basePath: '/content/pages',
    entityName: '页面',
    routes: [
      { method: 'get', path: '', action: 'getPages', summary: '获取页面列表' },
      { method: 'get', path: '/{id}', action: 'getPage', summary: '获取页面详情' }
    ]
  },
  {
    section: 'User type routes',
    tag: 'ContentUserTypes',
    basePath: '/content/user-types',
    entityName: '用户类型',
    routes: [
      { method: 'get', path: '', action: 'getUserTypes', summary: '获取用户类型列表' },
      { method: 'get', path: '/{id}', action: 'getUserType', summary: '获取用户类型详情' }
    ]
  },
  {
    section: 'Vote routes',
    tag: 'ContentVotes',
    basePath: '/content/votes',
    entityName: '投票',
    routes: [
      { method: 'get', path: '', action: 'getVotes', summary: '获取投票列表' },
      { method: 'get', path: '/{id}', action: 'getVote', summary: '获取投票详情' }
    ]
  },
  {
    section: 'Vote item routes',
    tag: 'ContentVoteItems',
    basePath: '/content/vote-items',
    entityName: '投票项目',
    routes: [
      { method: 'get', path: '', action: 'getVoteItems', summary: '获取投票项目列表' },
      { method: 'get', path: '/{id}', action: 'getVoteItem', summary: '获取投票项目详情' }
    ]
  },
  {
    section: 'Access token routes',
    tag: 'ContentAccessTokens',
    basePath: '/content/access-token',
    entityName: 'Access Token',
    routes: [
      { method: 'get', path: '', action: 'getAccessTokens', summary: '获取Access Token列表' },
      { method: 'get', path: '/{id}', action: 'getAccessToken', summary: '获取Access Token详情' },
      { method: 'post', path: '/check', action: 'checkAccessToken', summary: '验证Access Token' }
    ]
  }
];

function generateContentSwaggerDoc(config) {
  let docs = `/**\n * ${config.section.toUpperCase()} 模块 Swagger 文档\n * \n * 此文件包含 ${config.section.toLowerCase()} 相关的所有 API 文档\n * 自动生成\n */\n\n`;

  config.routes.forEach(route => {
    const fullPath = config.basePath + route.path;

    docs += `/**\n * @swagger\n * ${fullPath}:\n *   ${route.method}:\n *     tags: [${config.tag}]\n *     summary: ${route.summary}\n *     description: ${route.summary}\n *     security:\n *       - accessTokenAuth: []\n *         appNameAuth: []\n *         channelAuth: []\n`;

    // Add parameters for routes with path parameters
    if (route.path.includes('{id}')) {
      docs += ` *     parameters:\n *       - in: path\n *         name: id\n *         required: true\n *         schema:\n *           type: integer\n *         description: ${config.entityName}ID\n`;
    } else if (route.path.includes('{alias}')) {
      docs += ` *     parameters:\n *       - in: path\n *         name: alias\n *         required: true\n *         schema:\n *           type: string\n *         description: ${config.entityName}别名\n`;
    }

    // Add query parameters for GET list routes
    if (route.method === 'get' && route.path === '') {
      docs += ` *     parameters:\n *       - in: query\n *         name: page\n *         schema:\n *           type: integer\n *           default: 1\n *         description: 页码\n *       - in: query\n *         name: pageSize\n *         schema:\n *           type: integer\n *           default: 10\n *         description: 每页数量\n`;

      if (!config.entityName.includes('日志')) {
        docs += ` *       - in: query\n *         name: search\n *         schema:\n *           type: string\n *         description: 搜索关键词\n`;
      }
    }

    // Add request body for POST routes (like check token)
    if (route.method === 'post' && route.path === '/check') {
      docs += ` *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [app_name, channel, token]\n *             properties:\n *               app_name:\n *                 type: string\n *                 description: 应用名称\n *               channel:\n *                 type: string\n *                 description: 渠道名称\n *               token:\n *                 type: string\n *                 description: Access Token\n`;
    }

    docs += ` *     responses:\n *       200:\n *         description: 操作成功\n *         content:\n *           application/json:\n *             schema:\n *               $ref: '#/components/schemas/ApiResponse'\n`;

    if (route.method === 'get' && (route.path.includes('{id}') || route.path.includes('{alias}'))) {
      docs += ` *       404:\n *         description: ${config.entityName}不存在\n *         content:\n *           application/json:\n *             schema:\n *               $ref: '#/components/schemas/ErrorResponse'\n`;
    }

    if (route.method === 'post' && route.path === '/check') {
      docs += ` *       401:\n *         description: Token验证失败\n *         content:\n *           application/json:\n *             schema:\n *               $ref: '#/components/schemas/ErrorResponse'\n`;
    }

    docs += ` */\n\n`;
  });

  docs += `export default {};\n`;
  return docs;
}

// 生成所有文档
function generateAllContentDocs() {
  const docsDir = path.join(__dirname, '../src/server/docs/swagger/content');

  // 确保目录存在
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const moduleMapping = {};

  contentRouteConfigs.forEach(config => {
    const moduleName = config.tag.toLowerCase().replace('content', '');
    const moduleContent = generateContentSwaggerDoc(config);
    const filePath = path.join(docsDir, `${moduleName}.ts`);

    fs.writeFileSync(filePath, moduleContent, 'utf8');
    console.log(`Generated: ${filePath}`);

    moduleMapping[moduleName] = config.tag;
  });

  return moduleMapping;
}

// 生成索引文件
function generateContentIndexFile(moduleMapping) {
  const docsDir = path.join(__dirname, '../src/server/docs/swagger/content');
  const indexPath = path.join(docsDir, 'index.ts');

  const imports = Object.keys(moduleMapping).map(module => `import './${module}'`).join('\n');

  const indexContent = `/**\n * Content API Swagger 文档模块索引\n * \n * 此文件用于导入所有的 Content API Swagger 文档模块\n * Content API 主要提供只读访问，使用 Access Token 认证\n */\n\n${imports}\n\nexport default {};\n\n/**\n * 模块列表：\n${Object.keys(moduleMapping).map(module => ` * - ${module}.ts: ${moduleMapping[module]}`).join('\n')}\n */\n`;

  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`Generated: ${indexPath}`);
}

// 主函数
function main() {
  console.log('开始生成 Content API Swagger 文档...');

  const moduleMapping = generateAllContentDocs();
  generateContentIndexFile(moduleMapping);

  console.log(`\n✅ 生成完成！`);
  console.log(`📊 总计生成 ${Object.keys(moduleMapping).length} 个模块文件`);
  console.log(`🏷️  标签: ${Object.values(moduleMapping).join(', ')}`);

  console.log('\n下一步：');
  console.log('1. 更新 swagger.ts 配置文件，添加 content 文档路径');
  console.log('2. 为 content API 添加 Access Token 认证配置');
  console.log('3. 重启服务器测试文档是否正常');
}

if (require.main === module) {
  main();
}

module.exports = {
  generateContentSwaggerDoc,
  generateAllContentDocs,
  generateContentIndexFile
};
