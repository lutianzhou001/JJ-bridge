import * as jwt from 'jsonwebtoken';
import { default as config } from '../config';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JWTService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async createToken(email, roles) {
        const expiresIn = config.jwt.expiresIn;
        const secretOrKey = config.jwt.secretOrKey;
        const userInfo = { email, roles };
        const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

    async validateUser(signedUser): Promise<User> {
        const userFromDb = await this.userModel.findOne({ email: signedUser.email });
        if (userFromDb) {
            return userFromDb;
        }
        return null;
    }
}

