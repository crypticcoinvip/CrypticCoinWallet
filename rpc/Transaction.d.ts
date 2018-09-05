export interface Transaction {
    /**
     * The transaction id
     */
    txid: string;
    /**
     * the output number
     */
    vout?: string;
    account: string;
    address: string;
    category: string;
    amount: number;
    confirmations: number;
    blockhash: string;
    blockindex: number;
    blocktime: number;
    time: number;
    timereceived: number;
}
