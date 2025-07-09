#!/usr/bin/env node

/**
 * 从 routes.ts 文件中提取 Swagger 文档并分离到不同的模块文件
 */

const fs = require('fs');
const path = require('path');

// 读取 routes.ts 文件
const routesFilePath = path.join(__dirname, '../src/server/routes/admin/routes.ts');
const routesContent = fs.readFileSync(routesFilePath, 'utf8');

// 定义模块映射
const moduleMapping = {
  'Authentication': 'users',
  'Users': 'users',
  'Ads': 'ads',
  'AdItems': 'ads',
  'Additions': 'additions',
  'ApiLogs': 'api-logs',
  'Articles': 'articles',
  'Categories': 'categories',
  'Attrs': 'attrs',
  'Caches': 'caches',
  'Configs': 'configs',
  'Enums': 'enums',
  'Holidays': 'holidays',
  'Jobs': 'jobs',
  'Keywords': 'keywords',
  'Links': 'links',
  'Menus': 'menus',
  'Notices': 'notices',
  'OperateLogs': 'operate-logs',
  'Roles': 'roles',
  'Rules': 'rules',
  'Tags': 'tags',
  'Pages': 'pages',
  'UserTypes': 'user-types',
  'Votes': 'votes',
  'VoteItems': 'votes',
  'Comments': 'comments',
  'AccessTokens': 'access-tokens',
  'Upload': 'upload',
  'System': 'system',
  'Dashboard': 'dashboard'
};

// 提取 Swagger 文档块
function extractSwaggerDocs(content) {
  const swaggerBlocks = [];
  const regex = /\/\*\*\s*\n\s*\*\s*@swagger[\s\S]*?\*\//g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const block = match[0];
    // 提取 tags 来确定模块
    const tagMatch = block.match(/tags:\s*\[([^\]]+)\]/);
    if (tagMatch) {
      const tag = tagMatch[1].trim().replace(/['"]/g, '');
      const module = moduleMapping[tag] || 'misc';
      swaggerBlocks.push({
        content: block,
        tag: tag,
        module: module
      });
    }
  }
  
  return swaggerBlocks;
}

// 按模块分组文档
function groupByModule(swaggerBlocks) {
  const modules = {};
  
  swaggerBlocks.forEach(block => {
    if (!modules[block.module]) {
      modules[block.module] = [];
    }
    modules[block.module].push(block.content);
  });
  
  return modules;
}

// 生成模块文件
function generateModuleFiles(modules) {
  const docsDir = path.join(__dirname, '../src/server/docs/swagger');
  
  // 确保目录存在
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  Object.keys(modules).forEach(moduleName => {
    const moduleContent = modules[moduleName].join('\n\n');
    const filePath = path.join(docsDir, `${moduleName}.ts`);
    
    const fileContent = `/**
 * ${moduleName.toUpperCase()} 模块 Swagger 文档
 * 
 * 此文件包含 ${moduleName} 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

${moduleContent}

export default {};
`;
    
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Generated: ${filePath}`);
  });
}

// 生成索引文件
function generateIndexFile(modules) {
  const docsDir = path.join(__dirname, '../src/server/docs/swagger');
  const indexPath = path.join(docsDir, 'index.ts');
  
  const imports = Object.keys(modules).map(module => `import './${module}'`).join('\n');
  
  const indexContent = `/**
 * Swagger 文档模块索引
 * 
 * 此文件自动生成，用于导入所有的 Swagger 文档模块
 */

${imports}

export default {};

/**
 * 模块列表：
${Object.keys(modules).map(module => ` * - ${module}.ts`).join('\n')}
 */
`;
  
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`Generated: ${indexPath}`);
}

// 主函数
function main() {
  console.log('开始提取 Swagger 文档...');
  
  const swaggerBlocks = extractSwaggerDocs(routesContent);
  console.log(`找到 ${swaggerBlocks.length} 个 Swagger 文档块`);
  
  const modules = groupByModule(swaggerBlocks);
  console.log(`分组到 ${Object.keys(modules).length} 个模块:`, Object.keys(modules));
  
  generateModuleFiles(modules);
  generateIndexFile(modules);
  
  console.log('Swagger 文档提取完成！');
  console.log('\n下一步：');
  console.log('1. 更新 swagger.ts 配置文件中的 apis 路径');
  console.log('2. 从 routes.ts 文件中移除 Swagger 注释');
  console.log('3. 重启服务器测试文档是否正常');
}

if (require.main === module) {
  main();
}

module.exports = {
  extractSwaggerDocs,
  groupByModule,
  generateModuleFiles,
  generateIndexFile
};
