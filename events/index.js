'use strict';
const async = require('async');
var redis = require('redis');
var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe('chat');

let messages = [];
const socketsOnline = [];

setInterval(() => {
    if (messages.length) {
        console.log(messages.length);
        pub.publish('chat', JSON.stringify(messages.slice(Math.max(messages.length - 100, 1))));
        messages = [];
    }
}, 1000);

module.exports = function(io) {
    io.on('connection', function(socket) {
        /*
         When the user sends a chat message, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('chat', function(data, n) {
            var msg = JSON.parse(data);
            var reply = {
                action: 'message',
                onlineUsers: socketsOnline.length,
                user: socket.handshake.session.user,
                msg: msg.msg
            };

            messages.push(reply);
            // setInterval(() => {
                // console.log(`k => ${k} (${(new Date).getSeconds()})`);
                // pub.publish('chat', JSON.stringify(reply));
                // next();
            // }, 1000);
            


            // if (Object.keys(messages).length >= 5) {
            //     setTimeout(() => {
                    // pub.publish('chat', JSON.stringify(messages));
                    // messages = [];
                // }, 1000);
                // async.eachSeries(Object.keys(messages), (k, next) => {

                //     let message = messages[k];
                //     if (message) {

                //     }
                //     // delete messages[k];
                // }, function(err){
                //     messages = {};
                // });
            // }
        });

        /*
         When a user joins the channel, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('join', function() {
            socketsOnline.push(socket.id);

            // var reply = JSON.stringify({
            //     action: 'init',
            //     onlineUsers: Object.keys(socketsOnline).length
            // });

            // pub.publish('chat', reply);
        });

        /*
         Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
         When a message arrives, send it back to browser using socket.io
         */
        sub.on('message', function(channel, message) {
            socket.emit(channel, message);
        });
    })
}
