import * as React from 'react'
import { Dropdown, NavItem, Button } from 'react-materialize'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'
import ShieldCoinbaseModal from '../../modals/ShieldCoinbaseModal'

export class ShieldCoinbase extends React.Component {
  state = {
    
  }

  toggleShieldCoinbase() {
    $(`#shieldCoinbaseModal`).modal('open')
  }

  componentDidUpdate() {
    if (this.props.AccountInformationStore.info.balance.coinbase > 0 &&
      this.props.SettingsStore.getAutoShieldCoinbase === true) {
        new Promise((resolve, reject) => {
          let zaddress = this.props.SettingsStore.getShieldTo
          if (zaddress) {
            resolve(zaddress)
          } else {
            return this.props.AccountInformationStore.receiveNewZAddress()
          }
        }).then(zaddress => {
          return this.props.AccountInformationStore.shieldCoinbase('*', zaddress).then((result) => {
            const opId = result.opid
            const interval = setInterval(() => {
              this.props.AccountInformationStore.getOperationStatus([opId])
                .then(statuses => {
                  const status = statuses[0].status
                  Materialize.Toast.removeAll()
                  Materialize.toast(i18nReact.translate('asyncOperations.shield') + ' ' + i18nReact.translate('asyncOperations.' + status), 4000)
                  if (status == 'cancelled' || status == 'failed' || status == 'success') {
                    clearInterval(interval)
                  }
                })
              }, 5000)
            }
          ).catch(e => {
            Materialize.toast(i18nReact.translate('asyncOperations.shield') + ' ' + i18nReact.translate('asyncOperations.failed'), 4000)
          })
        })
    }
  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.shieldcoinbase.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <ShieldCoinbaseModal toggle={this.toggleShieldCoinbase} />
          <a 
            className={
              this.props.AccountInformationStore.getBalance.coinbase > 0
                ? "btn grey darken-3 waves-effect waves-light" 
                : "btn grey darken-3 waves-effect waves-light disabled"
            }
            onClick={
              this.props.AccountInformationStore.getBalance.coinbase > 0
                ? this.toggleShieldCoinbase
                : () => {}
            }
          >{i18nReact.translate('settings.shieldcoinbase.shield')}</a>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.shieldcoinbase.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ShieldCoinbase))
