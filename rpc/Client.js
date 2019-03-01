"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __assign = (this && this.__assign) || Object.assign || function (t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
      t[p] = s[p];
  }
  return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var API_1 = require("./API");
var RPCErrorCode_1 = require("./RPCErrorCode");
var Client = /** @class */ (function (_super) {
  __extends(Client, _super);
  function Client(options) {
    var _this = _super.call(this) || this;
    _this.options = __assign({
      host: "localhost", port: 23202, method: "POST", user: "", pass: "", headers: {
        Host: "localhost",
        Authorization: ""
      }, passphrasecallback: null, https: false, ca: null
    }, options);
    if (_this.options.user && _this.options.pass) {
      _this.options.headers.Authorization = "Basic " + new Buffer(_this.options.user + ":" + _this.options.pass).toString("base64");
    }
    return _this;
  }
  Client.prototype.send = function (command) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var rpcData = {
      id: new Date().getTime(),
      method: command.toLowerCase(),
      params: args.filter(function (item) { return (item !== "" ? !!item : true); })
    };
    var options = this.options;
    options.headers["Content-Length"] = JSON.stringify(rpcData).length;
    var request;
    if (this.options.https === true) {
      request = https.request;
    }
    else {
      request = http.request;
    }
    var promisedRequest = new Promise(function (resolve, reject) {
      var rpcRequest = request(options, function (res) {
        var _this = this;
        var data = "";
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          data += chunk;
        });
        res.on("end", function () {
          try {
            var rpcResponse = JSON.parse(data);
            if (rpcResponse.id != rpcData.id) {
              throw new Error("Possible Man-in-the-middle Attack!!!");
            }
            if (rpcResponse.error) {
              if (rpcResponse.error.code ===
                RPCErrorCode_1.RPCErrorCode.RPC_WALLET_UNLOCK_NEEDED &&
                options.passphrasecallback) {
                //TODO: Handle special case :thinking:
                return _this.unlock(command, args, function () { });
              }
              else {
                var err = JSON.stringify(rpcResponse);
                return reject(err);
              }
            }
            resolve(rpcResponse.result !== null ? rpcResponse.result : rpcResponse);
          }
          catch (exception) {
            var errMsg = res.statusCode !== 200
              ? "Invalid params " + res.statusCode
              : "Failed to parse JSON";
            errMsg += " : " + JSON.stringify(data);
            return reject(new Error(errMsg));
          }
        });
      });
      rpcRequest.on("error", function (error) { return reject(error); });
      rpcRequest.end(JSON.stringify(rpcData));
    });
    return promisedRequest;
  };
  Client.prototype.auth = function (user, pass) {
    if (user && pass) {
      var authString = "Basic " + new Buffer(user + ":" + pass).toString("base64");
      this.options.headers["Authorization"] = authString;
    }
    return this;
  };
  Client.prototype.unlockWallet = function (passphrase, timeout) {
    if (timeout === void 0) { timeout = 1; }
    return this.send("walletpassphrase", passphrase, timeout);
  };
  Client.prototype.lockWallet = function (timeout) {
    if (timeout === void 0) { timeout = 1; }
    return this.send("walletlock");
  };
  Client.prototype.encryptWallet = function (passphrase, timeout) {
    if (timeout === void 0) { timeout = 1; }
    return this.send("encryptwallet", passphrase, timeout);
  };
  Client.prototype.getBalance = function (account) {
    return this.send("getbalance", account);
  };
  Client.prototype.getInfo = function () {
    return this.send("getinfo");
  };
  Client.prototype.getPeerInfo = function () {
    return this.send("getPeerInfo");
  };
  Client.prototype.getTransactionList = function (count, from, account) {
    if (count === void 0) { count = 10; }
    if (from === void 0) { from = 0; }
    if (account === void 0) { account = "*"; }
    return this.send("listtransactions", account, count, from);
  };
  Client.prototype.getAddressList = function (account, withReceived) {
    var promises = [];
    promises.push(this.send("listunspent"))//, account === void 0 ? undefined : account));
    promises.push(this.send("z_listunspent"))
    promises.push(this.send("getaddressesbyaccount", ""));
    promises.push(this.send("z_listaddresses"));
    return Promise.all(promises).then(function (result) {
      var addresses = result[2];
      addresses = addresses.map((address) => {  // transperent addresses
        return {
          address,
          confirmations: 0,
          amount: 0,
          type: "t",
          spendable: false
        }
      });

      addresses = addresses.concat(             // + z_addresses
        result[3].map((address) => {
          return {
            address,
            confirmations: 0,
            amount: 0,
            type: "c",
            spendable: false
          }
        })
      );

      var utxo_entry = result[0].concat(result[1]); // "utxo" is unspent transaction outputs
      for (var i = 0; i < utxo_entry.length; ++i) {
        var found_utxo = false;
        for (var j = 0; j < addresses.length; ++j) {
          if (addresses[j].address == utxo_entry[i].address) { // if account have unspent output
            addresses[j].spendable = utxo_entry[i].spendable;
            addresses[j].amount += utxo_entry[i].amount;
            addresses[j].confirmations += utxo_entry[i].confirmations;
            found_utxo = true;
            break;
          }
        }
        if (!found_utxo) { // if account for utxo have not found
          addresses.push({
            address: utxo_entry[i].address,
            confirmations: utxo_entry[i].confirmations,
            amount: utxo_entry[i].amount,
            type: utxo_entry[i].jsindex ? "c" : "t",
            spendable: false
          });
        }
      }

      // TODO: SS sort works wrong https://cs8.pikabu.ru/post_img/2016/11/14/11/1479152491148632343.webm
      return addresses.sort(
        (a, b) => {
          // if ((a.address.indexOf("cc") == 0 && b.address.indexOf("cc") != 0) ||
          //   (a.address.indexOf("cc") != 0 && b.address.indexOf("cc") == 0)) {
          //   return a.address.indexOf("cc") != 0; // sorted: private addresses > transparent addresses
          // }
          return a.amount < b.amount; // sorted by descending amount
        });
    });
  };
  Client.prototype.sendToAddress = function (address, amount, from, minConf, fee, instantTx) {
    return (address.substr(0, 2) == 'c1' && !from)
      ? this.send("sendtoaddress", address, amount)
      : this.send("z_sendmany", from, [{ address: address, amount: amount }], minConf, fee, instantTx);
  };
  Client.prototype.walletLock = function () {
    return this.send("walletlock");
  };
  Client.prototype.getNewAddress = function () {
    return this.send("getnewaddress");
  };
  Client.prototype.getNewZAddress = function () {
    return this.send("z_getnewaddress");
  };
  Client.prototype.exportWallet = function (filename) {
    return this.send("z_exportwallet", filename);
  };
  Client.prototype.importWallet = function (filename) {
    return this.send("z_importwallet", filename);
  };
  return Client;
}(API_1.API));
exports.Client = Client;
