const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express()
const clientPath = './../client';
console.log('!!!Serving static from ' + clientPath);
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (sock) => {
	console.log('Someone connected');
	sock.emit('message', 'Hi, you are connected');

});

server.on('error', (err) => {
	console.log('NOTWORKINGGG');

	console.error('server. error:', err);
});
server.listen(8080, () => {
	console.log('RPS started on 8080');
});