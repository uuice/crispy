#!/usr/bin/env node

/**
 * 测试 Swagger 配置是否正常工作
 */

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// 模拟环境变量
process.env.PORT = '4000';
process.env.API_PREFIX = '/api';

// 导入 Swagger 配置
const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crispy API Documentation',
      version: '1.0.0',
      description: 'API documentation for Crispy application',
    },
    servers: [
      {
        url: `http://localhost:4000/api`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
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
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './src/server/docs/swagger/**/*.ts',
    './src/server/docs/swagger/**/*.js'
  ]
};

function testSwaggerConfig() {
  console.log('测试 Swagger 配置...');
  
  try {
    // 生成 Swagger 规范
    const specs = swaggerJsdoc(swaggerConfig);
    
    // 检查基本信息
    console.log('✅ Swagger 配置加载成功');
    console.log(`📖 API 标题: ${specs.info.title}`);
    console.log(`🔢 API 版本: ${specs.info.version}`);
    
    // 检查路径数量
    const pathCount = Object.keys(specs.paths || {}).length;
    console.log(`🛣️  发现 ${pathCount} 个 API 路径`);
    
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
    
    // 检查安全配置
    const hasAuth = specs.components?.securitySchemes?.bearerAuth;
    console.log(`🔐 认证配置: ${hasAuth ? '✅ 已配置' : '❌ 未配置'}`);
    
    // 显示一些示例路径
    const samplePaths = Object.keys(specs.paths || {}).slice(0, 5);
    if (samplePaths.length > 0) {
      console.log('\n📋 示例 API 路径:');
      samplePaths.forEach(path => {
        const methods = Object.keys(specs.paths[path]);
        console.log(`   ${path} [${methods.join(', ').toUpperCase()}]`);
      });
    }
    
    console.log('\n✅ Swagger 配置测试通过！');
    return true;
    
  } catch (error) {
    console.error('❌ Swagger 配置测试失败:');
    console.error(error.message);
    
    if (error.message.includes('Cannot resolve')) {
      console.log('\n💡 建议：');
      console.log('1. 检查文件路径是否正确');
      console.log('2. 确保所有 Swagger 文档文件存在');
      console.log('3. 检查文件中的语法错误');
    }
    
    return false;
  }
}

function listSwaggerFiles() {
  const fs = require('fs');
  const swaggerDir = path.join(__dirname, '../src/server/docs/swagger');
  
  console.log('\n📁 Swagger 文档文件列表:');
  
  try {
    const files = fs.readdirSync(swaggerDir);
    const tsFiles = files.filter(file => file.endsWith('.ts'));
    
    tsFiles.forEach(file => {
      const filePath = path.join(swaggerDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   📄 ${file} (${sizeKB} KB)`);
    });
    
    console.log(`\n📊 总计: ${tsFiles.length} 个文档文件`);
    
  } catch (error) {
    console.error('❌ 无法读取 Swagger 文档目录:', error.message);
  }
}

function main() {
  console.log('🧪 Swagger 配置测试工具\n');
  
  listSwaggerFiles();
  
  const success = testSwaggerConfig();
  
  if (success) {
    console.log('\n🎉 所有测试通过！可以启动服务器测试 Swagger UI。');
    console.log('📖 访问地址: http://localhost:4000/admin/docs');
  } else {
    console.log('\n🔧 请修复上述问题后重新测试。');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  testSwaggerConfig,
  listSwaggerFiles
};
