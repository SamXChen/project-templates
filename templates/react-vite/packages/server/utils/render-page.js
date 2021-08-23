const path = require('path')
const fs = require('fs-extra')
const artTpl = require('art-template')
const { DIR_CONFIG, SSR_MAP } = require('common-config')

const NODE_ENV = process.env.NODE_ENV

async function renderPage(ctx, pageName = '', data = {}) {

    const { transaction } = ctx

    transaction && transaction.log('start render page')

    let content = ''
    if (NODE_ENV === 'development') {

        transaction && transaction.log('development, use vite transformIndexHtml')

        const { getViteAssetDevModule } = require('./vite-module')
        const vite = await getViteAssetDevModule()
        const TARGET_DIR = path.join(DIR_CONFIG.CLIENT_SRC_DIR, `/${pageName}/index.html`)
        content = await fs.readFile(TARGET_DIR, { encoding: 'utf8' })
        content = await vite.transformIndexHtml(`/modules/${pageName}/index.html`, content)

        transaction && transaction.log('get html content')

    } else {

        transaction && transaction.log('production, use fs read html')

        const TARGET_DIR = path.join(DIR_CONFIG.CLIENT_DIST_HTML_DIR, `/${pageName}/index.html`)
        content = await fs.readFile(TARGET_DIR, { encoding: 'utf8' })

        transaction && transaction.log('get html content')
    }

    const entry = findSsrEntry(pageName) || ''
    const needSSr = entry.length > 0
    if (needSSr) {

        transaction && transaction.log('need ssr')

        try {
            let render

            let renderedHtml
            let stylelinksHtml

            if (NODE_ENV === 'development') {
              const { getViteSsrDevModule } = require('./vite-module')
                const vite = await getViteSsrDevModule()
                const entryPath = path.join(DIR_CONFIG.CLIENT_SRC_DIR, `${pageName}`, 'src', entry)
                render = (await vite.ssrLoadModule(entryPath)).render
                
                transaction && transaction.log(`loaded ssr module`)
                
                const ctx = {}
                renderedHtml = await render(ctx)
                
                // 开发环境：渲染过程中提取 style link
                if (ctx.ssrLoadedModuleIds && ctx.ssrLoadedModuleIds.length > 0) {
                    const ids = ctx.ssrLoadedModuleIds.map(id => {
                        if (id === entryPath) {
                            return id
                        } else {
                            return path.join('/', path.relative(path.join(DIR_CONFIG.CLIENT_SRC_DIR, '..'), id))
                        }
                    })
                    const styleLinks = findStyleLinksFromEntry([entryPath, ...ids], vite.moduleGraph)
                    stylelinksHtml = transformStyleLinksToHtml(styleLinks)
                }
            } else {
                const entryPath = path.join(DIR_CONFIG.CLIENT_DIST_DIR, 'ssr', `${pageName}`, `${entry.replace(/\.tsx?$/, '.js')}`)
                render = require(entryPath).render
                renderedHtml = await render()
            }
            
            if (renderedHtml) {
                content = content.replace(`<!--ssr-outlet-->`, renderedHtml)
            }
            if (stylelinksHtml) {
                content = content.replace(`<!--preload-styles-->`, `\n${stylelinksHtml}\n`)
            }

        } catch (err) {
            transaction && transaction.error(err)
        }
    }

    transaction && transaction.log('html content ready')

    return ctx.body = artTpl.render(content, data)
}

function findSsrEntry(pageName) {
    return SSR_MAP[pageName]
}

function findStyleLinksFromEntry(moduleIdList = [], moduleGraph) {
    
    const result = []

    moduleIdList.forEach(moduleId => {
        const moduleInfo = moduleGraph.urlToModuleMap.get(moduleId)
        if (moduleInfo.importedModules) {
            const depModuleInfos = Array.from(moduleInfo.importedModules)
            depModuleInfos.forEach(info => {
                if (info.url && renderPreloadLink(info.url)) {
                    result.push(info.url)
                }
            })
        }
    })

    return result
}

function transformStyleLinksToHtml(styleLinks = []) {
    if (styleLinks.length === 0) {
        return
    }
    return styleLinks.map(link => renderPreloadLink(link)).join('\n')
}

function renderPreloadLink(file) {
    if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.less')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.scss')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    } else if (file.endsWith('.jpg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    } else if (file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    } else {
        // TODO
        return ''
    }
}

module.exports = {
    renderPage,
}
