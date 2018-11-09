import * as React from 'react'
import { inject, observer } from 'mobx-react'
import T from 'i18n-react'
import Lock from 'react-material-icon-svg/dist/LockIcon'
import Unlock from 'react-material-icon-svg/dist/LockOpenIcon'
import Logout from 'react-material-icon-svg/dist/LogoutIcon'
import Check from 'react-material-icon-svg/dist/CheckIcon'
import WifiIcon from 'react-material-icon-svg/dist/WifiIcon'
import WifiOffIcon from 'react-material-icon-svg/dist/WifiOffIcon'

import LoadingIcon from '../LoadingIcon'
import UnlockModal from '../modals/UnlockModal'
import LockModal from '../modals/LockModal'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.toggleUnlock = this.toggleUnlock.bind(this)
    this.updateStealth = this.updateStealth.bind(this)
    this.state = {
      dropdownOpen: false,
      modal: false,
      dropdownOpenNotifiaction: false,
    }
  }

  componentDidUpdate() {
    console.log(this.getBlockSyncInfo())
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  toggleUnlock() {
    if (this.props.AccountInformationStore.unlocked === true && this.props.AccountInformationStore.encrypted === false) {
      $(`#lockModal`).modal('open')
    } else if (this.props.AccountInformationStore.unlocked === false) {
      $(`#unlockModal`).modal('open')
    }
    this.setState({ modal: !this.state.modal })
  }

  getConnectionInfo() {
    if (!this.props.AccountInformationStore.info.loaded) {
      return 0;
    }
    return this.props.AccountInformationStore &&
      this.props.AccountInformationStore.info &&
      this.props.AccountInformationStore.info.connections
      ? this.props.AccountInformationStore.info.connections
      : 0
  }

  updateStealth() {
    this.props.SettingsStore.setSettingOption({
      key: 'darkTheme',
      value: !this.props.SettingsStore.getDarkTheme,
    })
  }

  getBlockSyncInfo() {
    if (
      this.props.AccountInformationStore.info &&
      !this.props.AccountInformationStore.info.blocks
    ) {
      return this.props.AccountInformationStore.info.loadingProgress
        ? `${T.translate('header.loading')} ${
        this.props.AccountInformationStore.info.loadingProgress
        }%`
        : T.translate('header.loading')
    }

    let syncInfo = (this.props.AccountInformationStore.info.blocks /
      (this.props.AccountInformationStore.info.highestBlock)) * 100

    if (syncInfo > 100)
      syncInfo = 100
    else if (syncInfo < 0)
      syncInfo = 0

    return this.props.AccountInformationStore.info &&
      this.props.AccountInformationStore.info.blocks
      ? `${Number(syncInfo).toFixed(2)} % ${T.translate('header.synced')}`
      : T.translate('header.notsyncing')
  }

  isSynced() {
    let syncInfo = 0

    if (
      this.props.AccountInformationStore.info &&
      !this.props.AccountInformationStore.info.blocks
    ) {
      return false
    }

    syncInfo = (this.props.AccountInformationStore.info.blocks /
      (this.props.AccountInformationStore.info.highestBlock)) * 100

    if (syncInfo > 100)
      syncInfo = 100
    else if (syncInfo < 0)
      syncInfo = 0

    return syncInfo === 100
  }

  isUnlocked() {
    return this.props.AccountInformationStore.unlocked
  }

  isEncrypted() {
    return this.props.AccountInformationStore.encrypted
  }

  render() {
    return (
      <div className="container">
        {/* <UnlockModal
          open={this.state.modal}
          toggle={this.toggleUnlock.bind(this)}
        />
        <LockModal
          open={this.state.modal}
          toggle={this.toggleUnlock.bind(this)}
        /> */}
        <div className="row">
          <div className="col s1 offset-s1 text-center" style={{ left: '-40px' }}>
            <div id="logo">
              <img
                className="logo center-block"
                style={{
                  display: 'block',
                  margin: '0 auto',
                  height: '40px',
                }}
                alt="crypticcoin logo"
              />
            </div>
          </div>
          <div className="col s6" />

          {this.props.AccountInformationStore.info.loaded ? <div
            onClick={() => {
              //this.props.logout()
              this.props.AuthStore.setIsLogin(true)
              // needed for encrypt wallet
              // this.isUnlocked() && this.isEncrypted()
              //   ? this.props.AccountInformationStore.lockWallet()
              //   : this.toggleUnlock()
              }
            }
            className="col s1 header-icon">
            <span
              style={{
                paddingTop: '10px',
                display: 'block',
                margin: 'auto',
              }}
            >            
              <Logout style={{ fill: '#262626', cursor: 'pointer' }} />
              {/* needed for encrypt wallet
              {this.isUnlocked() ? (
                (!this.isEncrypted() ? <Unlock style={{ fill: '#262626' }} /> : <Logout style={{ fill: '#262626' }} />)
              ) : (
                <Lock style={{ fill: '#262626' }} />
              )} */}
            </span>
            <div className="header-icon-text hide-on-med-and-down">
              {this.isUnlocked()
                ? T.translate('header.unlocked')
                : T.translate('header.locked')}
            </div>
          </div> : <div className="col s1">

          </div>}

          <div
            className="col s1 header-icon">
            <span
              style={{
                paddingTop: '10px',
                display: 'block',
                margin: 'auto',
              }}
            >
              {!this.isSynced() || this.getConnectionInfo() <= 0 ? <LoadingIcon /> : <Check />}
            </span>
            <div className="header-icon-text hide-on-med-and-down">
              {this.getBlockSyncInfo()}
            </div>
          </div>
          <div
            className="col s1 header-icon">
            <div
              style={{
                paddingTop: '10px',
                display: 'block',
                margin: 'auto',
              }}
            >
              {this.getConnectionInfo() <= 0 ? (
                <WifiOffIcon style={{ fill: '#262626' }} />
              ) : (
                  <WifiIcon style={{ fill: '#262626' }} />
                )}
            </div>
            <div className="header-icon-text hide-on-med-and-down">
              {this.getConnectionInfo()} {T.translate('header.connection')}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default inject('AccountInformationStore', 'SettingsStore', 'AuthStore')(
  observer(Header),
)
