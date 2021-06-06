import React from 'react'
import ReactDom from 'react-dom'

import { App } from './App'
import { createRenderer } from '../../utils/ssr-renderer'

if (!import.meta.env.SSR) {
  ReactDom.hydrate(
    <App />,
    document.getElementById('root'),
  )
}

export async function render(ctx = {} as any) {
  return createRenderer(ctx, async () => {
    const ReactDomServer = await import('react-dom/server')
    return ReactDomServer.renderToString(
      <App />
    )
  })
}
