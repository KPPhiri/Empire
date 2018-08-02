const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');
  //get timeout
  var d = new Date();
  var t = d.getHours()%12 + ":" + d.getMinutes();

  // <li> element
  var msg = document.createElement('li');
  msg.className = "oddChat";
  tempP = document.createElement("p");
  tempP.innerHTML = text;
  msg.appendChild(tempP);
  tempSpan = document.createElement('span');
  tempSpan.innerHTML = t;
  msg.appendChild(tempSpan);
  parent.appendChild(msg);
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};

writeEvent('Welcome to One Hero');

const sock = io();
sock.on('message', writeEvent);

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);
