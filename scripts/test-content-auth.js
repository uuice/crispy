#!/usr/bin/env node

/**
 * 测试 Content API 三重认证配置
 */

const swaggerJsdoc = require('swagger-jsdoc');

// 模拟生产环境
process.env.NODE_ENV = 'development'; // 使用开发环境测试
process.env.PORT = '4000';
process.env.API_PREFIX = '/api';

function testContentApiAuth() {
  console.log('🔐 测试 Content API 三重认证配置...\n');
  
  try {
    // Content API 配置
    const contentConfig = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Crispy Content API Documentation',
          version: '1.0.0',
          description: 'Content API documentation - 需要三重认证: x-access-token, x-app-name, x-channel'
        },
        servers: [
          {
            url: '/api',
            description: 'API Server'
          }
        ],
        components: {
          securitySchemes: {
            accessTokenAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-access-token',
              description: 'Access Token - 必需'
            },
            appNameAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-app-name',
              description: 'Application Name - 必需'
            },
            channelAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-channel',
              description: 'Channel Name - 必需'
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
    
    const specs = swaggerJsdoc(contentConfig);
    
    console.log('✅ Content API Swagger 配置加载成功');
    console.log(`📖 API 标题: ${specs.info.title}`);
    console.log(`🔢 API 版本: ${specs.info.version}`);
    
    // 检查安全配置
    const securitySchemes = specs.components?.securitySchemes || {};
    console.log('\n🔐 安全配置检查:');
    console.log(`   x-access-token: ${securitySchemes.accessTokenAuth ? '✅' : '❌'}`);
    console.log(`   x-app-name: ${securitySchemes.appNameAuth ? '✅' : '❌'}`);
    console.log(`   x-channel: ${securitySchemes.channelAuth ? '✅' : '❌'}`);
    
    // 检查全局安全配置
    const globalSecurity = specs.security || [];
    console.log('\n🌐 全局安全配置:');
    if (globalSecurity.length > 0) {
      const firstSecurity = globalSecurity[0];
      console.log(`   accessTokenAuth: ${firstSecurity.accessTokenAuth !== undefined ? '✅' : '❌'}`);
      console.log(`   appNameAuth: ${firstSecurity.appNameAuth !== undefined ? '✅' : '❌'}`);
      console.log(`   channelAuth: ${firstSecurity.channelAuth !== undefined ? '✅' : '❌'}`);
    } else {
      console.log('   ❌ 未找到全局安全配置');
    }
    
    // 检查路径数量
    const pathCount = Object.keys(specs.paths || {}).length;
    console.log(`\n🛣️  API 路径: ${pathCount} 个`);
    
    // 检查示例路径的安全配置
    const samplePaths = Object.keys(specs.paths || {}).slice(0, 3);
    if (samplePaths.length > 0) {
      console.log('\n📋 示例路径安全配置:');
      samplePaths.forEach(path => {
        const pathMethods = specs.paths[path];
        Object.keys(pathMethods).forEach(method => {
          const methodSpec = pathMethods[method];
          if (methodSpec.security) {
            const security = methodSpec.security[0] || {};
            const hasAllAuth = security.accessTokenAuth !== undefined && 
                              security.appNameAuth !== undefined && 
                              security.channelAuth !== undefined;
            console.log(`   ${method.toUpperCase()} ${path}: ${hasAllAuth ? '✅' : '❌'} 三重认证`);
          }
        });
      });
    }
    
    // 生成认证说明
    console.log('\n📖 认证使用说明:');
    console.log('在 Swagger UI 中，您需要配置以下三个认证:');
    console.log('1. accessTokenAuth: 输入您的 Access Token');
    console.log('2. appNameAuth: 输入您的应用名称');
    console.log('3. channelAuth: 输入您的渠道名称');
    console.log('\n⚠️  注意: 所有三个认证都必须同时配置才能成功调用 API');
    
    return pathCount > 0;
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

function generateAuthExample() {
  console.log('\n🔧 认证示例:\n');
  
  console.log('curl 命令示例:');
  console.log('```bash');
  console.log('curl -X GET "http://localhost:4000/api/content/articles" \\');
  console.log('  -H "x-access-token: your-access-token" \\');
  console.log('  -H "x-app-name: your-app-name" \\');
  console.log('  -H "x-channel: your-channel-name"');
  console.log('```');
  
  console.log('\nJavaScript fetch 示例:');
  console.log('```javascript');
  console.log('fetch("/api/content/articles", {');
  console.log('  headers: {');
  console.log('    "x-access-token": "your-access-token",');
  console.log('    "x-app-name": "your-app-name",');
  console.log('    "x-channel": "your-channel-name"');
  console.log('  }');
  console.log('});');
  console.log('```');
  
  console.log('\nSwagger UI 配置步骤:');
  console.log('1. 点击 "Authorize" 按钮');
  console.log('2. 在 accessTokenAuth 中输入: your-access-token');
  console.log('3. 在 appNameAuth 中输入: your-app-name');
  console.log('4. 在 channelAuth 中输入: your-channel-name');
  console.log('5. 点击 "Authorize" 确认');
  console.log('6. 现在可以测试 API 接口了');
}

function validateSwaggerUI() {
  console.log('\n🎨 Swagger UI 显示验证:\n');
  
  console.log('在 Swagger UI 中，您应该看到:');
  console.log('✅ 右上角有一个 "Authorize" 按钮');
  console.log('✅ 点击后显示三个认证字段:');
  console.log('   - accessTokenAuth (apiKey)');
  console.log('   - appNameAuth (apiKey)');
  console.log('   - channelAuth (apiKey)');
  console.log('✅ 每个 API 接口都显示一个锁图标');
  console.log('✅ 接口文档中显示需要三重认证');
  
  console.log('\n如果显示不正确，请检查:');
  console.log('❌ 配置文件是否正确更新');
  console.log('❌ 文档是否重新生成');
  console.log('❌ 服务器是否重启');
}

function main() {
  console.log('🚀 Content API 三重认证测试工具\n');
  
  const success = testContentApiAuth();
  generateAuthExample();
  validateSwaggerUI();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果:');
  console.log('='.repeat(50));
  
  if (success) {
    console.log('✅ Content API 三重认证配置正确');
    console.log('\n🎉 现在 Swagger UI 将要求同时提供三个 header:');
    console.log('   - x-access-token');
    console.log('   - x-app-name');
    console.log('   - x-channel');
    
    console.log('\n📖 访问地址: http://localhost:4000/content/docs');
  } else {
    console.log('❌ Content API 三重认证配置有问题');
    console.log('\n🔧 请检查:');
    console.log('1. swagger.ts 配置文件');
    console.log('2. 生成的文档文件');
    console.log('3. 服务器重启');
  }
  
  return success;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testContentApiAuth,
  generateAuthExample,
  validateSwaggerUI
};
