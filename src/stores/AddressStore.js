import {
  action, computed, decorate, observable,
} from 'mobx'
import electronLog from 'electron-log'

import CCClient from './CCClient'

const hash = address => `${address.address}`

export class AddressStore {
  addresses = new Map()

  loadingFinished = false

  search = ''

  addAddresses = (addresses = []) => {
    this.addresses.forEach((transaction, key) => {
      transaction.deleted = true
    })
    addresses.forEach((transaction) => {
      const oldTransaction = this.addresses.get(hash(transaction))
      this.addresses.set(hash(transaction), {
        hide: true,
        ...oldTransaction,
        ...transaction,
        deleted: false,
      })
    })
    this.loadingFinished = true
  }

  setSearch(e) {
    this.search = e.target.value;
  }

  clearSearch() {
    this.search = ''
  }

  setAddresses(addressMap) {
    electronLog.log(`Successfully loaded ${addressMap.size} addresses`)
    this.addresses = addressMap

    if (this.addresses.size > 0) {
      this.loadingFinished = true
    }
  }

  get getAddressCount() {
    return this.addresses.size
  }

  get loaded() {
    return this.loadingFinished
  }

  get getAddressList() {
    return this.addresses
  }

  get searchValue() {
    return this.search
  }

  get lastAddress() {
    const addresses = Array.from(this.addresses.values())

    if (this.search) {
      return addresses.filter(address => [address.address, address.amount, address.account]
        .join('-')
        .toLocaleLowerCase()
        .includes(this.search.toLocaleLowerCase()))
    }

    return addresses
  }
}

decorate(AddressStore, {
  addresses: observable,
  loadingFinished: observable,
  search: observable,
  addAddresses: action,
  setSearch: action,
  clearSearch: action,
  setAddresses: action,
  getAddressCount: computed,
  loaded: computed,
  getAddressList: computed,
  lastAddress: computed,
  searchValue: computed,
  lastSend: observable,
  lastReceive: observable,
  lastAmount: observable
})

const store = new AddressStore()
try {
  store.setAddresses(new Map(JSON.parse(localStorage.myMap)) || new Map())
} catch (e) {}

setInterval(() => {
  CCClient.getAddressList()
    .then((addresses) => {
      store.addAddresses(addresses)
      electronLog.log('Fetched new addresses')
    })
    .catch(() => {
      electronLog.warn('Failed fetching new addresses')
    })
}, 10000)

setInterval(() => {
  localStorage.addresses = JSON.stringify(Array.from(store.getAddressList))
  electronLog.log('Saved newly addresses into localstorage')
}, 10000)
export default store
