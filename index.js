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

    requestChaskiSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_CHASKI_ASSIGNER);
    requestChaskiSocket.on('message', function(result, data){
        var parsedResponse = JSON.parse(data);
        module.chaski.ip = parsedResponse.ip;
        //TODO we must implement some way to understand which response is to each request , since the order does not have to be LILO
        callbacks.shift()(parsedResponse);
    });

    sendMessageSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_MESSAGE_RECEIVER);
    sendMessageSocket.on('message', function(res, message){
        //TODO we must implement some way to understand which response is to each request , since the order does not have to be LILO
        acks.shift()(res.toString()); 
    });
   
    var getWorker = function getWorker (clientId, callback){
        callbacks.push(callback); 
        requestChaskiSocket.send(JSON.stringify({id: clientId}));
    }; 
    
    var sendMessage = function sendMessage(channelId, message, callback){
        acks.push(callback);
        sendMessageSocket.send([channelId, message]);
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
