const withTM = require('next-transpile-modules')(['three/examples/jsm']);

module.exports = withTM({
  env: {
    APP_URL: 'https://modelv.mahoroi.com/',
    APP_TITLE: 'ModelV.',
    APP_DESCRIPTION: 'webカメラとブラウザでバーチャルモデルになれるwebアプリ',
  },
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
