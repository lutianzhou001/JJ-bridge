import { Injectable, Logger } from '@nestjs/common';
import { AccountCreateDto } from './dto/account.create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdvancedConsoleLogger } from 'typeorm';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8502'));

@Injectable()
export class AccountService {

  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>) { }

  async create(accountCreateDto: AccountCreateDto) {
    const accountETH = await web3.eth.accounts.create();
    accountCreateDto.ethAddress = accountETH.address;
    accountCreateDto.ethPrivateKey = accountETH.PrivateKey;
    const createdAccount = new this.accountModel(accountCreateDto);
    return await createdAccount.save();
  }
}
