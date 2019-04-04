import * as moment from 'moment';
import {
  action, computed, decorate, observable,
} from 'mobx';
import electronLog from 'electron-log';

import CCClient from './CCClient';

const hash = transaction => `${transaction.txid}#${transaction.category}#${transaction.address}#${transaction.timereceived}`;

export class TransactionStore {
  transactions = new Map();

  loadingFinished = false;

  search = '';

  addTransactions = (transactions = []) => {
    transactions.forEach((transaction) => {
      const oldTransaction = this.transactions.get(hash(transaction));
      this.transactions.set(hash(transaction), {
        hide: true,
        ...oldTransaction,
        ...transaction,
      });
    });
    this.loadingFinished = true;
  }

  setVisibility(txid, category, address, timereceived, hide) {
    const searchedTransaction = {
      txid,
      category,
      address,
      timereceived,
    }

    const oldTransaction = this.transactions.get(hash(searchedTransaction))

    if (oldTransaction == null) 
      return

    const newTransaction = {
      txid,
      category,
      address,
      timereceived,
    }

    const updatedTransaction = {
      ...oldTransaction,
      hide,
    }

    this.transactions.set(hash(newTransaction), updatedTransaction);

    this.loadingFinished = true
  }

  setSearch(e) {
    this.search = e.target.value
  }

  clearSearch() {
    this.search = ''
  }

  setTransactions(transactionMap) {
    electronLog.log(`Successfully loaded ${transactionMap.size} transactions`)
    this.transactions = transactionMap

    if (this.transactions.size > 0) {
      this.loadingFinished = true
    }
  }

  get getTransactionCount() {
    return this.transactions.size
  }

  get loaded() {
    return this.loadingFinished
  }

  get getTransactionList() {
    return this.transactions
  }

  get searchValue() {
    return this.search
  }

  get lastTenTransaction() {
    const transactions = Array.from(this.transactions.values())

    if (this.search) {
      return transactions
        .filter(transaction => [transaction.address, transaction.amount, transaction.account, transaction.category]
          .join('-')
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase()))
        .sort((a, b) => b.time - a.time)
        .sliceslice(0, 9)
    }

    return transactions.sort((a, b) => b.time - a.time).slice(0, 9);
  }

  get monthlyOutput() {
    return Array.from(this.transactions.values())
      .filter(
        ({ timereceived, category }) => moment.unix(timereceived).isSame(new Date(), 'month') && category.includes('send'),
      )
      .reduce((sum, { amount, fee }) => (fee ? sum + amount + fee : sum + amount), 0.0)
  }

  get monthlyIncome() {
    return Array.from(this.transactions.values())
      .filter(
        ({ timereceived, category }) => moment.unix(timereceived).isSame(new Date(), 'month') && category.includes('receive'),
      )
      .reduce((sum, { amount }) => sum + amount, 0.0)
  }

  get monthlyMined() {
    return Array.from(this.transactions.values())
      .filter(
        ({ timereceived, category }) => moment.unix(timereceived).isSame(new Date(), 'month')
          && (category.includes('immature') || category.includes('generated')),
      )
      .reduce((sum, { amount }) => sum + amount, 0.0)
  }
}

decorate(TransactionStore, {
  transactions: observable,
  loadingFinished: observable,
  search: observable,
  addTransactions: action,
  setVisibility: action,
  setSearch: action,
  clearSearch: action,
  setTransactions: action,
  getTransactionCount: computed,
  loaded: computed,
  getTransactionList: computed,
  searchValue: computed,
  lastTenTransaction: computed,
  monthlyOutput: computed,
  monthlyIncome: computed,
  monthlyMined: computed,
})

const store = new TransactionStore();
try {
  store.setTransactions(new Map(JSON.parse(localStorage.myMap)) || new Map());
} catch (e) {}

setInterval(() => {
  CCClient.getTransactionList(1000)
    .then((transactions) => {
      store.addTransactions(transactions);
      electronLog.log('Fetched new transactions');
    })
    .catch(() => {
      electronLog.warn('Failed fetching new transactions');
    })
}, 10000)

setInterval(() => {
  localStorage.transactions = JSON.stringify(Array.from(store.getTransactionList));
  electronLog.log('Saved newly transactions into localstorage');
}, 10000)

export default store
