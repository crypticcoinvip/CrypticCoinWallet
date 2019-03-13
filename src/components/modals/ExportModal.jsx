import * as React from 'react'
import Repeat from 'react-material-icon-svg/dist/RepeatIcon'
import { observer, inject } from 'mobx-react'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'
import { app, remote, ipcRenderer } from 'electron'
import uuidv5 from 'uuid/v5'

import secret from '../../secret'
import Modal from '../Modal'
import { resolve } from 'dns'

const Info = styledComponents.p`
  color: #232323;
  margin: 10px 0;
`

const Input = styledComponents.input`
  margin: 0 !important;
`

const PasswordRow = styledComponents.input`
  -webkit-text-security: disc
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  border-radius: 10px;
  margin-top: 50px;
  background-color: hsl(210, 9%, 96%);
  border: none;
  width: '60%';
  display: 'flex';
  justify-content: 'center'
`

const FalseInputHandler = styledComponents.p`
  color: rgba(220, 43, 61, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 30px;
  font-style: italic;
`

class ExportModal extends React.Component {
  state = {
    password: '',
    unlocked: true,
  }

  render() {
    const title = i18nReact.translate('export_modal.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="exportModal"
        style={{
          maxHeight: '90%',
        }}
      >
        <div className="container">

          <div className="row">
            <div className="col s12 l9 offset-l3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('export_modal.subtitle')}</Info>
                </div>
                <div style={{ paddingBottom: '20px' }}>
                      <PasswordRow
                        placeholder="Confirm your password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                      />
                    {this.state.unlocked ? (
                      <label>{i18nReact.translate('export_modal.info')}</label>
                    ) : (
                        <FalseInputHandler>
                          {i18nReact.translate('export_modal.wrongpass')}
                        </FalseInputHandler>
                      )}                      
                </div>
                <button
                  className={
                    this.state.password === ''
                      ? "btn grey darken-3 waves-effect waves-light disabled"
                      : "btn grey darken-3 waves-effect waves-light"
                  }
                  onClick={() => {
                    const hash = localStorage.getItem('cryp_hash')
                    if (uuidv5(this.state.password, secret) === hash) {
                      this.setState({ password: '', unlocked: true })
                      const date = (new Date()).toLocaleString().replace(/[^\d]+/g, '')
                      const filename = `cckeys${date}`
                      this.props.AccountInformationStore.exportWallet(filename).then((response) => {
                        if (response.indexOf(filename) !== -1) {
                          Materialize.toast(`${i18nReact.translate('settings.exportwallet.success')} (${response})`, 3000)
                          $('#exportModal').modal('close')
                        } else {
                          Materialize.toast(i18nReact.translate('settings.exportwallet.error'), 3000)
                        }
                      }).catch((response) => {
                        const r = JSON.parse(response)
                        Materialize.toast((r && r.error) ? r.error.message : i18nReact.translate('settings.exportwallet.error'), 3000)
                      })
                    } else {
                      this.setState({ unlocked: false })
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                  }}
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('export_modal.export')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </Modal>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ExportModal))
