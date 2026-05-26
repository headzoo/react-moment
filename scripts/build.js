const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const LIBRARY_NAME = 'react-moment';
const DIST_DIR = path.resolve(__dirname, '../dist');
const ENTRY = path.resolve(__dirname, '../src/index.ts');

const sharedOptions = {
  entryPoints: [ENTRY],
  bundle: true,
  minify: true,
  external: ['react', 'moment'],
  target: ['es2018'],
  jsx: 'automatic',
  legalComments: 'none',
  mainFields: ['module', 'main'],
};

async function buildUmd() {
  const result = await esbuild.build({
    ...sharedOptions,
    format: 'iife',
    globalName: '__REACT_MOMENT__',
    platform: 'browser',
    write: false,
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

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'index.umd.js'), umd);
}

async function build() {
  fs.mkdirSync(DIST_DIR, { recursive: true });

  await Promise.all([
    esbuild.build({
      ...sharedOptions,
      format: 'cjs',
      platform: 'neutral',
      outfile: path.join(DIST_DIR, 'index.cjs.js'),
    }),
    esbuild.build({
      ...sharedOptions,
      format: 'esm',
      platform: 'neutral',
      outfile: path.join(DIST_DIR, 'index.mjs'),
    }),
    buildUmd(),
  ]);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
