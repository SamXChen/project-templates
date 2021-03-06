const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const ConcatPlugin = require('webpack-concat-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')


const path = require('path')
const { HotModuleReplacementPlugin, EnvironmentPlugin } = require('webpack')
const {
    appPath,
    outputPath,
    viewsPathPrefix,
    SPAModulesPath,
    filesToConcatPath,
    copyWebpackPluginFromPath,
    remTemplatePath
} = require('./path')

const { ENV } = require('./const')

function getSplitChunksPlugin() {
    return {
        cacheGroups: {
            react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'async'
            },
            lodash: {
                test: /[\\/]node_modules[\\/](lodash)[\\/]/,
                name: 'lodash',
                chunks: 'async'
            }
        }
    }
}

/**
 * 获取配置好的 CleanWebpackPlugin
 */
function getCleanWebpackPlugin() {
    // the path(s) that should be cleaned
    const pathsToClean = [ 'public/views/spa-modules', 'public/static/spa-modules' ]

    // the clean options to use
    const cleanOptions = {
        root: appPath
    }
    return new CleanWebpackPlugin(pathsToClean, cleanOptions)
}
/**
 * 获取 pug 的 htmlWebpackPlugin
 * @param {string} entryKey 入口 key, 如 traning-camp-v2
 */
function getJadeHtmlWebpackPlugin(entryKey) {
    if (!entryKey || typeof entryKey !== 'string') {
        throw "\ngetJadeHtmlWebpackPlugin's param: entryKey 不能为空！\n\n"
    }
    return new HtmlWebpackPlugin({
        template: path.resolve(SPAModulesPath, `${entryKey}/views/index.pug`),
        alwaysWriteToDisk: true,
        filename: `${viewsPathPrefix}${entryKey}/views/index.pug`,
        chunks: [ entryKey ]
    })
}

function getHMRPlugin() {
    return new HotModuleReplacementPlugin(
        {
            // Options...
        }
    )
}

function getHtmlWebpackHarddiskPlugin() {
    return new HtmlWebpackHarddiskPlugin() // 在全用 webpack-dev-server 的时候， jade 文件没有生成在内存里。
}

function getHtmlWebpackPugPlugin() {
    return new HtmlWebpackPugPlugin()
}

/**
 * rem pug
 */
function getRemHtmlWebpackPlugin() {
    return new HtmlWebpackPlugin({
        template: remTemplatePath,
        alwaysWriteToDisk: true,
        filename: `${viewsPathPrefix}commons/views/rem.pug`
    })
}

/**
 * 获取配置好的 ConcatPlugin
 * @param {num} env development or production
 */
function getConcatPlugin(env) {
    if (env === undefined) {
        throw "\ngetConcatPlugin's param: env 不能为空！\n\n"
    }
    const isProduction = env === ENV.production
    const fileName = isProduction ? 'lib.[hash].js' : 'lib.js'
    return new ConcatPlugin({
        uglify: isProduction,
        outputPath: 'commons/libs',
        fileName: fileName,
        filesToConcat: [ filesToConcatPath ]
    })
}

/**
 * 复制插件
 */
function getCopyWebpackPlugin() {
    return new CopyWebpackPlugin(
        [
            {
                from: copyWebpackPluginFromPath,
                to: outputPath
            }
        ],
        {
            context: SPAModulesPath
        }
    )
}

/**
 * 获取 ExtractTextPlugin
 */
function getMiniCssExtractPlugin() {
    return new MiniCssExtractPlugin({
        filename: '[name]/css/[id]-style-[contenthash].css'
    })
}

/**
 * 获取 EnvironmentPlugin
 * @param {enum} env development or production
 */
function getEnvironmentPlugin(env) {
    if (env === undefined) {
        throw "\ngetEnvironmentPlugin's param: env 不能为空！\n\n"
    }
    const isProduction = env === ENV.production
    return new EnvironmentPlugin({
        NODE_ENV: isProduction ? env : ENV.development,
        DEBUG: isProduction ? false : true
    })
}

/**
 * 获取 UglifyJsPlugin
 */
function getUglifyJsPlugin() {
    return new TerserPlugin({
        terserOptions: {
        output: {
            comments: false,
        },
        extractComments: false,
        },
    })
}

/**
 * 获取 mini css 插件
 */
function getOptimizeCSSAssetsPlugin() {
    return new OptimizeCSSAssetsPlugin({})
}

/**
 * 获取 BundleAnalyzerPlugin
 */
function getBundleAnalyzerPlugin() {
    return new BundleAnalyzerPlugin({
        analyzerPort: 8090
    })
}

/**
 * 获取 LodashModuleReplacementPlugin
 * @param {object} options 创建这个实例时的 options, 具体参考 https://github.com/lodash/lodash-webpack-plugin
 */
function getLodashModuleReplacementPlugin(options = {}) {
    return new LodashModuleReplacementPlugin({
        ...options,
        paths: true
    })
}

/**
 * 提高冷启动打包速度
 */
function getHardSourcePlugin() {
    return new HardSourceWebpackPlugin({
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 50 * 1024 * 1024
      },
    })
  }

module.exports = {
    getCleanWebpackPlugin,
    getJadeHtmlWebpackPlugin,
    getHMRPlugin,
    getHtmlWebpackHarddiskPlugin,
    getHtmlWebpackPugPlugin,
    getMiniCssExtractPlugin,
    getEnvironmentPlugin,
    getUglifyJsPlugin,
    getOptimizeCSSAssetsPlugin,
    getLodashModuleReplacementPlugin,
    getBundleAnalyzerPlugin,
    getSplitChunksPlugin,
    getCopyWebpackPlugin,
    getConcatPlugin,
    getRemHtmlWebpackPlugin,
    getHardSourcePlugin,
}
