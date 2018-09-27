import * as React from 'react'
import * as T from 'i18n-react'
import * as moment from 'moment'
import * as styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { fadeIn } from 'react-animations'
import ArrowDown from 'react-material-icon-svg/dist/ArrowDownIcon'
import ArrowUp from 'react-material-icon-svg/dist/ArrowUpIcon'
import CheckCircle from 'react-material-icon-svg/dist/CheckCircleOutlineIcon'
import AccessTime from 'react-material-icon-svg/dist/TimerIcon'
import Info from 'react-material-icon-svg/dist/InformationOutlineIcon'
import { shell } from 'electron'

import ArrowWork from '../../assets/images/play_for_work'

const TextContainer = styled.default.div`
  line-height: 24px;
  color: ${props => (props.theme.light ? '#999999;' : '#7193ae;')};
`

const TransactionIcon = styled.default.div`
  display: inline-flex;
  padding: 7px;
  border-radius: 52%;
  height: 32px;
  width: 32px;
  background-color: ${(props) => (!props.up ? '#00917a' : 'rgb(222,222,222)')};
  .arrow-down,
  .arrow-up {
    stroke-width: 3px;
  }
`

const CenterDiv = styled.default.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const fadeInAnimation = styled.keyframes`
  ${fadeIn};
`

const TransactionDetails = styled.default.div`
  animation: 1s ${fadeInAnimation};
  padding-left: 8px;
  margin: 10px 0px;
`

const TransactionDetailsHeader = styled.default.div`
  font-weight: 800;
  font-size: 14px;
  font-style: bold;
`

const TransactionDetailsFooter = styled.default.div`
  font-weight: 800;
  font-size: 12px;
`

const TransactionDetailsMoney = styled.default.div`
  margin-top: 2px;
  margin-bottom: 2px;
  font-weight: 800;
  font-size: 18px;
  color: #000;
`

const TransactionDetailProp = styled.default.div`
  padding: 0px !important;
  display: inline-flex;
  align-items: center;
`

const ExternalLinks = styled.default.a`
  margin-right: 5px;
  margin-left: 5px;
`

class Transaction extends React.Component {
  getType(amount, category, fee) {
    if (amount !== 0) {
      if (category.includes('receive'))
        return T.default.translate('transaction.item.receive')
      else if (category.includes('immature') || category.includes('generate'))
        return T.default.translate('transaction.item.mined')
      else
        return T.default.translate('transaction.item.sent')
    }

    if ((!amount || amount === 0) && fee < 0) {
      return T.default.translate('transaction.item.fee')
    }

    return T.default.translate('transaction.item.unknown')
  }

  isNew() {
    return this.props.time + 90 * 60 - moment().unix() > 0
  }

  isReceived(category) {
    return (category.includes('receive') || category.includes('receive'))
  }

  render() {
    const crypFormatter = new Intl.NumberFormat(
      this.props.SettingsStore.getLocale,
      {
        minimumSignificantDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      },
    )

    const {
      address = '',
      amount = 0,
      fee = 0,
      category = '',
      confirmations = 0,
      timereceived = 0,
      time = 0,
      txid = '',
      hide = false,
      blockhash = '',
      TransactionStore,
    } = this.props

    return (
      <li>
        <div
          className="collapsible-header transactions"
          onClick={() => {
            TransactionStore.setVisibility(
              txid,
              category,
              address,
              timereceived,
              !hide,
            )
          }}
        >
          <div
            className="col s1"
            style={{
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '13px',
            }}
          >
            <TextContainer>
              {moment
                .unix(time)
                .format('MMM')
                .toUpperCase()}
            </TextContainer>
            <TextContainer
              style={{
                fontWeight: 300,
                fontSize: '22px',
                lineHeight: '1.0',
                color: '#cacaca',
              }}
            >
              {moment.unix(time).format('DD')}
            </TextContainer>
          </div>
          <CenterDiv className="col s1">
            {category.includes('receive') ? (
              <TransactionIcon>
                <ArrowDown width={18} height={18} />
              </TransactionIcon>
            ) : category.includes('send') ? (
              <TransactionIcon {...{ up: true }}>
                <ArrowUp width={18} height={18} />
              </TransactionIcon>
            ) : (
              <TransactionIcon {...{ up: true }}>
                <ArrowWork width={18} height={18} />
              </TransactionIcon>
            )}
          </CenterDiv>
          <div
            className={'col s9'}
            style={{
              fontWeight: 'bold',
              color: category.includes('send') ? '#dc2b3d' : '#00917a',
              textAlign: 'right',
              letterSpacing: '1px',
              fontSize: '22px',
              padding: '0 2rem 0 0.75rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 400,
                }}
              >
                {category.includes('send') ? '-' : '+'}
                {Math.abs(amount + fee)
                  .toFixed(3)
                  .toLocaleString()}{' '}
                CRYP
              </span>
            </div>
            <TextContainer>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                }}
              >
                {this.getType(amount, category, fee)}
              </span>
            </TextContainer>
          </div>
        </div>
        <div className="collapsible-body transactions">
          <div className="container">
            <TransactionDetailsHeader className="row">
              {this.getType(amount, category, fee)} transaction{' · '}
              {moment.unix(time).fromNow()}
            </TransactionDetailsHeader>
            <TransactionDetailsMoney className="row">
              CRYP {crypFormatter.format(Math.abs(amount + fee))}{' '}
              {category.includes('receive') ? '+' : '-'}
            </TransactionDetailsMoney>
            <TransactionDetailsFooter className="row">
              {category.includes('receive') ? 'to' : 'from'} {address}
            </TransactionDetailsFooter>
            <div className="row">
              <TransactionDetailProp className="col s6">
                <CheckCircle
                  height={15}
                  width={15}
                  style={{ fill: 'rgba(100,100,100, 0.5)', marginRight: '7px' }}
                />{' '}
                {confirmations > 0
                  ? `${confirmations} ${T.default.translate(
                      'transaction.item.confirmations',
                    )}`
                  : T.default.translate('transaction.item.outofsync')}
              </TransactionDetailProp>
              <TransactionDetailProp className="col s6">
                <AccessTime
                  height={15}
                  width={15}
                  style={{
                    fill: 'rgba(100,100,100, 0.75)',
                    marginRight: '7px',
                  }}
                />{' '}
                {moment.unix(time).format('MMMM Do YYYY, h:mm:ss a')}
              </TransactionDetailProp>
            </div>
            <div className="row">
              <TransactionDetailProp className="col s12">
                <Info
                  height={15}
                  width={15}
                  style={{ fill: 'rgba(100,100,100, 0.7)', marginRight: '7px' }}
                />{' '}
                {T.default.translate('transaction.item.more')}
                <ExternalLinks href="#" onClick={() => 
                  shell.openExternal("https://explorer.crypticcoin.io/tx/" + txid)
                }>
                  {T.default.translate('transaction.item.opentransaction')}
                </ExternalLinks>
                {'  '}
                <ExternalLinks href="#" onClick={() => 
                  shell.openExternal("https://explorer.crypticcoin.io/block/" + blockhash)
                }>
                  {T.default.translate('transaction.item.openblock')}
                </ExternalLinks>
              </TransactionDetailProp>
            </div>
          </div>  
        </div>        
      </li>
    )
  }
}

export default inject('TransactionStore', 'SettingsStore')(
  observer(Transaction),
)
