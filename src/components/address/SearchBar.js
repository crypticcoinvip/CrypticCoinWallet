import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import i18nReact from 'i18n-react';
import Clear from 'react-material-icon-svg/dist/CloseIcon';

const SearchRow = styled.input`
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 !important;
  border-radius: 10px;
  background-color: hsl(210, 9%, 96%);
  border: none;
`;

const SearchBar = ({ AddressStore }) => (
  <div style={{ position: 'relative' }}>
    <SearchRow
      className="input-field"
      placeholder={i18nReact.translate('address.searchplaceholder')}
      disabled={AddressStore.loaded ? false : 'disabled'}
      value={AddressStore.searchValue}
      onChange={e => AddressStore.setSearch(e)}
      id="searchAddress"
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
        AddressStore.clearSearch();
      }}
    />
  </div>
);

export default inject('AddressStore')(observer(SearchBar));
