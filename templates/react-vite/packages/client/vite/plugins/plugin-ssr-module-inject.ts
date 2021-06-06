import { parse } from '@babel/parser'

export default function ssrModuleInjectPlugin() {

    return {
        name: 'ssr-module-inject-plugin',
        transform(code, id, ssr) {
            if (ssr && /\.[j|t]sx?$/.test(id)) {

                const modules = []
                try {
                    const res = parse(code, { sourceType: 'module' })
                    const nodes = res.program.body
                    // 为了更好的性能，不使用 traverse，直接判断第一层的 export
                    nodes.forEach(node => {
                        if (node.type === 'ExportNamedDeclaration') {
                            if (['FunctionDeclaration', 'ClassDeclaration'].includes(node.declaration?.type)) {
                                const type = mapType(node.declaration?.type)
                                const declaration = node.declaration as any
                                if (declaration.id?.name) {
                                    modules.push({
                                        name: declaration.id.name,
                                        type,
                                    })
                                }
                            }
                        }
                    })
                } catch (err) {
                    console.error(err)
                }
                const codeToInject = modules.map(({ name, type }) => {
                    if (['function', 'class'].includes(type)) {
                        return `if (${name}.prototype) { ${name}.prototype.__ssr_dirname = "${id}" }\n`
                    }
                }).join('')
                return code + '\n' + codeToInject
            }
            return {
                code,
            }
        },
    }
}

function mapType(typename) {
    switch (typename) {
        case 'FunctionDeclaration':
            return 'function'
        case 'ClassDeclaration':
            return 'class'
    }
    return ''
}