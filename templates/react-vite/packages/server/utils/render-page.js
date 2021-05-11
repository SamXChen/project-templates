const path = require('path')
const fs = require('fs-extra')
const artTpl = require('art-template')
const { DIR_CONFIG, SSR_MAP } = require('common-config')

const { getViteDevModule } = require('./vite-module')

const NODE_ENV = process.env.NODE_ENV

async function renderPage(ctx, pageName = '', data = {}) {

    const { transaction } = ctx

    transaction?.log('start render page')

    let content = ''
    if (NODE_ENV === 'development') {

        transaction?.log('development, use vite transformIndexHtml')

        const vite = await getViteDevModule()
        const TARGET_DIR = path.join(DIR_CONFIG.CLIENT_SRC_DIR, `/${pageName}/index.html`)
        content = await fs.readFile(TARGET_DIR, { encoding: 'utf8' })
        content = await vite.transformIndexHtml(`/modules/${pageName}/index.html`, content)

        transaction?.log('get html content')

    } else {

        transaction?.log('production, use fs read html')

        const TARGET_DIR = path.join(DIR_CONFIG.CLIENT_DIST_HTML_DIR, `/${pageName}/index.html`)
        content = await fs.readFile(TARGET_DIR, { encoding: 'utf8' })

        transaction?.log('get html content')
    }

    const entry = findSsrEntry(pageName) || ''
    const needSSr = entry.length > 0
    if (needSSr) {

        transaction?.log('need ssr')

        try {
            let render

            let stylelinksHtml

            if (NODE_ENV === 'development') {
                const vite = await getViteDevModule()
                const entryPath = path.join(DIR_CONFIG.CLIENT_SRC_DIR, `${pageName}`, 'src', entry)
                render = (await vite.ssrLoadModule(entryPath)).render

                // TODO: need a better performance solution for React
                const styleLinks = findStyleLinksFromEntry(entryPath, vite.moduleGraph)
                stylelinksHtml = transformStyleLinksToHtml(styleLinks)

            } else {
                const entryPath = path.join(DIR_CONFIG.CLIENT_DIST_DIR, 'ssr', `${pageName}`, `${entry.replace(/\.tsx?$/, '.js')}`)
                render = require(entryPath).render
            }
            
            content = content.replace(`<!--ssr-outlet-->`, await render())

            if (stylelinksHtml) {
                // TODO: replace with regex
                content = content.replace(`<!--preload-styles-->`, `\n${stylelinksHtml}\n`)
            }

        } catch (err) {
            transaction?.error(err)
        }
    }

    transaction?.log('html content ready')

    return ctx.body = artTpl.render(content, data)
}

function findSsrEntry(pageName) {
    return SSR_MAP[pageName]
}

function findStyleLinksFromEntry(entryPath, moduleGraph, result) {
    if (result === undefined) {
        result = []
    }
    const moduleInfo = moduleGraph.urlToModuleMap.get(entryPath)
    
    if (moduleInfo.url && renderPreloadLink(moduleInfo.url)) {
        result.push(moduleInfo.url)
    }
    const depModuleInfos = Array.from(moduleInfo.importedModules)
    depModuleInfos.forEach(info => {
        findStyleLinksFromEntry(info.url, moduleGraph, result)
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
