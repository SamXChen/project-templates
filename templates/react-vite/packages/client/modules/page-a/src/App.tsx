import React from 'react'

import { Head } from './head'

import appStyles from './styles/app.module.scss'
import testImage from './images/umbrella.jpg'

export function App() {
  return (
    <div className={appStyles['app-panel']}>
      <Head />
      <div className={appStyles['desc']}>
        <div>image from react component</div>
        <img src={testImage} />
      </div>
    </div>
  )
}
