import * as React from 'react';
import { inject, observer } from 'mobx-react';
import i18nReact from 'i18n-react';
import styledComponents from 'styled-components';

import MoneyIn from 'react-material-icon-svg/dist/ArrowDownIcon';
import MoneyOut from 'react-material-icon-svg/dist/ArrowUpIcon';
import FlashOn from 'react-material-icon-svg/dist/FlashOutlineIcon'
import SendModal from './modals/SendModal';
import ReceiveModal from './modals/ReceiveModal';
import CCCacheStore from '../stores/CCCacheStore';

const AccountBarRightSmallContainer = styledComponents.div`
  text-align: center;
  height: calc(100vh - 110px);
  display: grid;
  grid-template-rows: 49.5% 16.5% 16.5% 16.5%;
  align-items: center;
`;

class AccountBarRightSmall extends React.Component {
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
    return (
      <AccountBarRightSmallContainer className="container">

        <div className="fixed-action-btn bottom-fixed">
          <a className={
              this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded
                ? 'send btn-floating btn-large amber lighten-2 waves-effect waves-light'
                : 'send tooltipped btn-floating btn-large disabled'
            }
            id="sending"
            data-position="bottom"
            data-tooltip={this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded ? 
              "" : "To send CRYP unlock your wallet"}
            style={{
              padding: '17px',
              lineHeight: '40px',
            }}>
            <FlashOn style={{ fill: '#fff' }}/>
          </a>
          <ul>
            <li>
              <a
                className={
                  this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded
                    ? 'send btn-floating amber lighten-2 waves-effect waves-light'
                    : 'send tooltipped btn-floating disabled'
                }
                id="sending"
                data-position="bottom"
                data-tooltip={this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded ? 
                  "" : "To send CRYP unlock your wallet" }
                style={{
                  padding: '8px',
                  lineHeight: '30px',
                }}
                onClick={
                  this.props.AccountInformationStore.unlocked
                    ? this.toggleSend
                    : () => { }
                }
              >
                <MoneyOut
                  style={{ fill: '#fff' }}
                />
              </a>
            </li>
            <li>
              <a
                id="receiving"
                className={
                  this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded
                    ? 'receive btn-floating amber lighten-2 waves-effect waves-light'
                    : 'receive tooltipped btn-floating disabled'
                }
                data-position="bottom"
                data-tooltip={this.props.AccountInformationStore.unlocked && this.props.AccountInformationStore.info.loaded ? 
                  "To receive CRYP unlock your wallet" : "" }
                style={{
                  padding: '8px',
                  lineHeight: '30px',
                }}
                onClick={
                  this.props.AccountInformationStore.unlocked
                    ? this.toggleReceive
                    : () => { }
                }
              >
                <MoneyIn
                  style={{ fill: '#fff' }}
                />
              </a>
            </li>
          </ul>
        </div>

      </AccountBarRightSmallContainer>
    );
  }
}

export default inject(
  'SettingsStore',
  'TransactionStore',
  'AccountInformationStore',
  'CoinStatsStore',
)(observer(AccountBarRightSmall));
