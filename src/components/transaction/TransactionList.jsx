import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Collapsible, CollapsibleItem } from 'react-materialize';
import styled from 'styled-components';
import T from 'i18n-react';
import List from 'react-material-icon-svg/dist/ViewListIcon';

import ArrowDown from '../../icons/ArrowDown';
import ArrowUp from '../../icons/ArrowUp';
import Loading from '../../icons/Loading';
import LoadingIcon from '../LoadingIcon';
import SearchBar from './SearchBar';
import Transaction from './Transaction';

const TransactionTitle = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  font-size: 26px;
  height: 45px;
  padding-top: 10px !important;
  ${props => (props.theme.light ? '' : 'color: #fff;')};
  > svg {
    ${props => (props.theme.light ? '' : 'fill: #fff;')};
  }
`;

class TransactionList extends Component {
  getMonthlyOuputFormatted(XVGSummaryFormatter) {
    return XVGSummaryFormatter.format(this.props.TransactionStore.monthlyOutput);
  }

  getMonthlyIncomeFormatted(XVGSummaryFormatter) {
    return `+${XVGSummaryFormatter.format(
      this.props.TransactionStore.monthlyIncome,
    )}`;
  }

  componentDidMount() {

  }

  render() {
    const XVGFormatter = new Intl.NumberFormat(
      this.props.SettingsStore.getLocale,
      {
        style: 'decimal',
        minimumFractionDigits: 2,
      },
    );

    return (
      <div id="account" className="col s12">
        <div className="container">
          <div className="container">
            <div className="row">
              <TransactionTitle className="col s6">
                <List
                  style={{ fill: '#232323', marginRight: '10px' }}
                />
                {' '}
                {T.translate('transaction.list')}
                {this.props.TransactionStore.loaded
                  ? (
                    <span style={{ paddingLeft: '12px' }}>
                      {this.props.TransactionStore.getTransactionCount > 10
                        ? '10+'
                        : this.props.TransactionStore.getTransactionCount}
                    </span>
                  )
                  : <LoadingIcon style={{ fill: '#232323', marginLeft: '12px' }} />
                }
              </TransactionTitle>
              <div className="col s6">
                <SearchBar />
              </div>
            </div>
          </div>
          {this.props.TransactionStore.loaded ? (
            <div>
              <Collapsible style={{ overflow: 'overlay', maxHeight: '586px' }}>
                {this.props.TransactionStore.lastTenTransaction.map(
                  transaction => (
                    <Transaction {...transaction} key={`${transaction.txid}#${transaction.category}#${transaction.address}#${transaction.timereceived}`} />
                  ),
                )}
                <li className="nothing-found">
                  <div style={{ textAlign: 'center', padding: '19px' }}>
                    Welcome to The CrypticCoin Wallet.
                  </div>
                </li>
              </Collapsible>
            </div>
          ) : (
            null
          )}
        </div>
      </div>
    );
  }
}

export default inject('TransactionStore', 'SettingsStore')(
  observer(TransactionList),
);
