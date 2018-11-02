import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import T from 'i18n-react'
import styled from 'styled-components'
import uuidv5 from 'uuid/v5'

import secret from '../../secret'
import Modal from '../Modal'

const FalseInputHandler = styled.p`
  color: rgba(220, 43, 61, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 30px;
  font-style: italic;
`

class Unlock extends Component {
  state = {
    password: '',
    password2: '',
    unlocked: true,
  }

  locking(e) {
    e.preventDefault()
    if (this.state.password !== '' && this.state.password != this.state.password2) {
      this.setState({ unlocked: false })
    } else {
      if (this.props.AuthStore.isLogin) {
        const hash = uuidv5(this.state.password, secret)
        localStorage.setItem('cryp_hash', hash)
        this.props.AuthStore.setIsLogin(false)
        $('#lockModal').modal('close')
      } else {
        this.props.AccountInformationStore.encryptWallet(this.state.password)
          .then(unlocked => {
            this.setState({ unlocked, password: '', password2: '' })
            if (unlocked) this.props.toggle()
          })
          .catch(() => {
            this.setState({ unlocked: false, password: '', password2: '' })
          })
      }
    }
  }

  render() {
    return (
      <Modal 
        {...this.props} 
        title={T.translate('lock.title')}
        id="lockModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s9 offset-s3">
              <div className="container">
                <form onSubmit={this.locking.bind(this)}>
                  <div>
                    <input
                      unlocked={this.state.unlocked.toString()}
                      placeholder={T.translate('lock.inputTitle')}
                      type="password"
                      id="passphrase"
                      value={this.state.password}
                      onChange={e =>
                        this.setState({ unlocked: true, password: e.target.value })
                      }
                    />
                    <input
                      unlocked={this.state.unlocked.toString()}
                      placeholder={T.translate('lock.inputTitle2')}
                      type="password"
                      id="passphrase2"
                      value={this.state.password2}
                      onChange={e =>
                        this.setState({ unlocked: true, password2: e.target.value })
                      }
                    />
                    {this.state.unlocked ? (
                      <label>{T.translate('lock.info')}</label>
                    ) : (
                      <FalseInputHandler>
                        {T.translate('lock.wrongpass')}
                      </FalseInputHandler>
                    )}
                  </div>
                  <button 
                    className="btn grey darken-3 waves-effect waves-light"
                    type="submit" 
                    onClick={this.locking.bind(this)}
                  >
                    {T.translate('lock.button')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default inject('AccountInformationStore', 'AuthStore')(observer(Unlock))
