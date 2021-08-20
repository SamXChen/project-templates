import artTemplate from 'art-template'
import path from 'path'

import MagicString from 'magic-string'
import { parse, transform } from '@vue/compiler-dom'
import { ElementNode, AttributeNode } from '@vue/compiler-core'

const assetAttrsConfig: Record<string, string[]> = {
  link: ['href'],
  video: ['src', 'poster'],
  source: ['src', 'srcset'],
  img: ['src', 'srcset'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href']
}

export default function(publicDir: string) {
  return {
    name: 'html-art-template-fold',
    transformIndexHtml: {
      enforce: 'pre' as ("pre" | "post"),
      async transform(html: string, { filename }) {

        const fileDir = path.dirname(filename)

        const transformedHtml = transformHtmlSrc(html, {
          rootDir: fileDir,
          parentDir: fileDir,
          publicDir,
        })

        const foldedHtml = artTemplate.render(transformedHtml, {}, {
          root: fileDir,
          include: includeHandler.bind(null, fileDir, publicDir),
          rules: [getArtRule()],
          escape: false,
        })

        return foldedHtml
      },
    },
  }
}


function includeHandler(rootDir: string, publicDir: string, filename, data, blocks, options) {

  // filename: 当前正在处理的 include 文件相对路径
  // data：用于渲染模板的数据
  // blocks：未知
  // options：
  //    filename: 来源文件的地址
  //    source：来源文件的具体内容
  const compile = artTemplate.compile
  options = options.$extend({
    filename: options.resolveFilename(filename, options),
    bail: true,
    source: null,
  })
  // @ts-ignore
  const compiledStr = compile(options)(data, blocks)
  const transformedHtml = transformHtmlSrc(compiledStr, {
    rootDir,
    parentDir: path.dirname(options.filename),
    publicDir,
  })
  return transformedHtml
}

// desc：只处理 include 和 extend 两种特征
function getArtRule() {
  const artRule = {
    test: /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/,
    use: function (match, raw, close, code) {

      const compiler = this
      const options = compiler.options
      const esTokens = compiler.getEsTokens(code)
      const values = esTokens.map((token) => token.value)
      const result = {}

      let group
      let output = raw ? 'raw' : false
      let key = close + values.shift()

      // 旧版语法升级提示
      const warn = (oldSyntax, newSyntax) => {
        console.warn(
          `${options.filename || 'anonymous'}:${match.line + 1}:${
            match.start + 1
          }\n` + `Template upgrade: {{${oldSyntax}}} -> {{${newSyntax}}}`
        )
      }

      // v3 compat: #value
      if (raw === '#') {
        warn('#value', '@value')
      }

      let matched = false

      switch (key) {
        case 'include':
        case 'extend':
          matched = true
          if (values.join('').trim().indexOf('(') !== 0) {
            // 执行函数省略 `()` 与 `,`
            group = artRule._split(esTokens)
            group.shift()
            code = `${key}(${group.join(',')})`
            break
          }
      }

      let outputCode
      if (matched) {
        outputCode = code
      } else {
        outputCode = `'${match.toString()}'`
        output = true
      }

      // @ts-ignore
      result.code = outputCode
      // @ts-ignore
      result.output = output
      return result
    },

    // 将多个 javascript 表达式拆分成组
    // 支持基本运算、三元表达式、取值、运行函数，不支持 `typeof value` 操作
    // 只支持 string、number、boolean、null、undefined 这几种类型声明，不支持 function、object、array
    _split: (esTokens) => {
      esTokens = esTokens.filter(({ type }) => {
        return type !== `whitespace` && type !== `comment`
      })

      let current = 0
      let lastToken = esTokens.shift()
      const punctuator = `punctuator`
      const close = /\]|\)/
      const group = [[lastToken]]

      while (current < esTokens.length) {
        const esToken = esTokens[current]
        if (
          esToken.type === punctuator ||
          (lastToken.type === punctuator && !close.test(lastToken.value))
        ) {
          group[group.length - 1].push(esToken)
        } else {
          group.push([esToken])
        }

        lastToken = esToken

        current++
      }

      return group.map((g) => g.map((g) => g.value).join(``))
    },
  }

  return artRule
}

function transformHtmlSrc(html, ctx) {

  html = html.replace(/<!doctype\s/i, '<!DOCTYPE ')

  const magicHtml = new MagicString(html)

  try {
    const ast = parse(html, { comments: true })
    transform(ast, {
      nodeTransforms: [htmlNodeVisitor.bind(null, { magicHtml, ...ctx })],
    })
  } catch (e) {
    throw e
  }
  return magicHtml.toString()
}

function htmlNodeVisitor({ magicHtml, parentDir, publicDir }, node) {
  // NodeTypes.ELEMENT 1
  if (node.type !== 1) {
    return
  }

  // script tags
  if (node.tag === 'script') {
    const { src } = getScriptInfo(node)
    const url = src?.value?.content
    const transferedUrl = transferUrl(url, parentDir, publicDir)
    if (url && url !== transferedUrl) {
      magicHtml.overwrite(
        src!.value!.loc.start.offset,
        src!.value!.loc.end.offset,
        `"${transferedUrl}"`,
      )
    }
  }

  // For asset references in index.html, also generate an import
  // statement for each - this will be handled by the asset plugin
  const assetAttrs = assetAttrsConfig[node.tag]
  if (assetAttrs) {
    for (const p of node.props) {
      if (
        p.type === 6 &&
        p.value &&
        assetAttrs.includes(p.name)
      ) {
        const url = p.value.content
        const transferedUrl = transferUrl(url, parentDir, publicDir)
        if (url !== transferedUrl) {
          magicHtml.overwrite(
            p!.value!.loc.start.offset,
            p!.value!.loc.end.offset,
            `"${transferedUrl}"`,
          )
        }
      }
    }
  }
}

function transferUrl(url: string = '', parentDir: string = '', publicDir: string = '') {
  if (isRelativeUrl(url)) {
    const realDir = getRealDir(url, parentDir)
    const absoluteUrl = generateAbsUrl(realDir, publicDir)
    return absoluteUrl
  }
  return url
}

function isRelativeUrl(url: string = '') {
  if (url.includes('./') || url.includes('../')) {
    return true
  }
  return false
}

function getRealDir(url, parentDir) {
  return path.resolve(parentDir, url)
}

function generateAbsUrl(targetDir, publicDir) {
  return targetDir.replace(publicDir, '')
}

function getScriptInfo(
  node: ElementNode
): {
  src: AttributeNode | undefined
  isModule: boolean
} {
  let src: AttributeNode | undefined
  let isModule = false
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i]
    if (p.type === 6) {
      if (p.name === 'src') {
        // @ts-ignore
        src = p
        // @ts-ignore
      } else if (p.name === 'type' && p.value && p.value.content === 'module') {
        isModule = true
      }
    }
  }
  return { src, isModule }
}
