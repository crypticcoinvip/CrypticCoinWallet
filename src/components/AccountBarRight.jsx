import * as React from 'react';
import { inject, observer } from 'mobx-react';
import i18nReact from 'i18n-react';
import styledComponents from 'styled-components';

import MoneyIn from 'react-material-icon-svg/dist/ArrowDownIcon';
import MoneyOut from 'react-material-icon-svg/dist/ArrowUpIcon';
import SendModal from './modals/SendModal';
import ReceiveModal from './modals/ReceiveModal';
import CCCacheStore from '../stores/CCCacheStore';

const AccountBarRightContainer = styledComponents.div`
  text-align: center;
  height: calc(768px - 134px);
  display: grid;
  grid-template-rows: 262px 131px 131px 131px;
  align-items: center;
`;

const Title = styledComponents.span`
  color: #232323;
  letter-spacing: 3px;
  font-size: 10px;
  text-transform: uppercase;
`;

class AccountBarRight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendOpen: false,
      tooltipSendOpen: false,
      tooltipReceiveOpen: false,
      receiveOpen: false,
    };

    this.toggleSend = this.toggleSend.bind(this);
    this.toggleReceive = this.toggleReceive.bind(this);
  }

  toggleSend() {
    $('#sendModal').modal('open');
    this.setState({ sendOpen: !this.state.sendOpen });
  }

  toggleReceive() {
    $('#receiveModal').modal('open');
    this.setState({ receiveOpen: !this.state.receiveOpen });
  }

  getMonthlyOuputFormatted(CRYPSummaryFormatter) {
    return `${CRYPSummaryFormatter.format(this.props.TransactionStore.monthlyOutput)}`;
  }

  getMonthlyIncomeFormatted(CRYPSummaryFormatter) {
    return `+${CRYPSummaryFormatter.format(
      this.props.TransactionStore.monthlyIncome,
    )}`;
  }

  componentDidMount() {
    $('.tooltipped').tooltip();
  }

  render() {
    const formatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'currency',
        currency: CCCacheStore.get('currency', 'USD'),
        minimumFractionDigits: 2,
      },
    );

    const formatterPrice = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'currency',
        currency: CCCacheStore.get('currency', 'USD'),
        minimumFractionDigits: 5,
      },
    );

    const CRYPformatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      },
    );

    const CRYPSummaryFormatter = new Intl.NumberFormat(
      CCCacheStore.get('locale', 'en-US'),
      {
        style: 'decimal',
        minimumFractionDigits: 2,
      },
    );

    const bigNumber = new Intl.NumberFormat(
      this.props.SettingsStore.getLocale,
      {
        style: 'currency',
        currency: this.props.SettingsStore.getCurrency,
        minimumFractionDigits: 2,
        // the default value for minimumFractionDigits depends on the currency
        // and is usually already 2
      },
    );

    return (
      <AccountBarRightContainer className="container">
        <div>
          <SendModal toggle={this.toggleSend} />
          <ReceiveModal toggle={this.toggleReceive} />
          <div style={{
            textAlign: 'right',
            textTransform: 'uppercase',
            padding: '10px 0',
            marginTop: '32px',
          }}
          >
            {i18nReact.translate('account-bar.send')}
            <a
              className={
                this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded
                  ? 'send btn-floating btn-large amber lighten-2 waves-effect waves-light'
                  : 'send tooltipped btn-floating btn-large disabled'
              }
              id="sending"
              data-position="bottom"
              data-tooltip="To send CRYP unlock your wallet"
              style={{
                marginLeft: '12px',
                marginRight: '32px',
                padding: '14px',
                lineHeight: '40px',
              }}
              onClick={
                this.props.AccountInformationStore.unlocked
                  ? this.toggleSend
                  : () => {}
              }
            >
              <MoneyOut
                style={{ fill: '#fff' }}
              />
            </a>
          </div>
          <div style={{
            textAlign: 'right',
            textTransform: 'uppercase',
            padding: '10px 0',
          }}
          >
            {i18nReact.translate('account-bar.receive')}
            <a
              id="receiving"
              className={
                this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded
                  ? 'receive btn-floating btn-large amber lighten-2 waves-effect waves-light'
                  : 'receive tooltipped btn-floating btn-large disabled'
              }
              data-position="bottom"
              data-tooltip="To receive CRYP unlock your wallet"
              style={{
                marginLeft: '12px',
                marginRight: '32px',
                padding: '14px',
                lineHeight: '40px',
              }}
              onClick={
                this.props.AccountInformationStore.unlocked
                  ? this.toggleReceive
                  : () => {}
              }
            >
              <MoneyIn
                style={{ fill: '#fff' }}
              />
            </a>
          </div>
        </div>
        <div>
          <Title>
            {i18nReact.translate('accountbar.crypprice')}
          </Title>
          <h6 style={{ color: '#232323' }}>
            {/* NOT FOUND */}
            {formatterPrice.format(
              this.props.CoinStatsStore.priceWithCurrency,
            )}
          </h6>
        </div>
        <div>
          <Title>
            {i18nReact.translate('statistics.cap')}
          </Title>
          <h6 style={{ color: '#232323' }}>
            NOT FOUND
{/* {bigNumber.format(
              this.props.CoinStatsStore.getUpdatedStats.cap,
            )} */}
          </h6>
        </div>
        <div>
          <Title>
            {i18nReact.translate('statistics.change')}
          </Title>
          <h6 style={{ color: '#232323' }}>
            {/* NOT FOUND */}
            {/* {i18nReact.translate('statistics.hourchange')}{' '}
          {this.props.CoinStatsStore.getUpdatedStats.hourChange} %<br /> */}
            {i18nReact.translate('statistics.daychange')}{' '}
            {this.props.CoinStatsStore.getUpdatedStats.dayChange > 0 ? '+' + this.props.CoinStatsStore.getUpdatedStats.dayChange : this.props.CoinStatsStore.getUpdatedStats.dayChange } %<br />
            {i18nReact.translate('statistics.weekchange')}{' '}
            {this.props.CoinStatsStore.getUpdatedStats.weekChange > 0 ? '+' + this.props.CoinStatsStore.getUpdatedStats.weekChange : this.props.CoinStatsStore.getUpdatedStats.weekChange } %
          </h6>
        </div>
      </AccountBarRightContainer>
    );
  }
}

export default inject(
  'SettingsStore',
  'TransactionStore',
  'AccountInformationStore',
  'CoinStatsStore',
)(observer(AccountBarRight));
