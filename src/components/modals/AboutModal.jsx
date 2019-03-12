import * as React from 'react'
import Repeat from 'react-material-icon-svg/dist/RepeatIcon'
import { observer, inject } from 'mobx-react'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'
import { app, remote, ipcRenderer } from 'electron'

import Modal from '../Modal'
import { resolve } from 'dns'

const Info = styledComponents.p`
  color: #232323;
  margin: 10px 0;
`

const Input = styledComponents.input`
  margin: 0 !important;
`

class AboutModal extends React.Component {
  state = {
    isReindexing: false,
  }

  render() {
    const title = i18nReact.translate('about_modal.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="aboutModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s12 l9 offset-l3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <h5>Wallet info</h5>
                  <div>Official <strong>CrypticCoin Wallet</strong></div>
                  <div>version {this.props.SettingsStore.appVersion}</div>
                  <h5>Network info</h5>
                  <div>blocks {this.props.AccountInformationStore.info ? this.props.AccountInformationStore.info.blocks : 'loading'}</div>
                  <div>connections {this.props.AccountInformationStore.info ? this.props.AccountInformationStore.info.connections : 'loading'}</div>
                  <div>difficulty {this.props.AccountInformationStore.info ? this.props.AccountInformationStore.info.difficulty : 'loading'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(AboutModal))
