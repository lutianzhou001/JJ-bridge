import { Injectable, Inject } from '@nestjs/common';
import { KeyType, Redis } from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './interfaces/transaction.interface.dto';
import { Log } from './interfaces/log.interface.dto';
import { Order } from './interfaces/order.interface.dto';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { default as abis } from './abi';

// import redis here
import {
    REDIS_EXPIRE_KEY_NAME,
    REDIS_EXPIRE_TIME_IN_SECONDS,
    REDIS_PUBLISHER_CLIENT,
    REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

export interface IRedisSubscribeMessage {
    readonly message: string;
    readonly channel: string;
}

// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
// tslint:disable-next-line: no-var-requires
const Web3 = require('web3');
// tslint:disable-next-line: no-var-requires
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

@Injectable()
export class BlockchainService {
    constructor(@InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
        @InjectModel('Log') private readonly logModel: Model<Log>,
        @InjectModel('Order') private readonly orderModel: Model<Order>,
        // @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly subClient: Redis,
        @Inject(REDIS_PUBLISHER_CLIENT) private readonly pubClient: Redis,
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async loadDepositTasks() {
        await this.fetch();
    }

    async migrate() { }

    async fetch() {
        try {
            // tslint:disable-next-line: no-console
            const currentBlock = await queryCurrentBlock().catch(err => console.log(err));
            // tslint:disable-next-line: no-console
            const transactionsFromDb = await this.transactionModel.find().exec();
            let maxBlock: number = 0;
            const res = await this.pubClient.get('maxBlock');
            // console.log(res);
            if (res) {
                maxBlock = Number(res);
            } else {
                maxBlock = 0;
            }
            // tslint:disable-next-line:prefer-for-of
            for (let i = maxBlock + 1; i < currentBlock - 10; i++) {
                // tslint:disable-next-line: no-console
                const block = await queryBlocks(i).catch(err => console.log(err));
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < block.transactions.length; j++) {
                    // tslint:disable-next-line: no-console
                    const transaction = await queryTransaction(block.transactions[j]).catch(err => console.log(err));
                    await this.decodeTransaction(transaction);
                }
                await this.pubClient.set('maxBlock', JSON.stringify(block.number), REDIS_EXPIRE_KEY_NAME, REDIS_EXPIRE_TIME_IN_SECONDS);
            }
        } catch (err) {
            return err;
        }
    }

    async decodeTransaction(transaction: any) {
        const newTransaction: any = {};
        const newLog: any = {};
        const newOrder: any = {};
        const decodedData = abiDecoder.decodeMethod(transaction.input);
        if (decodedData) {
            // 暂时设计三种表，管理表，交易表，流水表
            // 管理表表示新增，删除，修改角色
            // 交易表表示交易流水，包括增发，销毁，提现等
            // 流水表表示第三方传送过来的数据，交易记录，交易详情，退款等
            switch (decodedData.name) {
                // 第一种情况下，仅做记录（无标准化数据）
                case 'appendStore':
                case 'appendEnterprise':
                case 'updateStore':
                case 'updateEnterprise':
                case 'deleteStore':
                case 'deleteEnterprise':
                case 'setFeeAddress':
                case 'setAdmin':
                    newLog.func = decodedData.name;
                    newLog.data = JSON.stringify(decodedData.params);
                    newLog.blockNumber = transaction.blockNumber;
                    newLog.from = transaction.from;
                    newLog.contractAddress = transaction.to;
                    newLog.transactionHash = transaction.hash;
                    const createdNewLog = new this.logModel(newLog);
                    await createdNewLog.save();

                // 第二种情况下，须要把交易记录下来
                // 主要分为：1）首次发行Issue 2）购买Coupon 3）交易（转账） 4）提现 5）转账JJToken

                // JJToken的方法
                case 'jjburn':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.from = transaction.from;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.burnedAddress = decodedData.params[0].value;
                    newTransaction.burnedAmount = decodedData.params[1].value;
                    const createdNewTransactionjjburn = new this.transactionModel(newLog);
                    await createdNewTransactionjjburn.save();

                case 'jjmint':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.from = transaction.from;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.mintToAddress = decodedData.params[0].value;
                    newTransaction.mintAmount = decodedData.params[1].value;
                    const createdNewTransactionjjmint = new this.transactionModel(newLog);
                    await createdNewTransactionjjmint.save();

                case 'jjapproveTo':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.from = transaction.from;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.approvedAddress = decodedData.params[0].value;
                    newTransaction.approvedAmount = decodedData.params[1].value;
                    const createdNewTransactionjjapproveTo = new this.transactionModel(newLog);
                    await createdNewTransactionjjapproveTo.save();

                case 'jjtransfer':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.to = decodedData.params[0].value;
                    newTransaction.amount = decodedData.params[1].value;
                    const createdNewTransactionjjtransfer = new this.transactionModel(newLog);
                    await createdNewTransactionjjtransfer.save();

                // coupons的方法
                case 'withdraw':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.tokenAddress = decodedData.params[0].value;
                    newTransaction.withdrawAmount = decodedData.params[1].value;
                    const createdNewTransactionjjwithdraw = new this.transactionModel(newLog);
                    await createdNewTransactionjjwithdraw.save();

                case 'batchMint':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.tokenAddress = decodedData.params[0].value;
                    newTransaction.staff = decodedData.params[1].value;
                    newTransaction.mintAmount = decodedData.params[2].value;
                    const createdNewTransactionbatchMint = new this.transactionModel(newLog);
                    await createdNewTransactionbatchMint.save();

                case 'issue':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.tokenAddress = decodedData.params[0].value;
                    newTransaction.enterpriseAddress = decodedData.params[1].value;
                    newTransaction.issueAmount = decodedData.params[2].value;
                    const createdNewTransactionissue = new this.transactionModel(newLog);
                    await createdNewTransactionissue.save();

                case 'mint':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.tokenAddress = decodedData.params[0].value;
                    newTransaction.staff = decodedData.params[1].value;
                    newTransaction.mintAmount = decodedData.params[2].value;
                    const createdNewTransactionmint = new this.transactionModel(newLog);
                    await createdNewTransactionmint.save();

                case 'burn':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.burnedAddress = decodedData.params[0].value;
                    newTransaction.burnedAmount = decodedData.params[1].value;
                    const createdNewTransactionburn = new this.transactionModel(newLog);
                    await createdNewTransactionburn.save();

                case 'transfer':
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.to = decodedData.params[0].value;
                    newTransaction.amount = decodedData.params[1].value;
                    const createdNewTransactiontransfer = new this.transactionModel(newLog);
                    await createdNewTransactiontransfer.save();

                case 'refund':
                    newTransaction.func = decodedData.name;
                    newTransaction.blockNumber = transaction.blockNumber;
                    newTransaction.contractAddress = transaction.to;
                    newTransaction.transactionHash = transaction.hash;
                    newTransaction.from = transaction.from;
                    newTransaction.to = decodedData.params[0].value;
                    newTransaction.amount = decodedData.params[1].value;
                    const createdNewTransactionrefund = new this.transactionModel(newLog);
                    await createdNewTransactionrefund.save();

                // 第三种情况 order记录：纯记录
                case 'appendOrder':
                    newOrder.func = decodedData.name;
                    newOrder.blockNumber = transaction.blockNumber;
                    newOrder.contractAddress = transaction.to;
                    newOrder.transactionHash = transaction.hash;
                    newOrder.from = transaction.from;
                    newOrder.orderId = decodedData.params[0].value;
                    newOrder.orderContent = decodedData.params[1].value;
                    const createdNewOrderAppendOrder = new this.orderModel(newLog);
                    await createdNewOrderAppendOrder.save();

                case 'deleteOrder':
                    newOrder.func = decodedData.name;
                    newOrder.blockNumber = transaction.blockNumber;
                    newOrder.contractAddress = transaction.to;
                    newOrder.transactionHash = transaction.hash;
                    newOrder.from = transaction.from;
                    newOrder.orderId = decodedData.params[0].value;
                    newOrder.orderContent = decodedData.params[1].value;
                    const createdNewOrderDeleteOrder = new this.orderModel(newLog);
                    await createdNewOrderDeleteOrder.save();

                case 'appendOrderDetail':
                    newOrder.func = decodedData.name;
                    newOrder.blockNumber = transaction.blockNumber;
                    newOrder.contractAddress = transaction.to;
                    newOrder.transactionHash = transaction.hash;
                    newOrder.from = transaction.from;
                    newOrder.orderDetailId = decodedData.params[0].value;
                    newOrder.orderDetailContent = decodedData.params[1].value;
                    const createdNewOrderAppendOrderDetail = new this.orderModel(newLog);
                    await createdNewOrderAppendOrderDetail.save();

                case 'deleteOrderDetail':
                    newOrder.func = decodedData.name;
                    newOrder.blockNumber = transaction.blockNumber;
                    newOrder.contractAddress = transaction.to;
                    newOrder.transactionHash = transaction.hash;
                    newOrder.from = transaction.from;
                    newOrder.orderDetailId = decodedData.params[0].value;
                    newOrder.orderDetailContent = decodedData.params[1].value;
                    const createdNewOrderDeleteOrderDetail = new this.orderModel(newLog);
                    await createdNewOrderDeleteOrderDetail.save();
            }
        }
    }
}
