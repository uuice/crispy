#!/usr/bin/env node

/**
 * Script to add Swagger documentation to remaining routes
 */

const fs = require('fs');
const path = require('path');

// Route configurations for generating Swagger docs
const routeConfigs = [
  {
    section: 'Notice routes',
    tag: 'Notices',
    basePath: '/admin/notices',
    entityName: '通知',
    routes: [
      { method: 'get', path: '', action: 'getNotices', summary: '获取通知列表' },
      { method: 'get', path: '/{id}', action: 'getNotice', summary: '获取通知详情' },
      { method: 'post', path: '', action: 'createNotice', summary: '创建通知' },
      { method: 'put', path: '/{id}', action: 'updateNotice', summary: '更新通知' },
      { method: 'delete', path: '/{id}', action: 'deleteNotice', summary: '删除通知' }
    ]
  },
  {
    section: 'Operate log routes',
    tag: 'OperateLogs',
    basePath: '/admin/operate-logs',
    entityName: '操作日志',
    routes: [
      { method: 'get', path: '', action: 'getOperateLogs', summary: '获取操作日志列表' },
      { method: 'get', path: '/{id}', action: 'getOperateLog', summary: '获取操作日志详情' },
      { method: 'post', path: '', action: 'createOperateLog', summary: '创建操作日志' },
      { method: 'put', path: '/{id}', action: 'updateOperateLog', summary: '更新操作日志' },
      { method: 'delete', path: '/{id}', action: 'deleteOperateLog', summary: '删除操作日志' }
    ]
  },
  {
    section: 'Role routes',
    tag: 'Roles',
    basePath: '/admin/roles',
    entityName: '角色',
    routes: [
      { method: 'get', path: '', action: 'getRoles', summary: '获取角色列表' },
      { method: 'get', path: '/{id}', action: 'getRole', summary: '获取角色详情' },
      { method: 'post', path: '', action: 'createRole', summary: '创建角色' },
      { method: 'put', path: '/{id}', action: 'updateRole', summary: '更新角色' },
      { method: 'delete', path: '/{id}', action: 'deleteRole', summary: '删除角色' }
    ]
  },
  {
    section: 'Rule routes',
    tag: 'Rules',
    basePath: '/admin/rules',
    entityName: '规则',
    routes: [
      { method: 'get', path: '', action: 'getRules', summary: '获取规则列表' },
      { method: 'get', path: '/tree', action: 'getRuleTree', summary: '获取规则树形结构' },
      { method: 'get', path: '/{id}', action: 'getRule', summary: '获取规则详情' },
      { method: 'post', path: '', action: 'createRule', summary: '创建规则' },
      { method: 'put', path: '/{id}', action: 'updateRule', summary: '更新规则' },
      { method: 'delete', path: '/{id}', action: 'deleteRule', summary: '删除规则' }
    ]
  },
  {
    section: 'Tag routes',
    tag: 'Tags',
    basePath: '/admin/tags',
    entityName: '标签',
    routes: [
      { method: 'get', path: '', action: 'getTags', summary: '获取标签列表' },
      { method: 'get', path: '/{id}', action: 'getTag', summary: '获取标签详情' },
      { method: 'post', path: '', action: 'createTag', summary: '创建标签' },
      { method: 'put', path: '/{id}', action: 'updateTag', summary: '更新标签' },
      { method: 'delete', path: '/{id}', action: 'deleteTag', summary: '删除标签' }
    ]
  },
  {
    section: 'Page routes',
    tag: 'Pages',
    basePath: '/admin/pages',
    entityName: '页面',
    routes: [
      { method: 'get', path: '', action: 'getPages', summary: '获取页面列表' },
      { method: 'get', path: '/{id}', action: 'getPage', summary: '获取页面详情' },
      { method: 'post', path: '', action: 'createPage', summary: '创建页面' },
      { method: 'put', path: '/{id}', action: 'updatePage', summary: '更新页面' },
      { method: 'delete', path: '/{id}', action: 'deletePage', summary: '删除页面' }
    ]
  },
  {
    section: 'User type routes',
    tag: 'UserTypes',
    basePath: '/admin/user-types',
    entityName: '用户类型',
    routes: [
      { method: 'get', path: '', action: 'getUserTypes', summary: '获取用户类型列表' },
      { method: 'get', path: '/{id}', action: 'getUserType', summary: '获取用户类型详情' },
      { method: 'post', path: '', action: 'createUserType', summary: '创建用户类型' },
      { method: 'put', path: '/{id}', action: 'updateUserType', summary: '更新用户类型' },
      { method: 'delete', path: '/{id}', action: 'deleteUserType', summary: '删除用户类型' }
    ]
  },
  {
    section: 'Vote routes',
    tag: 'Votes',
    basePath: '/admin/votes',
    entityName: '投票',
    routes: [
      { method: 'get', path: '', action: 'getVotes', summary: '获取投票列表' },
      { method: 'get', path: '/{id}', action: 'getVote', summary: '获取投票详情' },
      { method: 'post', path: '', action: 'createVote', summary: '创建投票' },
      { method: 'put', path: '/{id}', action: 'updateVote', summary: '更新投票' },
      { method: 'delete', path: '/{id}', action: 'deleteVote', summary: '删除投票' }
    ]
  },
  {
    section: 'Vote item routes',
    tag: 'VoteItems',
    basePath: '/admin/vote-items',
    entityName: '投票项目',
    routes: [
      { method: 'get', path: '', action: 'getVoteItems', summary: '获取投票项目列表' },
      { method: 'get', path: '/{id}', action: 'getVoteItem', summary: '获取投票项目详情' },
      { method: 'post', path: '', action: 'createVoteItem', summary: '创建投票项目' },
      { method: 'put', path: '/{id}', action: 'updateVoteItem', summary: '更新投票项目' },
      { method: 'delete', path: '/{id}', action: 'deleteVoteItem', summary: '删除投票项目' }
    ]
  },
  {
    section: 'Comment routes',
    tag: 'Comments',
    basePath: '/admin/comments',
    entityName: '评论',
    routes: [
      { method: 'get', path: '', action: 'getComments', summary: '获取评论列表' },
      { method: 'get', path: '/{id}', action: 'getComment', summary: '获取评论详情' },
      { method: 'post', path: '', action: 'createComment', summary: '创建评论' },
      { method: 'put', path: '/{id}', action: 'updateComment', summary: '更新评论' },
      { method: 'delete', path: '/{id}', action: 'deleteComment', summary: '删除评论' },
      { method: 'post', path: '/batch-update-status', action: 'batchUpdateStatus', summary: '批量更新评论状态' },
      { method: 'post', path: '/batch-delete', action: 'batchDeleteComments', summary: '批量删除评论' },
      { method: 'get', path: '/stats', action: 'getCommentStats', summary: '获取评论统计' }
    ]
  },
  {
    section: 'Access token routes',
    tag: 'AccessTokens',
    basePath: '/admin/access-token',
    entityName: 'Access Token',
    routes: [
      { method: 'get', path: '', action: 'getAccessTokens', summary: '获取Access Token列表' },
      { method: 'post', path: '', action: 'createAccessToken', summary: '创建Access Token' },
      { method: 'get', path: '/{id}', action: 'getAccessTokenById', summary: '获取Access Token详情' },
      { method: 'put', path: '/{id}', action: 'updateAccessToken', summary: '更新Access Token' },
      { method: 'delete', path: '/{id}', action: 'deleteAccessToken', summary: '删除Access Token' }
    ]
  },
  {
    section: 'Upload routes',
    tag: 'Upload',
    basePath: '/admin/upload',
    entityName: '上传',
    routes: [
      { method: 'post', path: '/image', action: 'uploadImage', summary: '上传图片' }
    ]
  },
  {
    section: 'System routes',
    tag: 'System',
    basePath: '/admin/system',
    entityName: '系统',
    routes: [
      { method: 'get', path: '/getSystemInfo', action: 'getSystemInfo', summary: '获取系统信息' }
    ]
  },
  {
    section: 'Dashboard routes',
    tag: 'Dashboard',
    basePath: '/admin/dashboard',
    entityName: '仪表板',
    routes: [
      { method: 'get', path: '/overview', action: 'getDashboardOverview', summary: '获取仪表板概览' }
    ]
  }
];

function generateSwaggerDoc(config) {
  let docs = `// ${config.section}\n`;
  
  config.routes.forEach(route => {
    const fullPath = config.basePath + route.path;
    const methodUpper = route.method.toUpperCase();
    
    docs += `/**
 * @swagger
 * ${fullPath}:
 *   ${route.method}:
 *     tags: [${config.tag}]
 *     summary: ${route.summary}
 *     description: ${route.summary}
 *     security:
 *       - bearerAuth: []`;

    // Add parameters for routes with path parameters
    if (route.path.includes('{id}')) {
      docs += `
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ${config.entityName}ID`;
    }

    // Add query parameters for GET list routes
    if (route.method === 'get' && route.path === '') {
      docs += `
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量`;
      
      if (!config.entityName.includes('日志')) {
        docs += `
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词`;
      }
    }

    // Add request body for POST and PUT routes
    if (route.method === 'post' || route.method === 'put') {
      docs += `
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 标题
 *               content:
 *                 type: string
 *                 description: 内容
 *               status:
 *                 type: integer
 *                 description: 状态`;
    }

    docs += `
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'`;

    if (route.method === 'get' && route.path.includes('{id}')) {
      docs += `
 *       404:
 *         description: ${config.entityName}不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'`;
    }

    docs += `
 */
router.${route.method}('${route.path.replace('{id}', ':id')}', ${config.section.split(' ')[0].toLowerCase()}Controller.${route.action})

`;
  });

  return docs;
}

// Generate all documentation
let allDocs = '';
routeConfigs.forEach(config => {
  allDocs += generateSwaggerDoc(config);
});

console.log('Generated Swagger documentation:');
console.log(allDocs);
