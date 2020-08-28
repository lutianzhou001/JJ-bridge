export default {
    db: {
        user: null,
        pass: null,
        host: 'localhost',
        port: '27017',
        database: 'testdb',
        authSource: null,
    },

    redisSettings: {
        host: 'localhost',
        port: 6379,
        password: 'password',
    },
    jwt: {
        secretOrKey: 'secret',
        expiresIn: 3600,
    },
    aesKey: {
        secret: 'password',
    },
    deployedContracts: {
        RolesAddress: '0xE807c1C269e168f16AEadaE1FDBe2dC8680D6555',
        OrdersAddress: '0x22e7Dd9B7C2708dE833b880EF9804D3E31689Fa6',
        OrderDetailsAddress: '0x22e7Dd9B7C2708dE833b880EF9804D3E31689Fa6',
        JJTokenAddress: '0xbCff0801bffC7E687D99Cc224002cbE4CAbc523C',
    },
};
