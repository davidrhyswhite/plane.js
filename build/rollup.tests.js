import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'test/**/*.js',
  plugins: [
    multiEntry()
  ],
  format: 'cjs',
  external: ['mocha', 'chai', 'sinon'],
  dest: 'dist/plane.tests.js'
};
