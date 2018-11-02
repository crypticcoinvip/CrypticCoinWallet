import * as React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import uuidv5 from 'uuid/v5'

import secret from '../../secret'

const PasswordRow = styled.input`
  -webkit-text-security: disc
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  border-radius: 10px;
  margin-top: 50px;
  background-color: hsl(210, 9%, 96%);
  border: none;
  width: '60%';
  display: 'flex';
  justify-content: 'center'
`

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.signUp = this.signUp.bind(this)
    this.state = {
      password: '',
      passwordConfirm: '',
      isSignUp: true,
      warningPassword: false,
      warningConfirm: false
    }
  }

  componentWillMount() {
    const data = localStorage.getItem('cryp_hash')
    if (data) {
      this.setState({ isSignUp: false })
    }
  }

  signUp() {
    const { TransactionStore } = this.props
    const { password, passwordConfirm, isSignUp, warningPassword, warningConfirm } = this.state

    if (isSignUp) {
      if (password === passwordConfirm) {
        const hash = uuidv5(password, secret)
        localStorage.setItem('cryp_hash', hash)
        TransactionStore.setIsLogin(false)
      } else {
        this.setState({ warningConfirm: true })
      }
    } else {
      const data = localStorage.getItem('cryp_hash')
      const hash = uuidv5(password, secret)
      if (data === hash) {
        TransactionStore.setIsLogin(false)
      } else {
        this.setState({ warningPassword: true })
      }
    }
  }

  render() {
    const { password, passwordConfirm, isSignUp, warningPassword, warningConfirm } = this.state

    return (
      <div>
        {isSignUp
          && (
            <div>
              <div style={{
                position: 'relative', paddingTop: '200px', marginBottom: '70px', marginLeft: '25%', fontSize: 42,
              }}
              >
                Create new password
              </div>
              <label style={{ display: warningConfirm ? 'flex' : 'none', color: warningConfirm ? 'red' : '', marginLeft: '45%' }}>Password mismatch</label>
              <div style={{ position: 'relative' }}>
                <PasswordRow
                  style={{ width: '45%', marginLeft: '30%' }}
                  placeholder="Enter your password"
                  disabled={false}
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  id="password"
                />
              </div>
              <div style={{ position: 'relative' }}>
                <PasswordRow
                  style={{ width: '45%', marginLeft: '30%' }}
                  placeholder="Confirm your password"
                  disabled={false}
                  value={passwordConfirm}
                  onChange={e => this.setState({ passwordConfirm: e.target.value })}
                  id="passwordConfirm"
                />
              </div>
              <button
                className="btn waves-effect waves-light grey darken-3"
                onClick={this.signUp}
                style={{
                  display: 'inline-flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginLeft: '45%',
                }}
              >
                SignUp
              </button>
            </div>
          )}
        {!isSignUp
          && (
            <div>
              <div style={{
                position: 'relative', paddingTop: '200px', marginBottom: '50px', marginLeft: '45%', fontSize: 42,
              }}
              >
                Login
              </div>
              <label style={{ display: warningPassword ? 'flex' : 'none', color: warningPassword ? 'red' : '', marginLeft: '45%' }}>Incorrect password</label>
              <div style={{ position: 'relative' }}>
                <PasswordRow
                  style={{ width: '45%', marginLeft: '30%' }}
                  placeholder="Enter your password"
                  disabled={false}
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  id="password"
                />
              </div>
              <button
                className="btn waves-effect waves-light grey darken-3"
                onClick={this.signUp}
                style={{
                  display: 'inline-flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginLeft: '45%',
                }}
              >
                Login
              </button>
            </div>
          )}
      </div>
    )
  }
}

export default inject('AccountInformationStore', 'TransactionStore', 'SettingsStore')(observer(Login))
