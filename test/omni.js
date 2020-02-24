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

    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck);
}

async function omnigetTransaction(transactionHash){
    var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "omni_gettransaction", "params": ["'+ transactionHash +'"] }';
    console.log(dataString);
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

    resultCheck = await promiseCheck.then(function (value) { return value });
    console.log(resultCheck);
}

omniCheck(100);
omnigetTransaction("1fbf69015263620052fd30cd7d46c75efc8647a1f56d3c52769d6b1497a38e1f");