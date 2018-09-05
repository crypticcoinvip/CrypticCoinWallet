import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import App from './containers/App'

const RedirectHome = () => <Redirect to="/" />

const WrapWithApp = Site => {
  const AppWrapper = () => (
    <App>
      <Site />
    </App>
  )

  return AppWrapper
}

const MainRoute = () => (
  <Switch>
    <Route exact path="/" component={App} />
    <Route component={WrapWithApp(RedirectHome)} />
  </Switch>
)

export default MainRoute
