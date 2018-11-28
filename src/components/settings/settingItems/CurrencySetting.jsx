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
  },
  {
    currency: 'BTC',
    locale: 'en-US',
  },
  {
    currency: 'AUD',
    locale: 'en-AU',
  },
  {
    currency: 'CAD',
    locale: 'en-CA',
  },
  {
    currency: 'CZK',
    locale: 'cs-CZ',
  },
  {
    currency: 'GBP',
    locale: 'en-GB',
  },
  {
    currency: 'HKD',
    locale: 'zh-HK',
  },
  {
    currency: 'JPY',
    locale: 'ja-JP',
  },
  {
    currency: 'NZD',
    locale: 'en-NZ',
  },
  {
    currency: 'PHP',
    locale: 'fil-PH',
  },
  {
    currency: 'RUB',
    locale: 'ru-RU',
  },
  {
    currency: 'THB',
    locale: 'th-TH',
  },
  {
    currency: 'TWD',
    locale: 'zh-TW',
  },
  {
    currency: 'KRW',
    locale: 'ko-KR',
  }
]

export class CurrencySetting extends React.Component {
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
            {i18nReact.translate('settings.currency.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <Dropdown trigger={
            <Button className="grey darken-3">{this.props.SettingsStore.getCurrency}</Button>
          } options={{ constrainWidth: false }}>
            {locales.map(locale => (
              <NavItem key={`${locale.currency}`}
                onClick={() => {
                  this.props.SettingsStore.setSettingOption({
                    key: 'currency', 
                    value: locale.currency,
                  })
                  this.props.SettingsStore.setSettingOption({
                    key: 'locale',
                    value: locale.locale,
                  })
                }}
              >
                <span className="grey-text text-darken-1">
                  {locale.currency}{' '}
                  <em>
                    ({new Intl.NumberFormat(locale.locale, {
                      style: 'currency',
                      currency: locale.currency,
                      minimumFractionDigits: 2,
                      // the default value for minimumFractionDigits depends on the currency
                      // and is usually already 2
                    }).format(1234567.089)})
                  </em>
                </span>
              </NavItem>
            ))}
          </Dropdown>{' '}
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.currency.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore')(observer(CurrencySetting))
