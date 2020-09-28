const path = require('path')
const appPath = path.resolve(__dirname, '../..')
const clientPath = path.resolve(__dirname, '..')

const SPAModulesPath = path.resolve(clientPath, './spa-modules')
const outputPath = path.resolve(appPath, 'public/static/spa-modules')
// 相对于 outputPath
const viewsPathPrefix = '../../../public/views/spa-modules/'

// view 输出目录
const devServerContentBase = path.resolve(outputPath, '/views/spa-modules')

const publicPath = '/test-app/static/spa-modules/'
const filesToConcatPath = path.resolve(SPAModulesPath, 'commons/libs/**')
const copyWebpackPluginFromPath = path.resolve(SPAModulesPath, 'commons/plugins/**/*')
const remTemplatePath = path.resolve(SPAModulesPath, 'commons/views/rem.pug')

module.exports = {
    appPath,
    SPAModulesPath,
    outputPath,
    viewsPathPrefix,
    devServerContentBase,
    publicPath,
    filesToConcatPath,
    copyWebpackPluginFromPath,
    remTemplatePath
}
