import * as React from 'react'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'
import Clear from 'react-material-icon-svg/dist/CloseIcon'

import Row from '../Row'
import CCCacheStore from '../../../stores/CCCacheStore'

export class ShieldTo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shieldTo: this.props.SettingsStore.getAutoShieldTo,
    }
  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.shieldto.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <div style={{ position: 'relative' }}>
            <input type="text"
              className="input-field"
              min="90"
              max="110"
              style={{ paddingRight: '24px', boxSizing: 'border-box' }}
              pattern="^cc([a-zA-Z0-9]{90,110})$"
              placeholder={i18nReact.translate('settings.shieldto.placeholder')}
              value={this.props.SettingsStore.shieldTo}
              onChange={e => {
                this.props.SettingsStore.setShieldTo(e.target.value)
                if (e.target.validity.valid) {
                  this.props.AccountInformationStore.validateZAddress(this.props.SettingsStore.getShieldTo).then((response) => {
                    if (response.isvalid === true) {
                      this.props.SettingsStore.setSettingOption({
                        key: 'shieldTo',
                        value: this.props.SettingsStore.getShieldTo,
                      })
                    }
                  })
                }
              }}
              id="shieldto"
            />
            <Clear
              style={{
                fill: '#ccc',
                position: 'absolute',
                right: '0px',
                top: '12px',
                cursor: 'pointer',
              }}
              onClick={() => {
                this.props.SettingsStore.setShieldTo('')
                CCCacheStore.delete('shieldTo')
              }}
            />
          </div>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.shieldto.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(ShieldTo))
