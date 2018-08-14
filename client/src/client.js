const sock = io();

if (window.location.pathname != "/multiplayer.html") {

    const writeEvent = (text) => {
        // <ul> element
        const parent = document.querySelector('#events');
        //get timeout
        var d = new Date();
        var t = d.getHours() % 12 + ":" + d.getMinutes();

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
    document.getElementById('playerDeck0').addEventListener('click', () => {
        sock.emit("drawingRequest", "now");
        sock.emit("drawing", "now");

    });


    //
    for (i = 0; i < 7; i++) {
        button = document.getElementById('handPos' + i);
        button.addEventListener('click', (event) => {
            var imgSrc = event.srcElement.src.substr(event.srcElement.src.length - 13);
            var position = event.srcElement.id[7];
            var pts = document.getElementById('pt1');
            var points;
            if (pts.textContent.length == 17) {
                points = pts.textContent.slice(0, -16);
            } else {
                points = pts.textContent.slice(0, pts.textContent.length - 3);
            }
            //checks to see if sufficient amount of points to play card and the card isn't an empty cardUsed
            if ((imgSrc != "emptyCard.png") && (handCards[position].cost <= points)) {
                sock.emit('playingRequest', event.srcElement.id[7]);
                checkIfAction(handCards[position]);
            } else {
                console.log("cannot perform move: " + handCards[event.srcElement.id[7]].action + " Cost: " + handCards[event.srcElement.id[7]].cost +
                    "  players points: " + points);
            }

        });
    }


    /** Card Types Implementation to use on Properties**/
    function checkIfAction(cardUsed) {
        console.log(cardUsed.action);
        if (cardUsed.action == "attack") {
            console.log("Attacking!");
            enableEnemyPropListener();
            // properties[propertyId].health -= 15;
            // document.getElementById('health'+propertyId).innerHTML =properties[propertyId].health.toString();
            // console.log("health is now " + properties[propertyId].health);
        } else if (cardUsed.name == "Defend") {
            enablePlayerPropListener();
            console.log("defense is now " + properties[propertyId].shield);
        }
    }

    function enablePlayerPropListener() {
        //use selected card on selected property
        for (i = 0; i < 4; i++) {
					property = document.getElementById('prop' + i);
					property.addEventListener('dblclick', (event) => {
							propertyId = event.srcElement.id[5];
							if (properties[propertyId].shield < 30) {
									properties[propertyId].shield += 15;
									document.getElementById('shield' + propertyId).innerHTML = properties[propertyId].shield.toString();
							} else {
									console.log("cannot put more shields");
							}
					});

        };
    }



    function enableEnemyPropListener() {
        //use selected card on selected property
        for (i = 0; i < 4; i++) {
            console.log("enabling enemy properties")
            property = document.getElementById('eprop' + i);
            property.addEventListener('dblclick', (event) => {
                console.log("emmitting: " + event.srcElement.id[5]);
                sock.emit('playing', event.srcElement.id[5]);
            });
        }
    }


    /** Card Types Implementation to use on Properties**/
    // function useCardOn(propertyId, cardUsed) {
    //     console.log(cardUsed.action);
    //     if (cardUsed.action == "attack") {
    //         //properties[propertyId].health -= 15;
    //         console.log(propertyId);
    //         properties[propertyId].health -= 15;
    //         document.getElementById('health'+propertyId).innerHTML =properties[propertyId].health.toString();
    //         console.log("health is now " + properties[propertyId].health);
    //     } else if (cardUsed.name == "Defend"){
    //         if(properties[propertyId].shield < 30) {
    //             properties[propertyId].shield += 15;
    //             document.getElementById('shield'+propertyId).innerHTML =properties[propertyId].shield.toString();
    //         }else {
    //             console.log("cannot put more shields");
    //         }
    //         console.log("defense is now " + properties[propertyId].shield);
    //     }
    // }



    sock.on('playingRequest', (text) => {
        //play card on the field and remove from hand
        cardRemover(text);

    });


    //Adding action listener to deck that adds cards to player hand
    document.getElementById('playerDeck0').addEventListener('dblclick', () => {
        sock.emit('drawingRequest', 'OK');

    });


    sock.on('drawingRequest', (text) => {
        var pos = 0;
        var temp = document.getElementById('handPos' + pos).src;
        while (temp.substr(temp.length - 13) != "emptyCard.png" && pos < 6) {
            pos++;
            temp = document.getElementById('handPos' + pos).src;
        }
        if ((temp.substr(temp.length - 13)) == "emptyCard.png") {
            var index = Math.floor(Math.random() * deckCards.length);
            rand = deckCards[index];
            document.getElementById('handPos' + pos).src = rand.imgURL;
        }
    });



    sock.on('eplaying', (text) => {
        //when opponent is playing a card, decrease opponents hand size by 1

        var pos = 6;
        var temp = document.getElementById('ehandPos' + pos).src;
        while (temp.substr(temp.length - 13) == "emptyCard.png" && pos > 0) {
            pos--;
            temp = document.getElementById('ehandPos' + pos).src;
        }

        document.getElementById('ehandPos' + pos).src = "img/emptyCard.png";
        if (Number(text) >= 0) {
            const parent = document.querySelector('.prompt');
            parent.style.display = 'flex';
            document.getElementById('no').addEventListener('click', () => {
                properties[text].health -= 15;
                document.getElementById('health' + text).innerHTML = properties[text].health.toString();
								console.log("enemy is accepting attack:");
                sock.emit("acceptAttack", text);
            });

        }

    });

    sock.on('acceptAttack', (text) => {
        //play card on the field and remove from hand
        enemyProperties[Number(text)].health -= 15;
      //TODO  document.getElementById('health' + text).innerHTML = enemyProperties[text].health.toString();

    });


    sock.on('edrawing', (text) => {
        var pos = 0;
        var temp = document.getElementById('ehandPos' + pos).src;
        while (temp.substr(temp.length - 13) != "emptyCard.png" && pos < 6) {
            pos++;
            temp = document.getElementById('ehandPos' + pos).src;
        }
        document.getElementById('ehandPos' + pos).src = "img/enemyHand.jpg";
    });
}
