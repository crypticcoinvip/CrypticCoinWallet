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
    let promises = [];
    promises.push(new Promise((resolve, reject) => torRequest.request(
      `https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=${CCCacheStore.get(
        'currency',
        'USD',
      )}`,
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          const [resJson] = JSON.parse(body);
          const currency = CCCacheStore.get('currency', 'USD');
          return resolve({
            price: Number(`${resJson[`price_${currency.toLowerCase()}`]}`),
            hourChange: Number(resJson.percent_change_1h),
            dayChange: Number(resJson.percent_change_24h),
            weekChange: Number(resJson.percent_change_7d),
          });
        }

        return reject(err);
      },
    )));

    promises.push(new Promise((resolve, reject) => torRequest.request(
      'https://www.cryptobulls.exchange/ticker/btc_cryp',
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          const [resJson] = JSON.parse("[" + body + "]");
          return resolve(resJson);
        }
        return reject(err);
      }
    )));

    return Promise.all(promises).then((result) => {
      if (result[0] && result[0].price && result[1] && result[1].last_price) {
        let ticker = result[0];
        ticker.price *= Number(result[1].last_price);
        ticker.price_btc = Number(result[1].last_price);
        ticker.hourChange = 0;
        ticker.dayChange = Number(result[1].price_change_24h);
        ticker.weekChange = Number(result[1].price_change_7d);
        return ticker
      } else {
        throw result[0]
      }
    });
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
