const fs = require('fs');
const path = require('path');

// Function to fix double extensions in a file
function fixDoubleExtensions(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix double .js extensions
    const doubleExtensionPatterns = [
      /\.js\.js['"]/g,
      /\.js\.js$/g
    ];

    for (const pattern of doubleExtensionPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, '.js');
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

// Start fixing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('🔧 Starting to fix double extensions...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing double extensions!');
} else {
  console.error('❌ Pages directory not found!');
} 