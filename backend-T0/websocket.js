let io;
var redis = require('socket.io-redis');

function initialize(server, LOCAL) {
    if (LOCAL) {
        io = require('socket.io').listen(server, {
            path: '/backend',
            handlePreflightRequest: (req, res) => {
                const headers = {
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                    "Access-Control-Allow-Credentials": true
                };
                res.writeHead(200, headers);
                res.end();
            }
        });
    } else {
        io = require('socket.io').listen(5000, {
            path: '/backend',
            handlePreflightRequest: (req, res) => {
                const headers = {
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                    "Access-Control-Allow-Credentials": true
                };
                res.writeHead(200, headers);
                res.end();
            }
        });
        io.adapter(redis({ host: 'master.redis-cluster-2.f8l4hc.use2.cache.amazonaws.com', port: 6379, password: "grupo-21-redis-alkSNsSDAlwijd" }));
    }
    console.log("Initialized socket.io server");
    io.on('message-added', (socket) => {
        console.log('a message was put onto the database');
        //io.adapter.clients([room], (err, clients) => {
        //console.log(clients);
    });
    var backend_socket = io.of('/backend');
    backend_socket.on('message-added', function(socket){
        socket.on('message-added', function(message){
            socket.join(message);

            //log other socket.io-id's in the message
            backend_socket.adapter.clients([message], (err, clients) => {
                console.log(clients);
            });
        });
    });
    backend_socket.emit("auth-message", {
        message: 'testing'
    });
}

function emitAuthMessageToRoom(message, roomId) {
    console.log("Emitting auth-message!")
    io.emit("auth-message", {
        message: message
    });
    io.emit('message-added', {
        message: 'testing',
        username: 'testinguser',
        roomId: roomId,
        date: "Today",
        time: 'Today'
    });
}


function getParsedDate(date) {
    const parsedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateNow = new Date();
    dateNow.setHours(0);
    dateNow.setMinutes(0);
    dateNow.setSeconds(0, 0);
    const dateYesterday = new Date(dateNow);
    dateYesterday.setDate(dateYesterday.getDate() - 1);
    if (parsedDate.getTime() === dateNow.getTime())
        return "Today";
    else if (parsedDate.getTime() === dateYesterday.getTime())
        return "Yesterday";
    else
        return `${parsedDate.getFullYear()}-${parsedDate.getMonth() + 1}-${parsedDate.getDate()}`;
}


function emitMessageSent(message, username, roomId) {
    const date = new Date();
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const message_time = `${hours}:${minutes}`;
    io.emit('message-added', {
        message: message,
        username: username,
        roomId: roomId,
        date: "Today",
        time: message_time
    });
}

module.exports = {
    io,
    emitMessageSent,
    emitAuthMessageToRoom,
    initialize
};
