#!/usr/bin/env node

/**
 * 调试 Swagger 文档路径问题
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function debugPaths() {
  console.log('🔍 调试 Swagger 文档路径...\n');
  
  // 当前工作目录
  const cwd = process.cwd();
  console.log(`当前工作目录: ${cwd}`);
  
  // 检查可能的路径
  const possiblePaths = [
    './browser/server/docs/swagger',
    './dist/crispy/browser/server/docs/swagger',
    path.join(cwd, 'browser/server/docs/swagger'),
    path.join(cwd, 'dist/crispy/browser/server/docs/swagger')
  ];
  
  console.log('\n📁 检查可能的 Swagger 文档路径:');
  possiblePaths.forEach(testPath => {
    const exists = fs.existsSync(testPath);
    console.log(`   ${exists ? '✅' : '❌'} ${testPath}`);
    
    if (exists) {
      try {
        const adminPath = path.join(testPath, 'admin');
        const contentPath = path.join(testPath, 'content');
        
        const adminExists = fs.existsSync(adminPath);
        const contentExists = fs.existsSync(contentPath);
        
        console.log(`      Admin: ${adminExists ? '✅' : '❌'} ${adminPath}`);
        console.log(`      Content: ${contentExists ? '✅' : '❌'} ${contentPath}`);
        
        if (adminExists) {
          const adminFiles = fs.readdirSync(adminPath).filter(f => f.endsWith('.ts'));
          console.log(`      Admin 文件数: ${adminFiles.length}`);
        }
        
        if (contentExists) {
          const contentFiles = fs.readdirSync(contentPath).filter(f => f.endsWith('.ts'));
          console.log(`      Content 文件数: ${contentFiles.length}`);
        }
      } catch (error) {
        console.log(`      ❌ 读取子目录失败: ${error.message}`);
      }
    }
  });
}

function testGlobPatterns() {
  console.log('\n🔍 测试 Glob 模式匹配...\n');
  
  const patterns = [
    './browser/server/docs/swagger/admin/**/*.ts',
    './dist/crispy/browser/server/docs/swagger/admin/**/*.ts',
    path.join(process.cwd(), 'browser/server/docs/swagger/admin/**/*.ts'),
    path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger/admin/**/*.ts')
  ];
  
  patterns.forEach(pattern => {
    try {
      const files = glob.sync(pattern);
      console.log(`模式: ${pattern}`);
      console.log(`匹配文件数: ${files.length}`);
      if (files.length > 0) {
        console.log(`示例文件: ${files.slice(0, 3).join(', ')}`);
      }
      console.log('');
    } catch (error) {
      console.log(`模式: ${pattern}`);
      console.log(`❌ 错误: ${error.message}\n`);
    }
  });
}

function simulateSwaggerConfig() {
  console.log('🧪 模拟 Swagger 配置加载...\n');
  
  // 模拟生产环境
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  
  try {
    const swaggerJsdoc = require('swagger-jsdoc');
    
    // 测试不同的路径配置
    const pathConfigs = [
      {
        name: '相对路径 (./browser/...)',
        paths: ['./browser/server/docs/swagger/admin/**/*.ts']
      },
      {
        name: '绝对路径 (process.cwd() + browser/...)',
        paths: [path.join(process.cwd(), 'browser/server/docs/swagger/admin/**/*.ts')]
      },
      {
        name: '完整路径 (dist/crispy/browser/...)',
        paths: [path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger/admin/**/*.ts')]
      }
    ];
    
    pathConfigs.forEach(config => {
      console.log(`测试配置: ${config.name}`);
      
      const swaggerConfig = {
        definition: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' }
        },
        apis: config.paths
      };
      
      try {
        const specs = swaggerJsdoc(swaggerConfig);
        const pathCount = Object.keys(specs.paths || {}).length;
        console.log(`   结果: ${pathCount} 个 API 路径`);
        
        if (pathCount > 0) {
          const samplePaths = Object.keys(specs.paths).slice(0, 3);
          console.log(`   示例路径: ${samplePaths.join(', ')}`);
        }
      } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
      }
      
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ 模拟配置失败:', error.message);
  } finally {
    // 恢复环境变量
    process.env.NODE_ENV = originalNodeEnv;
  }
}

function checkFileContents() {
  console.log('📄 检查文档文件内容...\n');
  
  const swaggerDir = path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger');
  
  if (!fs.existsSync(swaggerDir)) {
    console.log('❌ Swagger 文档目录不存在');
    return;
  }
  
  const adminDir = path.join(swaggerDir, 'admin');
  const contentDir = path.join(swaggerDir, 'content');
  
  [
    { name: 'Admin', dir: adminDir },
    { name: 'Content', dir: contentDir }
  ].forEach(({ name, dir }) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
      console.log(`${name} API 文档:`);
      
      files.slice(0, 3).forEach(file => {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const hasSwaggerComments = content.includes('@swagger');
        const linesCount = content.split('\n').length;
        
        console.log(`   📄 ${file}: ${linesCount} 行, ${hasSwaggerComments ? '包含' : '不包含'} @swagger 注释`);
      });
      
      if (files.length > 3) {
        console.log(`   ... 还有 ${files.length - 3} 个文件`);
      }
      
      console.log('');
    } else {
      console.log(`❌ ${name} 文档目录不存在: ${dir}\n`);
    }
  });
}

function generateSolution() {
  console.log('💡 解决方案建议:\n');
  
  const swaggerDir = path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger');
  const exists = fs.existsSync(swaggerDir);
  
  if (exists) {
    console.log('✅ Swagger 文档文件存在，问题可能在路径解析');
    console.log('建议解决方案:');
    console.log('1. 使用绝对路径而不是相对路径');
    console.log('2. 在服务器启动时验证文档路径');
    console.log('3. 添加路径调试日志');
    
    console.log('\n推荐的路径配置:');
    console.log(`const swaggerBasePath = path.join(process.cwd(), 'dist/crispy/browser/server/docs/swagger');`);
    console.log(`const adminPaths = path.join(swaggerBasePath, 'admin/**/*.ts');`);
    
  } else {
    console.log('❌ Swagger 文档文件不存在');
    console.log('建议解决方案:');
    console.log('1. 检查构建配置 (angular.json)');
    console.log('2. 确保文档文件被正确复制');
    console.log('3. 验证构建过程');
  }
}

function main() {
  console.log('🚀 Swagger 路径调试工具\n');
  
  debugPaths();
  testGlobPatterns();
  simulateSwaggerConfig();
  checkFileContents();
  generateSolution();
}

if (require.main === module) {
  main();
}

module.exports = {
  debugPaths,
  testGlobPatterns,
  simulateSwaggerConfig,
  checkFileContents,
  generateSolution
};
