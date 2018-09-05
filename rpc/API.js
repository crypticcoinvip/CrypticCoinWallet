"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var API = /** @class */ (function () {
    function API() {
        this.commands = new Array(
            "getinfo",
            "help",
            "stop",
            "getnetworkinfo",
            "getdeprecationinfo",
            "addnode",
            "disconnectnode",
            "getaddednodeinfo",
            "getconnectioncount",
            "getnettotals",
            "getpeerinfo",
            "ping",
            "setban",
            "listbanned",
            "clearbanned",
            "getblockchaininfo",
            "getbestblockhash",
            "getblockcount",
            "getblock",
            "getblockhash",
            "getblockheader",
            "getchaintips",
            "getdifficulty",
            "getmempoolinfo",
            "getrawmempool",
            "gettxout",
            "gettxoutproof",
            "verifytxoutproof",
            "gettxoutsetinfo",
            "verifychain",
            "getblocktemplate",
            "getmininginfo",
            "getlocalsolps",
            "getnetworksolps",
            "getnetworkhashps",
            "prioritisetransaction",
            "submitblock",
            "getblocksubsidy",
            "getgenerate",
            "setgenerate",
            "generate",
            "createrawtransaction",
            "decoderawtransaction",
            "decodescript",
            "getrawtransaction",
            "sendrawtransaction",
            "signrawtransaction",
            "fundrawtransaction",
            "createmultisig",
            "validateaddress",
            "verifymessage",
            "estimatefee",
            "estimatepriority",
            "z_validateaddress",
            "invalidateblock",
            "reconsiderblock",
            "setmocktime",
            "resendwallettransactions",
            "addmultisigaddress",
            "backupwallet",
            "dumpprivkey",
            "dumpwallet",
            "encryptwallet",
            "getaccountaddress",
            "getaccount",
            "getaddressesbyaccount",
            "getbalance",
            "getnewaddress",
            "getrawchangeaddress",
            "getreceivedbyaccount",
            "getreceivedbyaddress",
            "gettransaction",
            "getunconfirmedbalance",
            "getwalletinfo",
            "importprivkey",
            "importwallet",
            "importaddress",
            "keypoolrefill",
            "listaccounts",
            "listaddressgroupings",
            "listlockunspent",
            "listreceivedbyaccount",
            "listreceivedbyaddress",
            "listsinceblock",
            "listtransactions",
            "listunspent",
            "lockunspent",
            "move",
            "sendfrom",
            "sendmany",
            "validateaddress",
            "setaccount",
            "settxfee",
            "signmessage",
            "walletlock",
            "walletpassphrasechange",
            "walletpassphrase",
            "z_listreceivedbyaddress",
            "z_listunspent",
            "z_getbalance",
            "z_gettotalbalance",
            "z_mergetoaddress",
            "z_sendmany",
            "z_shieldcoinbase",
            "z_getoperationstatus",
            "z_getoperationresult",
            "z_listoperationids",
            "z_getnewaddress",
            "z_listaddresses",
            "z_exportkey",
            "z_importkey",
            "z_exportviewingkey",
            "z_importviewingkey",
            "z_exportwallet",
            "z_importwallet",
            "z_getpaymentdisclosure",
            "z_validatepaymentdisclosure"
            // "addMultiSigAddress", 
            // "backupWallet", 
            // "createRawTransaction", 
            // "decodeRawTransaction", 
            // "dumpPrivKey", 
            // "encryptWallet", 
            // "getAccount", 
            // "getAccountAddress", 
            // "getAddressesByAccount", 
            // "getBalance", 
            // "getBlock", 
            // "getBlockCount", 
            // "getBlockHash", 
            // "getConnectionCount", 
            // "getDifficulty", 
            // "getGenerate", 
            // "getHashesPerSec", 
            // "getInfo", 
            // "getMemoryPool", 
            // "getMiningInfo", 
            // "getNewAddress", 
            // "getRawTransaction", 
            // "getReceivedByAccount", 
            // "getReceivedByAddress", 
            // "getTransaction", 
            // "getWork", 
            // "help", 
            // "importPrivKey", 
            // "importAddress", 
            // "keyPoolRefill", 
            // "listAccounts", 
            // "listReceivedByAccount", 
            // "listReceivedByAddress", 
            // "listSinceBlock", 
            // "listTransactions", 
            // "listUnspent", 
            // "move", 
            // "sendFrom", 
            // "sendMany", 
            // "sendRawTransaction", 
            // "sendToAddress", 
            // "setAccount", 
            // "setGenerate", 
            // "setTxFee", 
            // "signMessage", 
            // "signRawTransaction", 
            // "stop", 
            // "validateAddress", 
            // "verifyMessage", 
            // "walletLock", 
            // "walletPassphrase", 
            // "walletPassphraseChange",
            // "z_listaddresses",
            // "z_getnewaddress"
        );
    }
    API.prototype.isCommand = function (command) {
        var lowerCommand = command.toLowerCase();
        var lowerCaseCommands = this.getCommands().map(function (item) {
            return item.toLowerCase();
        });
        return lowerCaseCommands.indexOf(lowerCommand) !== -1;
    };
    API.prototype.getCommands = function () {
        return this.commands;
    };
    return API;
}());
exports.API = API;
