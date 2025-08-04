const fs = require('fs');
const path = require('path');

// Function to fix double extensions in a file
function fixDoubleExtensions(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix double extensions
    const doubleExtensionPatterns = [
      /\.js\.js['"]/g,
      /\.js\.js$/g,
      /\.vue\.js['"]/g,
      /\.vue\.js$/g
    ];

    for (const pattern of doubleExtensionPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          if (match.includes('.vue.js')) {
            return match.replace('.vue.js', '.vue');
          } else if (match.includes('.js.js')) {
            return match.replace('.js.js', '.js');
          }
          return match;
        });
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed double extensions in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all Vue files
function fixAllVueFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixAllVueFiles(filePath);
    } else if (file.endsWith('.vue')) {
      fixDoubleExtensions(filePath);
    }
  }
}

// Start fixing from multiple directories
const directories = ['pages', 'components', 'composables', 'stores'];

for (const dir of directories) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`🔧 Starting to fix double extensions in ${dir}...`);
    fixAllVueFiles(dirPath);
    console.log(`✅ Finished fixing double extensions in ${dir}!`);
  }
}

console.log('🎉 All double extensions have been fixed!'); 