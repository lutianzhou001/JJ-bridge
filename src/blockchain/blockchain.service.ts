import { Injectable, Post, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './interfaces/transaction.interface.dto';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { default as abis } from './abi';
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
const Web3 = require('web3');
const abiDecoder = require('abi-decoder');
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8502'));

abiDecoder.addABI(abis.erc20abi);

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
    return transaction;
};

// async function coin_name2Address(coin_name) {
//     //IMPLEMENT: 增加coin_NAME向address转换
//     coins.forEach(element => {
//         if (element.coin_name == coin_name) {
//             return element.contractAddress;
//         }
//     });
// }

// async function address2Coin_name(address) {
//     //IMPLEMENT: 增加address向COIN_NAME转换
//     coins.forEach(element => {
//         if (element.contractAddress == address) {
//             return element.coin_name;
//         }
//     });
// }

@Injectable()
export class BlockchainService {
    constructor(@InjectModel('Transaction') private readonly transactionModel: Model<Transaction>) { }

    // async withdraw(value, id, coin_name, address) {
    //     // 第一步，从engine中update balance
    //     Logger.log("Withdraw begins");
    //     const engineResult = await this.engine(value, id, coin_name);
    //     if (engineResult) {
    //         var resultBalance = await this.getBalance(coin_name, hotWallet.address);
    //         if (resultBalance > value) {
    //             let withdrawResult = await this.transfer(hotWallet.address, address, value, coin_name, hotWallet.ethPrivateKey);
    //             if (withdrawResult.transactionHash) {
    //                 //插入转出记录 
    //                 const newTransaction = new Transaction();
    //                 newTransaction.coin_name = coin_name;
    //                 newTransaction.from = hotWallet.address;
    //                 newTransaction.to = address;
    //                 newTransaction.value = value;
    //                 newTransaction.isSuccess = 0;
    //                 newTransaction.transactionHash = withdrawResult.transactionHash;
    //                 const result = await this.transactionRepository.save(newTransaction)
    //                 if (result) {
    //                     return {
    //                         result: true,
    //                         errMessage: null
    //                     }
    //                 }
    //             }
    //         } else {
    //             return {
    //                 result: false,
    //                 errMessage: 'insuffcient balance'
    //             }
    //         }
    //     }
    // }

    // // 新建轮训去查询转账是否成功
    // async checkTransactionStatus() {
    //     const result = await this.transactionRepository.createQueryBuilder().where({ isSuccess: 0 }).getMany();
    //     for (let i = 0; i < result.length; i++) {
    //         let res = await web3.eth.getTransactionReceipt(result[i].transactionHash)
    //         if (res.status == true) {
    //             const update = await this.transactionRepository.createQueryBuilder().update(Transaction).set({
    //                 isSuccess: 1,
    //             }).where({ transactionHash: res.transactionHash }).execute();
    //             if (update) {
    //                 Logger.log("update success")
    //             }
    //         }
    //     }
    // }

    // async getBalance(coin_name, currentAddress) {
    //     if (coin_name === 'ETH') {
    //         const resultBalance = await web3.eth.getBalance(hotWallet.address);
    //         return resultBalance;
    //     } else {
    //         var myContract = new web3.eth.Contract(abi, coin_name, {
    //             from: hotWallet.address,
    //             gasPrice: '1000000000'
    //         })
    //         let contractAddress = await coin_name2Address(coin_name);
    //         myContract.methods.balanceOf(contractAddress).call({ from: currentAddress }, function (err, res) {
    //             if (!err) {
    //                 Logger.log(res)
    //             } else {
    //                 Logger.log(err)
    //             }
    //         })
    //     }
    // }

    // async transfer(from, to, value, coin_name, ethPrivateKey) {
    //     var data: any = {}
    //     data.nonce = await web3.eth.getTransactionCount(from);
    //     data.from = from;
    //     data.value = value;
    //     data.gas = '0x21000';
    //     data.chainId = '0x22b8'
    //     if (coin_name == "ETH") {
    //         data.to = to;
    //         data.input = '0x';
    //         let signedData = await web3.eth.accounts.signTransaction(data, ethPrivateKey);
    //         if (signedData) {
    //             let resultTransferETH = await web3.eth.sendSignedTransaction(signedData.rawTransaction);
    //             return resultTransferETH;
    //         }
    //     } else {
    //         var addPreZero = (num) => {
    //             var t = (num + '').length,
    //                 s = '';
    //             for (var i = 0; i < 64 - t; i++) {
    //                 s += '0';
    //             }
    //             return s + num;
    //         }
    //         data.to = await coin_name2Address(coin_name);
    //         let subto = to.substr(2);
    //         data.input = '0x' + 'a9059cbb' + addPreZero(subto) + addPreZero(web3.utils.toHex(value).substr(2)) //T0DO TO是去掉0x的
    //         let signedData = await web3.eth.signTransaction(data, ethPrivateKey);
    //         if (signedData) {
    //             let resultTransferERC20 = await web3.eth.sendSignedTransaction(signedData.rawTransaction);
    //             return resultTransferERC20;
    //         }
    //     }
    // }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async loadDepositTasks() {
        await this.fetch();
    }

    async fetch() {
        try {
            // tslint:disable-next-line: no-console
            const currentBlock = await queryCurrentBlock().catch(err => console.log(err));
            // tslint:disable-next-line: no-console
            const transactionsFromDb = await this.transactionModel.find().exec();
            let maxBlock: number = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let i: number = 0; i < transactionsFromDb.length; i++) {
                const current: number = transactionsFromDb[i].blockNumber;
                if (current > maxBlock) {
                    maxBlock = current;
                }
            }
            // tslint:disable-next-line: no-empty
            for (let i = maxBlock + 1; i < currentBlock - 10; i++) {
                // tslint:disable-next-line: no-console
                const block = await queryBlocks(i).catch(err => console.log(err));
                if (block.transactions.length === 0) {
                    const newTransaction: any = {};
                    newTransaction.blockNumber = block.number;
                    const createdTransaction = new this.transactionModel(newTransaction);
                    const result = await createdTransaction.save();
                }
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < block.transactions.length; j++) {
                    // tslint:disable-next-line: no-console
                    const transaction = await queryTransaction(block.transactions[j]).catch(err => console.log(err));
                    const newTransaction: any = {};
                    const decodeData = abiDecoder.decodeMethod(transaction.input);
                    if (decodeData) {
                        newTransaction.blockNumber = transaction.blockNumber;
                        newTransaction.contractAddress = transaction.to;
                        newTransaction.amount = decodeData.params[1].value;
                        newTransaction.transactionHash = transaction.hash;
                        newTransaction.from = transaction.from;
                        newTransaction.to = decodeData.params[0].value;
                        const createdTransaction = new this.transactionModel(newTransaction);
                        const result = await createdTransaction.save();
                    }
                }
            }
        } catch (err) {
            return err;
        }
    }
}
