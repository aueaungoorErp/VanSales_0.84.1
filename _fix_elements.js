const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/campaign/container/CTListItems.js',
  'src/pages/campaign/container/CTDetailListItems.js',
  'src/pages/customer/container/CTListItems.js',
  'src/pages/customer/container/CTChoices.js',
  'src/pages/stock/container/CTListItems.js',
  'src/pages/stock/container/drop-point/CTListItems.js',
  'src/pages/order/container/CTListItems.js',
  'src/pages/order/bill/container/CTListItems.js',
  'src/pages/order/check-stock/container/CTListItems.js',
  'src/pages/order/outstanding-balance/container/CTListItems.js',
  'src/pages/order/outstanding-balance/key-step/container/CTListItems.js',
  'src/pages/order/outstanding-balance/create-step/presenter/Form.js',
  'src/pages/order/survey/container/CTListItems.js',
  'src/pages/order/sales/container/CTSummaryListItems.js',
  'src/pages/order/sales/presenter/PaymentForm.js',
  'src/pages/product/container/CTListItems.js',
  'src/pages/product/container/CTDetailFormSCR.js',
  'src/pages/ktb/QRCODE.js',
  'src/pages/paperless/presenter/DetailForm.js',
];

const elementsPath = 'src/component/elements';

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP (not found):', filePath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  
  const fileDir = path.dirname(filePath);
  let relPath = path.relative(fileDir, elementsPath).replace(/\\/g, '/');
  if (!relPath.startsWith('.')) relPath = './' + relPath;
  
  const regex = /from\s*['"]react-native-elements['"]/g;
  if (regex.test(content)) {
    content = content.replace(/from\s*['"]react-native-elements['"]/g, "from '" + relPath + "'");
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('DONE:', filePath, '->', relPath);
  } else {
    console.log('SKIP (no import):', filePath);
  }
});

// Remove commented imports
const commentFiles = [
  'src/pages/customer/presenter/ProfileDetailForm.js',
  'src/component/camera/ICamera.js',
];
commentFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  const newContent = content.replace(/\/\/\s*import\s*\{[^}]+\}\s*from\s*['"]react-native-elements['"];?\n?/g, '');
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log('Removed comment import:', filePath);
  }
});

console.log('\nAll done!');
