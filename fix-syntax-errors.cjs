const fs = require('fs');
const path = require('path');

// Function to fix syntax errors in a file
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix unterminated string constants in import statements
    const syntaxPatterns = [
      // Fix import statements missing closing quote
      { 
        pattern: /import\s+.*from\s+['"][^'"]*\.js\s*$/gm,
        replacement: (match) => match + "'"
      },
      { 
        pattern: /import\s+.*from\s+['"][^'"]*\.js\s*\n/gm,
        replacement: (match) => match.replace(/\s*\n$/, "'\n")
      }
    ];

    for (const { pattern, replacement } of syntaxPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed syntax errors in ${filePath}`);
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
      fixSyntaxErrors(filePath);
    }
  }
}

// Start fixing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('🔧 Starting to fix syntax errors...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing syntax errors!');
} else {
  console.error('❌ Pages directory not found!');
} 