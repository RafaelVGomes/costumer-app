export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*-)+(spec|test|tests).[tj]s?(x)']
};
