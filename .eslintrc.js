module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'import/no-dynamic-require': 'off',
    'no-underscore-dangle': [2, { allow: ['foo_', '_id'] }],
    'func-names': ['error', 'never', { generators: 'as-needed' }],
  },
};
