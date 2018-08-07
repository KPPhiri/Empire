const sock = io();

if(window.location.pathname != "/multiplayer.html"){

	const writeEvent = (text) => {
		console.log("WORKING: " + text);
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
	writeEvent("THIS IS THE CHAT BOX BELOW.....");

	sock.on('message', writeEvent);

	document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);

} else {


	const eDraw = (text) => {
		var x = document.getElementById('drawing');
		if (x.style.visibility === "hidden") {
					x.style.visibility = "visible";
			} else {
					x.style.visibility = "hidden";
			}
	};


//adding action listener to deck
document.getElementById('playerDeck').addEventListener('click', ()=> {
	sock.emit("drawing", "now");
});


	//adding action listeners to all 7 cards in hand
	for (i =0; i < 7; i++){
		button = document.getElementById('handPos' + i);
		button.addEventListener('click', (event)=> {
			var imgSrc = event.srcElement.src.substr(event.srcElement.src.length - 13);
			if(imgSrc != "emptyCard.png"){
				console.log("PLAYING: " + imgSrc)
				sock.emit('playing', event.srcElement.src);
			}

		});
	}

	sock.on('eplaying', (text) => {
			document.getElementById('eActionCard').src = text;
			var pos = 6;
			var temp = document.getElementById('ehandPos' + pos).src;
			while(temp.substr(temp.length - 13) == "emptyCard.png" && pos >0) {
				pos--;
				temp = document.getElementById('ehandPos' + pos).src;
			}
				document.getElementById('ehandPos' + pos).src = "img/emptyCard.png";
			});


sock.on('edrawing', (text) => {
		var pos = 0;
		var temp = document.getElementById('ehandPos' + pos).src;
		while(temp.substr(temp.length - 13) != "emptyCard.png" && pos< 6) {
			pos++;
			temp = document.getElementById('ehandPos' + pos).src;
		}
			document.getElementById('ehandPos' + pos).src = "img/enemyHand.jpg";
		});
}
