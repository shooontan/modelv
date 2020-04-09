const withTM = require('next-transpile-modules')(['three/examples/jsm']);

module.exports = withTM({
  webpack: (config) => {
    return {
      ...config,
      node: {
        ...config.node,
        fs: 'empty',
      },
    };
  },
});
