#!/usr/bin/env node

/**
 * 验证构建后的 Swagger 文档是否正常
 */

const fs = require('fs');
const path = require('path');

function checkBuildOutput() {
  console.log('🔍 检查构建输出...');

  const distDir = path.join(__dirname, '../dist/crispy');
  const browserDir = path.join(distDir, 'browser');
  const serverDir = path.join(distDir, 'server');
  const swaggerDocsDir = path.join(browserDir, 'server/docs/swagger');

  const checks = {
    distExists: fs.existsSync(distDir),
    browserExists: fs.existsSync(browserDir),
    serverExists: fs.existsSync(serverDir),
    swaggerDocsExists: fs.existsSync(swaggerDocsDir),
    adminDocsExists: fs.existsSync(path.join(swaggerDocsDir, 'admin')),
    contentDocsExists: fs.existsSync(path.join(swaggerDocsDir, 'content'))
  };

  console.log(`   dist 目录: ${checks.distExists ? '✅' : '❌'}`);
  console.log(`   browser 目录: ${checks.browserExists ? '✅' : '❌'}`);
  console.log(`   server 目录: ${checks.serverExists ? '✅' : '❌'}`);
  console.log(`   swagger docs 目录: ${checks.swaggerDocsExists ? '✅' : '❌'}`);
  console.log(`   admin docs: ${checks.adminDocsExists ? '✅' : '❌'}`);
  console.log(`   content docs: ${checks.contentDocsExists ? '✅' : '❌'}`);

  return Object.values(checks).every(Boolean);
}

function countSwaggerFiles() {
  console.log('\n📊 统计 Swagger 文档文件...');

  const swaggerDocsDir = path.join(__dirname, '../dist/crispy/browser/server/docs/swagger');

  if (!fs.existsSync(swaggerDocsDir)) {
    console.log('   ❌ Swagger 文档目录不存在');
    return false;
  }

  try {
    const adminDir = path.join(swaggerDocsDir, 'admin');
    const contentDir = path.join(swaggerDocsDir, 'content');

    let adminFiles = 0;
    let contentFiles = 0;

    if (fs.existsSync(adminDir)) {
      adminFiles = fs.readdirSync(adminDir).filter(f => f.endsWith('.ts')).length;
    }

    if (fs.existsSync(contentDir)) {
      contentFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts')).length;
    }

    console.log(`   Admin API 文档: ${adminFiles} 个文件`);
    console.log(`   Content API 文档: ${contentFiles} 个文件`);
    console.log(`   总计: ${adminFiles + contentFiles} 个文件`);

    return adminFiles > 0 && contentFiles > 0;

  } catch (error) {
    console.error('   ❌ 统计文件时出错:', error.message);
    return false;
  }
}

function testSwaggerConfigInBuild() {
  console.log('\n🧪 测试构建后的 Swagger 配置...');

  try {
    // 模拟生产环境
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.PORT = '4000';
    process.env.API_PREFIX = '/api';

    // 动态导入配置（模拟构建后的环境）
    const swaggerJsdoc = require('swagger-jsdoc');

    // 模拟构建后的路径配置
    const getSwaggerDocsPaths = (apiType) => {
      const basePath = './dist/crispy/browser/server/docs/swagger';
      return [
        `${basePath}/${apiType}/**/*.ts`,
        `${basePath}/${apiType}/**/*.js`
      ];
    };

    // Admin API 配置
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
      apis: getSwaggerDocsPaths('admin')
    };

    // Content API 配置
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
      apis: getSwaggerDocsPaths('content')
    };

    const adminSpecs = swaggerJsdoc(adminConfig);
    const contentSpecs = swaggerJsdoc(contentConfig);

    const adminPaths = Object.keys(adminSpecs.paths || {}).length;
    const contentPaths = Object.keys(contentSpecs.paths || {}).length;

    console.log(`   Admin API: ${adminPaths} 个路径`);
    console.log(`   Content API: ${contentPaths} 个路径`);

    // 恢复环境变量
    process.env.NODE_ENV = originalNodeEnv;

    return adminPaths > 0 && contentPaths > 0;

  } catch (error) {
    console.error('   ❌ 测试配置时出错:', error.message);
    console.error('   详细错误:', error.stack);
    return false;
  }
}

function generateBuildReport() {
  console.log('\n📋 生成构建报告...');

  const reportPath = path.join(__dirname, '../dist/swagger-build-report.json');
  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    buildStatus: 'success',
    swaggerDocs: {
      admin: {
        path: './dist/crispy/browser/server/docs/swagger/admin',
        files: 0
      },
      content: {
        path: './dist/crispy/browser/server/docs/swagger/content',
        files: 0
      }
    },
    recommendations: []
  };

  try {
    const adminDir = path.join(__dirname, '../dist/crispy/browser/server/docs/swagger/admin');
    const contentDir = path.join(__dirname, '../dist/crispy/browser/server/docs/swagger/content');

    if (fs.existsSync(adminDir)) {
      report.swaggerDocs.admin.files = fs.readdirSync(adminDir).filter(f => f.endsWith('.ts')).length;
    }

    if (fs.existsSync(contentDir)) {
      report.swaggerDocs.content.files = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts')).length;
    }

    // 添加建议
    if (report.swaggerDocs.admin.files === 0) {
      report.recommendations.push('Admin API 文档文件缺失，检查构建配置');
    }

    if (report.swaggerDocs.content.files === 0) {
      report.recommendations.push('Content API 文档文件缺失，检查构建配置');
    }

    if (report.recommendations.length === 0) {
      report.recommendations.push('所有 Swagger 文档文件已正确构建');
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`   报告已生成: ${reportPath}`);

    return true;

  } catch (error) {
    console.error('   ❌ 生成报告时出错:', error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Swagger 构建验证工具\n');

  const tests = [
    { name: '构建输出检查', test: checkBuildOutput },
    { name: '文档文件统计', test: countSwaggerFiles },
    { name: 'Swagger 配置测试', test: testSwaggerConfigInBuild },
    { name: '构建报告生成', test: generateBuildReport }
  ];

  const results = [];

  tests.forEach(({ name, test }) => {
    console.log(`🧪 ${name}...`);

    try {
      const success = test();
      results.push({ name, success });
      console.log(`${success ? '✅' : '❌'} ${name}${success ? '通过' : '失败'}`);
    } catch (error) {
      console.error(`❌ ${name}出错:`, error.message);
      results.push({ name, success: false });
    }
  });

  // 最终结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 验证结果汇总:');
  console.log('='.repeat(50));

  results.forEach(({ name, success }) => {
    console.log(`   ${success ? '✅' : '❌'} ${name}`);
  });

  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;

  console.log(`\n📈 通过率: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);

  if (passedTests === totalTests) {
    console.log('\n🎉 构建验证通过！Swagger 文档已正确构建。');
    console.log('\n🚀 可以启动生产服务器测试了：');
    console.log('   bun run serve:ssr:crispy');
  } else {
    console.log('\n🔧 请修复构建问题后重新验证。');

    if (results.find(r => r.name === '构建输出检查' && !r.success)) {
      console.log('\n💡 建议：');
      console.log('1. 检查 angular.json 中的 assets 配置');
      console.log('2. 确保构建命令正确执行');
      console.log('3. 验证 Swagger 文档源文件存在');
    }
  }

  return passedTests === totalTests;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  checkBuildOutput,
  countSwaggerFiles,
  testSwaggerConfigInBuild,
  generateBuildReport
};
