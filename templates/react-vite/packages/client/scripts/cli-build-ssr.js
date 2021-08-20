const lodash = require('lodash')
const path = require('path')
const { build } = require('vite')
const { buildViteConfig } = require('./build-config')
const { SSR_MAP, DIR_CONFIG } = require('common-config')

async function run() {
    
    const config = await buildViteConfig()

    delete config.root
    delete config.server
    if (config.build) {
        delete config.build.emptyOutDir
        delete config.build.rollupOptions
    }

    config.plugins = config.plugins.filter(plugin => {
        if (Array.isArray(plugin)) {
            const plugins = plugin
            if (plugins && plugins[0] && plugins[0].name && plugins[0].name.startsWith('legacy')) {
                return false
            }
        }
        return true
    })
    config.build.ssr = true

    const buildTasks = []

    Object.keys(SSR_MAP).forEach(moduleName => {
        const baseConfig = lodash.cloneDeep(config)
        const entryName = SSR_MAP[moduleName]

        baseConfig.build.outDir = path.join(DIR_CONFIG.CLIENT_DIST_DIR, 'ssr', moduleName)
        baseConfig.build.rollupOptions = {
            input: path.join(DIR_CONFIG.CLIENT_SRC_DIR, moduleName, 'src', entryName),
        }

        buildTasks.push(build({ ...baseConfig, configFile: false }))
    })

    try {
        await Promise.all(buildTasks)
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}

run()
