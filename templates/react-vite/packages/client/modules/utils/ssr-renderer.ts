import React from 'react'

export function createRenderer(ctx: any, callback: any) {
  if (import.meta.env.SSR) {
    if (import.meta.env.DEV) {
      ctx.ssrLoadedModuleIds = []
      // @ts-ignore
      const originCreateElement = React.createElement
      // @ts-ignore
      React.createElement = function (...args) {
        // @ts-ignore
        const type = args[0]
        if (type.prototype?.__ssr_dirname) {
          ctx.ssrLoadedModuleIds.push(type.prototype.__ssr_dirname)
        }
        // @ts-ignore
        return originCreateElement(...args)
      }
    }
    return callback(ctx)
  }
}
