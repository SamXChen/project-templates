const { createRouter } = require('../utils/create-router')
const { renderPage } = require('../utils/render-page')

const rootRouter = createRouter('root')

const serveRouter = createRouter('test-page')
serveRouter.get('/page-a', async ctx => {
  await renderPage(ctx, 'page-a', {
    title: 'page-a',
  })
})
serveRouter.get('/page-b', async ctx => {
  await renderPage(ctx, 'page-b', {
    title: 'page-b',
  })
})
rootRouter.use('/serve', serveRouter.routes(), serveRouter.allowedMethods())

module.exports = {
  rootRouter,
}
