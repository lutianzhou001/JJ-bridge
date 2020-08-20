import { Document } from 'mongoose';

export interface Transaction extends Document {
    blockNumber: number;
    amount: string;
    transactionHash: string;
    from: string;
    to: string;
    createdTime: number;
    contractAddress: string;
    func: string;
    burnedAddress: string;
    burnedAmount: string;
    mintToAddress: string;
    mintAmount: number;
    approvedAddress: string;
    approvedAmount: number;
    tokenAddress: string;
    withdrawAmount: number;
    staff: string;
}
