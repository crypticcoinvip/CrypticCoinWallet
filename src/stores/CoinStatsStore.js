import {
  autorun, computed, decorate, observable,
} from 'mobx';
import electronLog from 'electron-log';
import torRequest from 'tor-request';

import CCCacheStore from './CCCacheStore';
import SettingsStore from './SettingsStore';

torRequest.setTorAddress('localhost', 9089);

export class CoinStatsStore {
  loadingFinished = false;

  info = {
    price: 0,
    price_btc: 0,
    rank: 1,
    cap: 0,
    hourChange: 0,
    dayChange: 0,
    weekChange: 0,
  };

  constructor() {
    this.getCoinStats()
      .then((info) => {
        this.info = { ...this.info, ...info };
        this.loadingFinished = true;
      })
      .catch(electronLog.error);

    setInterval(() => {
      this.getCoinStats()
        .then((info) => {
          this.info = { ...this.info, ...info };
          this.loadingFinished = true;
        })
        .catch(electronLog.error);
    }, 30000);

    autorun(() => {
      this.storeInfo(SettingsStore.currency);
    });
  }

  storeInfo(sessionStoreInfo) {
    this.getCoinStats()
      .then((info) => {
        this.info = { ...this.info, ...info };
        this.loadingFinished = true;
      })
      .catch(electronLog.error);
  }

  getCoinStats() {
    return new Promise((resolve, reject) => torRequest.request(
      `https://api.coinmarketcap.com/v1/ticker/verge/?convert=${CCCacheStore.get(
        'currency',
        'USD',
      )}`,
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          const [resJson] = JSON.parse(body);
          const currency = CCCacheStore.get('currency', 'USD');
          return resolve({
            price: Number(`${resJson[`price_${currency.toLowerCase()}`]}`),
            price_btc: Number(resJson.price_btc),
            rank: Number(resJson.rank),
            cap: Number(resJson[`market_cap_${currency.toLowerCase()}`]),
            hourChange: Number(resJson.percent_change_1h),
            dayChange: Number(resJson.percent_change_24h),
            weekChange: Number(resJson.percent_change_7d),
          });
        }

        return reject(err);
      },
    ));
  }

  get loaded() {
    return this.loadingFinished;
  }

  get getUpdatedStats() {
    return this.info;
  }

  get priceWithCurrency() {
    return this.info.price || 0;
  }
}

decorate(CoinStatsStore, {
  info: observable.struct,
  getUpdatedStats: computed,
  priceWithCurrency: computed,
  loadingFinished: observable,
});

const coinStore = new CoinStatsStore();
export default coinStore;
