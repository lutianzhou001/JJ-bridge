import { Injectable, Post, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateDateColumn } from 'typeorm';
import { Omni, Account, Transaction } from '../database/database.entity';
//import { hotWallet, coins } from './config'
const request = require('request');
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"


@Injectable()
export class OmniService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(Omni)
        private readonly blockchainRepository: Repository<Omni>,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async attach() {
        // tslint:disable-next-line: no-console
        console.log('here is a sample');
    }

    async findUsers(): Promise<Account[]> {
        const result = await this.accountRepository.find({
            where: { isAvailable: 1 },
        })
        return result;
    }

    async withdraw(value, id, coin_name, address) {
    }

    // 新建轮训去查询转账是否成功
    async checkTransactionStatus() {
    }

    async getBalance(coin_name, currentAddress) {
    }

    async transfer(from, to, value, coin_name, ethPrivateKey) {
    }

    async collect() {
    }

    // 函数作用，从INFURA.IO 上再检查一遍 交易是否存在了
    async check(hash, from, to, value, input) {
    }
   
    async fetch(){
    }

}