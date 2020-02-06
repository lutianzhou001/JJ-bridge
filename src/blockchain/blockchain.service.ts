import { Injectable, Post, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blockchain, Account, Transaction } from '../database/database.entity';
import { hotWallet, coins } from './config'
const request = require('request');
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
const Web3 = require('web3');
const abiDecoder = require('abi-decoder');
const web3 = new Web3(new Web3.providers.HttpProvider('http://119.3.43.136:23130'));
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

async function coin_name2Address(coin_name) {
    //IMPLEMENT: 增加coin_NAME向address转换
    coins.forEach(element => {
        if (element.coin_name == coin_name) {
            return element.contractAddress;
        }
    });
}


async function address2Coin_name(address) {
    //IMPLEMENT: 增加address向COIN_NAME转换
    coins.forEach(element => {
        if (element.contractAddress == address) {
            return element.coin_name;
        }
    });
}

@Injectable()
export class BlockchainService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @InjectRepository(Blockchain)
        private readonly blockchainRepository: Repository<Blockchain>,
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
        // 第一步，从engine中update balance
        Logger.log("Withdraw begins");
        const engineResult = await this.engine(value, id, coin_name);
        if (engineResult) {
            var resultBalance = await this.getBalance(coin_name, hotWallet.address);
            if (resultBalance > value) {
                let withdrawResult = await this.transfer(hotWallet.address, address, value, coin_name, hotWallet.ethPrivateKey);
                if (withdrawResult.transactionHash) {
                    //插入转出记录 
                    const newTransaction = new Transaction();
                    newTransaction.coin_name = coin_name;
                    newTransaction.from = hotWallet.address;
                    newTransaction.to = address;
                    newTransaction.value = value;
                    newTransaction.transactionHash = withdrawResult.transactionHash;
                    const result = await this.transactionRepository.save(newTransaction)
                    if (result) {
                        return {
                            result: true,
                            errMessage: null
                        }
                    }
                }
            } else {
                return {
                    result: false,
                    errMessage: 'insuffcient balance'
                }
            }
        }
    }

    // 新建轮训去查询转账是否成功

    async getBalance(coin_name, currentAddress) {
        if (coin_name == 'ETH') {
            let resultBalance = await web3.eth.getBalance(hotWallet.address);
            return resultBalance;
        } else {
            var myContract = new web3.eth.Contract(abi, coin_name, {
                from: hotWallet.address,
                gasPrice: '1000000000'
            })
            let contractAddress = await coin_name2Address(coin_name);
            myContract.methods.balanceOf(contractAddress).call({ from: currentAddress }, function (err, res) {
                if (!err) {
                    Logger.log(res)
                } else {
                    Logger.log(err)
                }
            })
        }
    }

    async transfer(from, to, value, coin_name, ethPrivateKey) {
        var data: any = {}
        data.nonce = await web3.eth.getTransactionCount(from);
        data.from = from;
        data.value = value;
        data.gas = '0x21000';
        data.chainId = '0x22b8'
        if (coin_name == "ETH") {
            data.to = to;
            data.input = '0x';
            let signedData = await web3.eth.accounts.signTransaction(data, ethPrivateKey);
            if (signedData) {
                let resultTransferETH = await web3.eth.sendSignedTransaction(signedData.rawTransaction);
                return resultTransferETH;
            }
        } else {
            var addPreZero = (num) => {
                var t = (num + '').length,
                    s = '';
                for (var i = 0; i < 64 - t; i++) {
                    s += '0';
                }
                return s + num;
            }
            data.to = await coin_name2Address(coin_name);
            let subto = to.substr(2);
            data.input = '0x' + 'a9059cbb' + addPreZero(subto) + addPreZero(web3.utils.toHex(value).substr(2)) //T0DO TO是去掉0x的
            let signedData = await web3.eth.signTransaction(data, ethPrivateKey);
            if (signedData) {
                let resultTransferERC20 = await web3.eth.sendSignedTransaction(signedData.rawTransaction);
                return resultTransferERC20;
            }
        }
    }

    async collect() {
        // we want to check the data with infura.io
        // 读取表
        const result = await this.blockchainRepository.createQueryBuilder().select('`to`', 'receiver').addSelect('sum(value)', 'value').where({ isCollected: 0 }).groupBy('`to`').getRawMany();
        result.forEach(async element => {
            // we should config the data to be updated
            if (element.value > 4000) {
                // element.receiver
                // element.value
                const accountCollect = await this.accountRepository.findOne({
                    where: { ethAddress: element.receiver }
                })
                if (accountCollect.ethPrivateKey) {
                    var data: any = {};
                    data.to = hotWallet.address;
                    data.value = '0x' + (element.value - 100000000000000000).toString(16) // we left 0.1 ETH in his account
                    let resultSendTransaction = await this.transfer(accountCollect.ethAddress, data.to, data.value, "ETH", accountCollect.ethPrivateKey)
                    if (resultSendTransaction) {
                        const update = await this.blockchainRepository.createQueryBuilder().update(Blockchain).set({
                            isCollected: 1,
                        }).where({ ethAddress: element.value }).execute();
                        if (update) {
                            Logger.log("collect success")
                        }
                    }
                }
            }
        });
    }

    // 函数作用，从INFURA.IO 上再检查一遍 交易是否存在了
    async check(hash, from, to, value, input): Promise<Boolean> {
        let resultCheck: any = {};
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
                resolve(body)
            });
        });
        resultCheck = await promiseCheck.then(function (value) { return value });
        // 不知道怎么解RESULT
        return true;
    }

    async engine(value, id, coin_name): Promise<Boolean> {
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
                db = 2661000;
            } else {
                db = maxBlock[0].blockNumber;
            }

            if (db < currentBlock - 10) {
                // tslint:disable-next-line: no-empty
                for (let i = db + 1; i < currentBlock - 10; i++) {
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
                                    newTransaction.isERC20 = 0;
                                    newTransaction.isCollected = 0;
                                    newTransaction.isUpdated = 0;
                                    const result = await this.blockchainRepository.save(newTransaction);
                                    if (result) {
                                        const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                        if (checkResult === true) {
                                            const engineResult = await this.engine(transaction.value, users[i].id, "ETH")
                                            if (engineResult) {
                                                const update = await this.blockchainRepository.update(
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
                                    newTransaction.isERC20 = 1;
                                    newTransaction.isUpdated = 0;
                                    newTransaction.isCollected = 0;
                                    const result = await this.blockchainRepository.save(newTransaction);
                                    if (result) {
                                        const checkResult = await this.check(transaction.hash, transaction.from, transaction.to, transaction.value, transaction.input);
                                        if (checkResult === true) {
                                            //TODO 找出该币种，暂时写为USDT
                                            let coin_name = await address2Coin_name(transaction.to)
                                            const engineResult = await this.engine(transaction.value, users[i].id, coin_name)
                                            if (engineResult) {
                                                const update = await this.blockchainRepository.update(
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
        }
        catch (err) {
            return err;
        }
    }
}


