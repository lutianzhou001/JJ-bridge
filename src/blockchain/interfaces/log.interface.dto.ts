import { Document } from 'mongoose';

export interface Log extends Document {
    func: string;
    data: string;
    blockNumber: number;
    to: string;
    from: string;
    contractAddress: string;
    transactionHash: string;
    createdTime: number;
}