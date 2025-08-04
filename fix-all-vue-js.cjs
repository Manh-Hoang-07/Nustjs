const fs = require('fs');
const path = require('path');

// Function to fix all .vue.js imports in a file
function fixVueJsImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix all .vue.js imports to .vue
    const vueJsPattern = /from\s+['"]([^'"]*\.vue)\.js['"]/g;
    
    if (vueJsPattern.test(content)) {
      content = content.replace(vueJsPattern, (match, p1) => {
        return `from '${p1}'`;
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed .vue.js imports in ${filePath}`);
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
      fixVueJsImports(filePath);
    }
  }
}

// Start fixing from multiple directories
const directories = ['pages', 'components', 'composables', 'stores'];

for (const dir of directories) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`🔧 Starting to fix .vue.js imports in ${dir}...`);
    fixAllVueFiles(dirPath);
    console.log(`✅ Finished fixing .vue.js imports in ${dir}!`);
  }
}

console.log('🎉 All .vue.js imports have been fixed!'); 