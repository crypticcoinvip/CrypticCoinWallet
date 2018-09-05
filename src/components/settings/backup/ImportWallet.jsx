import * as React from 'react'
import { remote } from "electron"
import { Button } from 'react-materialize'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'

const locales = [
  {
    currency: 'EUR',
    locale: 'de-DE',
  },
  {
    currency: 'USD',
    locale: 'en-US',
  }
]

export class ImportWallet extends React.Component {
  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.importwallet.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <Button
            className="grey darken-3"
            onClick={() => {
              remote.dialog.showOpenDialog(
                { properties: ['openFile', 'showHiddenFiles'] },
                (fileNames) => {
                  if (fileNames === undefined) {
                    Materialize.toast(i18nReact.translate('settings.importwallet.error'), 3000)
                    return
                  }

                  const filename = fileNames[0];

                  this.props.AccountInformationStore.importWallet(filename).then((response) => {
                    if (response === filename) {
                      Materialize.toast(i18nReact.translate('settings.importwallet.success'), 3000)
                    } else {
                      Materialize.toast(i18nReact.translate('settings.importwallet.error'), 3000)
                    }
                  }).catch((response) => {
                    const r = JSON.parse(response)
                    Materialize.toast((r && r.error) ? r.error.message : i18nReact.translate('settings.importwallet.error'), 3000)
                  })
                })
            }}
          >
            {i18nReact.translate('settings.importwallet.button')}
          </Button>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.importwallet.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ImportWallet))