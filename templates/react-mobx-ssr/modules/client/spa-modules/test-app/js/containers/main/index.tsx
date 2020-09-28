import * as React from 'react'

import Text from '../../components/text'

import './style.scss'

const MainContainer = () => {
    return (
        <div styleName='main-container'>
            <h1>Hello World</h1>
            <div styleName='bg-img'></div>
            <div style={{ fontSize: '36px' }}>
                <Text />
            </div>
        </div>
    )
}

export default MainContainer
