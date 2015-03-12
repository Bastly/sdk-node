var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');
var zmq = require('zmq');
var constants = require('../constants');

if(!config.chaski.ip) {
    console.log('Must give chaski info');
    process.exit(9);
}

describe('Request a chaski worker', function() {

    it('message response IP should be equal to CHASKI given IP', function (done) {

        var chaski = zmq.socket('rep');
        var client = zmq.socket('req');

        chaski.bind('tcp://'+ config.chaski.ip + ':' + constants.PORT_CHASKI_CHANNEL_NOTIFIER);
        client.connect('tcp://'+ config.client.ip + ':' + constants.PORT_CHASKI_ASSIGNER);

        var chaskiNotifier = require('../worker/chaskiNotifier')
        ({
            "ipChaski": config.chaski.ip,
            "verbose" : constants.LOG_LEVEL_ERROR
        });
        var chaskiAssigner = require('../worker/chaskiAssigner')
        ({
            "ipChaski": config.chaski.ip,
            "chaskiNotifier": chaskiNotifier,
            "verbose" : constants.LOG_LEVEL_ERROR
        });

        chaski.on('message', function (result, data) {
            var parsedResponse = JSON.parse(data);
            console.log(result, data);
        });
        
        var dataToSend = { id: config.client.id };
        client.send(JSON.stringify(dataToSend));

        client.on('message', function (result, data) {
            var parsedResponse = JSON.parse(data);
            assert.equal(result, 200);
            assert.equal(parsedResponse.ip, config.chaski.ip);

            chaski.close();
            client.close();
            chaskiNotifier.close();
            chaskiAssigner.close();
            done();
        });
    });
});

describe('Notify chaski a new client', function() {

    it('Notified chaski with cliend given ID', function (done) {

        var chaski = zmq.socket('rep');
        var client = zmq.socket('req');

        chaski.bind('tcp://'+ config.chaski.ip + ':' + constants.PORT_CHASKI_CHANNEL_NOTIFIER);
        client.connect('tcp://'+ config.client.ip + ':' + constants.PORT_CHASKI_ASSIGNER);

        var chaskiNotifier = require('../worker/chaskiNotifier')
        ({
            "ipChaski": config.chaski.ip,
            "verbose" : constants.LOG_LEVEL_ERROR
        });
        var chaskiAssigner = require('../worker/chaskiAssigner')
        ({
            "ipChaski": config.chaski.ip,
            "chaskiNotifier": chaskiNotifier,
            "verbose" : constants.LOG_LEVEL_ERROR
        });

        var dataToSend = { id: config.client.id };
        client.send(JSON.stringify(dataToSend));

        chaski.on('message', function (data) {
            var parsedResponse = JSON.parse(data.toString());
            assert.equal(parsedResponse.id, config.client.id);
            chaski.close();
            client.close();
            chaskiNotifier.close();
            chaskiAssigner.close();
            done();
        });

        client.on('message', function (result, data) {
            var parsedResponse = JSON.parse(data);
        });
    });
}); 
