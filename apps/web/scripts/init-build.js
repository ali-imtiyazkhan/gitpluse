const { execSync } = require('child_process');

console.log('🏁 Initializing build process...');

try {
  // Check if we are in a git repository
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  
  console.log('📦 Updating submodules...');
  // Use try/catch specifically for git command to avoid failing the whole build if submodules aren't present
  try {
    execSync('git submodule update --init --recursive', { stdio: 'inherit' });
    console.log('✅ Submodules initialized.');
  } catch (e) {
    console.warn('⚠️  Submodule update failed or skipped. This is expected if submodules are not used in this environment.');
  }
} catch (e) {
  console.log('ℹ️  Not a git repository, skipping submodule initialization.');
}

console.log('🚀 Build initialization complete.');
process.exit(0);
