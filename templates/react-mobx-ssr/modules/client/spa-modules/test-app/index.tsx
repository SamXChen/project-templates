import * as React from 'react'
import * as ReactDom from 'react-dom'
import MainContainer from './js/containers/main'

async function init() {
    ReactDom.hydrate(
        <MainContainer />,
        document.getElementById('container')
    )
}

init()
