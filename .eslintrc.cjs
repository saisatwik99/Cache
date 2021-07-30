module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'max-len': ['error', { code: 120 }],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 0,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 0
  }
};
