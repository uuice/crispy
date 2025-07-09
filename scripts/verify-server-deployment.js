#!/usr/bin/env node

/**
 * 验证服务器部署后的 Swagger 配置
 */

const fs = require('fs');
const path = require('path');

// 模拟服务器环境
process.env.NODE_ENV = 'production';
process.env.PORT = '4000';
process.env.API_PREFIX = '/api';

function checkServerPaths() {
  console.log('🔍 检查服务器路径...\n');
  
  const serverPaths = [
    '/home/yjj/crispy/dist/crispy/browser/server/docs/swagger',
    path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger'),
    path.join(process.cwd(), 'browser/server/docs/swagger')
  ];
  
  console.log('📁 检查可能的服务器路径:');
  let foundPath = null;
  
  serverPaths.forEach(testPath => {
    const exists = fs.existsSync(testPath);
    console.log(`   ${exists ? '✅' : '❌'} ${testPath}`);
    
    if (exists && !foundPath) {
      foundPath = testPath;
      
      // 详细检查
      const adminPath = path.join(testPath, 'admin');
      const contentPath = path.join(testPath, 'content');
      
      const adminExists = fs.existsSync(adminPath);
      const contentExists = fs.existsSync(contentPath);
      
      console.log(`      Admin 目录: ${adminExists ? '✅' : '❌'} ${adminPath}`);
      console.log(`      Content 目录: ${contentExists ? '✅' : '❌'} ${contentPath}`);
      
      if (adminExists && contentExists) {
        const adminFiles = fs.readdirSync(adminPath).filter(f => f.endsWith('.ts'));
        const contentFiles = fs.readdirSync(contentPath).filter(f => f.endsWith('.ts'));
        
        console.log(`      Admin 文件: ${adminFiles.length} 个`);
        console.log(`      Content 文件: ${contentFiles.length} 个`);
        
        // 检查文件内容
        if (adminFiles.length > 0) {
          const sampleFile = path.join(adminPath, adminFiles[0]);
          const content = fs.readFileSync(sampleFile, 'utf8');
          const hasSwagger = content.includes('@swagger');
          console.log(`      示例文件包含 @swagger: ${hasSwagger ? '✅' : '❌'}`);
        }
      }
    }
  });
  
  return foundPath;
}

function testSwaggerJsdocWithServerPath(swaggerPath) {
  console.log('\n🧪 测试 swagger-jsdoc 配置...\n');
  
  try {
    const swaggerJsdoc = require('swagger-jsdoc');
    
    // Admin API 测试
    const adminPaths = [
      path.join(swaggerPath, 'admin/**/*.ts'),
      path.join(swaggerPath, 'admin/**/*.js')
    ];
    
    console.log('Admin API 路径:');
    adminPaths.forEach(p => console.log(`   ${p}`));
    
    const adminConfig = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'Admin API', version: '1.0.0' },
        servers: [{ url: '/api', description: 'Production server' }],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
          }
        }
      },
      apis: adminPaths
    };
    
    const adminSpecs = swaggerJsdoc(adminConfig);
    const adminPathCount = Object.keys(adminSpecs.paths || {}).length;
    
    console.log(`\nAdmin API 结果: ${adminPathCount} 个路径`);
    
    // Content API 测试
    const contentPaths = [
      path.join(swaggerPath, 'content/**/*.ts'),
      path.join(swaggerPath, 'content/**/*.js')
    ];
    
    console.log('\nContent API 路径:');
    contentPaths.forEach(p => console.log(`   ${p}`));
    
    const contentConfig = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'Content API', version: '1.0.0' },
        servers: [{ url: '/api', description: 'Production server' }],
        components: {
          securitySchemes: {
            accessTokenAuth: { type: 'apiKey', in: 'header', name: 'x-access-token' }
          }
        }
      },
      apis: contentPaths
    };
    
    const contentSpecs = swaggerJsdoc(contentConfig);
    const contentPathCount = Object.keys(contentSpecs.paths || {}).length;
    
    console.log(`\nContent API 结果: ${contentPathCount} 个路径`);
    
    return { adminPathCount, contentPathCount };
    
  } catch (error) {
    console.error('❌ swagger-jsdoc 测试失败:', error.message);
    return { adminPathCount: 0, contentPathCount: 0 };
  }
}

function generateServerStartScript() {
  console.log('\n📝 生成服务器启动脚本...\n');
  
  const scriptContent = `#!/bin/bash

# Crispy 服务器启动脚本
# 生成时间: ${new Date().toISOString()}

echo "🚀 启动 Crispy 应用服务器..."

# 设置环境变量
export NODE_ENV=production
export PORT=4000
export API_PREFIX=/api

# 检查工作目录
echo "当前工作目录: $(pwd)"

# 检查 Swagger 文档路径
SWAGGER_PATHS=(
    "/home/yjj/crispy/dist/crispy/browser/server/docs/swagger"
    "$(pwd)/dist/crispy/browser/server/docs/swagger"
    "$(pwd)/browser/server/docs/swagger"
)

FOUND_PATH=""
for path in "\${SWAGGER_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "✅ 找到 Swagger 文档路径: $path"
        FOUND_PATH="$path"
        break
    else
        echo "❌ 路径不存在: $path"
    fi
done

if [ -z "$FOUND_PATH" ]; then
    echo "❌ 未找到 Swagger 文档路径"
    echo "请检查构建文件是否正确上传"
    exit 1
fi

# 检查文档文件
ADMIN_COUNT=$(find "$FOUND_PATH/admin" -name "*.ts" 2>/dev/null | wc -l)
CONTENT_COUNT=$(find "$FOUND_PATH/content" -name "*.ts" 2>/dev/null | wc -l)

echo "📊 文档文件统计:"
echo "   Admin API: $ADMIN_COUNT 个文件"
echo "   Content API: $CONTENT_COUNT 个文件"

if [ "$ADMIN_COUNT" -eq 0 ] || [ "$CONTENT_COUNT" -eq 0 ]; then
    echo "❌ 文档文件不完整，请检查构建过程"
    exit 1
fi

echo "✅ 文档文件检查通过"

# 启动应用
echo "🚀 启动应用..."
echo "📖 文档访问地址:"
echo "   Admin API: http://localhost:4000/admin/docs"
echo "   Content API: http://localhost:4000/content/docs"

# 启动服务
bun run serve:ssr:crispy
`;

  const scriptPath = path.join(process.cwd(), 'start-server.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  
  try {
    fs.chmodSync(scriptPath, '755');
    console.log(`✅ 启动脚本已生成: ${scriptPath}`);
    console.log('使用方法: ./start-server.sh');
  } catch (error) {
    console.log(`✅ 启动脚本已生成: ${scriptPath}`);
    console.log('使用方法: bash start-server.sh');
  }
  
  return scriptPath;
}

function generateTroubleshootingGuide() {
  console.log('\n🔧 故障排除指南:\n');
  
  console.log('1. 检查文件上传:');
  console.log('   - 确保整个 dist/crispy 目录已上传');
  console.log('   - 验证 browser/server/docs/swagger 目录存在');
  console.log('   - 检查文件权限是否正确');
  
  console.log('\n2. 检查工作目录:');
  console.log('   - 确认在正确的目录启动应用');
  console.log('   - 检查相对路径是否正确');
  
  console.log('\n3. 检查环境变量:');
  console.log('   - NODE_ENV=production');
  console.log('   - PORT=4000');
  console.log('   - API_PREFIX=/api');
  
  console.log('\n4. 调试命令:');
  console.log('   - 检查文档路径: ls -la /home/yjj/crispy/dist/crispy/browser/server/docs/swagger');
  console.log('   - 统计文件数量: find /path/to/swagger -name "*.ts" | wc -l');
  console.log('   - 查看应用日志: 检查 [Swagger] 开头的日志信息');
  
  console.log('\n5. 验证文档:');
  console.log('   - 访问: curl http://localhost:4000/admin/docs');
  console.log('   - 访问: curl http://localhost:4000/content/docs');
  console.log('   - 检查返回的 HTML 是否包含 Swagger UI');
}

function main() {
  console.log('🚀 服务器部署验证工具\n');
  
  const swaggerPath = checkServerPaths();
  
  if (!swaggerPath) {
    console.log('\n❌ 未找到 Swagger 文档路径');
    generateTroubleshootingGuide();
    return false;
  }
  
  console.log(`\n✅ 找到 Swagger 文档路径: ${swaggerPath}`);
  
  const { adminPathCount, contentPathCount } = testSwaggerJsdocWithServerPath(swaggerPath);
  
  const startScript = generateServerStartScript();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 验证结果汇总:');
  console.log('='.repeat(60));
  console.log(`Swagger 路径: ${swaggerPath}`);
  console.log(`Admin API: ${adminPathCount} 个路径`);
  console.log(`Content API: ${contentPathCount} 个路径`);
  console.log(`启动脚本: ${startScript}`);
  
  const success = adminPathCount > 0 && contentPathCount > 0;
  
  if (success) {
    console.log('\n🎉 服务器部署验证通过！');
    console.log('\n📖 下一步：');
    console.log('1. 使用生成的启动脚本启动服务');
    console.log('2. 访问 Swagger 文档验证功能');
    console.log('3. 检查 API 接口是否正常工作');
  } else {
    console.log('\n❌ 服务器部署验证失败');
    generateTroubleshootingGuide();
  }
  
  return success;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  checkServerPaths,
  testSwaggerJsdocWithServerPath,
  generateServerStartScript,
  generateTroubleshootingGuide
};
