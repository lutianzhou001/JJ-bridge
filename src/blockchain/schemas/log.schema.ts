import * as mongoose from 'mongoose';

export const logSchema = new mongoose.Schema({
    func: String,
    data: String,
    blockNumber: Number,
    to: String,
    from: String,
    contractAddress: String,
    transactionHash: String,
    createdTime: Number,
});
