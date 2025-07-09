#!/usr/bin/env node

/**
 * 综合测试所有 Swagger 文档配置
 */

const { testSwaggerConfig } = require('./test-swagger-config');
const { testContentSwaggerConfig } = require('./test-content-swagger');
const fs = require('fs');
const path = require('path');

function testFileStructure() {
  console.log('📁 测试文档文件结构...');
  
  const baseDir = path.join(__dirname, '../src/server/docs/swagger');
  const adminDir = path.join(baseDir, 'admin');
  const contentDir = path.join(baseDir, 'content');
  
  const results = {
    baseDir: fs.existsSync(baseDir),
    adminDir: fs.existsSync(adminDir),
    contentDir: fs.existsSync(contentDir),
    adminIndex: fs.existsSync(path.join(adminDir, 'index.ts')),
    contentIndex: fs.existsSync(path.join(contentDir, 'index.ts')),
    readme: fs.existsSync(path.join(baseDir, 'README.md'))
  };
  
  console.log(`   基础目录: ${results.baseDir ? '✅' : '❌'}`);
  console.log(`   Admin 目录: ${results.adminDir ? '✅' : '❌'}`);
  console.log(`   Content 目录: ${results.contentDir ? '✅' : '❌'}`);
  console.log(`   Admin 索引: ${results.adminIndex ? '✅' : '❌'}`);
  console.log(`   Content 索引: ${results.contentIndex ? '✅' : '❌'}`);
  console.log(`   README 文件: ${results.readme ? '✅' : '❌'}`);
  
  return Object.values(results).every(Boolean);
}

function countDocumentationFiles() {
  console.log('\n📊 统计文档文件...');
  
  const adminDir = path.join(__dirname, '../src/server/docs/swagger/admin');
  const contentDir = path.join(__dirname, '../src/server/docs/swagger/content');
  
  let adminFiles = 0;
  let contentFiles = 0;
  let adminSize = 0;
  let contentSize = 0;
  
  try {
    const adminFileList = fs.readdirSync(adminDir).filter(f => f.endsWith('.ts'));
    const contentFileList = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts'));
    
    adminFiles = adminFileList.length;
    contentFiles = contentFileList.length;
    
    adminFileList.forEach(file => {
      const stats = fs.statSync(path.join(adminDir, file));
      adminSize += stats.size;
    });
    
    contentFileList.forEach(file => {
      const stats = fs.statSync(path.join(contentDir, file));
      contentSize += stats.size;
    });
    
    console.log(`   Admin API 文档: ${adminFiles} 个文件, ${(adminSize / 1024).toFixed(2)} KB`);
    console.log(`   Content API 文档: ${contentFiles} 个文件, ${(contentSize / 1024).toFixed(2)} KB`);
    console.log(`   总计: ${adminFiles + contentFiles} 个文件, ${((adminSize + contentSize) / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('   ❌ 统计文件时出错:', error.message);
    return false;
  }
  
  return true;
}

function testSwaggerConfigs() {
  console.log('\n🧪 测试 Swagger 配置...');
  
  console.log('\n--- Admin API 配置测试 ---');
  const adminSuccess = testSwaggerConfig();
  
  console.log('\n--- Content API 配置测试 ---');
  const contentSuccess = testContentSwaggerConfig();
  
  return adminSuccess && contentSuccess;
}

function generateSummaryReport() {
  console.log('\n📋 生成汇总报告...');
  
  const swaggerJsdoc = require('swagger-jsdoc');
  
  // Admin API 配置
  const adminConfig = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'Admin API', version: '1.0.0' },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
      }
    },
    apis: ['./src/server/docs/swagger/admin/**/*.ts']
  };
  
  // Content API 配置
  const contentConfig = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'Content API', version: '1.0.0' },
      components: {
        securitySchemes: {
          accessTokenAuth: { type: 'apiKey', in: 'header', name: 'x-access-token' }
        }
      }
    },
    apis: ['./src/server/docs/swagger/content/**/*.ts']
  };
  
  try {
    const adminSpecs = swaggerJsdoc(adminConfig);
    const contentSpecs = swaggerJsdoc(contentConfig);
    
    const adminPaths = Object.keys(adminSpecs.paths || {}).length;
    const contentPaths = Object.keys(contentSpecs.paths || {}).length;
    
    const adminTags = new Set();
    const contentTags = new Set();
    
    Object.values(adminSpecs.paths || {}).forEach(pathMethods => {
      Object.values(pathMethods).forEach(method => {
        if (method.tags) method.tags.forEach(tag => adminTags.add(tag));
      });
    });
    
    Object.values(contentSpecs.paths || {}).forEach(pathMethods => {
      Object.values(pathMethods).forEach(method => {
        if (method.tags) method.tags.forEach(tag => contentTags.add(tag));
      });
    });
    
    console.log('\n📈 API 统计汇总:');
    console.log(`   Admin API: ${adminPaths} 个路径, ${adminTags.size} 个标签`);
    console.log(`   Content API: ${contentPaths} 个路径, ${contentTags.size} 个标签`);
    console.log(`   总计: ${adminPaths + contentPaths} 个路径, ${adminTags.size + contentTags.size} 个标签`);
    
    return true;
    
  } catch (error) {
    console.error('   ❌ 生成报告时出错:', error.message);
    return false;
  }
}

function checkConfigurationFiles() {
  console.log('\n⚙️  检查配置文件...');
  
  const swaggerConfigPath = path.join(__dirname, '../src/server/config/swagger.ts');
  const routesAdminPath = path.join(__dirname, '../src/server/routes/admin/routes.ts');
  const routesContentPath = path.join(__dirname, '../src/server/routes/content/routes.ts');
  
  const results = {
    swaggerConfig: fs.existsSync(swaggerConfigPath),
    adminRoutes: fs.existsSync(routesAdminPath),
    contentRoutes: fs.existsSync(routesContentPath)
  };
  
  console.log(`   Swagger 配置: ${results.swaggerConfig ? '✅' : '❌'}`);
  console.log(`   Admin 路由: ${results.adminRoutes ? '✅' : '❌'}`);
  console.log(`   Content 路由: ${results.contentRoutes ? '✅' : '❌'}`);
  
  // 检查路由文件是否已清理
  if (results.adminRoutes) {
    const adminContent = fs.readFileSync(routesAdminPath, 'utf8');
    const hasSwaggerComments = adminContent.includes('@swagger');
    console.log(`   Admin 路由已清理: ${!hasSwaggerComments ? '✅' : '❌ (仍包含 @swagger 注释)'}`);
  }
  
  return Object.values(results).every(Boolean);
}

function main() {
  console.log('🚀 Crispy API Swagger 文档系统综合测试\n');
  
  const tests = [
    { name: '文件结构', test: testFileStructure },
    { name: '文件统计', test: countDocumentationFiles },
    { name: '配置文件', test: checkConfigurationFiles },
    { name: 'Swagger 配置', test: testSwaggerConfigs },
    { name: '汇总报告', test: generateSummaryReport }
  ];
  
  const results = [];
  
  tests.forEach(({ name, test }) => {
    console.log(`\n🧪 测试: ${name}`);
    console.log('='.repeat(50));
    
    try {
      const success = test();
      results.push({ name, success });
      console.log(`\n${success ? '✅' : '❌'} ${name}测试${success ? '通过' : '失败'}`);
    } catch (error) {
      console.error(`\n❌ ${name}测试出错:`, error.message);
      results.push({ name, success: false });
    }
  });
  
  // 最终结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总:');
  console.log('='.repeat(60));
  
  results.forEach(({ name, success }) => {
    console.log(`   ${success ? '✅' : '❌'} ${name}`);
  });
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`\n📈 通过率: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！Swagger 文档系统已准备就绪。');
    console.log('\n📖 访问地址:');
    console.log('   Admin API: http://localhost:4000/admin/docs');
    console.log('   Content API: http://localhost:4000/content/docs');
    console.log('\n🚀 可以启动服务器进行测试了！');
  } else {
    console.log('\n🔧 请修复失败的测试项后重新运行。');
  }
  
  return passedTests === totalTests;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testFileStructure,
  countDocumentationFiles,
  testSwaggerConfigs,
  generateSummaryReport,
  checkConfigurationFiles
};
