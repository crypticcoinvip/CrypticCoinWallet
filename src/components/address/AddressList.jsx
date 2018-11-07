import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Collapsible, CollapsibleItem } from 'react-materialize'
import styled from 'styled-components'
import T from 'i18n-react'
import List from 'react-material-icon-svg/dist/ViewListIcon'

import LoadingIcon from '../LoadingIcon'
import SearchBar from './SearchBar'
import Address from './Address'

const AddressTitle = styled.div`
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
`

class AddressList extends Component {

  render() {
    const CRYPFormatter = new Intl.NumberFormat(
      this.props.SettingsStore.getLocale,
      {
        style: 'decimal',
        minimumFractionDigits: 2,
      },
    )

    return (
      <div id="addresses" className="col s12">
        <div className="container">
          <div className="container">
            <div className="row">
              <AddressTitle className="col m6 hide-on-small-only">
                <List
                  style={{ fill: '#232323', marginRight: '10px' }}
                />{' '}
                {T.translate('address.list')}
                {this.props.AddressStore.loaded ? 
                  <span style={{ paddingLeft: '12px' }}>{this.props.AddressStore.getAddressCount || '0'}</span> :
                  <LoadingIcon style={{ fill: '#232323', marginLeft: '12px' }}/>
                }
              </AddressTitle>
              <div className="col s12 m6">
                <SearchBar />
              </div>
            </div>
          </div>
          {this.props.AddressStore.loaded ? (
            <div>
              <Collapsible style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 177px)' }}>
                {this.props.AddressStore.lastAddress.map(
                  address => (
                    <Address {...address} key={`${address.address}`} />
                  ),
                )}
                <li className="nothing-found">
                  <div style={{ textAlign: 'center', padding: '19px' }}>Ooops... Nothing found</div>
                </li>                
              </Collapsible>
            </div>
          ) : (
            null
          )}
        </div>
      </div>
    )
  }
}

export default inject('AddressStore', 'SettingsStore')(
  observer(AddressList),
)
