const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');

const LIBRARY_NAME = 'react-moment';
const DIST_DIR = path.resolve(__dirname, '../dist');
const ENTRY = path.resolve(__dirname, '../src/index.ts');
const LICENSE_BANNER = `/*! ${pkg.name} v${pkg.version} | Copyright (c) 2017 Sean Hickey | MIT License */`;

const DURATION_FORMAT_STRING_THROW = 'throw"Moment Duration Format init cannot find moment instance."';
const DURATION_FORMAT_ERROR_THROW = 'throw new Error("Moment Duration Format init cannot find moment instance.")';

function patchDurationFormatInit(source) {
  return source.replaceAll(DURATION_FORMAT_STRING_THROW, DURATION_FORMAT_ERROR_THROW);
}

function writePatchedFile(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, patchDurationFormatInit(source));
}

const sharedOptions = {
  entryPoints: [ENTRY],
  bundle: true,
  minify: true,
  external: ['react', 'moment', 'moment-duration-format'],
  target: ['es2018'],
  jsx: 'automatic',
  legalComments: 'inline',
  banner: {
    js: LICENSE_BANNER,
  },
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
    define(['react', 'moment', 'moment-duration-format'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('react'),
      require('moment'),
      require('moment-duration-format')
    );
  } else {
    root['${LIBRARY_NAME}'] = factory(root.React, root.moment);
  }
}(typeof self !== 'undefined' ? self : this, function (react, moment) {
  ${iifeBody};
  return __REACT_MOMENT__;
}));
`;

  fs.mkdirSync(DIST_DIR, { recursive: true });
  writePatchedFile(path.join(DIST_DIR, 'index.umd.js'), umd);
}

async function build() {
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const [cjsResult, esmResult] = await Promise.all([
    esbuild.build({
      ...sharedOptions,
      format: 'cjs',
      platform: 'neutral',
      write: false,
    }),
    esbuild.build({
      ...sharedOptions,
      format: 'esm',
      platform: 'neutral',
      write: false,
    }),
    buildUmd(),
  ]);

  writePatchedFile(
    path.join(DIST_DIR, 'index.cjs.js'),
    cjsResult.outputFiles[0].text
  );
  writePatchedFile(
    path.join(DIST_DIR, 'index.mjs'),
    esmResult.outputFiles[0].text
  );
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
