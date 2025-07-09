#!/usr/bin/env node

/**
 * 修复服务器部署时的 Swagger 路径问题
 */

const fs = require('fs');
const path = require('path');

function detectServerEnvironment() {
  console.log('🔍 检测服务器环境...\n');
  
  const cwd = process.cwd();
  console.log(`当前工作目录: ${cwd}`);
  
  // 检查是否在服务器环境
  const isServer = cwd.includes('/home/') || cwd.includes('/var/') || cwd.includes('/opt/');
  console.log(`服务器环境: ${isServer ? '是' : '否'}`);
  
  // 检查可能的文档路径
  const possiblePaths = [
    // 如果在应用根目录运行
    path.join(cwd, 'dist/crispy/browser/server/docs/swagger'),
    // 如果在 dist/crispy 目录运行
    path.join(cwd, 'browser/server/docs/swagger'),
    // 如果文档被复制到根目录
    path.join(cwd, 'server/docs/swagger'),
    // 开发环境路径
    path.join(cwd, 'src/server/docs/swagger')
  ];
  
  console.log('\n📁 检查文档路径:');
  let foundPath = null;
  
  possiblePaths.forEach(testPath => {
    const exists = fs.existsSync(testPath);
    console.log(`   ${exists ? '✅' : '❌'} ${testPath}`);
    
    if (exists && !foundPath) {
      foundPath = testPath;
      
      // 检查子目录
      const adminExists = fs.existsSync(path.join(testPath, 'admin'));
      const contentExists = fs.existsSync(path.join(testPath, 'content'));
      
      console.log(`      Admin: ${adminExists ? '✅' : '❌'}`);
      console.log(`      Content: ${contentExists ? '✅' : '❌'}`);
      
      if (adminExists && contentExists) {
        const adminFiles = fs.readdirSync(path.join(testPath, 'admin')).filter(f => f.endsWith('.ts')).length;
        const contentFiles = fs.readdirSync(path.join(testPath, 'content')).filter(f => f.endsWith('.ts')).length;
        console.log(`      Admin 文件: ${adminFiles} 个`);
        console.log(`      Content 文件: ${contentFiles} 个`);
      }
    }
  });
  
  return foundPath;
}

function generateServerConfig(swaggerPath) {
  console.log('\n⚙️  生成服务器配置...\n');
  
  const configContent = `// 服务器环境 Swagger 配置
// 自动生成于: ${new Date().toISOString()}
// 工作目录: ${process.cwd()}
// 文档路径: ${swaggerPath}

import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'
import path from 'path'
import fs from 'fs'

// 服务器环境的固定文档路径
const SERVER_SWAGGER_PATH = '${swaggerPath}'

// 动态获取 Swagger 文档路径
function getSwaggerDocsPaths(apiType: 'admin' | 'content'): string[] {
  const isDev = env.isDevelopment()

  if (isDev) {
    // 开发环境：使用源文件路径
    return [
      \`./src/server/docs/swagger/\${apiType}/**/*.ts\`,
      \`./src/server/docs/swagger/\${apiType}/**/*.js\`,
      \`./src/server/routes/\${apiType}/**/*.ts\`,
      \`./src/server/routes/\${apiType}/**/*.js\`
    ]
  } else {
    // 生产环境：使用服务器固定路径
    return [
      path.join(SERVER_SWAGGER_PATH, \`\${apiType}/**/*.ts\`),
      path.join(SERVER_SWAGGER_PATH, \`\${apiType}/**/*.js\`)
    ]
  }
}

// 其余配置保持不变...
`;

  const configPath = path.join(process.cwd(), 'swagger-server.config.js');
  fs.writeFileSync(configPath, configContent);
  
  console.log(`✅ 服务器配置已生成: ${configPath}`);
  
  return configPath;
}

function createSymbolicLink(sourcePath) {
  console.log('\n🔗 创建符号链接...\n');
  
  const linkPath = path.join(process.cwd(), 'swagger-docs');
  
  try {
    // 如果链接已存在，先删除
    if (fs.existsSync(linkPath)) {
      fs.unlinkSync(linkPath);
    }
    
    // 创建符号链接
    fs.symlinkSync(sourcePath, linkPath);
    console.log(`✅ 符号链接已创建: ${linkPath} -> ${sourcePath}`);
    
    return linkPath;
    
  } catch (error) {
    console.error(`❌ 创建符号链接失败: ${error.message}`);
    return null;
  }
}

function updateSwaggerConfig(swaggerPath) {
  console.log('\n📝 更新 Swagger 配置...\n');
  
  const configPath = path.join(process.cwd(), 'src/server/config/swagger.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ 配置文件不存在: ${configPath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // 替换路径检测函数
    const newPathFunction = \`// 智能检测 Swagger 文档路径
function findSwaggerDocsPath(): string {
  const currentDir = process.cwd()
  
  // 服务器环境的固定路径
  const serverPath = '${swaggerPath}'
  if (fs.existsSync(serverPath)) {
    console.log(\`[Swagger] 使用服务器路径: \${serverPath}\`)
    return serverPath
  }
  
  // 可能的路径列表（按优先级排序）
  const possiblePaths = [
    // 本地构建后的路径
    path.join(currentDir, 'dist/crispy/browser/server/docs/swagger'),
    // 开发环境路径
    path.join(currentDir, 'src/server/docs/swagger')
  ]
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(\`[Swagger] 找到文档路径: \${testPath}\`)
      return testPath
    }
  }
  
  // 如果都找不到，返回默认路径并记录警告
  const defaultPath = path.join(currentDir, 'src/server/docs/swagger')
  console.warn(\`[Swagger] 警告：未找到文档路径，使用默认路径: \${defaultPath}\`)
  return defaultPath
}\`;
    
    // 替换现有的函数
    content = content.replace(
      /\/\/ 智能检测 Swagger 文档路径[\\s\\S]*?return defaultPath\\n}/,
      newPathFunction
    );
    
    // 写回文件
    fs.writeFileSync(configPath, content);
    console.log(`✅ Swagger 配置已更新: ${configPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ 更新配置失败: ${error.message}`);
    return false;
  }
}

function generateDeploymentScript() {
  console.log('\n📋 生成部署脚本...\n');
  
  const scriptContent = \`#!/bin/bash

# Crispy 应用部署脚本
# 自动生成于: ${new Date().toISOString()}

echo "🚀 开始部署 Crispy 应用..."

# 设置环境变量
export NODE_ENV=production
export PORT=4000
export API_PREFIX=/api

# 检查文档路径
SWAGGER_PATH="${process.cwd()}/dist/crispy/browser/server/docs/swagger"
if [ ! -d "\$SWAGGER_PATH" ]; then
    echo "❌ Swagger 文档路径不存在: \$SWAGGER_PATH"
    echo "请确保构建文件已正确上传"
    exit 1
fi

echo "✅ Swagger 文档路径存在: \$SWAGGER_PATH"

# 检查文档文件
ADMIN_FILES=\$(find "\$SWAGGER_PATH/admin" -name "*.ts" 2>/dev/null | wc -l)
CONTENT_FILES=\$(find "\$SWAGGER_PATH/content" -name "*.ts" 2>/dev/null | wc -l)

echo "📊 文档文件统计:"
echo "   Admin API: \$ADMIN_FILES 个文件"
echo "   Content API: \$CONTENT_FILES 个文件"

if [ "\$ADMIN_FILES" -eq 0 ] || [ "\$CONTENT_FILES" -eq 0 ]; then
    echo "❌ 文档文件不完整"
    exit 1
fi

# 启动应用
echo "🚀 启动应用..."
bun run serve:ssr:crispy

\`;

  const scriptPath = path.join(process.cwd(), 'deploy-server.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');
  
  console.log(`✅ 部署脚本已生成: ${scriptPath}`);
  
  return scriptPath;
}

function main() {
  console.log('🔧 服务器 Swagger 路径修复工具\\n');
  
  const swaggerPath = detectServerEnvironment();
  
  if (!swaggerPath) {
    console.log('\\n❌ 未找到 Swagger 文档路径');
    console.log('\\n💡 建议：');
    console.log('1. 确保构建文件已上传到服务器');
    console.log('2. 检查工作目录是否正确');
    console.log('3. 验证文档文件是否存在');
    return false;
  }
  
  console.log(\`\\n✅ 找到 Swagger 文档路径: \${swaggerPath}\`);
  
  // 更新配置
  const configUpdated = updateSwaggerConfig(swaggerPath);
  
  // 生成部署脚本
  const deployScript = generateDeploymentScript();
  
  console.log('\\n' + '='.repeat(50));
  console.log('📊 修复结果汇总:');
  console.log('='.repeat(50));
  console.log(\`文档路径: \${swaggerPath}\`);
  console.log(\`配置更新: \${configUpdated ? '✅' : '❌'}\`);
  console.log(\`部署脚本: \${deployScript ? '✅' : '❌'}\`);
  
  if (configUpdated) {
    console.log('\\n🎉 修复完成！');
    console.log('\\n📖 下一步：');
    console.log('1. 重启应用服务');
    console.log('2. 访问 Swagger 文档验证');
    console.log('3. 检查服务器日志');
  } else {
    console.log('\\n🔧 需要手动修复配置文件');
  }
  
  return configUpdated;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  detectServerEnvironment,
  generateServerConfig,
  updateSwaggerConfig,
  generateDeploymentScript
};
