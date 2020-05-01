module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  roots: [
    '<rootDir>/components',
    '<rootDir>/context',
    '<rootDir>/libs',
    '<rootDir>/pages',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
};
