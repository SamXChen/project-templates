const webpack = require('webpack');
const path = require('path');
const { outputPath, publicPath } = require('./path');

const {
  getFontsLoader,
  getImagesLoader,
  getStyleLoader,
  getBabelLoader,
} = require('./loaders');

const {
  getHMRPlugin,
  getEnvironmentPlugin,
  getLodashModuleReplacementPlugin,
  getSplitChunksPlugin,
  getMiniCssExtractPlugin,
} = require('./plugins');

const { ENV } = require('./const');

/**
 * 获取打包业务主入口的默认配置
 * @param {enum} env development or production
 * @return {object} webpack config
 */
function getOriginMainBundleWebpackConfig(env) {
  if(env === undefined) {
    throw '\ngetOriginMainBundleWebpackConfig\'s param: env 不能为空！\n\n';
  }

  const isProduction = env === ENV.production;
  const filename = '[name]/js/[name].js';

  let finalPublicPath = publicPath;
  if (process.env.CDN_ROOT) {
    finalPublicPath = `${process.env.CDN_ROOT}${publicPath}`;
  }

  const originWebpackConfig = {
    entry: {},
    mode: 'none',
    output: {
      filename: filename,
      path: outputPath,
      publicPath: finalPublicPath,
      libraryTarget: 'commonjs2',
    },

    optimization: {},

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
      rules: []
    },
    plugins: []
  };

  if(!isProduction) {
    // Enable sourcemaps for debugging webpack's output.
    originWebpackConfig.devtool = 'cheap-module-eval-source-map';
    originWebpackConfig.cache = true;
  }

  return originWebpackConfig;
}

/**
 * 获取打包业务主入口的相关配置
 * @param {enum} env development or production
 * @param {string} entryKey 入口 key, 如 traning-camp-v2
 * @param {number} entryIndex 多入口同时打包时，当前入口的 index
 * @param {object} entries 处理过的入口配置
 * @return {object} webpack config
 */
function getBundlesWebpackConfig(env, entries) {
  const webpackConfig = getOriginMainBundleWebpackConfig(env);
  const isProduction = env === ENV.production;
  for(let entryKey in entries){
    const entry = entries[entryKey];
    const optArr = [
      entry.path,
    ];
    
    webpackConfig.entry = {
      ...webpackConfig.entry,
      [entryKey]: optArr
    };
  }

  webpackConfig.module.rules = [
    getBabelLoader(env),
    getStyleLoader(env),
    getImagesLoader(env),
    getFontsLoader(env),
  ];
  
  webpackConfig.plugins.push(getLodashModuleReplacementPlugin());

  webpackConfig.optimization.splitChunks = getSplitChunksPlugin();
  webpackConfig.optimization.chunkIds = 'named';

  webpackConfig.plugins.push(getMiniCssExtractPlugin());

  if(isProduction) {
    webpackConfig.plugins.push(getEnvironmentPlugin(env));

    webpackConfig.optimization.moduleIds = 'hashed';

  } else {
    // webpackConfig.plugins.push(getHMRPlugin());
  }
  return webpackConfig;
}


module.exports = {
  getBundlesWebpackConfig
};
