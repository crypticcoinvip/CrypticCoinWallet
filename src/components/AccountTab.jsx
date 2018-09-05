import * as React from 'react'
import { inject, observer } from 'mobx-react'

import TransactionList from './transaction/TransactionList'

class AccountTab extends React.Component {
    render() {
      return (
        <div id="account" className="col s12">
          <TransactionList />
        </div>
      )
    }
  }
  
export default inject(
  'SettingsStore',
  'AccountInformationStore',
  'CoinStatsStore'
)(observer(AccountTab))