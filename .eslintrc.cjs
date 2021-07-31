module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'max-len': ['error', { code: 120 }],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 0,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 0,
    'import/extensions': [
      'error',
      'ignorePackages'
    ]
  }
};
