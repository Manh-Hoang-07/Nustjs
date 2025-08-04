const fs = require('fs');
const path = require('path');

// Function to fix endpoints imports in a file
function fixEndpointsImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace ~/api/endpoints with absolute path
    const oldImport = "import endpoints from '~/api/endpoints'";
    const newImport = "import endpoints from '/api/endpoints.js'";
    
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
      modified = true;
      console.log(`✅ Fixed endpoints import in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
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
      fixEndpointsImports(filePath);
    }
  }
}

// Start fixing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('🔧 Starting to fix endpoints imports...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing endpoints imports!');
} else {
  console.error('❌ Pages directory not found!');
} 