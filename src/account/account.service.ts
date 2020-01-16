import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../database/database.entity';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8545'));
var pointer: number = 0;
@Injectable()
export class AccountService {


  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }

  async findAll(): Promise<Account[]> {
    const result = await this.accountRepository.find();
    return result;
  }

  async findUsers(): Promise<Account[]> {
    const result = await this.accountRepository.find({
      where: { isAvailable: 1 },
    })
    return result;
  }

  async generate() {
    try {
      for (let i = 1; i <= 100000; i++) {
        console.log(i);
        const newAccount = new Account();
        let account = await web3.eth.accounts.create();
        newAccount.ethAddress = account.address;
        newAccount.ethPrivateKey = account.privateKey;
        newAccount.isAllocated = 0;
        newAccount.isAvailable = 0;
        await this.accountRepository.save(newAccount);
      }
    } catch (err) {
      return err;
    }
  }

  async apply(): Promise<Account> {
    const newAccount = new Account()
    const lastApply = await this.accountRepository.find({
      where: { id: pointer },
    })
    const thisApply = await this.accountRepository.find({
      where: { id: pointer + 1 },
    })
    if (lastApply[0]) {
      if (lastApply[0].isAvailable && (!thisApply[0].isAvailable)) {
        // begin to allocate
        const updatedThisApply = await this.accountRepository.update(
          thisApply[0],
          { isAvailable: 1 },
        )
        newAccount.id = thisApply[0].id;
        newAccount.ethAddress = thisApply[0].ethAddress;
        pointer = pointer + 1;
        Logger.log("apply success");
        return newAccount;
      }
    } else {
      for (let i = 1; i <= 100000; i++) {
        const r = await this.accountRepository.find({
          where: { id: i }
        })
        if (r[0].isAvailable === 0) {
          pointer = i - 1;
          // begin to allocate
          const thisApply = await this.accountRepository.find({
            where: { id: pointer + 1 },
          })
          const updatedThisApply = await this.accountRepository.update(
            thisApply[0],
            { isAvailable: 1 },
          )
          newAccount.id = thisApply[0].id;
          newAccount.ethAddress = thisApply[0].ethAddress;
          pointer = pointer + 1;
          Logger.log("apply success");
          return newAccount;
        }
      }
    }
  }

  async destroyAccount(id: number) {
    try {
      const isSuccess = await this.accountRepository.delete(id);
      return isSuccess.affected;
    } catch (err) {
      return err;
    }
  }
}
