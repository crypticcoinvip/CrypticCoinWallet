import * as React from 'react'
import * as T from 'i18n-react'
import * as moment from 'moment'
import * as styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { Collapsible, CollapsibleItem } from 'react-materialize'
import { fadeIn } from 'react-animations'

const TextContainer = styled.default.div`
  line-height: 24px;
  color: ${props => (props.theme.light ? '#999999;' : '#7193ae;')};
`

const AddressDetailsFooter = styled.default.div`
  font-weight: 800;
  font-size: 12px;
`

class Address extends React.Component {
  getType(amount, category, fee) {
    if (amount !== 0) {
      return category.includes('receive')
        ? T.default.translate('transaction.item.receive')
        : T.default.translate('transaction.item.sent')
    }

    if ((!amount || amount === 0) && fee < 0) {
      return T.default.translate('transaction.item.fee')
    }

    return T.default.translate('transaction.item.unknown')
  }

  isNew() {
    return this.props.time + 90 * 60 - moment().unix() > 0
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
      account = '',
      address = '',
      amount = 0,
      confirmations = 0,
      type = 't',
      AddressStore,
    } = this.props

    return (
      <li>
        <div
          className="collapsible-header transactions"
          onClick={() => {
          }}
        >
          <div
            className={'col s8'}
            style={{
              fontWeight: 'bold',
              textAlign: 'left',
              letterSpacing: '1px',
              fontSize: '22px',
              padding: '0 1.75rem 0 0.75rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 400,
                }}
              >
                {address.length > 38 ? address.substr(0, 35) + '...' : address}
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
              </span>
            </TextContainer>
          </div>
          <div
            className="col s4"
            style={{
              textAlign: 'right',
              fontWeight: 500,
              fontSize: '13px',
              padding: '0 2rem 0 0.75rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 400,
                  color: (amount > 0 ? '#232323' : '#cacaca')
                }}
              >
                {Math.abs(amount)
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
                {T.default.translate('address.confirmations')}{' '}{confirmations}
              </span>
            </TextContainer>
          </div>          
        </div>
        <div className="collapsible-body transactions">
          <div className="container">
            <AddressDetailsFooter className="row">
              {type == 't' ? 'transparent' : 'private'}
            </AddressDetailsFooter>
            <div className="row" style={{ wordWrap: 'break-word' }}>
              {address}
            </div>
          </div>  
        </div>        
      </li>
    )
  }
}

export default inject('AddressStore', 'SettingsStore')(
  observer(Address),
)
