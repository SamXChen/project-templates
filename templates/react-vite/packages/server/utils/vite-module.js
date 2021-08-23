const { createViteSsrDevModule, createViteAssetDevModule } = require('template-vite-client/scripts/dev-middlewares')

let globalViteAssetDevModule
let globalViteSsrDevModule

async function getViteAssetDevModule() {
    if (globalViteAssetDevModule) {
        return globalViteAssetDevModule
    } else {
        globalViteAssetDevModule = await createViteAssetDevModule()
        return globalViteAssetDevModule
    }
}

async function getViteSsrDevModule() {
    if (globalViteSsrDevModule) {
        return globalViteSsrDevModule
    } else {
        globalViteSsrDevModule = await createViteSsrDevModule()
        return globalViteSsrDevModule
    }
}

module.exports = {
    getViteAssetDevModule,
    getViteSsrDevModule,
}
