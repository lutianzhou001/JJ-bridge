import request = require('request');

var headers = {
    'content-type': 'text/plain;'
};

async function omnigetCurrentBlock() {
    let resultCheck: any = {}

    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_getcurrentconsensushash", "params": [] }';

    var options = {
        url: 'http://127.0.0.1:8332/',
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
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck)
    return JSON.parse(resultCheck);
}

async function main(){
    let a = await omnigetCurrentBlock()
    console.log(a.result.block)
}

main();



async function omniCheck(blockNumber){
    let resultCheck : any = {}
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_listblocktransactions", "params": [' + blockNumber + '] }';
    var options = {
        url: 'http://127.0.0.1:8332/',
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
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck)
    return JSON.parse(resultCheck)
}

async function omnigetTransaction(transactionHash){
    let resultCheck : any = {}
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_gettransaction", "params": ["'+ transactionHash +'"] }';
    var options = {
        url: 'http://127.0.0.1:8332/',
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
            if (!error && response.statusCode == 200) {
                resolve (body);
            }
        });
    });
    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck);
    return JSON.parse(resultCheck);
}



