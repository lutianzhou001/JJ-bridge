import * as mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
    blockNumber: Number,
    amount: String,
    transactionHash: String,
    from: String,
    to: String,
    createTime: Number,
    contractAddress: String,
});
