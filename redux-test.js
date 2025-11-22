try {
  console.log('Attempting to require @reduxjs/toolkit ...');
  const rtk = require('@reduxjs/toolkit');
  console.log('Loaded keys:', Object.keys(rtk));
} catch (e) {
  console.error('FAILED requiring @reduxjs/toolkit:', e.message);
  process.exit(1);
}
