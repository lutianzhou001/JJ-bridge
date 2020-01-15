import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blockchain, Account } from '../database/database.entity';
import * as Request from "request-promise-native"
import { resolve } from 'url';
const request = require('request');
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
const Web3 = require('web3');
const abiDecoder = require('abi-decoder');
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8545'));
const endPoint = "https://mainnet.infura.io/v3/b7b3b54135a548e6b52c32fc9b62436a"

const abi = [
    {
        'constant': true,
        'inputs': [],
        'name': 'name',
        'outputs': [
            {
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': '_spender',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'approve',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': '_from',
                'type': 'address'
            },
            {
                'name': '_to',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transferFrom',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'decimals',
        'outputs': [
            {
                'name': '',
                'type': 'uint8'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': '_owner',
                'type': 'address'
            }
        ],
        'name': 'balanceOf',
        'outputs': [
            {
                'name': 'balance',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'symbol',
        'outputs': [
            {
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': '_to',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': '_owner',
                'type': 'address'
            },
            {
                'name': '_spender',
                'type': 'address'
            }
        ],
        'name': 'allowance',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'payable': true,
        'stateMutability': 'payable',
        'type': 'fallback'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
            },
            {
                'indexed': true,
                'name': 'spender',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Approval',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'name': 'from',
                'type': 'address'
            },
            {
                'indexed': true,
                'name': 'to',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Transfer',
        'type': 'event'
    }
]

abiDecoder.addABI(abi);

const queryCurrentBlock = async () => {
    const blockNumber = await web3.eth.getBlockNumber();
    return blockNumber;
};

const queryBlocks = async (blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber);
    return block;
};

const queryTransaction = async (transactionHash) => {
    const transaction = await web3.eth.getTransaction(transactionHash);
    return transaction
};

@Injectable()
export class BlockchainService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(Blockchain)
        private readonly blockchainRepository: Repository<Blockchain>,
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

    async collection() {
        // we want to check the data with infura.io
        // 读取表
        let tobeUpdated = [];
        const result = await this.blockchainRepository.createQueryBuilder().select('`to`', 'receiver').addSelect('sum(value)', 'value').groupBy('`to`').getRawMany();
        result.forEach(element => {
            // we should config the data to be updated
            if (element.value > 4000) {
                tobeUpdated.push(element.receiver)
            }
        });
        console.log(tobeUpdated);

        // to find the address which in the tobeUpdated;
        const details = await this.blockchainRepository.createQueryBuilder().select().where("`to` IN (:addresses)", { addresses: tobeUpdated }).getMany();
        // 开始验证details的有效性，如果有效，送归集
        console.log(details[0].isChecked)

    }

    async check(hash, from, to, value, input): Promise<Boolean> {
        let result: any = {};
        var headers = {
            'Content-Type': 'application/json'
        };
        var dataString = '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params": ["0xbb3a336e3f823ec18197f1e13ee875700f08f03e2cab75f0d0b118dabb44cba0"],"id":1}';
        var options = {
            url: endPoint,
            method: 'POST',
            headers: headers,
            body: dataString,
        };
        var promiseCheck = new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                resolve(body.result)
            });
        });
        result = await promiseCheck.then(function (value) { return value })
        // 不知道怎么解RESULT
        return true;
    }

    async engine(value, id): Promise<Boolean> {
        // TODO
        // send to engine
        return true
    }

    async fetch() {
        try {
            let db: number;
            // tslint:disable-next-line: no-console
            const currentBlock = await queryCurrentBlock().catch(err => console.log(err));
            // tslint:disable-next-line: no-console
            const maxBlock = await this.blockchainRepository.find({
                order: {
                    blockNumber: 'DESC',
                },
                take: 1,
            });

            if (maxBlock.length === 0) {
                db = 0;
            } else {
                db = maxBlock[0].blockNumber;
            }

            if (db < currentBlock - 10) {
                // tslint:disable-next-line: no-empty
                for (let i = 462680; i < currentBlock - 10; i++) {
                    const block = await queryBlocks(i).catch(err => console.log(err));
                    // tslint:disable-next-line: prefer-for-of
                    for (let j = 0; j < block.transactions.length; j++) {
                        const transaction = await queryTransaction(block.transactions[j]).catch(err => console.log(err));
                        const users = await this.findUsers();
                        for (let i = 0; i < users.length; i++) {
                            // 这里还需要看下合约地址是否是配置中的ERC20如果不是，则也可以不入库
                            if (users[i].ethAddress === transaction.to) {
                                if (transaction.input === '0x') {
                                    const newTransaction = new Blockchain();
                                    newTransaction.blockNumber = transaction.blockNumber;
                                    newTransaction.value = transaction.value;
                                    newTransaction.transactionHash = transaction.hash;
                                    newTransaction.from = transaction.from;
                                    newTransaction.to = transaction.to;
                                    newTransaction.isERC20 = false;
                                    const result = await this.blockchainRepository.save(newTransaction);
                                    if (result) {
                                        const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                        if (checkResult === true) {
                                            const engineResult = await this.engine(transaction.value, users[i].id)
                                            if (engineResult) {
                                                const update = await this.blockchainRepository.update(
                                                    1,
                                                    { id: users[i].id },
                                                )
                                                if (update) {
                                                    console.log("update Success");
                                                    // 流程至此结束
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                const decodeData = abiDecoder.decodeMethod(transaction.input);
                                if (decodeData) {
                                    const newTransaction = new Blockchain();
                                    newTransaction.blockNumber = transaction.blockNumber;
                                    newTransaction.contractAddress = transaction.to;
                                    newTransaction.value = decodeData.params[1].value;
                                    newTransaction.transactionHash = transaction.hash;
                                    newTransaction.from = transaction.from;
                                    newTransaction.to = decodeData.params[0].value;
                                    newTransaction.isERC20 = true;
                                    const result = await this.blockchainRepository.save(newTransaction);
                                    if (result) {
                                        const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                        if (checkResult === true) {
                                            const engineResult = await this.engine(transaction.value, users[i].id)
                                            if (engineResult) {
                                                const update = await this.blockchainRepository.update(
                                                    1,
                                                    { id: users[i].id },
                                                )
                                                if (update) {
                                                    console.log("update Success");
                                                    // 流程至此结束
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
        }
        catch (err) {
            return err;
        }
    }
}


