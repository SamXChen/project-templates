import * as React from 'react'
import { observer } from 'mobx-react'

import store from '../../store'

const Text = observer(() => {
    return (
        <div>{ store.text }</div>
    )
})

export default Text
