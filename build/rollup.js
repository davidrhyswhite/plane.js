export default {
  entry: 'src/index.js',
  moduleName: 'plane',
  targets: [
    {
      dest: 'dist/plane.js',
      format: 'umd'
    },
    {
      dest: 'dist/plane.es.js',
      format: 'es'
    }
  ]
};
