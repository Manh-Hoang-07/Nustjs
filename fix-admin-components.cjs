const fs = require('fs');
const path = require('path');

// Function to fix admin component imports in a file
function fixAdminComponentImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix all Admin component imports that have .js added to .vue files
    const adminComponentPatterns = [
      { 
        pattern: /from\s+['"]\/components\/Admin\/AdminTable\.vue\.js['"]/g,
        replacement: "from '/components/Admin/AdminTable.vue'"
      },
      { 
        pattern: /from\s+['"]\/components\/Admin\/AdminFilter\.vue\.js['"]/g,
        replacement: "from '/components/Admin/AdminFilter.vue'"
      },
      { 
        pattern: /from\s+['"]\/components\/Admin\/AdminFilterItem\.vue\.js['"]/g,
        replacement: "from '/components/Admin/AdminFilterItem.vue'"
      },
      { 
        pattern: /from\s+['"]\/components\/Core\/.*\.vue\.js['"]/g,
        replacement: (match) => match.replace('.vue.js', '.vue')
      }
    ];

    for (const { pattern, replacement } of adminComponentPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed admin component imports in ${filePath}`);
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
      fixAdminComponentImports(filePath);
    }
  }
}

// Start fixing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('🔧 Starting to fix admin component imports...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing admin component imports!');
} else {
  console.error('❌ Pages directory not found!');
} 