var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');

if(!config.chaski.ip) {
    console.log('Must give chaski info');
    process.exit(9);
}

describe('SDK node', function() {

    it('can be imported', function (done) {
        var IP_ATAHUALPA = '127.0.0.1';
        var bastly = require('../index.js');
        bastly({ipAtahualpa:IP_ATAHUALPA});
        assert.equal(1,1);
        done();
    });
});

describe('SDK node', function() {

    it('Can send messages', function (done) {
        //TODO how to test this without atahualpa?
        done();
    });
}); 
