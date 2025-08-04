const fs = require('fs');
const path = require('path');

// Function để tìm tất cả file .vue và .js
function findFiles(dir, extensions = ['.vue', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Bỏ qua node_modules và .git
      if (file !== 'node_modules' && file !== '.git' && !file.startsWith('.')) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function để sửa import paths
function fixImportPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Sửa import từ '/utils/' thành đường dẫn tương đối
  const utilsRegex = /from\s+['"]\/utils\/([^'"]+)['"]/g;
  content = content.replace(utilsRegex, (match, utilPath) => {
    modified = true;
    // Tính đường dẫn tương đối từ file hiện tại đến utils
    const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'utils')).replace(/\\/g, '/');
    return `from '${relativePath}/${utilPath}'`;
  });
  
  // Sửa import từ '/api/' thành đường dẫn tương đối
  const apiRegex = /from\s+['"]\/api\/([^'"]+)['"]/g;
  content = content.replace(apiRegex, (match, apiPath) => {
    modified = true;
    // Tính đường dẫn tương đối từ file hiện tại đến api
    const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'api')).replace(/\\/g, '/');
    return `from '${relativePath}/${apiPath}'`;
  });
  
  // Sửa import từ '/constants/' thành đường dẫn tương đối
  const constantsRegex = /from\s+['"]\/constants\/([^'"]+)['"]/g;
  content = content.replace(constantsRegex, (match, constantsPath) => {
    modified = true;
    // Tính đường dẫn tương đối từ file hiện tại đến constants
    const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'constants')).replace(/\\/g, '/');
    return `from '${relativePath}/${constantsPath}'`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

// Main execution
console.log('Fixing import paths...');
const files = findFiles('.');
files.forEach(fixImportPaths);
console.log('Done!'); 