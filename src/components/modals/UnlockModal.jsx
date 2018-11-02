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
    unlocked: true,
  }

  unlocking(e) {
    e.preventDefault()
    if (this.props.AuthStore.isLogin) {
      const hash = localStorage.getItem('cryp_hash')
      if (uuidv5(this.state.password, secret) === hash) {
        this.props.AuthStore.setIsLogin(false)
        this.setState({ password: '' })
        $('#unlockModal').modal('close')
      } else {
        this.setState({ unlocked: false })
      }
    } else {
      this.props.AccountInformationStore.unlockWallet(this.state.password)
        .then(unlocked => {
          this.setState({ unlocked, password: '' })
          if (unlocked) this.props.toggle()
        })
        .catch(() => {
          this.setState({ unlocked: false })
        })
    }
  }

  render() {
    return (
      <Modal 
        {...this.props} 
        title={T.translate('unlock.title')}
        id="unlockModal"
      >
        <div className="container">
          <div className="row">
            <div className="col s9 offset-s3">
              <div className="container">
                <div className="container" style={{ marginBottom: '20px' }}>
                  <form onSubmit={this.unlocking.bind(this)}>
                    <input
                      unlocked={this.state.unlocked.toString()}
                      placeholder={T.translate('unlock.inputTitle')}
                      type="password"
                      id="passphrase"
                      value={this.state.password}
                      onChange={e =>
                        this.setState({ unlocked: true, password: e.target.value })
                      }
                    />
                    {this.state.unlocked ? (
                      <label>{T.translate('unlock.info')}</label>
                    ) : (
                        <FalseInputHandler>
                          {T.translate('unlock.wrongpass')}
                        </FalseInputHandler>
                      )}
                  </form>
                </div>
                <button
                  className="btn grey darken-3 waves-effect waves-light"
                  type="submit"
                  onClick={this.unlocking.bind(this)}
                >
                  {T.translate('unlock.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default inject('AccountInformationStore', 'AuthStore')(observer(Unlock))
