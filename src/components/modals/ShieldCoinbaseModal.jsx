import * as React from 'react'
import Repeat from 'react-material-icon-svg/dist/RepeatIcon'
import { observer, inject } from 'mobx-react'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'

import Modal from '../Modal'

const Info = styledComponents.p`
  color: #232323;
  margin: 10px 0;
`

const Input = styledComponents.input`
  margin: 0 !important;
`

const SendState = {
  OPEN: 1,
  SENDING: 2,
  DONE: 3,
  ERROR: 4,
}

class ShieldCoinbaseModal extends React.Component {
  state = {
    isLoadingZAddress: false,
    zaddress: this.props.SettingsStore.getShieldTo,
    status: SendState.OPEN
  }

  shieldCoinbase() {
    const { AccountInformationStore } = this.props
    const { zaddress } = this.state

    this.setState({ status: SendState.SENDING, error: null })

    Materialize.toast(i18nReact.translate('asyncOperations.shield') + ' ' + i18nReact.translate('asyncOperations.started'), 3000)

    AccountInformationStore.shieldCoinbase('*', zaddress).then((result) => {
      const opId = result.opid
      const interval = setInterval(() => {
        AccountInformationStore.getOperationStatus([opId])
          .then(statuses => {
            const status = statuses[0].status
            Materialize.Toast.removeAll()
            Materialize.toast(i18nReact.translate('asyncOperations.shield') + ' ' + i18nReact.translate('asyncOperations.' + status), 4000)
            if (status == 'cancelled' || status == 'failed' || status == 'success') {
              clearInterval(interval)
              this.setState({
                status: SendState.OPEN,
                error: status == 'failed' ? statuses[0].error.message : null
              })
            }
            if (status == 'success') {
              setTimeout(() => {
                this.props.toggle()
                this.setState({
                  amount: 0,
                  address: '',
                  from: '',
                  label: '',
                  status: SendState.OPEN,
                })
              }, 1000)
            }
          })
        }, 5000)
      }
    ).catch(e => {
      Materialize.toast(i18nReact.translate('asyncOperations.shield') + ' ' + i18nReact.translate('asyncOperations.failed'), 4000)
      this.setState({
        status: SendState.ERROR,
        error: JSON.parse(e).error.message,
      })
      setTimeout(() => {
        this.setState({
          status: SendState.OPEN,
          error: null,
        })
      }, 2500)
    })
  }

  createNewZAddress() {
    this.setState({
      isLoadingZAddress: true,
    })
    this.props
      .AccountInformationStore.receiveNewZAddress()
      .then(zaddress => this.setState({ zaddress, isLoadingZAddress: false }))
  }

  render() {
    const title = i18nReact.translate('shield_coinbase_modal.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="shieldCoinbaseModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s9 offset-s3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('shield_coinbase_modal.subtitle')}</Info>
                  <Input
                    placeholder={
                      i18nReact.translate('shield_coinbase_modal.placeholder')
                    }
                    onChange={e => this.setState({ zaddress: e.target.value })}
                    value={this.state.zaddress}
                  />
                  <label>{i18nReact.translate('shield_coinbase_modal.label')}</label><br />
                </div>
                <button
                  className="btn grey darken-3 waves-effect waves-light"
                  onClick={
                    !this.state.isLoadingZAddress
                      ? () => this.createNewZAddress()
                      : () => {}
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}                      
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('shield_coinbase_modal.zaddress')}
                </button>
                <button
                  className={
                    !this.state.zaddress || this.state.status === SendState.SENDING
                      ? "btn grey darken-3 waves-effect waves-light disabled"
                      : "btn grey darken-3 waves-effect waves-light"
                  }
                  onClick={
                    !this.state.isLoadingZAddress
                      ? () => this.shieldCoinbase()
                      : () => {}
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}                      
                >
                  {i18nReact.translate('shield_coinbase_modal.shield')}
                </button>                
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ShieldCoinbaseModal))
