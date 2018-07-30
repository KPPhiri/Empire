
const writeEvent = (text) => {
	const parent = document.querySelector('#heading');
	console.log("WORKINGG");
	const el = document.createElement('p');
	el.innerHTML = text;
	parent.appendChild(el);


};

writeEvent("LETS CHANGE!!");

const sock = io();
sock.on('message', writeEvent);
