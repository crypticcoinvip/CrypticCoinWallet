import React from 'react'
import { inject, observer } from 'mobx-react'
import Clear from 'react-material-icon-svg/dist/CloseIcon'
import styled from 'styled-components'
import i18nReact from 'i18n-react'

const SearchRow = styled.input`
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 !important;
  border-radius: 10px;
  background-color: hsl(210, 9%, 96%);
  border: none;
`

const SearchBar = ({ TransactionStore }) => (
  <div style={{ position: 'relative' }}>
    <SearchRow
      className="input-field"
      placeholder={i18nReact.translate('transaction.searchplaceholder')}
      disabled={TransactionStore.loaded ? false : 'disabled'}
      value={TransactionStore.searchValue}
      onChange={e => TransactionStore.setSearch(e)}
      id="search"
    />
    <Clear
      style={{
        fill: '#ccc',
        position: 'absolute',
        right: '0px',
        top: '12px',
        cursor: 'pointer',
      }}
      onClick={() => {
        TransactionStore.clearSearch();
      }}
    />
  </div>
)

export default inject('TransactionStore')(observer(SearchBar))
