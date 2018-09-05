import {
  computed, decorate, observable, action,
} from 'mobx'
import electronLog from 'electron-log'
import { remote } from 'electron'

import CCClient from './CCClient'

const getAccountInfo = () => CCClient.getInfo()
  .then(info => CCClient.getPeerInfo().then((peers) => {
    const highestBlock = Math.max(...peers.map(peer => peer.startingheight));
    return CCClient.unlockWallet('a')
      .then(() => ({
        ...info,
        highestBlock,
        unlocked: true,
        encrypted: true,
      }))
      .catch(e => ({
        ...info,
        highestBlock,
        unlocked:
              e.includes('already unlocked')
              || e.includes('running with an unencrypted wallet, but walletpassphrase'),
        encrypted: !e.includes('running with an unencrypted wallet, but walletpassphrase'),
      }));
  }))
  .catch(electronLog.error)

export class AccountInformationStore {
  info = {}

  constructor() {
    setInterval(() => {
      getAccountInfo()
        .then((info) => {
          this.info = {
            ...this.info,
            ...info,
            loadingProgress: remote.getGlobal('sharedObj').loadingProgress,
            loaded: !!info,
          }
          localStorage.info = JSON.stringify(this.info)
          electronLog.log('Updated wallet information successfully.')
        })
        .catch(() => {
          this.info = {
            ...this.info,
            loadingProgress: remote.getGlobal('sharedObj').loadingProgress,
            loaded: !!info,
          };
          electronLog.warn('Couldn`t fetch wallet information')
        })
    }, 10000)
  }

  sendTransaction(ccAddress, amount, from) {
    return CCClient.sendToAddress(ccAddress, amount, from)
  }

  shieldCoinbase(from, zaddress) {
    return CCClient.send('z_shieldcoinbase', from, zaddress)
  }

  validateZAddress(zaddress) {
    return CCClient.send('z_validateaddress', zaddress)
  }

  getOperationStatus(opIds) {
    return CCClient.send('z_getoperationstatus', opIds)
  }

  unlockWallet(password) {
    return CCClient.unlockWallet(password)
  }

  encryptWallet(password) {
    return CCClient.encryptWallet(password)
  }

  lockWallet() {
    return CCClient.lockWallet()
  }

  addOldInfo(info) {
    this.info = info
  }

  get getUpdatedInfo() {
    return this.info
  }

  get getBalance() {
    return (
      this.info.balance || {
        total: 0,
        private: 0,
        transparent: 0,
        coinbase: 0,
      }
    )
  }

  get unlocked() {
    return this.info.isunlocked || this.info.unlocked || false
  }

  get encrypted() {
    return this.info.isencrypted || this.info.encrypted || false
  }

  get debugPanelInformation() {
    const keys = Object.keys(this.info)
    const values = keys.map(key => ({ key, value: this.info[key] }))
    return values
  }

  receiveNewAddress() {
    return CCClient.getNewAddress()
  }

  receiveNewZAddress() {
    return CCClient.getNewZAddress()
  }

  exportWallet(filename) {
    return CCClient.exportWallet(filename)
  }

  importWallet(filename) {
    return CCClient.importWallet(filename)
  }
}

decorate(AccountInformationStore, {
  info: observable.struct,
  addOldInfo: action,
  getUpdatedInfo: computed,
  getBalance: computed,
  unlocked: computed,
  encrypted: computed,
});
const store = new AccountInformationStore();

try {
  store.addOldInfo(JSON.parse(localStorage.info) || {});
} catch (e) {}

export default store;
