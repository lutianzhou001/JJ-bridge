import { Document } from 'mongoose';

export interface Account extends Document {
    role: string;
    ethAddress: string;
    ethPrivateKey: string;
}
