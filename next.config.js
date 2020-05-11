require('dotenv').config();
const withTM = require('next-transpile-modules')(['three/examples/jsm']);

module.exports = withTM({
  env: {
    APP_URL: process.env.APP_URL,
    APP_TITLE: process.env.APP_TITLE,
    APP_DESCRIPTION: process.env.APP_DESCRIPTION,
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
