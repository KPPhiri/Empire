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
io.on('connection', (socket) => {
	socket.on('message', (text) => {
		io.emit("emessage", text);
		});
		if(!waiting) {
			waiting = new Player(socket, "bob2");
			console.log("Waiting on player...");
		} else {

			new Game([waiting, new Player(socket, "bob")]);
			waiting = null;
			console.log("Starting");
		}

});

server.on('error', (err) => {
	console.log('NOTWORKINGGG');

	console.error('server. error:', err);
});
