import * as mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
    blockNumber: Number,
    amount: String,
    transactionHash: String,
    from: String,
    to: String,
    createTime: Number,
    contractAddress: String,
    func: String,
    burnedAddress: String,
    burnedAmount: String,
    mintToAddress: String,
    mintAmount: Number,
    approvedAddress: String,
    approvedAmount: Number,
    tokenAddress: String,
    withdrawAmount: Number,
    staff: String,
});
