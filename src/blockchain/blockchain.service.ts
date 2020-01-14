import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blockchain,Account } from '../database/database.entity';
// here we can't import web3 into Ts. For more you can refer to "https://github.com/ethereum/web3.js/issues/1597"
const Web3 = require('web3');
const abiDecoder = require('abi-decoder');
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

    async check() {
        let db: number;
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
                                await this.blockchainRepository.save(newTransaction);
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
                                    await this.blockchainRepository.save(newTransaction);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

