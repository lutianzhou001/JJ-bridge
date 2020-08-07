import { Document } from 'mongoose';

export interface Transaction extends Document {
    blockNumber: number;
    amount: string;
    transactionHash: string;
    from: string;
    to: string;
    createdTime: number;
    contractAddress: string;
}
