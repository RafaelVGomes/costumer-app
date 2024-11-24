import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
  // transform: {
  //   '^.+\\.ts$': 'ts-jest',
  // },
  // transformIgnorePatterns: ['/node_modules/'],
};
