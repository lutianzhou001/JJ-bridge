import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    accountstatus: String,
    name: String,
    surname: String,
    nickname: String,
    email: String,
    phone: String,
    password: String,
    birthdaydate: Date,
    roles: Array<String>(),
    privateKey: String,
    address: String,
    kyc: {
        realname: String,
        IDNumber: String,
        IDType: String,
        nation: String,
        status: String,
        frontIDCard: String,
        handHeldIDCard: String,
        reason: String,
    },
});
