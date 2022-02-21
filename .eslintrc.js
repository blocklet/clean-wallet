module.exports = {
  parser: 'babel-eslint',
  extends: '@arcblock/eslint-config',
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
    jest: true,
  },
  globals: {
    logger: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
