const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');
const Player = require('./player');

const app = express();
const clientPath = './../client';
console.log('!!!Serving static from ' + clientPath);
app.use(express.static(clientPath));

const server = http.createServer(app);
server.listen(8080, () => {
	console.log('RPS started on 8080');
});

const io = socketio(server);

//Socket.IO allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths.
//This namespace is identified by io.sockets or simply io

var waiting = null;
io.of('/multiplayer').on('connection', (socket) => {
			socket.on('sendCharID', (text) => {
				if(!waiting) {
					console.log("waiting for player..");
					waiting = new Player(socket, "Player1", text);
					socket.emit('waitingPlayer','ok');
					io.of('/index').emit("playerWaiting", text);
				} else {
					io.of('/index').emit("gameStarted", text);
					new Game([waiting, new Player(socket, "Player2", text)]);
					waiting = null;
					console.log("Starting");
				}
		});
});

io.of('/index').on('connection', (socket) => {
	console.log("home page");

	socket.on('message', (text) => {
		io.of('/index').emit("emessage", text);
		});

});

server.on('error', (err) => {
	console.log('NOTWORKINGGG');

	console.error('server. error:', err);
});
