require('dotenv').config();
const withTM = require('next-transpile-modules')(['three/examples/jsm']);

const isDev = process.env.NODE_ENV !== 'production';

module.exports = withTM({
  env: {
    APP_URL: process.env.APP_URL,
    APP_TITLE: process.env.APP_TITLE,
    APP_DESCRIPTION: process.env.APP_DESCRIPTION,
    GOOGLE_ANALYTICS_MEASUREMENT_ID: isDev
      ? 'UA-000000000-0'
      : process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
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
