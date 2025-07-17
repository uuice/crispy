const fs = require('fs');
const path = require('path');

// Patterns to replace
const patterns = [
  // Numeric parameters that need !== undefined
  {
    regex: /(\w+): req\.query\['([^']+)'\] \? parseInt\(req\.query\['([^']+)'\] as string\) : undefined,/g,
    replacement: '$1: req.query[\'$2\'] !== undefined ? parseInt(req.query[\'$3\'] as string) : undefined,'
  },
  // Time parameters that need !== undefined
  {
    regex: /(\w+): req\.query\['([^']+)'\] \? parseInt\(req\.query\['([^']+)'\] as string\)\s*\n\s*: undefined,/g,
    replacement: '$1: req.query[\'$2\'] !== undefined ? parseInt(req.query[\'$3\'] as string)\n        : undefined,'
  },
  // Boolean parameters that need !== undefined
  {
    regex: /(\w+): req\.query\['([^']+)'\] \? parseInt\(req\.query\['([^']+)'\] as string\) : undefined,/g,
    replacement: '$1: req.query[\'$2\'] !== undefined ? parseInt(req.query[\'$3\'] as string) : undefined,'
  }
];

// Directories to process
const directories = [
  'src/server/routes/admin',
  'src/server/routes/content'
];

// Files to skip (if any)
const skipFiles = [];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changed = false;

    // Apply all patterns
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.regex, pattern.replacement);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  let totalFiles = 0;
  let fixedFiles = 0;

  files.forEach(file => {
    if (file.endsWith('.ts') && !skipFiles.includes(file)) {
      totalFiles++;
      const filePath = path.join(dirPath, file);
      if (fixFile(filePath)) {
        fixedFiles++;
      }
    }
  });

  console.log(`\n📊 Summary for ${dirPath}:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Fixed files: ${fixedFiles}`);
  console.log(`   Skipped files: ${totalFiles - fixedFiles}`);
}

// Main execution
console.log('🔧 Starting to fix undefined checks in route files...\n');

directories.forEach(dir => {
  console.log(`📁 Processing directory: ${dir}`);
  processDirectory(dir);
  console.log('');
});

console.log('🎉 Finished processing all route files!');
