import { Client } from "./Client";
import { Peer } from "./Peer";
import { Transaction } from "./Transaction";
import { Address } from "./Address";
import { WalletInfo } from "./WalletInfo";
export declare abstract class API {
    commands: Array<string>;
    isCommand(command: string): boolean;
    getCommands(): Array<string>;
    abstract getBalance(account?: string): Promise<number>;
    abstract getInfo(): Promise<WalletInfo>;
    abstract getPeerInfo(): Promise<Array<Peer>>;
    abstract getNewAddress(): Promise<String>;
    abstract getTransactionList(): Promise<Transaction[]>;
    abstract getAddressList(): Promise<Address[]>;
    abstract sendToAddress(address: string, amount: number): Promise<Client>;
    abstract walletLock(): Promise<any>;
}
