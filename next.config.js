module.exports = {
  webpack: (config) => {
    return {
      ...config,
      node: {
        ...config.node,
        fs: 'empty',
      },
    };
  },
};
