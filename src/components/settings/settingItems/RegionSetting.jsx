import * as React from 'react'
import { Dropdown, NavItem, Button } from 'react-materialize'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'

const locales = [
  {
    name: 'English',
    localeId: 'en',
  }
]

class RegionSetting extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false,
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.region.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <Dropdown trigger={
            <Button className="grey darken-3">{this.props.SettingsStore.getName}</Button>
          } options={{ constrainWidth: false }}>
            {locales.map(locale => (
              <NavItem key={`${locale.name}`}
                onClick={() => {
                  this.props.SettingsStore.setSettingOption({
                    key: 'name',
                    value: locale.name,
                  })
                  this.props.SettingsStore.setSettingOption({
                    key: 'localeId',
                    value: locale.localeId,
                  })
                }}
              >
                <span className="grey-text text-darken-1">
                  {locale.name}
                </span>
              </NavItem>
            ))}
          </Dropdown>{' '}
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.region.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore')(observer(RegionSetting))
