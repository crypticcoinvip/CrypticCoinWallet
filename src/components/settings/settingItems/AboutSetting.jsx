import * as React from 'react'
import { Dropdown, NavItem, Button } from 'react-materialize'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'
import AboutModal from '../../modals/AboutModal'

export class AboutSetting extends React.Component {
  constructor(props) {
    super(props)

  }

  toggle() {
    $(`#aboutModal`).modal('open')
  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.about.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <AboutModal toggle={this.toggle} />
          <Button className="grey darken-3" onClick={
            this.toggle
          }>{i18nReact.translate('settings.about.button')}</Button>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">

          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore')(observer(AboutSetting))
