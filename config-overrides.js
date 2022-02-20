const { override, addWebpackAlias, overrideDevServer } = require('customize-cra');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

const devServerConfig = () => (config) => {
  return {
    ...config,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  };
};

module.exports = {
  webpack: override(
    addWebpackAlias({
      '@src': resolve('src'),
    })
  ),
  devServer: overrideDevServer(devServerConfig()),
};
