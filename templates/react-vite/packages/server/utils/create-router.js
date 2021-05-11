const { apmMid } = require('../middlewares/apm')
const Router = require('koa-router')

function createRouter(name = 'anonymous') {
    const router = new Router()
    router.use(apmMid(name))
    return router
}

module.exports = {
    createRouter,
}
