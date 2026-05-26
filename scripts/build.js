const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const LIBRARY_NAME = 'react-moment';
const OUT_FILE = path.resolve(__dirname, '../dist/index.js');

async function build() {
  const result = await esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/index.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: '__REACT_MOMENT__',
    external: ['react', 'moment'],
    platform: 'browser',
    target: ['es2018'],
    jsx: 'automatic',
    write: false,
    legalComments: 'none',
  });

  const iifeBody = result.outputFiles[0].text.trim();
  const umd = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react', 'moment'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('react'), require('moment'));
  } else {
    root['${LIBRARY_NAME}'] = factory(root.react, root.moment);
  }
}(typeof self !== 'undefined' ? self : this, function (react, moment) {
  ${iifeBody};
  return __REACT_MOMENT__;
}));
`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, umd);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
