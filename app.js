
var IP_ATAHUALPA = '127.0.0.1';
var sdk = require('./index.js')({ipAtahualpa:IP_ATAHUALPA});
console.log('lala');
//sdk.close();
var printA = function(data){
    console.log('a');
    console.log('data: ', data);
};
for(var i = 0; i < 10; i++){
    sdk.getWorker('id', printA);
}



sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
sdk.sendMessage('id', 'message', printA);
