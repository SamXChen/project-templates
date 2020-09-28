const postcssAutoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const { ENV } = require('./const')
const { SPAModulesPath } = require('./path')
const babelOptions = require('../babel.config')
const loader = require('sass-loader')

const autoprefix = [
    'last 10 versions',
    'Chrome >= 42',
    'ff >= 38',
    'Safari >= 7',
    'Opera >= 29',
    'iOS >= 7.1',
    'ie_mob >= 10',
    'Android >= 4.4',
    'and_uc >= 9.9',
]

/**
 * 获取 webpack module.rules 的 imagesLoader
 * @param {enum} env development or production
 */
function getImagesLoader(env) {
    if (env === undefined) {
        throw "\ngetImagesLoader's param: env 不能为空！\n\n"
    }
    const isProduction = env === ENV.production
    const name = isProduction ? `[path][name]-[hash:8].[ext]` : `[path][name].[ext]`
    return {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: name,
                },
            },
        ],
    }
}

/**
 * 获取 webpack module.rules 的 fontsLoader
 * @param {enum} env development or production
 */
function getFontsLoader(env) {
    if (env === undefined) {
        throw "\ngetImagesLoader's param: env 不能为空！\n\n"
    }

    const name = `[path][name]-[hash:8].[ext]`
    return {
        test: /\.(eot|svg|ttf|woff|woff2|wav)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    prefix: 'font/',
                    name: name,
                },
            },
        ],
    }
}

/**
 * 获取 webpack module.rules 的 样式处理 loader
 * @param {enum} env development or production
 */
function getStyleLoader(env) {
    if (env === undefined) {
        throw "\ngetStyleLoader's param: env 不能为空！\n\n"
    }

    const isProduction = env === ENV.production

    const loaders = [
        {
            loader: 'css-loader',
            options: {
                context: path.resolve(__dirname, '../../../'),
                localIdentName: '[name]_[local]_[hash:base64:5]',
                sourceMap: false,
                importLoaders: 1,
                modules: true
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: [
                    postcssAutoprefixer({
                        overrideBrowserslist: autoprefix
                    }),
                    px2rem({
                        remUnit: 75
                    })
                ],
                sourceMap: false
            }
        },
        {
            loader: 'resolve-url-loader',
            options: {
                root: SPAModulesPath
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                sourceMapContents: false
            }
        }
    ]

    if (isProduction) {
        return {
            test: /\.(scss|css)$/,
            use: [ MiniCssExtractPlugin.loader, ...loaders ]
        }
    } else {
        return {
            test: /\.(scss|css)$/,
            use: [
                {
                    loader: 'style-loader'
                },
                ...loaders
            ]
        }
    }
}

/**
 * @description
 * 处理 Antd 组件库中使用 less 编写的样式
 * @param {enum} env development or production
 */
function getAntdStyleLoader(env) {
    if (env === undefined) {
        throw "\ngetStyleLoader's param: env 不能为空！\n\n"
    }

    const isProduction = env === ENV.production

    const loaders = [
        {
            loader: 'css-loader'
        },
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true
            }
        }
    ]

    if (isProduction) {
        return {
            test: /\.less$/,
            use: [ MiniCssExtractPlugin.loader, ...loaders ]
        }
    } else {
        return {
            test: /\.less$/,
            use: [
                {
                    loader: 'style-loader'
                },
                ...loaders
            ]
        }
    }
}

/**
 * 获取 webpack module.rules 的 fontsLoader
 * @param {enum} env development or production
 */
function getBabelLoader(env) {
    if (env === undefined) {
        throw "\ngetBabelLoader's param: env 不能为空！\n\n"
    }

    let options = babelOptions
    const isProduction = env === ENV.production
    if (isProduction) {
        options.plugins = options.plugins.filter(plugin => {
            let name
            if (Array.isArray(plugin)) {
                name = plugin[0]
            } else {
                name = plugin
            }
            return !['react-hot-loader/babel'].includes(plugin)
        })
    }

    const loader = {
        loader: 'babel-loader',
        options,
    }

    return {
        test: /\.(j|t)sx?$/,
        use: loader,
    }
}

module.exports = {
    getImagesLoader,
    getFontsLoader,
    getStyleLoader,
    getBabelLoader,
    getAntdStyleLoader
}
