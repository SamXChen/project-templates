import React from 'react'
import ReactDom from 'react-dom'

import { App } from './App'

if (!import.meta.env.SSR) {
  ReactDom.hydrate(
    <App />,
    document.getElementById('root'),
  )
}

export async function render() {
  if (import.meta.env.SSR) {
    const ReactDomServer = await import('react-dom/server')
    return ReactDomServer.renderToString(
        <App />
    )
  }
}
