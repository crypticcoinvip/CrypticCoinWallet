import { inject, observer } from 'mobx-react'
import * as React from 'react'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'
import uuidv5 from 'uuid/v5'

import Modal from '../Modal'
import secret from '../../secret'

const PasswordRow = styledComponents.input`
  -webkit-text-security: disc
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  border-radius: 10px;
  margin-top: 50px;
  background-color: hsl(210, 9%, 96%);
  border: none;
  width: '60%';
  display: 'flex';
  justify-content: 'center'
`;

const Input = styledComponents.input`
  margin: 0 !important;
`

const BalanceTitle = styledComponents.div`
  text-shadow: 0 0 73px rgba(255, 255, 255, 0.1);
  color: #476b84;
  font-size: 8px;
  font-weight: 400;
  line-height: 10.53px;
  text-transform: uppercase;
  letter-spacing: 2.12px;
`

const Balance = styledComponents.div`
  text-shadow: 0 0 73px rgba(255, 255, 255, 0.1);
  color: #476b84;
  font-size: 20px;
  font-weight: 400;
  line-height: 20.54px;
`

const Info = styledComponents.p`
  color: #232323;
  margin: 10px 0;
`

const FEE = 0.01;

const SendState = {
  OPEN: 1,
  SENDING: 2,
  DONE: 3,
  ERROR: 4,
}

class SendModal extends React.Component {
  state = {
    amount: 0,
    address: this.props.address || '',
    from: this.props.from || '',
    label: '',
    status: SendState.OPEN,
    error: null,
    password: '',
    isPassword: false,
    warningAddressTo: false,
    warningAddressFrom: false,
    warningAmount: false,
  }

  getLocaleId() {
    return this.props.SettingsStore.getLocale
  }

  getBalance() {
    return this.props.AccountInformationStore.getBalance
  }

  getPrice() {
    return this.props.CoinStatsStore.priceWithCurrency
  }

  sendTransaction() {
    const {
      address, amount, isPassword, password, warningAddressTo, warningAddressFrom, warningAmount,
    } = this.state

    const from = this.props.AddressStore.lastSend

    const { AccountInformationStore } = this.props

    if (!address) {
      this.setState({
        warningAddressTo: true,
        warningAddressFrom: false,
        warningAmount: false,
      });
      return;
    }

    if (!from) {
      this.setState({
        warningAddressTo: false,
        warningAddressFrom: true,
        warningAmount: false,
      });
      return;
    }

    if (!amount) {
      this.setState({
        warningAddressTo: false,
        warningAddressFrom: false,
        warningAmount: true,
      });
      return;
    }

    if (!address || !amount || !AccountInformationStore) return;

    if (!isPassword) {
      this.setState({ isPassword: true });
      return;
    }

    const data = localStorage.getItem('cryp_hash');
    const hash = uuidv5(password, secret);

    if (data !== hash) return;

    this.setState({ status: SendState.SENDING, error: null });

    if (address.substr(0, 2) === 'zc' || from) { Materialize.toast(`${i18nReact.translate('asyncOperations.send')} ${i18nReact.translate('asyncOperations.started')}`, 3000); }

    setTimeout(() => {
      AccountInformationStore.sendTransaction(address, amount, from)
        .then((result) => {
          if (address.substr(0, 2) === 'zc' || from) {
            const opId = result;
            const interval = setInterval(() => {
              AccountInformationStore.getOperationStatus([opId])
                .then((statuses) => {
                  const { status } = statuses[0];
                  Materialize.Toast.removeAll();
                  Materialize.toast(`${i18nReact.translate('asyncOperations.send')} ${i18nReact.translate(`asyncOperations.${status}`)}`, 4000);
                  if (status === 'cancelled' || status === 'failed' || status === 'success') {
                    clearInterval(interval);
                    this.setState({
                      status: SendState.OPEN,
                      error: status === 'failed' ? statuses[0].error.message : null,
                    });
                  }
                  if (status === 'success') {
                    setTimeout(() => {
                      this.props.toggle();
                      this.setState({
                        amount: 0,
                        address: '',
                        label: '',
                        status: SendState.OPEN,
                      });
                    }, 1000);
                  }
                });
            }, 5000);
          } else {
            setTimeout(() => {
              this.setState({ status: SendState.DONE });
              setTimeout(() => {
                this.props.toggle();
                this.setState({
                  amount: 0,
                  address: '',
                  label: '',
                  status: SendState.OPEN,
                });
              }, 1000);
            }, 500);
          }
        })
        .catch((e) => {
          this.setState({
            status: SendState.ERROR,
            error: JSON.parse(e).error.message,
          });
          setTimeout(() => {
            this.setState({
              status: SendState.OPEN,
              error: null,
            });
          }, 2500);
        });
    }, 1000);
  }

  render() {
    const { props } = this;
    const { warningAddressTo, warningAddressFrom, warningAmount } = this.state;
    return (
      <Modal
        {...props}
        id="sendModal"
        title={i18nReact.translate('sendPanel.title')}
        style={{
          maxHeight: '90%',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col s9 offset-s3">
              <div className="container">
                <Info>
                  {i18nReact.translate('sendPanel.recipient')}
                </Info>
                <Input
                  // style={{ borderColor: "red", borderWidth: '3px' }}
                  value={this.state.address}
                  name="address"
                  id="passpharse"
                  placeholder={i18nReact.translate('sendPanel.addressplaceholder')}
                  onChange={e => this.setState({ address: e.target.value })}
                />
                <label style={{ color: warningAddressTo ? 'red' : '' }}>
                  {i18nReact.translate('sendPanel.fundwarning')}
                </label>
                <Info>
                  {i18nReact.translate('sendPanel.sender')}
                </Info>
                <Input
                  value={this.props.AddressStore.lastSend}
                  name="from"
                  onChange={e => { this.props.AddressStore.lastSend = e.target.value }}
                  placeholder={
                    i18nReact.translate('sendPanel.zaddressplaceholder')
                  }
                />
                <label style={{ color: warningAddressFrom ? 'red' : '' }}>
                  {i18nReact.translate('sendPanel.zaddressInfo')}
                </label>
                <div className="container" style={{ marginBottom: '20px', marginTop: '16px' }}>
                  <div className="row">
                    <div className="col s5">
                      <Info>
                        {i18nReact.translate('sendPanel.amount')}
                      </Info>
                      <Input
                        value={this.state.amount}
                        onChange={(event) => {
                          const regex = /^[0-9.,]+$/;
                          const amount = event.target.value;
                          if (amount === '' || regex.test(amount)) {
                            this.setState({ amount });
                          }
                        }}
                        placeholder={
                          i18nReact.translate('sendPanel.amountplaceholder')
                        }
                      />
                      <label style={{ color: warningAmount ? 'red' : '' }}>
                        {i18nReact.translate('sendPanel.amountInfo')}
                      </label>
                    </div>
                    <div className="col s6 offset-s1">
                      <Info>
                        {i18nReact.translate('sendPanel.addressLabel')}
                      </Info>
                      <Input
                        placeholder={
                          i18nReact.translate('Example: John Doe')
                        }
                        value={this.state.label}
                        onChange={e => this.setState({ label: e.target.value })}
                      />
                      <label>
                        {i18nReact.translate('sendPanel.labelInfo')}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="container" style={{ marginBottom: '20px', marginTop: '16px' }}>
                  <div className="row">
                    <div className="col s5">
                      <BalanceTitle>
                        {i18nReact.translate('sendPanel.crypUSD')}
                      </BalanceTitle>
                      <Balance>
                        $
                        {(this.getBalance().total * this.getPrice()).toLocaleString(this.getLocaleId())}
                      </Balance>
                    </div>
                    <div className="col s6 offset-s1">
                      <BalanceTitle>
                        {i18nReact.translate('sendPanel.balanceCRYP')}
                      </BalanceTitle>
                      <Balance>
                        {this.getBalance().total.toLocaleString(this.getLocaleId())}
                        {' '}
                        CRYP
                      </Balance>
                    </div>
                  </div>
                </div>
                {
                  this.state.isPassword
                  && (
                    <div style={{ paddingBottom: '20px' }}>
                      <PasswordRow
                        placeholder="Confirm your password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                      />
                    </div>
                  )
                }
                <button
                  onClick={() => this.sendTransaction()}
                  className={
                    this.state.status === SendState.SENDING ? 'btn grey darken-3 disabled' : 'btn grey darken-3'
                  }
                >
                  {this.state.status === SendState.OPEN
                    && `${i18nReact.translate('sendPanel.sendButton')}${' '}
                  ${
                    this.state.amount
                      ? `${this.state.amount.toLocaleString(this.getLocaleId())} CRYP ($${(this.state.amount * this.getPrice()).toLocaleString(this.getLocaleId())}) + ${FEE.toLocaleString(this.getLocaleId())} CRYP Fee`
                      : ''
                    }`}
                  {this.state.status === SendState.SENDING
                    && i18nReact.translate('sendPanel.sending')}
                  {this.state.status === SendState.ERROR && this.state.error}
                  {this.state.status === SendState.DONE
                    && i18nReact.translate('sendPanel.sent')}
                </button>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <label style={{ textAlign: 'center', color: '#476b84' }}>
                    {i18nReact.translate('sendPanel.walletAfterTransaction')}
                    {' '}
                    <b>
                      {(this.getBalance().total - this.state.amount - FEE).toLocaleString(this.getLocaleId())}
                      {' '}
                      CRYP
                    </b>
                  </label>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <label
                    style={{
                      textAlign: 'center',
                      marginTop: '20px',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: '19px',
                    }}
                  >
                    {i18nReact.translate('sendPanel.sendWarning')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default inject(
  'SettingsStore',
  'CoinStatsStore',
  'AccountInformationStore',
  'AddressStore'
)(observer(SendModal));
