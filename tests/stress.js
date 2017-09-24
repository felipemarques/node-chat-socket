// var SocketPromiseHandler = require('socket-stress-test')
 
// socket_handler = new SocketPromiseHandler({
//      ioUrl: 'http://localhost:3000'
//       , connectionInterval: 0 // Fire one each second
//       , maxConnections: 2 // Stop at having 100 connections
//       , ioOptions: {
//             transports: ['websocket'], // force only websocket (optional)
//         }
// })
 
 
// socket_handler.new(function(socketTester, currentConnections) {
//         // New connection comes in.
//         // socketTester.addEmit('join', JSON.stringify({}), 1000);
//     })
//     .connecting(function(socketTester) {
//     //     // Connection is disconnected by socket
//         console.log(socketTester);
//     })
//     // .addEmit('join', JSON.stringify({}), 100)
//     // .addEmit('chat', JSON.stringify({
//     //                 action: 'message',
//     //                 msg: 'dsd',
//     //             }), 100)
//     // .addEmit('meessage', {
//     //     msg: "data"
 
//     // }, 0) // After 1000
//     .run()

var io = require('socket.io-client');
var async = require('async');

var socketURL = 'http://0.0.0.0:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

async.each([...Array(3000).keys()], (i) => {
	var client = io.connect(socketURL, options);
  client.emit('join', JSON.stringify({}));
  client.emit('chat', JSON.stringify({action: 'message', msg: i.toString()}));
}, function(err){
  console.log("FINISH");
})
