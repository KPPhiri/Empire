const sock = io();

if(window.location.pathname != "/multiplayer.html"){

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
	sock.emit("drawingRequest", "now");
	sock.emit("drawing", "now");

});


	//
	for (i =0; i < 7; i++){
		button = document.getElementById('handPos' + i);
		button.addEventListener('click', (event)=> {
		var position  = event.srcElement.id[7];
		var pts = document.getElementById('pt1');
    var points;
    if (pts.textContent.length == 17) {
        points = pts.textContent.slice(0,-16);
    } else {
        points = pts.textContent.slice(0,pts.textContent.length-3);
    }
    //checks to see if sufficient amount of points to play card
    if (handCards[position].cost <= points) {
			var imgSrc = event.srcElement.src.substr(event.srcElement.src.length - 13);
			if(imgSrc != "emptyCard.png"){
				console.log("EMITTINGGG: " + 'playing');
				sock.emit('playing', "OK");
				sock.emit('playingRequest', event.srcElement.id[7]);
			}
		} else {
			console.log(points);
			console.log(handCards[event.srcElement.id[7]].cost);
			console.log("cannot perform move of cost: " + handCards[event.srcElement.id[7]].cost +
		 "  players points: " + points);
	}

		});
	}

	sock.on('playingRequest', (text) => {
		cardRemover(text);
	});


	//Adding action listener to deck that adds cards to player hand
	document.getElementById('playerDeck0').addEventListener('click', () => {
		sock.emit('drawingRequest', 'OK');

		});


	sock.on('drawingRequest', (text) => {
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

			console.log("REMVOING CARD: " + pos);
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
