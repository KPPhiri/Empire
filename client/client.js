
const writeEvent = (text) => {
	const parent = document.querySelector('#heading');
	console.log("WORKINGG");
	const el = document.createElement('p');
	el.innerHTML = text;
	parent.appendChild(el);
};

const onFormSubmitted = (e) => {
	e.preventDefault();
	const input = document.querySelector('#chat');
	const text = input.value;
	input.value = '';

	sock.emit('message', text);

};

writeEvent("THIS IS THE CHAT BOX BELOW.....");

const sock = io();
sock.on('message', writeEvent);

document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);
