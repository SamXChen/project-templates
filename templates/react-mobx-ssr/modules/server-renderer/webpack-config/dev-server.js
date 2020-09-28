const { devServerContentBase, outputPath, publicPath } = require('./path');

function getDevServerConfig() {
  return {
    contentBase: [
      devServerContentBase,
      outputPath
    ],
    hot: true,
    proxy: {
      '*': 'http://127.0.0.1:7001'
    },
    allowedHosts: [
      '.test.github.com'
    ],
    publicPath: publicPath,
    host: '0.0.0.0',
    port: 8080
  };
}

module.exports = {
  getDevServerConfig
};