const gulp = require('gulp');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const {
  getBundlesWebpackConfig
} = require('./webpack-config/webpack.config.js');

const {
  getEntries: getSPAEntries
} = require('./webpack-config/utils');
const {
  SPAModulesPath
} = require('./webpack-config/path');
const {
  getDevServerConfig
} = require('./webpack-config/dev-server');

const customEntry = require('./webpack-config/custom-entry');

const {
  ENV
} = require('./webpack-config/const');

/**
 * 打包业务主入口
 * @param {enum} env development or production
 * @param {object} entries 处理过的入口配置
 * @return {object} webpack config
 */
const packBundles = (env, entries) => {
  const webpackConfig = getBundlesWebpackConfig(env, entries);
  return new Promise((resolve, reject) => {
    if (env === ENV.development) {
      try {
        const compiler = webpack(webpackConfig);
        const devServerOptions = Object.assign({}, getDevServerConfig(), {
          stats: {
            colors: true
          }
        });
        const server = new WebpackDevServer(compiler, devServerOptions);
        server.listen(8080, '0.0.0.0', () => {
          console.log('Starting server on http://0.0.0.0:8080');
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    } else {
      webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error('gulp watch error: ', err);
          reject();
        }
        console.log('stats: ', stats.toString({
          colors: true
        }));
        resolve();
      });
    }
  });
}

/**
 * 生成打包流程
 * @param {enum} env development or production
 * @return {function} 返回 async function
 */
const buildingWorkflow = (env) => {
  /**
   * 执行打包流程
   * @param {object} entries 处理过的入口配置
   */
  return async (entries) => {
    await packBundles(env, entries);
  }
}

/**
 * 生成打包流程
 * @param {enum} env development or production
 */
const genBuilddingWorkflow = async (env) => {
  let entries;
  switch (env) {
    case ENV.development:
      entries = getSPAEntries(SPAModulesPath, customEntry);
      break;
    case ENV.production:
      entries = getSPAEntries(SPAModulesPath);
      break;
    default:
      throw '\ngenBuilddingWorkflow\'s param: env should be one of "development", "production", \n';
  }
  await buildingWorkflow(env)(entries);
}

/**
 * 开发打包
 */
gulp.task('watch', async () => {
  await genBuilddingWorkflow(ENV.development);
});

/**
 * 线上打包
 */
gulp.task('build', async () => {
  await genBuilddingWorkflow(ENV.production);
});
