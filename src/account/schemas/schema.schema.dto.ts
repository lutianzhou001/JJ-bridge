import * as mongoose from 'mongoose';

export const accountSchema = new mongoose.Schema({
    role: String,
    ethAddress: String,
    ethPrivateKey: String,
});
