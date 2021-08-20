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

    return await createServer({ ...config, configFile: false })
}

module.exports = {
    createViteDevModule,
}
