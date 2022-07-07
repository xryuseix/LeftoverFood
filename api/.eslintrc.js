module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: "./tsconfig.json" 
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}
