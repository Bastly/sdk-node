module.exports = function(opts){

    var logHandler = require('./logHandler.js');
    var log = logHandler({name:'sdk-node', log:log});    

    if(!opts || !opts.ipAtahualpa){
        log.info('Must give atahualpa ip');
        process.exit(9);
    }

    
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var requestChaskiSocket = zmq.socket('req'); 
    var sendMessageSocket = zmq.socket('req'); 
    var callbacks = []; 
    var acks = []; 
    var module = {};
    module.chaski = {};

    requestChaskiSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_REQ_REP_ATAHUALPA_CLIENT_REQUEST_WORKER);
    requestChaskiSocket.on('message', function(result, data){
        var parsedResponse = JSON.parse(data);
        log.info('got message', parsedResponse);
        module.chaski.ip = parsedResponse.ip;
        //TODO we must implement some way to understand which response is to each request , since the order does not have to be LILO
        callbacks.shift()(parsedResponse);
    });

    sendMessageSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_REQ_REP_ATAHUALPA_CLIENT_MESSAGES);
    sendMessageSocket.on('message', function(res, message){
        //TODO we must implement some way to understand which response is to each request , since the order does not have to be LILO
        acks.shift()(res.toString()); 
    });
   
    var getWorker = function getWorker (clientId, chaskiType, callback){
        log.info('get worker', clientId, chaskiType);
        var dataToSendForRequestingWoker = [
            'subscribe', //ACTION
            clientId, //TO
            clientId, //FROM
            'fakeApiKey', //apiKey
            chaskiType//type

        ];

        callbacks.push(callback); 
        requestChaskiSocket.send(dataToSendForRequestingWoker);
    }; 
    
    var sendMessage = function sendMessage(to, from, apiKey, message, callback){
        var data;
        log.info('message is',typeof message, message, message.toString());
        if(typeof message === 'object'){
            data = JSON.stringify(message);
        } else {
            throw new Error('message must be a javascrip object');
        }
        log.info('data is', data);
        var dataToSend = [
            'send', //ACTION
            to, 
            from, 
            apiKey, //apiKey
            data,//data

        ];
        acks.push(callback);
        sendMessageSocket.send(dataToSend);
    }; 


    //closes all open comms opened by the module
    var close = function close(){
        sendMessageSocket.close();
        requestChaskiSocket.close();
    };
   
    module.getWorker = getWorker;
    module.sendMessage = sendMessage;
    module.close = close;
    return module;
};
