import * as React from 'react'
import { inject, observer } from 'mobx-react'
import styledComponents from 'styled-components'
import i18nReact from 'i18n-react'
import { remote } from 'electron'
import uuidv5 from 'uuid/v5'

import Header from '../components/header/Header'
import Login from '../components/login/Login'
import SettingsTab from '../components/settings/SettingsTab'
import TransactionList from '../components/transaction/TransactionList'
import AddressList from '../components/address/AddressList'
import AccountBarLeft from '../components/AccountBarLeft'
import AccountBarRight from '../components/AccountBarRight'
import AccountBarRightSmall from '../components/AccountBarRightSmall'
import backgroundRing from '../assets/images/oval_header_outline@3x_dot.png'
import UnlockModal from '../components/modals/UnlockModal'
import LockModal from '../components/modals/LockModal'
import secret from '../secret'

const Ul = styledComponents.ul`
  background-color: #262626;
  text-align: center;
`
const MainLayer = styledComponents.div`
  background: url(${backgroundRing}) no-repeat top right / 900px auto;
  min-height: 768px;
`
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogin: true,
      modal: true,
      isSignUp: true,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      $('[data-ajax-transitions=true]').attr('data-ajax-transitions', 'false')
      if (this.props.AuthStore.isLogin) {
        const hash = localStorage.getItem('cryp_hash')
        let modalId = '#lockModal'
        if (hash && hash !== uuidv5('', secret)) {
          this.setState({ isSignUp: false })
          modalId = '#unlockModal'
        }
        $(modalId).modal({ dismissible: false, complete: () => {
          if (this.props.AuthStore.isLogin) {
            remote.getCurrentWindow().close()
          }
        } })
        $(modalId).modal('open')
      }
    }, 2000)
  }

  componentDidUpdate() {
    if (!this.props.AuthStore.isLogin) {
      $('.tabs').tabs()
    } else {
      $('#unlockModal').modal('open')
    }
  }

  toggleUnlock() {
    this.setState({ modal: !this.state.modal })
  }

  logout() {
    
  }

  render() {
    const language = this.props.SettingsStore.getLocaleId
    const dictionary = require(`../translations/${language}.json`)

    const { AuthStore } = this.props

    i18nReact.setTexts(dictionary)
    return (
      <MainLayer className="main-layer">
        {/* {isLogin && <Login />}
        {!isLogin && <Header />} */}
        <UnlockModal
          open={this.state.modal}
          toggle={this.toggleUnlock.bind(this)}
        />
        <LockModal
          open={this.state.modal}
          toggle={this.toggleUnlock.bind(this)}
        />
        { !AuthStore.isLogin ?
          <Header logout={this.logout}/> : null 
        }
        { !AuthStore.isLogin ?
          <div className="container"> 
            <div className="row">
              <div className="col s12">
                <Ul className="tabs" id="nav">
                  <li className="tab"><a className="active" href="#account">Account</a></li>
                  <li className="tab"><a href="#addresses">My addresses</a></li>
                  <li className="tab"><a href="#settings">Settings</a></li>
                </Ul>
                <div className="container">
                  <div className="row">
                    <div className="col s2 hide-on-med-and-down">
                      <AccountBarLeft />
                    </div>
                    <div className="col s12 m12 l8">
                      <TransactionList />
                      <AddressList />
                      <SettingsTab />
                    </div>
                    <div className="col s2 hide-on-med-and-down">
                      <AccountBarRight />
                    </div>
                    <div className="hide-on-med-and-up show-on-small">
                      <AccountBarRightSmall />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : null 
      }
      </MainLayer>
    )
  }
}

export default inject('SettingsStore', 'TransactionStore', 'AuthStore')(observer(App))
