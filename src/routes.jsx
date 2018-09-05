import * as React from 'react'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import { createHashHistory } from 'history'

import AccountInformationStore from './stores/AccountInformationStore'
import CoinStatsStore from './stores/CoinStatsStore'
import SettingsStore from './stores/SettingsStore'
import SetupStore from './stores/SetupStore'
import TransactionStore from './stores/TransactionStore'
import AddressStore from './stores/AddressStore'
import AuthStore from './stores/AuthStore'
import CCProvider from './CCProvider'
import ReRouter from './ReRouter'

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

const Routes = (props) => (
  <Router history={createHashHistory()}>
    <Provider
      AddressStore={AddressStore}
      TransactionStore={TransactionStore}
      AuthStore={AuthStore}
      AccountInformationStore={AccountInformationStore}
      CoinStatsStore={CoinStatsStore}
      SettingsStore={SettingsStore}
      SetupStore={SetupStore}
    >
      <CCProvider>
        <div>
          <ReRouter {...props} />
        </div>
      </CCProvider>
    </Provider>
  </Router>
)

export default Routes
