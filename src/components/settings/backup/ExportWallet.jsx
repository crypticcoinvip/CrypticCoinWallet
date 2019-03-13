import * as React from 'react'
import { remote } from 'electron'
import { Button } from 'react-materialize'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'

export class ExportWallet extends React.Component {
  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.exportwallet.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <Button
            className="grey darken-3"
            onClick={() => {
              // let filename = remote.dialog.showSaveDialog(
              //   { properties: ['openFile', 'showHiddenFiles'] }
              // )
              const date = (new Date()).toLocaleString().replace(/[^\d]+/g, '')
              const filename = `cckeys${date}`
              this.props.AccountInformationStore.exportWallet(filename).then((response) => {
                if (response.indexOf(filename) !== -1) {
                  Materialize.toast(`${i18nReact.translate('settings.exportwallet.success')} (${response})`, 3000)
                } else {
                  Materialize.toast(i18nReact.translate('settings.exportwallet.error'), 3000)
                }
              }).catch((response) => {
                const r = JSON.parse(response)
                Materialize.toast((r && r.error) ? r.error.message : i18nReact.translate('settings.exportwallet.error'), 3000)
              })
            }}
          >
            {i18nReact.translate('settings.exportwallet.button')}
          </Button>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.exportwallet.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ExportWallet))