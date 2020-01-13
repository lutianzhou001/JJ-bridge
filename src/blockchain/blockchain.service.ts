import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blockchain } from './blockchain.entity';
import { max } from 'bn.js';
import { toUnicode } from 'punycode';
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
// tslint:disable-next-line: no-var-requires
const Web3 = require('web3');
// tslint:disable-next-line: no-var-requires
const abiDecoder = require('abi-decoder');

// tslint:disable-next-line: prefer-const
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8545'));

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
    console.log(currentBlock);
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
      console.log(db);
      for (let i = 949950; i < currentBlock - 10; i++) {
          console.log(i);
          const block = await queryBlocks(i).catch(err => console.log(err));
        for (let j = 0; j < block.transactions.length; j++) {
              const transaction = await queryTransaction(block.transactions[j]).catch(err => console.log(err));
              if (transaction.input == '0x') {
                  const newTransaction = new Blockchain();
                  newTransaction.blockNumber = transaction.blockNumber;
                  newTransaction.value = transaction.value;
                  newTransaction.transactionHash = transaction.hash;
                  newTransaction.from = transaction.from;
                  newTransaction.to = transaction.to;
                  newTransaction.isERC20 = false;
                  await this.blockchainRepository.save(newTransaction);
                // TODO: 还需要判断TO是否在用户清单里，如果不在，则次交易可以不入库；  
                // 如果判断到input是0x的话，表示是一个普通的转账交易，取出FROM和TO即可
              }
              const decodeData = abiDecoder.decodeMethod(transaction.input);
              console.log(decodeData);
          // 开始解合约
          // tslint:disable-next-line: no-console
          // TODO 这里开始解合约
        }
      }
    }
  }
}