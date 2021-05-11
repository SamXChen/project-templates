const { build } = require('vite')
const { buildViteConfig } = require('./build-config')
const { CDN_CONFIG } = require('common-config')

async function run() {

    const config = await buildViteConfig()

    delete config.server

    // vite will read plugins from vite.config.ts, remove plugins settings here
    delete config.plugins

    if (config.build) {
        delete config.build.emptyOutDir
    }

    if (CDN_CONFIG.prefix && CDN_CONFIG.prefix.length > 0) {
        config.base = CDN_CONFIG.prefix
    }
    
    return build(config)
}

run()
