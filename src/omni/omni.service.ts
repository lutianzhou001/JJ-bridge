import { Injectable, Post, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateDateColumn } from 'typeorm';
import { Omni, Account, Transaction } from '../database/database.entity';
import { omniCheck, omnigetCurrentBlock, omnigetTransaction } from './utils';
//import { hotWallet, coins } from './config'
const request = require('request');

@Injectable()
export class OmniService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(Omni)
        private readonly omniRepository: Repository<Omni>,
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

    async engine(value, id, coin_name): Promise<Boolean> {
        // TODO
        // send to engine
        return true
    }

    // 函数作用，从INFURA.IO 上再检查一遍 交易是否存在了
    async check(hash, from, to, value, input) {
    }



    async fetch() {
        let db: number;
        const ocb = await omnigetCurrentBlock()
        const maxBlock = await this.omniRepository.find({
            order: {
                block: 'DESC',
            },
            take: 1,
        });
        if (maxBlock.length === 0) {
            db = 1000;
        } else {
            db = maxBlock[0].block;
        }

        if (db < ocb.block - 10) {
            for (let i = db + 1; i < ocb.block - 10; i++) {
                const block = await omniCheck(i);
                console.log("checking" + i + "block")
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < block.length; j++) {
                    const transaction = await omnigetTransaction(block[j])
                    const users = await this.findUsers();
                    for (let i = 0; i < users.length; i++) {
                        // 这里还需要看下合约地址是否是配置中的ERC20如果不是，则也可以不入库
                        if ((users[i].btcAddress === transaction.result.referenceaddress) && (transaction.result.propertyid == 31)) {
                            const newTransaction = new Omni();
                            newTransaction.block = transaction.result.block;
                            newTransaction.amount = transaction.result.amount;
                            newTransaction.txid = transaction.result.txid;
                            newTransaction.sendingAddress = transaction.result.sendingaddress;
                            newTransaction.referenceAddress = transaction.result.referenceaddress;
                            newTransaction.isCollected = 0;
                            newTransaction.isUpdated = 0;
                            const result = await this.omniRepository.save(newTransaction);
                            if (result) {
                                //const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                const engineResult = await this.engine(transaction.result.amount, users[i].id, "OMNIUSDT")
                                if (engineResult) {
                                    const update = await this.omniRepository.update(
                                        result,
                                        { isUpdated: 1 },
                                    )
                                    if (update) {
                                        Logger.log("update success");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}