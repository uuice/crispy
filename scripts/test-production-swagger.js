#!/usr/bin/env node

/**
 * 测试生产环境 Swagger 配置
 */

const fs = require('fs');
const path = require('path');

// 模拟生产环境
process.env.NODE_ENV = 'production';
process.env.PORT = '4000';
process.env.API_PREFIX = '/api';

// 智能检测 Swagger 文档路径（复制自 swagger.ts）
function findSwaggerDocsPath() {
  const currentDir = process.cwd();
  
  // 可能的路径列表（按优先级排序）
  const possiblePaths = [
    // 服务器部署后的路径（相对于应用根目录）
    path.join(currentDir, 'browser/server/docs/swagger'),
    // 本地构建后的路径
    path.join(currentDir, 'dist/crispy/browser/server/docs/swagger'),
    // 开发环境路径
    path.join(currentDir, 'src/server/docs/swagger')
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`[Swagger] 找到文档路径: ${testPath}`);
      return testPath;
    }
  }
  
  // 如果都找不到，返回默认路径并记录警告
  const defaultPath = path.join(currentDir, 'src/server/docs/swagger');
  console.warn(`[Swagger] 警告：未找到文档路径，使用默认路径: ${defaultPath}`);
  return defaultPath;
}

// 动态获取 Swagger 文档路径（复制自 swagger.ts）
function getSwaggerDocsPaths(apiType) {
  const swaggerBasePath = findSwaggerDocsPath();
  
  return [
    path.join(swaggerBasePath, `${apiType}/**/*.ts`),
    path.join(swaggerBasePath, `${apiType}/**/*.js`)
  ];
}

function testSwaggerConfig() {
  console.log('🧪 测试生产环境 Swagger 配置...\n');
  
  try {
    const swaggerJsdoc = require('swagger-jsdoc');
    
    // Admin API 配置
    const adminPaths = getSwaggerDocsPaths('admin');
    console.log('Admin API 路径:');
    adminPaths.forEach(p => console.log(`   ${p}`));
    
    const adminConfig = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'Admin API', version: '1.0.0' },
        servers: [{ url: '/api' }],
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
    if (adminPathCount > 0) {
      const samplePaths = Object.keys(adminSpecs.paths).slice(0, 5);
      console.log(`示例路径: ${samplePaths.join(', ')}`);
    }
    
    // Content API 配置
    const contentPaths = getSwaggerDocsPaths('content');
    console.log('\nContent API 路径:');
    contentPaths.forEach(p => console.log(`   ${p}`));
    
    const contentConfig = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'Content API', version: '1.0.0' },
        servers: [{ url: '/api' }],
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
    if (contentPathCount > 0) {
      const samplePaths = Object.keys(contentSpecs.paths).slice(0, 5);
      console.log(`示例路径: ${samplePaths.join(', ')}`);
    }
    
    // 总结
    console.log('\n' + '='.repeat(50));
    console.log('📊 测试结果汇总:');
    console.log('='.repeat(50));
    console.log(`Admin API: ${adminPathCount} 个路径`);
    console.log(`Content API: ${contentPathCount} 个路径`);
    console.log(`总计: ${adminPathCount + contentPathCount} 个路径`);
    
    const success = adminPathCount > 0 && contentPathCount > 0;
    console.log(`\n${success ? '✅ 测试通过' : '❌ 测试失败'}！`);
    
    if (success) {
      console.log('\n🎉 生产环境 Swagger 配置正常！');
      console.log('📖 可以访问以下地址查看文档:');
      console.log('   Admin API: http://your-domain/admin/docs');
      console.log('   Content API: http://your-domain/content/docs');
    } else {
      console.log('\n🔧 需要检查以下问题:');
      console.log('1. 确认构建后的文档文件存在');
      console.log('2. 检查文件路径配置');
      console.log('3. 验证文档文件格式');
    }
    
    return success;
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error.stack);
    return false;
  }
}

function simulateServerEnvironment() {
  console.log('🌐 模拟服务器环境...\n');
  
  // 模拟不同的服务器工作目录
  const scenarios = [
    {
      name: '本地开发构建',
      cwd: process.cwd(),
      description: '在项目根目录运行'
    },
    {
      name: '服务器部署 (应用根目录)',
      cwd: '/home/yjj/crispy',
      description: '在服务器应用目录运行'
    },
    {
      name: '服务器部署 (dist 目录)',
      cwd: '/home/yjj/crispy/dist/crispy',
      description: '在构建输出目录运行'
    }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`场景: ${scenario.name}`);
    console.log(`描述: ${scenario.description}`);
    console.log(`工作目录: ${scenario.cwd}`);
    
    // 检查可能的文档路径
    const possiblePaths = [
      path.join(scenario.cwd, 'browser/server/docs/swagger'),
      path.join(scenario.cwd, 'dist/crispy/browser/server/docs/swagger'),
      path.join(scenario.cwd, 'src/server/docs/swagger')
    ];
    
    let foundPath = null;
    possiblePaths.forEach(testPath => {
      const exists = fs.existsSync(testPath);
      console.log(`   ${exists ? '✅' : '❌'} ${testPath}`);
      if (exists && !foundPath) {
        foundPath = testPath;
      }
    });
    
    if (foundPath) {
      console.log(`   🎯 推荐路径: ${foundPath}`);
    } else {
      console.log(`   ❌ 未找到有效路径`);
    }
    
    console.log('');
  });
}

function generateDeploymentGuide() {
  console.log('📋 部署指南:\n');
  
  console.log('1. 构建应用:');
  console.log('   bun run build');
  
  console.log('\n2. 上传到服务器:');
  console.log('   - 上传整个 dist/crispy 目录');
  console.log('   - 确保 browser/server/docs/swagger 目录存在');
  
  console.log('\n3. 服务器环境变量:');
  console.log('   NODE_ENV=production');
  console.log('   PORT=4000');
  console.log('   API_PREFIX=/api');
  
  console.log('\n4. 启动服务:');
  console.log('   cd /path/to/your/app');
  console.log('   bun run serve:ssr:crispy');
  
  console.log('\n5. 验证文档:');
  console.log('   curl http://your-domain/admin/docs');
  console.log('   curl http://your-domain/content/docs');
  
  console.log('\n6. 故障排除:');
  console.log('   - 检查工作目录是否正确');
  console.log('   - 确认文档文件路径存在');
  console.log('   - 查看服务器日志中的路径信息');
}

function main() {
  console.log('🚀 生产环境 Swagger 配置测试工具\n');
  
  simulateServerEnvironment();
  const success = testSwaggerConfig();
  generateDeploymentGuide();
  
  return success;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  findSwaggerDocsPath,
  getSwaggerDocsPaths,
  testSwaggerConfig,
  simulateServerEnvironment,
  generateDeploymentGuide
};
