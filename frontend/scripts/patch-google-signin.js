const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'node_modules', '@react-native-google-signin', 'google-signin', 'lib', 'module');

if (!fs.existsSync(baseDir)) {
  console.log('[patch-google-signin] Target directory not found, skipping patch.');
  process.exit(0);
}

const patches = [
  {
    file: path.join(baseDir, 'index.js'),
    transforms: [
      {
        from: /from\s+['"]\.\/signIn\/GoogleSignin(?:\.js)?['"]/g,
        to: "from './signIn/GoogleSignin.js'",
      },
      {
        from: /from\s+['"]\.\/errors\/errorCodes(?:\.js)?['"]/g,
        to: "from './errors/errorCodes.js'",
      },
      {
        from: /from\s+['"]\.\/buttons\/GoogleSigninButton(?:\.js)?['"]/g,
        to: "from './buttons/GoogleSigninButton.js'",
      },
    ],
  },
  {
    file: path.join(baseDir, 'translateNativeRejection.js'),
    transforms: [
      {
        from: /from\s+['"]\.\/errors\/errorCodes(?:\.js)?['"]/g,
        to: "from './errors/errorCodes.js'",
      },
    ],
  },
  {
    file: path.join(baseDir, 'signIn', 'GoogleSignin.js'),
    transforms: [
      {
        from: /from\s+['"]\.\.\/errors\/errorCodes(?:\.js)?['"]/g,
        to: "from '../errors/errorCodes.js'",
      },
    ],
  },
];

let totalPatched = 0;

for (const patch of patches) {
  if (fs.existsSync(patch.file)) {
    let content = fs.readFileSync(patch.file, 'utf8');
    let modified = false;

    for (const { from, to } of patch.transforms) {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(patch.file, content, 'utf8');
      console.log(`[patch-google-signin] Successfully patched: ${path.relative(baseDir, patch.file)}`);
      totalPatched++;
    }
  }
}

if (totalPatched > 0) {
  console.log(`[patch-google-signin] Patched ${totalPatched} file(s) for strict ESM compatibility.`);
} else {
  console.log('[patch-google-signin] All files already up to date.');
}
