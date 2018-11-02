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
    volume: 0,
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

    // https://api.coingecko.com/api/v3/coins/cryptic-coin
    return new Promise((resolve, reject) => torRequest.request('https://proxy.hidemyass.com/proxy/en-ww/aHR0cHM6Ly9hcGkuY29pbmdlY2tvLmNvbS9hcGkvdjMvY29pbnMvY3J5cHRpYy1jb2lu', (err, res, body) => {
        if (!err && res.statusCode === 200) {
          const data = JSON.parse(body);
          const currency = CCCacheStore.get('currency', 'USD');
          let ticker = {};
          ticker.price = Number(data['market_data']['current_price'][currency.toLowerCase()]);
          ticker.volume = Number(data['market_data']['total_volume'][currency.toLowerCase()]);
          ticker.price_btc = Number(data['market_data']['current_price']['btc']);
          ticker.hourChange = Number(data['market_data']['price_change_percentage_1h_in_currency']['btc']);
          ticker.dayChange = Number(data['market_data']['price_change_percentage_24h_in_currency']['btc']);
          ticker.weekChange = Number(data['market_data']['price_change_percentage_7d_in_currency']['btc']);
          return resolve(ticker);
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
