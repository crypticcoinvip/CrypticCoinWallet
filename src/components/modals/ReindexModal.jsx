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

class ReindexModal extends React.Component {
  state = {
    stateUpdated: false,
    isReindexing: false,
    isRescanning: false,
    isHardReindexing: false,
    advancedMode: false,
  }

  isInService() {
    return this.props.AccountInformationStore.info.state !== '' || !this.props.AccountInformationStore.info.loaded
  }

  toggle() {
    this.setState({
      advancedMode: !this.state.advancedMode,
    })
  }

  cleanAndReindex() {
    this.setState({ isHardReindexing: true })
    this.props.AccountInformationStore.setState('cleaning')
    ipcRenderer.send('request-clean-reindex', {});
  }

  reindex() {
    this.props.AccountInformationStore.setState('reindexing')
    this.setState({ isReindexing: true })
    ipcRenderer.send('request-reindex', {});
  }

  rescan() {
    this.props.AccountInformationStore.setState('rescanning')
    this.setState({ isRescanning: true })
    ipcRenderer.send('request-rescan', {});
  }

  render() {
    const title = i18nReact.translate('reindex_modal.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="reindexModal"
        style={{
          maxHeight: '90%',
        }}
      >
        <div className="container">

          <div className="row">
            <div className="col s12 l9 offset-l3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('reindex_modal.subreindex')}</Info>
                </div>
                <button
                  className={!this.isInService() ? "btn grey darken-3 waves-effect waves-light" : "btn grey darken-3 waves-effect waves-light disabled"}
                  onClick={
                    !this.isInService()
                      ? () => this.reindex()
                      : () => { }
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                  }}
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('reindex_modal.reindex')}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col s12 l9 offset-l3">
              <div className="switch">
              <label>
                {i18nReact.translate('reindex_modal.advanceduser')} Off
                <input type="checkbox"
                  checked={this.state.advancedMode}
                  onChange={this.toggle.bind(this)}
                />
                <span className="lever"></span>
                On
              </label>
            </div>
            </div>
            <div className="col s12 l9 offset-l3"
              style={{ display: this.state.advancedMode ? 'block' : 'none' }}
            >
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('reindex_modal.subcleanreindex')}</Info>
                </div>
                <button
                  className={
                    this.isInService()
                      ? "btn grey darken-3 waves-effect waves-light disabled"
                      : "btn grey darken-3 waves-effect waves-light"
                  }
                  onClick={
                    !this.isInService()
                      ? () => this.cleanAndReindex()
                      : () => { }
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                  }}
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('reindex_modal.cleanreindex')}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col s12 l9 offset-l3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('reindex_modal.subrescan')}</Info>
                </div>
                <button
                  className={
                    this.isInService()
                      ? "btn grey darken-3 waves-effect waves-light disabled"
                      : "btn grey darken-3 waves-effect waves-light"
                  }
                  onClick={
                    !this.isInService()
                      ? () => this.rescan()
                      : () => { }
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                  }}
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('reindex_modal.rescan')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </Modal>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ReindexModal))
