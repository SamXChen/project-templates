const path = require('path')

const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

const commonConfigExternalPlugin = {
    name: 'make-common-config-external',
    setup(build) {
        const filter = /common-config/
        build.onResolve({ filter }, args => {
            return ({ path: args.path, external: true })
        })
    },
}

const reactRefreshExternalPlugin = {
    name: 'make-react-refresh-external',
    setup(build) {
        const filter = /^react-refresh\/?/
        build.onResolve({ filter }, args => {
            return ({ path: args.path, external: true })
        })
    },
}

async function buildConfig() {

    await esbuild.build({
        entryPoints:[path.resolve(__dirname, '../vite/vite.config.ts')],
        bundle: true,
        platform: 'node',
        target: 'es2015',
        outfile: path.resolve(__dirname, '../dist/vite.config.js'),
        plugins: [
            nodeExternalsPlugin(),
            commonConfigExternalPlugin,
            reactRefreshExternalPlugin,
        ],
    })

    return require('../dist/vite.config').default
}

module.exports = {
    buildViteConfig: buildConfig,
}
