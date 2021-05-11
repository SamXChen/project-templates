const { createViteDevModule } = require('template-vite-client/scripts/dev-middlewares')

let globalViteModule

async function getViteDevModule() {
    if (globalViteModule) {
        return globalViteModule
    } else {
        globalViteModule = await createViteDevModule()
        return globalViteModule
    }
}

module.exports = {
    getViteDevModule,
}
