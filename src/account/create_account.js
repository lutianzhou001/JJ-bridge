const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://47.75.214.198:8545'));
let a  = web3.eth.accounts.create();
console.log(a);


