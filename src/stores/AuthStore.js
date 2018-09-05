import * as moment from 'moment'
import {
  action, computed, decorate, observable,
} from 'mobx'

export class AuthStore {
  
  password = '';

  confirmPassword = ''

  isLogin = true;

  setIsLogin(data) {
    this.isLogin = data
  }

  get passwordValue() {
    return this.password
  }

  setPassword(text) {
    this.password = text
  }

  clearPassword() {
    this.password = ''
  }

  get confirmPasswordValue() {
    return this.confirmPassword;
  }

  setConfirmPassword(text) {
    this.confirmPassword = text;
  }

  clearConfirmPassword() {
    this.confirmPassword = ''
  }

}

decorate(AuthStore, {
  isLogin: observable,
  setIsLogin: action,
  passwordValue: computed,
  setPassword: action,
  clearPassword: action,
  confirmPasswordValue: computed,
  setConfirmPassword: action,
  clearConfirmPassword: action,
})

const store = new AuthStore()

export default store
