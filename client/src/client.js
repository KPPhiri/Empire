const sock = io();

if(window.location.pathname != "/multiplayer.html"){

	const writeEvent = (text) => {
		console.log("RECEVINGf: " + text);
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
		parent.scrollTop = parent.scrollHeight;﻿
	};



	const onFormSubmitted = (e) => {
		e.preventDefault();
		const input = document.querySelector('#chat');
		const text = input.value;
		input.value = '';

		sock.emit('message', text);
		console.log("sending");

	};
	writeEvent("THIS IS THE CHAT BOX BELOW.....");

	sock.on('emessage', writeEvent);

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
document.getElementById('playerDeck0').addEventListener('click', ()=> {
	sock.emit("drawing", "now");
});


	//
	for (i =0; i < 7; i++){
		button = document.getElementById('handPos' + i);
		button.addEventListener('click', (event)=> {
			var imgSrc = event.srcElement.src.substr(event.srcElement.src.length - 13);
			if(imgSrc != "emptyCard.png"){
				console.log("PLAYINGSLDKFJSDL");

				sock.emit('playingRequest', event.srcElement.id[7]);
			}

		});
	}

	sock.on('playingRequest', (text) => {
		console.log("GETTING REMOVING");

		cardRemover(text);
	});


	//Adding action listener to deck that adds cards to player hand
	document.getElementById('playerDeck0').addEventListener('click', () => {
		sock.emit('drawingRequest', 'OK');

		});


	sock.on('drawingRequest', (text) => {
		console.log("DRAWINGGG");
		var pos = 0;
		var temp = document.getElementById('handPos' + pos).src;
		while(temp.substr(temp.length - 13) != "emptyCard.png" && pos< 6) {
			pos++;
			temp = document.getElementById('handPos' + pos).src;
		}
		if((temp.substr(temp.length - 13)) == "emptyCard.png") {
			var index = Math.floor(Math.random()*deckCards.length);
			rand = deckCards[index];
			document.getElementById('handPos' + pos).src = rand.imgURL;
		}
	});

	sock.on('eplaying', (text) => {
			//when opponent is playing a card, decrease opponents hand size by 1
			document.getElementById('eActionCard').src = text;
			var pos = 6;
			var temp = document.getElementById('ehandPos' + pos).src;
			while(temp.substr(temp.length - 13) == "emptyCard.png" && pos >0) {
				pos--;
				temp = document.getElementById('ehandPos' + pos).src;
			}
			document.getElementById('ehandPos' + pos).src = "img/emptyCard.png";

			const parent = document.querySelector('.prompt');
			parent.style.display = 'flex';



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
