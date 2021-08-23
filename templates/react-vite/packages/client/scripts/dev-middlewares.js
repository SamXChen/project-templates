const { createServer } = require('vite')
const { buildViteConfig } = require('./build-config')

async function createViteDevModule() {

    const config = await buildViteConfig()

    if (config.server === undefined) {
        config.server = {
            watch: {
                usePolling: true,
                interval: 100,
            }
        }
    }
    config.server.middlewareMode = true

    const esbuildConfig = config.esbuild || {}
    const esbuildTarget = esbuildConfig.target || []

    config.esbuild = {
      ...esbuildConfig,
      target: [
        ...esbuildTarget,
        'es2020', 'node12',
      ],
    }

    return await createServer({ ...config, configFile: false })
}

module.exports = {
    createViteDevModule,
}
