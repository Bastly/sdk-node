# Bastly SDK for [node][1]

Bastly offers the hability to create realtime apps. You only need to write a frew lines in your app to enable synchronization across all your connected devices.

## Installation

```bash
$ npm install bastly
```

## Usage

```js
// Define the ip of a bastly server
var BASTLY_SERVER = '127.0.0.1';

// Load bastly module and pass bastly options object as argument
var bastly = require('bastly')({ipAtahualpa:IP_ATAHUALPA});

// Create a custom function that will be passed to all connected
// devices and then will be executed in each
function myFunction(data){
    console.log('Hello world');
};

// Obtain some workers
for(var i = 0; i < 10; i++){
    bastly.getWorker('id', myFunction);
}

// Send message to workers
for(var i = 0; i < 10; i++){
    bastly.sendmessage('id', 'message', myFunction);
}

// Close connection
bastly.close();
```

[1]: https://nodejs.org/