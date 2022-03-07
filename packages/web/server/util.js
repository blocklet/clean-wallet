const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

const resolve = (dir) => {
  if (isDevelopment) {
    return path.join(__dirname, '../', dir);
  }

  return path.join(__dirname, '../../../', dir);
};

module.exports = { resolve };
