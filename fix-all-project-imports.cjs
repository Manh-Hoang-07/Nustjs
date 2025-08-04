const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix all import patterns that are missing file extensions
    const importPatterns = [
      // Fix @/ imports (alias for root)
      { 
        pattern: /from\s+['"]@\/([^'"]+)['"]/g,
        replacement: "from '/$1.js'"
      },
      // Fix ~/ imports (alias for root)
      { 
        pattern: /from\s+['"]~\/([^'"]+)['"]/g,
        replacement: "from '/$1.js'"
      },
      // Fix relative imports without extensions
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/utils\/([^'"]+)['"]/g,
        replacement: "from '../../../utils/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/utils\/([^'"]+)['"]/g,
        replacement: "from '../../utils/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/utils\/([^'"]+)['"]/g,
        replacement: "from '../utils/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/composables\/([^'"]+)['"]/g,
        replacement: "from '../../../composables/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/composables\/([^'"]+)['"]/g,
        replacement: "from '../../composables/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/composables\/([^'"]+)['"]/g,
        replacement: "from '../composables/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/api\/([^'"]+)['"]/g,
        replacement: "from '../../../api/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/api\/([^'"]+)['"]/g,
        replacement: "from '../../api/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/api\/([^'"]+)['"]/g,
        replacement: "from '../api/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/constants\/([^'"]+)['"]/g,
        replacement: "from '../../../constants/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/constants\/([^'"]+)['"]/g,
        replacement: "from '../../constants/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/constants\/([^'"]+)['"]/g,
        replacement: "from '../constants/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/stores\/([^'"]+)['"]/g,
        replacement: "from '../../../stores/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/\.\.\/stores\/([^'"]+)['"]/g,
        replacement: "from '../../stores/$1.js'"
      },
      { 
        pattern: /from\s+['"]\.\.\/stores\/([^'"]+)['"]/g,
        replacement: "from '../stores/$1.js'"
      }
    ];

    for (const { pattern, replacement } of importPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in ${filePath}`);
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
      fixImports(filePath);
    }
  }
}

// Start fixing from multiple directories
const directories = ['pages', 'components', 'composables', 'stores'];
let totalFixed = 0;

for (const dir of directories) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`🔧 Starting to fix imports in ${dir}...`);
    fixAllVueFiles(dirPath);
    console.log(`✅ Finished fixing imports in ${dir}!`);
  }
}

console.log('🎉 All imports have been fixed!'); 