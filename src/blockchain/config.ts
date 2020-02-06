//配置热钱包地址
const hotWallet = { address: '0x57Fbf0e343B2F42297b6B52526D5c2e88589A052', ethPrivateKey: 'f869cfe80454e8c14223b778801894d2c3c84d91ed3010a1604bfee59319082c' };

//配置ERC20地址
const coins = [
    { coin_name: 'USDT', contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { coin_name: 'BNB', contractAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' },
    { coin_name: 'HT', contractAddress: '0x6f259637dcd74c767781e37bc6133cd6a68aa161' },
    { coin_name: 'VeChain', contractAddress: '0xd850942ef8811f2a866692a623011bde52a462c1' }
];

export { hotWallet, coins }
