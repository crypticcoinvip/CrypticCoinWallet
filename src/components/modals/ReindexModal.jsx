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
    isReindexing: false,
  }

  reindex() {
    this.setState({ isReindexing: true })

    ipcRenderer.send('request-reindex', {});
  }

  render() {
    const title = i18nReact.translate('reindex_modal.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="reindexModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s9 offset-s3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('reindex_modal.subtitle')}</Info>
                </div>
                <button
                  className={!this.state.isReindexing ? "btn grey darken-3 waves-effect waves-light" : "btn grey darken-3 waves-effect waves-light disabled"}
                  onClick={
                    !this.state.isReindexing
                      ? () => this.reindex()
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
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('reindex_modal.reindex')}
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
