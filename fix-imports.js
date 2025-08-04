const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix ConfirmModal imports that are incorrectly named
    const importRegex = /import\s+ConfirmModal\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    let importCount = 0;

    while ((match = importRegex.exec(content)) !== null) {
      importCount++;
      const importPath = match[1];
      let newImportName = 'ConfirmModal';
      
      // Determine the correct import name based on the path
      if (importPath.includes('DataTable.vue')) {
        newImportName = 'DataTable';
      } else if (importPath.includes('Pagination.vue')) {
        newImportName = 'Pagination';
      } else if (importPath.includes('FormLayout.vue')) {
        newImportName = 'FormLayout';
      } else if (importPath.includes('MultipleSelect.vue')) {
        newImportName = 'MultipleSelect';
      } else if (importPath.includes('CKEditorUltimate.vue')) {
        newImportName = 'CKEditorUltimate';
      } else if (importPath.includes('ConfirmModal.vue')) {
        newImportName = 'ConfirmModal';
      } else {
        newImportName = 'Modal';
      }

      // Replace the import
      const oldImport = match[0];
      const newImport = `import ${newImportName} from '${importPath}'`;
      content = content.replace(oldImport, newImport);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${importCount} imports in ${filePath}`);
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
  console.log('🔧 Starting to fix import errors...');
  fixAllVueFiles(pagesDir);
  console.log('✅ Finished fixing imports!');
} else {
  console.error('❌ Pages directory not found!');
} 