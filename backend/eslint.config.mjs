export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './backend/tsconfig.json'
      }
    }
  }
};
