import { API } from "./API";
import { ClientOption } from "./ClientOption";
import { Peer } from "./Peer";
import { RPCErrorCode } from "./RPCErrorCode";
import { Transaction } from "./Transaction";
import { Address } from "./Address";
import { WalletInfo } from "./WalletInfo";
export declare class Client extends API {
    options: ClientOption;
    errors: RPCErrorCode[];
    constructor(options: ClientOption);
    private send(command, ...args);
    private auth(user, pass);
    unlockWallet(passphrase: any, timeout?: number): Promise<boolean>;
    getBalance(account?: string): Promise<number>;
    getInfo(): Promise<WalletInfo>;
    getPeerInfo(): Promise<Array<Peer>>;
    getTransactionList(count?: number, from?: number, account?: string): Promise<Transaction[]>;
    getAddressList(account?: string, withReceived?: boolean): Promise<Address[]>;
    sendToAddress(address: string, amount: number): Promise<Client>;
    lockWallet(): Promise<any>;
    encryptWallet(passphrase: any, timeout?: number): Promise<any>;
    getNewAddress(): Promise<string>;
}
