import { Document } from 'mongoose';

export interface User extends Document {
    accountstatus: string;
    name: string;
    surname: string;
    nickname: string;
    email: string;
    phone: string;
    birthdaydate: Date;
    password: string;
    roles: string[];
    privateKey: string;
    address: string;
    kyc: {
        realname: string,
        IDNumber: string,
        IDType: string,
        nation: string,
        status: string,
        frontIDCard: string,
        handHeldIDCard: string,
        reason: string,
    };
}
