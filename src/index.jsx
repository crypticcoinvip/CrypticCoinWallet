import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import './assets/css/main.scss'

import * as React from 'react'

import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'

import Root from './containers/Root'

// Since we are using HtmlWebpackPlugin WITHOUT a template,
// we should create our own root node in the body element before rendering into it
const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

if (!window.location.href.includes('loading.html')) {
  const loading = document.createElement('div')
  loading.setAttribute('data-ajax-transitions', 'false')
  loading.id = 'ajax-loading-screen'
  const spin = document.createElement('div')
  spin.setAttribute('class', 'loading-icon spin')
  loading.appendChild(spin)
  document.body.appendChild(loading)
  loading.setAttribute('data-ajax-transitions', 'true')
}

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById('root'),
)

if (module && module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root') // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
