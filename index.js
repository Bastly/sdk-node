module.exports = function(opts){

    var logHandler = require('./logHandler.js');
    var log = logHandler({name:'sdk-node', log:log});    

    if(!opts || !opts.ipAtahualpa){
        log.info('Must give atahualpa ip');
        process.exit(9);
    }

    
    var zmq = require('zmq');
    var constants = require('./constants.js');
    var requestChaskiSocket = zmq.socket('req'); 
    var sendMessageSocket = zmq.socket('req'); 
    
    var module = {};
    module.chaski = {};
    requestChaskiSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_CHASKI_ASSIGNER);
    requestChaskiSocket.on('message', function(result, data){
        var parsedResponse = JSON.parse(data);
        console.log('result is :' + result);
        module.chaski.ip = parsedResponse.ip;
    });

    sendMessageSocket.connect('tcp://' + opts.ipAtahualpa + ':' + constants.PORT_MESSAGE_RECEIVER);
   
    var getWorker = function getWorker (params, callback){
        requestChaskiSocket.send(params);
    }; 
    
    var sendMessage = function sendMessage(message){
        sendMessageSocket.send(message);
    }; 


    //closes all open comms opened by the module
    var close = function close(){
        sendMessageSocket.close();
        requestChaskiSocket.close();
    };
   
    console.log('finishing loadind module'); 
    module.getWorker = getWorker;
    module.sendMessage = sendMessage;
    module.close = close;
    return module;
}
