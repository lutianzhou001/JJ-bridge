import { Document } from 'mongoose';

export interface Order extends Document {
    func: string;
    blockNumber: number;
    to: string;
    from: string;
    contractAddress: string;
    transactionHash: string;
    createdTime: number;
    orderId: string;
    orderDetailId: string;
    orderContent: string;
    orderDetailContent: string;
}