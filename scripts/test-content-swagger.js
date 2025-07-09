#!/usr/bin/env node

/**
 * 测试 Content API Swagger 配置是否正常工作
 */

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// 模拟环境变量
process.env.PORT = '4000';
process.env.API_PREFIX = '/api';

// Content API Swagger 配置
const contentSwaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crispy Content API Documentation',
      version: '1.0.0',
      description: 'Content API documentation for Crispy application - Read-only access with Access Token authentication',
    },
    servers: [
      {
        url: `http://localhost:4000/api`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        accessTokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token',
          description: 'Access token for API authentication'
        },
        appNameAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-app-name',
          description: 'Application name for API authentication'
        },
        channelAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-channel',
          description: 'Channel name for API authentication'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        accessTokenAuth: [],
        appNameAuth: [],
        channelAuth: []
      }
    ]
  },
  apis: [
    './src/server/docs/swagger/content/**/*.ts',
    './src/server/docs/swagger/content/**/*.js'
  ]
};

function testContentSwaggerConfig() {
  console.log('🧪 测试 Content API Swagger 配置...');
  
  try {
    // 生成 Swagger 规范
    const specs = swaggerJsdoc(contentSwaggerConfig);
    
    // 检查基本信息
    console.log('✅ Content API Swagger 配置加载成功');
    console.log(`📖 API 标题: ${specs.info.title}`);
    console.log(`🔢 API 版本: ${specs.info.version}`);
    
    // 检查路径数量
    const pathCount = Object.keys(specs.paths || {}).length;
    console.log(`🛣️  发现 ${pathCount} 个 Content API 路径`);
    
    // 检查标签
    const tags = new Set();
    Object.values(specs.paths || {}).forEach(pathMethods => {
      Object.values(pathMethods).forEach(method => {
        if (method.tags) {
          method.tags.forEach(tag => tags.add(tag));
        }
      });
    });
    
    console.log(`🏷️  发现 ${tags.size} 个标签: ${Array.from(tags).join(', ')}`);
    
    // 检查认证配置
    const hasAccessToken = specs.components?.securitySchemes?.accessTokenAuth;
    const hasAppName = specs.components?.securitySchemes?.appNameAuth;
    const hasChannel = specs.components?.securitySchemes?.channelAuth;
    
    console.log(`🔐 认证配置:`);
    console.log(`   Access Token: ${hasAccessToken ? '✅' : '❌'}`);
    console.log(`   App Name: ${hasAppName ? '✅' : '❌'}`);
    console.log(`   Channel: ${hasChannel ? '✅' : '❌'}`);
    
    // 检查路径类型（应该主要是 GET 请求）
    const methodStats = {};
    Object.values(specs.paths || {}).forEach(pathMethods => {
      Object.keys(pathMethods).forEach(method => {
        methodStats[method.toUpperCase()] = (methodStats[method.toUpperCase()] || 0) + 1;
      });
    });
    
    console.log(`📊 HTTP 方法统计:`);
    Object.entries(methodStats).forEach(([method, count]) => {
      console.log(`   ${method}: ${count} 个接口`);
    });
    
    // 显示一些示例路径
    const samplePaths = Object.keys(specs.paths || {}).slice(0, 8);
    if (samplePaths.length > 0) {
      console.log('\n📋 示例 Content API 路径:');
      samplePaths.forEach(path => {
        const methods = Object.keys(specs.paths[path]);
        console.log(`   ${path} [${methods.join(', ').toUpperCase()}]`);
      });
      
      if (Object.keys(specs.paths || {}).length > 8) {
        console.log(`   ... 还有 ${Object.keys(specs.paths || {}).length - 8} 个路径`);
      }
    }
    
    // 检查是否有非 GET 请求
    const nonGetPaths = [];
    Object.entries(specs.paths || {}).forEach(([path, methods]) => {
      const nonGetMethods = Object.keys(methods).filter(method => method.toLowerCase() !== 'get');
      if (nonGetMethods.length > 0) {
        nonGetPaths.push({ path, methods: nonGetMethods });
      }
    });
    
    if (nonGetPaths.length > 0) {
      console.log('\n🔄 非 GET 请求:');
      nonGetPaths.forEach(({ path, methods }) => {
        console.log(`   ${path} [${methods.join(', ').toUpperCase()}]`);
      });
    }
    
    console.log('\n✅ Content API Swagger 配置测试通过！');
    return true;
    
  } catch (error) {
    console.error('❌ Content API Swagger 配置测试失败:');
    console.error(error.message);
    
    if (error.message.includes('Cannot resolve')) {
      console.log('\n💡 建议：');
      console.log('1. 检查 Content API 文档文件路径是否正确');
      console.log('2. 确保所有 Content Swagger 文档文件存在');
      console.log('3. 检查文件中的语法错误');
    }
    
    return false;
  }
}

function listContentSwaggerFiles() {
  const fs = require('fs');
  const contentSwaggerDir = path.join(__dirname, '../src/server/docs/swagger/content');
  
  console.log('\n📁 Content API Swagger 文档文件列表:');
  
  try {
    const files = fs.readdirSync(contentSwaggerDir);
    const tsFiles = files.filter(file => file.endsWith('.ts'));
    
    let totalSize = 0;
    tsFiles.forEach(file => {
      const filePath = path.join(contentSwaggerDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      console.log(`   📄 ${file} (${sizeKB} KB)`);
    });
    
    console.log(`\n📊 总计: ${tsFiles.length} 个文档文件，总大小: ${(totalSize / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ 无法读取 Content API Swagger 文档目录:', error.message);
  }
}

function compareWithAdminAPI() {
  console.log('\n🔍 Content API vs Admin API 对比:');
  console.log('📖 Content API 特点:');
  console.log('   - 主要提供只读访问（GET 请求）');
  console.log('   - 使用 Access Token + App Name + Channel 三重认证');
  console.log('   - 面向外部应用和第三方集成');
  console.log('   - 数据访问权限受限');
  
  console.log('\n🔧 Admin API 特点:');
  console.log('   - 提供完整的 CRUD 操作');
  console.log('   - 使用 JWT Bearer Token 认证');
  console.log('   - 面向管理后台');
  console.log('   - 具有完整的管理权限');
}

function main() {
  console.log('🧪 Content API Swagger 配置测试工具\n');
  
  listContentSwaggerFiles();
  
  const success = testContentSwaggerConfig();
  
  compareWithAdminAPI();
  
  if (success) {
    console.log('\n🎉 所有测试通过！Content API Swagger 文档已准备就绪。');
    console.log('📖 建议访问地址: http://localhost:4000/content/docs');
    console.log('\n🔧 下一步：');
    console.log('1. 在服务器中添加 Content API 的 Swagger UI 路由');
    console.log('2. 启动服务器测试文档界面');
    console.log('3. 验证 Access Token 认证是否正常工作');
  } else {
    console.log('\n🔧 请修复上述问题后重新测试。');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  testContentSwaggerConfig,
  listContentSwaggerFiles,
  compareWithAdminAPI
};
