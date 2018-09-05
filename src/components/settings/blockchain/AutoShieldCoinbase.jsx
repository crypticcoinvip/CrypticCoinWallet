import * as React from 'react'
import { Dropdown, NavItem, Button } from 'react-materialize'
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

export class AutoShieldCoinbase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoShieldCoinbase: this.props.SettingsStore.getAutoShieldCoinbase,
    }
  }

  toggle() {
    this.setState({
      autoShieldCoinbase: !this.state.autoShieldCoinbase,
    })
    this.props.SettingsStore.setSettingOption({
      key: 'autoShieldCoinbase',
      value: !this.state.autoShieldCoinbase,
    })
  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.autoshieldcoinbase.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <div className="switch">
            <label>
              Off
              <input type="checkbox"
                checked={this.state.autoShieldCoinbase}
                onChange={this.toggle.bind(this)}
              />
              <span className="lever"></span>
              On
            </label>
          </div>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.autoshieldcoinbase.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore')(observer(AutoShieldCoinbase))
