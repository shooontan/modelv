module.exports = {
  presets: [
    [
      'next/babel',
      {
        'styled-jsx': {
          plugins: ['styled-jsx-plugin-sass'],
        },
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
  ],
};
