import { Injectable, Post, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateDateColumn } from 'typeorm';
import { Omni, Account, Transaction } from '../database/database.entity';
//import { hotWallet, coins } from './config'
import { request } from 'http'

var headers = {
    'content-type': 'text/plain;'
};

async function omniCheck(blockNumber){
    let resultCheck : any = {}
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_listblocktransactions", "params": [' + blockNumber + '] }';
    var options = {
        url: 'http://127.0.0.1:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': '12345678'
        }
    };

    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck)
    return JSON.parse(resultCheck)
}

async function omnigetCurrentBlock(){
    let resultCheck : any = {}

    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_getcurrentconsensushash", "params": [] }';

    var options = {
        url: 'http://127.0.0.1:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': '12345678'
        }
    };


    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
                console.log(response);
        	if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck)
    return JSON.parse(resultCheck);
    }


async function omnigetTransaction(transactionHash){
    let resultCheck : any = {}
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_gettransaction", "params": ["'+ transactionHash +'"] }';
    var options = {
        url: 'http://127.0.0.1:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': '12345678'
        }
    };

    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            console.log(response)
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    return JSON.parse(resultCheck);
}

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
        console.log('omni/fetch')
        let db: number;
        const ocb = await omnigetCurrentBlock();
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
	        console.log(i)
	        const block = await omniCheck(i);
                // tslint:disable-next-line: no-console
                console.log('checking' + i + 'block')
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < block.length; j++) {
                    const transaction = await omnigetTransaction(block[j])
                    const users = await this.findUsers();
                    // tslint:disable-next-line: prefer-for-of
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
                                // tslint:disable-next-line: max-line-length
                                // const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                const engineResult = await this.engine(transaction.result.amount, users[i].id, 'OMNIUSDT')
                                if (engineResult) {
                                    const update = await this.omniRepository.update(
                                        result,
                                        { isUpdated: 1 },
                                    );
                                    if (update) {
                                        Logger.log('update success');
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
