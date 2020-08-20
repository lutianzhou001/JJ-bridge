import * as mongoose from 'mongoose';

export const orderSchema = new mongoose.Schema({
    func: String,
    blockNumber: Number,
    to: String,
    from: String,
    contractAddress: String,
    transactionHash: String,
    createdTime: Number,
    orderId: String,
    orderDetailId: String,
    orderContent: String,
    orderDetailContent: String,
});
