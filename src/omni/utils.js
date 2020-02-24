var request = require('request');

var headers = {
    'content-type': 'text/plain;'
};

async function omniCheck(blockNumber){
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_listblocktransactions", "params": [' + blockNumber + '] }';
    var options = {
        url: 'http://47.75.138.67:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': '12345678'
        }
    };

    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            console.log(response)
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    let resultCheck = await promiseCheck.then(function (value) { return value });
    return resultCheck
}

async function omnigetCurrentBlock(){

    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_getcurrentconsensushash", "params": [] }';

    var options = {
        url: 'http://127.0.0.1:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': 'qaz123-QAZ123'
        }
    };

    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            console.log(response)
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    let resultCheck = await promiseCheck.then(function (value) { return value });
    return resultCheck
}

async function omnigetTransaction(transactionHash){
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_gettransaction", "params": ["'+ transactionHash +'"] }';
    var options = {
        url: 'http://47.75.138.67:8332/',
        method: 'POST',
        headers: headers,
        body: dataString,
        auth: {
            'user': 'vincent',
            'pass': '12345678'
        }
    };

    var promiseCheck = new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            console.log(response)
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    let resultCheck = await promiseCheck.then(function (value) { return value });
    return resultCheck;
}

export {omniCheck,omnigetCurrentBlock,omnigetTransaction}
