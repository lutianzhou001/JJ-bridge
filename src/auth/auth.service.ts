import * as bcrypt from 'bcryptjs';
import { default as config } from '../config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/createuser.dto';
import { ResponseError } from 'src/common/dto/responseError.dto';
import { IRedisSubscribeMessage, BlockchainService } from 'src/blockchain/blockchain.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/responseSuccess.dto';
var CryptoTS = require('crypto-ts');

const saltRounds = 10;

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        private readonly blockchainService: BlockchainService,
        private readonly jwtService: JWTService) { }

    async createNewUser(newUser: CreateUserDto): Promise<IResponse> {
        if (this.isValidEmail(newUser.email)) {
            const userRegistered = await this.findByEmail(newUser.email);
            if (!userRegistered) {
                newUser.password = await bcrypt.hash(newUser.password, saltRounds);
                const addressCreated = await this.blockchainService.createAddress();
                newUser.address = addressCreated.address;
                // 用AES算法对私钥进行加密
                const ciphertext = CryptoTS.AES.encrypt(addressCreated.privateKey, config.aesKey.secret);
                newUser.privateKey = ciphertext.toString();

                // 解密算法在这里，编者注
                // var bytes = CryptoTS.AES.decrypt(ciphertext.toString(), 'secret key 123');
                // var plaintext = bytes.toString(CryptoTS.enc.Utf8);

                const createdUser = new this.userModel(newUser);
                createdUser.roles = ['User'];
                const res = await createdUser.save();
                return new ResponseSuccess('CREATE_NEW_USER_SUCCESS', { id: res.id, email: res.email, name: res.name });
            } else {
                return new ResponseError('USER_HAS_ALREADY_EXISTED');
            }
        } else {
            return new ResponseError('EMAIL_IS_NOT_VALID');
        }
    }

    async validateLogin(email, password) {
        const userFromDb = await this.userModel.findOne({ email });
        if (!userFromDb) {
            throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND)
        };
        const isValidPass = await bcrypt.compare(password, userFromDb.password);
        if (isValidPass) {
            const accessToken = await this.jwtService.createToken(email, userFromDb.roles);
            return { token: accessToken, user: userFromDb };
        } else {
            throw new HttpException('LOGIN.PASSWORD_NOT_VALID', HttpStatus.UNAUTHORIZED);
        }
    }

    isValidEmail(email: string) {
        if (email) {
            // tslint:disable-next-line: max-line-length
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        } else {
            return false;
        }
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }
}
