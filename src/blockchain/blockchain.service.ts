import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blockchain } from './blockchain.entity';
import { max } from 'bn.js';
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
const Web3 = require("web3");

// tslint:disable-next-line: prefer-const
const web3 = new Web3(new Web3.providers.HttpProvider('http://119.3.43.136:23130'));

const queryCurrentBlock = async () => {
  const blockNumber = await web3.eth.getBlockNumber()
  return blockNumber;
}

const queryTransactions = async (blockNumber) => {
  const transactions = await web3.eth.getBlock(blockNumber)
  return transactions.transactions;
}

@Injectable()
export class BlockchainService {
  constructor(
    @InjectRepository(Blockchain)
    private readonly blockchainRepository: Repository<Blockchain>,
  ) { }

  async attach() {
    // tslint:disable-next-line: no-console
    console.log('here is a sample');
  }

  async check() {
    let db : number
    // tslint:disable-next-line: no-console
    const currentBlock = await queryCurrentBlock().catch(err => console.log(err));
    // tslint:disable-next-line: no-console
    const transactions = await queryTransactions(currentBlock).catch(err => console.log(err));
    //console.log(currentBlock)
    //console.log(transactions
    const maxBlock = await this.blockchainRepository.find({
      order: {
        blockNumber: 'DESC',
      },
      take: 1,
    });

    if (maxBlock.length == 0) {
      db = 0;
    } else {
      db = maxBlock[0].blockNumber;
    }

    if (db < currentBlock - 10) {
      // tslint:disable-next-line: no-empty

      for (let i = db + 1; i < currentBlock - 10; i++) {
        for (let j = 0; j < transactions.length; j++) {
          // 开始解合约
          // tslint:disable-next-line: no-console
          // TODO 这里开始解合约
        }
      }
    }
  }
}