import * as React from 'react'
import { QRCode as QRCodeReact } from 'react-qr-svg';
import Repeat from 'react-material-icon-svg/dist/RepeatIcon'
import { observer, inject } from 'mobx-react'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'

import Modal from '../Modal'

const Info = styledComponents.p`
  color: #232323;
  margin: 10px 0;
`

const Input = styledComponents.input`
  margin: 0 !important;
`

class ReceiveModal extends React.Component {
  state = {
    isLoadingAddress: false,
    isLoadingZAddress: false,
    address: '',
  }

  createNewAddress() {
    this.setState({
      isLoadingAddress: true,
    })
    this.props
      .AccountInformationStore.receiveNewAddress()
      .then(address => this.setState({ address, isLoadingAddress: false }))
  }

  createNewZAddress() {
    this.setState({
      isLoadingZAddress: true,
    })
    this.props
      .AccountInformationStore.receiveNewZAddress()
      .then(address => this.setState({ address, isLoadingZAddress: false }))
  }

  render() {
    const title = i18nReact.translate('receive.title')
    return (
      <Modal
        {...this.props}
        title={title}
        id="receiveModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s3">
              <QRCodeReact
                value={this.state.address ? this.state.address : 'Please generate address'}
                size={128}
                bgColor={'#ffffff'}
                fgColor={'#152f36'}
                level={'M'}
                height={128}
                width={128} 
              />
            </div>
            <div className="col s9">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <Info>{i18nReact.translate('receive.address')}</Info>
                  <Input
                    placeholder={
                      i18nReact.translate('receive.generate')
                    }
                    onChange={() => {}}
                    value={this.state.address}
                  />
                  <label>{i18nReact.translate('receive.labelInfo')}</label><br />
                </div>
                <button
                  className="btn grey darken-3 waves-effect waves-light"
                  onClick={
                    !this.state.isLoadingAddress
                      ? () => this.createNewAddress()
                      : () => {}
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}                      
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('receive.taddress')}
                </button>
                <button
                  className="btn grey darken-3 waves-effect waves-light"
                  onClick={
                    !this.state.isLoadingZAddress
                      ? () => this.createNewZAddress()
                      : () => {}
                  }
                  style={{
                    display: 'inline-flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}                      
                >
                  <Repeat style={{ fill: '#fff', marginRight: '10px' }} />{i18nReact.translate('receive.zaddress')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default inject('AccountInformationStore')(observer(ReceiveModal))
