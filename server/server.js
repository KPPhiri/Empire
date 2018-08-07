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

var players = null;
io.on('connection', (socket) => {
		if(players == null) {
			players = [new Player(socket, "bob2")];

		} else {
			players.push(new Player(socket, "bob"));
			new Game(players);
		}

});

server.on('error', (err) => {
	console.log('NOTWORKINGGG');

	console.error('server. error:', err);
});
