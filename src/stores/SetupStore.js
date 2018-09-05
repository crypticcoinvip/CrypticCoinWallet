import {
  action, computed, decorate, observable,
} from 'mobx';

import CCCacheStore from './CCCacheStore';

export class SetupStore {
  setupOpen = !CCCacheStore.get('setupOpen', true);

  setSetup = (bool) => {
    CCCacheStore.set('setupOpen', bool);
    this.setupOpen = bool;
  };

  get getSetupStatus() {
    return this.setupOpen;
  }
}

decorate(SetupStore, {
  setupOpen: observable,
  setSetup: action,
  getSetupStatus: computed,
});

const setupStore = new SetupStore();
export default setupStore;
