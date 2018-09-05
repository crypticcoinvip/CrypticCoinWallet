import {
  action, computed, decorate, observable,
} from 'mobx'
import { remote } from 'electron'

import CCCacheStore from './CCCacheStore'

const CURRENT_VERSION = remote.app.getVersion()

export class SettingsStore {
  name = CCCacheStore.get('name', 'English')

  currency = CCCacheStore.get('currency', 'USD')

  locale = CCCacheStore.get('locale', 'en-US')

  localeId = CCCacheStore.get('localeId', 'en')

  autoShieldCoinbase = CCCacheStore.get('autoShieldCoinbase', true)

  shieldTo = CCCacheStore.get('shieldTo', '')

  name = CCCacheStore.get('name', 'English')

  version = CURRENT_VERSION

  setSettingOption(pair) {
    CCCacheStore.set(pair.key, pair.value)
    this[pair.key] = pair.value
  }

  get appVersion() {
    return this.version
  }

  get getAutoShieldCoinbase() {
    return this.autoShieldCoinbase
  }

  get getShieldTo() {
    return this.shieldTo
  }

  setShieldTo(address) {
    this.shieldTo = address
  }

  get getName() {
    return this.name
  }

  get getCurrency() {
    return this.currency
  }

  get getLocaleId() {
    return this.localeId
  }

  get getLocale() {
    return this.locale
  }
}

decorate(SettingsStore, {
  name: observable,
  currency: observable,
  locale: observable,
  localeId: observable,
  autoShieldCoinbase: observable,
  setSettingOption: action,
  getAutoShieldCoinbase: computed,
  getShieldTo: computed,
  shieldTo: observable,
  getName: computed,
  getCurrency: computed,
  getLocaleId: computed,
  getLocale: computed,
})

const settingStore = new SettingsStore()
export default settingStore
