const Koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')

const { SERVER_CONFIG, DIR_CONFIG, CDN_CONFIG } = require('common-config')

const e2k = require('./utils/express-to-koa')

const { rootRouter } = require('./routers/root')

const RES_MAX_AGE = 30 * 24 * 3600 * 1000
const NODE_ENV = process.env.NODE_ENV

async function start() {

  const app = new Koa()

  if (NODE_ENV === 'development') {
    const { getViteAssetDevModule } = require('./utils/vite-module')
    const vite = await getViteAssetDevModule()
    app.use(e2k(vite.middlewares))
  } else {
    if (!CDN_CONFIG.prefix) {
      app.use(mount('/', static(DIR_CONFIG.CLIENT_DIST_DIR, { maxAge: RES_MAX_AGE })))
    }
  }

  app.use(rootRouter.routes(), rootRouter.allowedMethods())

  app.listen(SERVER_CONFIG.SERVICE_PORT)
}

start()
