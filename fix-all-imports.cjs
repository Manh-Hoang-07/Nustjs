const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix various import patterns that are missing file extensions
    const importPatterns = [
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

// Start fixing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('🔧 Starting to fix all imports...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing all imports!');
} else {
  console.error('❌ Pages directory not found!');
} 