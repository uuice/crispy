#!/usr/bin/env node

/**
 * 从 routes.ts 文件中移除 Swagger 注释，保留纯净的路由定义
 */

const fs = require('fs');
const path = require('path');

// 读取 routes.ts 文件
const routesFilePath = path.join(__dirname, '../src/server/routes/admin/routes.ts');
const routesContent = fs.readFileSync(routesFilePath, 'utf8');

// 移除 Swagger 注释块
function removeSwaggerComments(content) {
  // 匹配 /** @swagger ... */ 注释块
  const swaggerRegex = /\/\*\*\s*\n\s*\*\s*@swagger[\s\S]*?\*\/\s*\n?/g;
  
  // 移除所有 Swagger 注释
  let cleanContent = content.replace(swaggerRegex, '');
  
  // 清理多余的空行（超过2个连续空行的情况）
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');
  
  return cleanContent;
}

// 创建备份
function createBackup(filePath) {
  const backupPath = filePath + '.backup.' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`备份文件已创建: ${backupPath}`);
  return backupPath;
}

// 主函数
function main() {
  console.log('开始清理 routes.ts 文件中的 Swagger 注释...');
  
  // 创建备份
  const backupPath = createBackup(routesFilePath);
  
  // 移除 Swagger 注释
  const cleanContent = removeSwaggerComments(routesContent);
  
  // 写入清理后的内容
  fs.writeFileSync(routesFilePath, cleanContent, 'utf8');
  
  // 统计信息
  const originalLines = routesContent.split('\n').length;
  const cleanLines = cleanContent.split('\n').length;
  const removedLines = originalLines - cleanLines;
  
  console.log(`清理完成！`);
  console.log(`原文件行数: ${originalLines}`);
  console.log(`清理后行数: ${cleanLines}`);
  console.log(`移除行数: ${removedLines}`);
  console.log(`文件大小减少: ${((routesContent.length - cleanContent.length) / 1024).toFixed(2)} KB`);
  
  console.log('\n建议：');
  console.log('1. 检查清理后的 routes.ts 文件是否正常');
  console.log('2. 重启服务器测试路由是否正常工作');
  console.log('3. 访问 /admin/docs 测试 Swagger 文档是否正常');
  console.log(`4. 如有问题，可以从备份文件恢复: ${backupPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  removeSwaggerComments,
  createBackup
};
