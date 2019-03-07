import * as React from 'react'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
import MoneyIn from 'react-material-icon-svg/dist/ArrowDownIcon'
import MoneyOut from 'react-material-icon-svg/dist/ArrowUpIcon'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'

import Mined from '../assets/images/play_for_work'
import CCCacheStore from '../stores/CCCacheStore'

const AccountBarLeftContainer = styledComponents.div`
  text-align: center;
  height: calc(100vh - 110px);
  display: grid;
  grid-template-rows: 16.5% 16.5% 16.5% 16.5% 16.5% 16.5%;
  align-items: center;
`

const Title = styledComponents.span`
  color: #232323;
  letter-spacing: 3px;
  font-size: 10px;
  text-transform: uppercase;
`

class AccountBarLeft extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sendOpen: false,
      tooltipSendOpen: false,
      tooltipReceiveOpen: false,
      receiveOpen: false,
    }

    this.toggleSend = this.toggleSend.bind(this)
    this.toggleReceive = this.toggleReceive.bind(this)
    this.toggleSendTooltip = this.toggleSendTooltip.bind(this)
    this.toggleReceiveTooltip = this.toggleReceiveTooltip.bind(this)
  }

  toggleSend() {
    this.setState({ sendOpen: !this.state.sendOpen })
  }

  toggleReceive() {
    this.setState({ receiveOpen: !this.state.receiveOpen })
  }

  toggleSendTooltip() {
    this.setState({
      tooltipSendOpen: !this.state.tooltipSendOpen,
    })
  }

  toggleReceiveTooltip() {
    this.setState({
      tooltipReceiveOpen: !this.state.tooltipReceiveOpen,
    })
  }

  getMonthlyOuputFormatted(CRYPSummaryFormatter) {
    return `${CRYPSummaryFormatter.format(this.props.TransactionStore.monthlyOutput)}`
  }

  getMonthlyIncomeFormatted(CRYPSummaryFormatter) {
    return `${CRYPSummaryFormatter.format(
      this.props.TransactionStore.monthlyIncome,
    )}`
  }

  getMonthlyMinedFormatted(CRYPSummaryFormatter) {
    return `${CRYPSummaryFormatter.format(
      this.props.TransactionStore.monthlyMined,
    )}`
  }

  render() {
    const formatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'currency',
        currency: CCCacheStore.get('currency', 'USD'),
        minimumFractionDigits: 2,
      },
    )

    const formatterPrice = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'currency',
        currency: CCCacheStore.get('currency', 'USD'),
        minimumFractionDigits: 5,
      },
    )

    const CRYPformatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      },
    )

    const CRYPSummaryFormatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'decimal',
        minimumFractionDigits: 2,
      },
    )

    return (
      <AccountBarLeftContainer className="container">
        <div>
          <Title>{i18nReact.translate('accountbar.crypbalance')}</Title>
          <h6 style={{ color: '#232323' }}>
            {CRYPformatter.format(
              this.props.AccountInformationStore.getBalance.total,
            )}{' '}
            CRYP
          </h6>
        </div>
        <div>
          <Title>{i18nReact.translate('accountbar.crypunsbalance')}</Title>
          <h6 style={{ color: '#232323' }}>
            {CRYPformatter.format(
              (this.props.AccountInformationStore.getBalance.instant_transparent || 0) + (this.props.AccountInformationStore.getBalance.instant_private || 0)
            )}{' '}
            CRYP
          </h6>
        </div>
        <div>
          <Title>{i18nReact.translate('accountbar.tbalance')}</Title>
          <h6 style={{ color: '#232323' }}>
            {CRYPformatter.format(
              this.props.AccountInformationStore.getBalance.transparent,
            )}{' '}
            CRYP
          </h6>
        </div>
        <div>
          <Title>{i18nReact.translate('accountbar.zbalance')}</Title>
          <h6 style={{ color: '#232323' }}>
            {CRYPformatter.format(
              this.props.AccountInformationStore.getBalance.private,
            )}{' '}
            CRYP
          </h6>
        </div>
        <div>
          <Title>
            {i18nReact.translate('accountbar.crypusd', {
              currency: this.props.SettingsStore.getCurrency,
            })}
          </Title>
          <h6 style={{ color: '#232323' }}>
            {/*NOT FOUND*/}
            {formatter.format(
              this.props.AccountInformationStore.getBalance.total *
              this.props.CoinStatsStore.priceWithCurrency,
            )}
          </h6>
        </div>
        <div>
          <Title>
            {moment().format('MMM YYYY')}{' '}
            {i18nReact.translate('transaction.summary')}
          </Title>
          <h6 style={{ color: '#232323' }}>
            <MoneyOut
              width={14}
              height={14}
              style={{ marginRight: '5px' }}
            />
            {this.getMonthlyOuputFormatted(CRYPSummaryFormatter)}<br />
            <MoneyIn
              width={14}
              height={14}
              style={{ marginRight: '5px' }}
            />
            {this.getMonthlyIncomeFormatted(CRYPSummaryFormatter)}<br />
            <Mined
              width={14}
              height={14}
              style={{ marginRight: '5px' }}
            />
            {this.getMonthlyMinedFormatted(CRYPSummaryFormatter)}
          </h6>
        </div>
      </AccountBarLeftContainer>
    )
  }
}

export default inject(
  'SettingsStore',
  'TransactionStore',
  'AccountInformationStore',
  'CoinStatsStore',
)(observer(AccountBarLeft))
