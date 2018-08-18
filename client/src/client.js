
if (window.location.pathname != "/multiplayer.html") {
    const sock = io('/index');

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

    sock.on('playerWaiting', () => {
      console.log("there is a player available");
      const vsButton = document.getElementsByClassName("btn-vs")[0];
        vsButton.style.background= "yellow";

    });

    sock.on('gameStarted', () => {
      console.log("no player available");
      const vsButton = document.getElementsByClassName("btn-vs")[0];
        vsButton.style.background= "lightblue";

    });



    const onFormSubmitted = (e) => {
        e.preventDefault();
        const input = document.querySelector('#chat');
        const text = input.value;
        input.value = '';

        sock.emit('message', text);

    };
    writeEvent("THIS IS THE CHAT BOX BELOW.....");

    sock.on('emessage', writeEvent);

    document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);

} else {
    const sock = io('/multiplayer');

    const eDraw = (text) => {
        var x = document.getElementById('drawing');
        if (x.style.visibility === "hidden") {
            x.style.visibility = "visible";
        } else {
            x.style.visibility = "hidden";
        }
    };


    //adding action listener to deck
    document.getElementById('playerDeck0').addEventListener('dblclick', () => {
      console.log("drawing");
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
            if ((imgSrc != "emptyCard.png") && (handCards[position].cost <= points) && !hasConstraints(handCards[position].name)) {
                sock.emit('decEnemyProgBar', handCards[position].cost);
                console.log("Playing type: " + handCards[position].name + " Cost: " + handCards[position].cost);
                sock.emit('playing', event.srcElement.src + position);
                //!!!!!!only remove card if it was successful^
                checkIfAction(handCards[position], position);
            } else {
                console.log("!!cannot perform move: " + handCards[event.srcElement.id[7]].action + " Cost: " + handCards[event.srcElement.id[7]].cost +
                    "  players points: " + points);
            }
        });
    }

    function hasConstraints(card) {
        if (card == "attack") {
            return false;
        } else if (card == "defend") {
            var violates = true;
            properties.forEach((property) => {
                if (property.shield < 30) {
                    violates = false;
                } else {
                    console.log("cannot use a defensive card");
                }
            });
            return violates;
        } else if (card == "Disappear") {
            var violates = true;
            properties.forEach((property) => {
                if(property.shield == 0) {
                    violates = false;
                } else {
                    console.log("none of your properties have 0 health");
                }
            });
        } else {
            return false;
        }
    }
function emitPlayerIsReady(charId){
  console.log("CLIENT SENDING");
  sock.emit('sendCharID', charId);
}

function changeTurns() {
  console.log("ending turn");
  sock.emit('endTurn', 'turns');
}

sock.on('startGame', (text)=>{
  console.log("doing startGame: " + text)
  play(text);
});

    /** Card Types Implementation to use on Properties**/
    function checkIfAction(cardUsed,position) {
        if (cardUsed.name == "attack" || cardUsed.name == "Destroy") {
            console.log("enabling enemy action listeners");
            sock.emit('disableHandandDeck', 'ok');
            enableEnemyPropListener(position,cardUsed);
        } else if (cardUsed.name == "defend" || cardUsed.name == "reject" || cardUsed.name == "Rebuild") {
            enablePlayerPropListener(cardUsed);
            //console.log("defense is now " + properties[propertyId].shield);
        } else if (cardUsed.name == "counter") {
          console.log("playing counter card");
            sock.emit('cancelAttack', cardUsed.name);
        } else if (cardUsed.name == "swap") {
          console.log("sending swap");
            sock.emit('swap', 'ok');
        } else if (cardUsed.name == "Freeze") {
            console.log("is a freeze card");
            sock.emit('freezeOpp', 'true');
            //makes it so that the opponent's turn will be skipped once the player's turn is done
        } else if (cardUsed.name == "Disappear") {
            console.log("will take as own");
            enableEnemyPropListener(position,cardUsed);
        }
    }

    function disablePlayerDeckHand(){
      sock.emit('disablePlayerDeckHand', "ok");
    }

    function enablePlayerPropListener(cardUsed) {
        disablePlayerDeckHand();
        //use selected card on selected property
        document.getElementById('cardDescContainer').style.zIndex= '20';
        var used = false;
        for (i = 0; i < 4; i++) {
            property = document.getElementById('prop' + i);
            property.addEventListener('dblclick', (event) => {
              document.getElementById('cardDescContainer').style.zIndex='24';
                console.log(event.srcElement.id[4]);

                propertyId = event.srcElement.id[4];
                if(properties[propertyId].isAttackable && cardUsed.name == "reject" && !used) {
                    properties[propertyId].isAttackable = false;
                    console.log("makes not attackable");
                } else if (properties[propertyId].shield < 30 && cardUsed.name == "defend" && !used) {
										console.log("requesting server to add shield to property")
										sock.emit('addShield', propertyId);
                    // properties[propertyId].shield += 15;
                    document.getElementById('pshield' + propertyId).innerHTML = properties[propertyId].shield.toString();
                    used = true;

                } else if(cardUsed.name == "Rebuild" && !used) {
                    properties[propertyId].health = 100;
                    document.getElementById('phealth' + propertyId).innerHTML = properties[propertyId].health.toString();
                } else {
                    //or reject card was already used on property
                    console.log("cannot put more shields or youve used the card");
                }
            });

        };
    }


    //var propi;
    function enableEnemyPropListener(position,cardUsed) {
        //use selected card on selected property
        document.getElementById('cardDescContainer').style.zIndex='20';
        var used = false;
        for (i = 0; i < 4; i++) {
            property = document.getElementById('eprop' + i);
            property.addEventListener('dblclick', (event) => {
              document.getElementById('cardDescContainer').style.zIndex='24';

                console.log("emmitting enemy response");
                propertyId = event.srcElement.id[5];
                //propi = propertyId;
                //sock.emit('requestResponse', event.srcElement.id[5]);
                if(!used) {
                    console.log(position);
                    if(!(enemyProperties[propertyId].isAttackable)) { //if the property they want to attack isnt attackable, just remove card without affecting health
                        console.log("not attack");
                        cardRemover(position);
                    } else if (cardUsed.name == "Destroy") {
                        console.log("destroys");
                        enemyProperties[propertyId].health = 0;
                        document.getElementById('health'+propertyId).innerHTML = enemyProperties[propertyId].health.toString();
                    } else if (cardUsed.name == "Disappear") {
                        console.log("disappear");
                        sock.emit('takeProperty', event.srcElement.id[5]);
                    } else {
                        console.log("regular attack");
                        //check if the property is attackable
                        if(enemyProperties[propertyId].isAttackable) {
                            sock.emit('requestResponse', event.srcElement.id[5]);
                        }
                        //else if the opponent has counter card, call emit req
                        //sock.emit('requestResponse', event.srcElement.id[5]);
                    }
                    used = true;
                }
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

    function incrementNegatePoints() {
        console.log("adding negate increment");
        sock.emit('incrNegateCards', 'OK');
    }

    var isEnd = false;
    //**Check if game is over
    function isEndGame() {
        var count = 0;
        console.log("checking end game");
        enemyProperties.forEach((property) => {
            if(property.health == 0){
                count++;
                console.log("counting healths 0");
            }
        });
        if (count == 4) {
            console.log("end of game");
            isEnd = true;
        }
        console.log(isEnd);
        return isEnd;
    }

    sock.on('swapCharId', (text) => {
        swap(text);
    });

    sock.on('playing', (text) => {
        //play card on the field and remove from hand
        cardRemover(text);
    });

    sock.on('decEnemyProgBar', (text) => {
        eProgress(text);
    });

    sock.on('drawingRequest', (text) => {
      console.log('im drawing');
        var pos = 0;
        var temp = document.getElementById('handPos' + pos).src;
        while (temp.substr(temp.length - 13) != "emptyCard.png" && pos < 6) {
            pos++;
            temp = document.getElementById('handPos' + pos).src;
        }
        if ((temp.substr(temp.length - 13)) == "emptyCard.png") {
            var index = Math.floor(Math.random() * weightedDeck.length);
            rand = weightedDeck[index];
            if (rand.name == "counter") {
                console.log("incrementing");
                incrementNegatePoints();
            }
            document.getElementById('handPos' + pos).src = rand.imgURL;
            handCards.push(rand);
        }
    });



    sock.on('eplaying', (text) => {
        //when opponent is playing a card, decrease opponents hand size by 1
        document.getElementById('eActionCard').src = text;
        var pos = 6;
        var temp = document.getElementById('ehandPos' + pos).src;
        while (temp.substr(temp.length - 13) == "emptyCard.png" && pos > 0) {
            pos--;
            temp = document.getElementById('ehandPos' + pos).src;
        }

        document.getElementById('ehandPos' + pos).src = "img/emptyCard.png";

    });

    var propi = 0;
    // sock.on('dontPrompt', (text) => {
    //     properties[propi].health -= 15;
    //     document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
    //     sock.emit("acceptAttack", propi);
    // });
    sock.on('createPrompt', (text) => {
        propi = Number(text);
        console.log("creating prompt: " + text);
        if (Number(text) >= 0) {
            const parent = document.querySelector('.prompt');
            parent.style.display = 'flex';
            propi = Number(text);
        } else {
            console.log("propi id: " + propi);

          properties[propi].health -= 15;
          document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
          sock.emit("acceptAttack", propi);
        }
    });

    document.getElementById('no').addEventListener('click', () => {
        if(properties[propi].shield > 0) {
            console.log(propi);
            properties[Number(propi)].shield -=15;
            document.getElementById('pshield' + propi).innerHTML = properties[Number(propi)].shield;
        } else {
            properties[propi].health -= 15;
            console.log("health bc said no " + properties[3].health);
            document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
        }
        // properties[propi].health -= 15;
        // document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
        sock.emit("acceptAttack", propi);
    });

      // sock.on('enableEnemyHand', (text) => {
      //   //TODO: adding action listeners
      // });

    //** This is going to opponent who is accepting attack
    sock.on('acceptAttack', (text) => {
        //play card on the field and remove from hand
        console.log("accpting");
        console.log(properties[Number(text)].shield);
        if(enemyProperties[Number(text)].shield > 0) {
            console.log("taking from shield");
            enemyProperties[Number(text)].shield -= 15;
            document.getElementById('shield' + text).innerHTML = enemyProperties[text].shield.toString();
        } else {
            var newHealth;
            newHealth = enemyProperties[Number(text)].health -= 15;
            if (newHealth <= 0) {
                newHealth = 0;
                enemyProperties[Number(text)].isAttackable = false;
            }
            //document.getElementById('health' + text).innerHTML = enemyProperties[text].health.toString();
            document.getElementById('health' + text).innerHTML = newHealth.toString();

        }
        isEndGame();
        if(isEnd){
            //display ending popup
            console.log("end game was true");
            const game = document.querySelector('.endGame');
            document.getElementById('status').innerHTML += "win! Congratulations!";
            game.style.display = 'flex';
            console.log("emit end game");
            sock.emit('endGame','ended');
        }
        //enemyProperties[Number(text)].health -= 15;
        //document.getElementById('health' + text).innerHTML = enemyProperties[text].health.toString();

    });

    //!!this is actually called before the "no" click goes through
    sock.on('endGame', () => {
        console.log("ending the game here");
        // console.log("health decreased to " + properties[3].health);
        //check if it's the end for the opponent
        if(isEnd) {
            const game = document.querySelector('.endGame');
            document.getElementById('status').innerHTML += "lose. Try again?";
            game.style.display = 'flex';
        }
        // const game = document.querySelector('.endGame');
        // document.getElementById('status').innerHTML += "lose. Try again?";
        // game.style.display = 'flex';
    });


    sock.on('nextRound', () => {
        nextRound();
    });
    sock.on('yourTurn', () => {
      console.log("your turn color activate");

      document.getElementById('player').style.filter = 'drop-shadow(5px 5px 5px #dddddd)';
      document.getElementById('player').style.webkitFilter = 'drop-shadow(5px 5px 5px #dddddd)';
      document.getElementById('oppChar').style.filter = 'none';

    });
    sock.on('opponentTurn', () => {
      console.log("opponents turn color activate");
      document.getElementById('oppChar').style.filter = 'drop-shadow(5px 5px 5px #dddddd)';
      document.getElementById('oppChar').style.webkitFilter = 'drop-shadow(5px 5px 5px #dddddd)';
      document.getElementById('player').style.filter = 'none';

    });

    sock.on('waitingPlayer', () => {
      console.log("waiting");
      const sButton = document.getElementById("start");
        sButton.innerHTML = "Waiting on player...";
        document.getElementById('warning').style.visibility = 'hidden';
        sButton.style.background= "yellow";
        sButton.style.fontSize= "12px";

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

    sock.on('addShield', (text) => {
        properties[Number(text)].shield += 15;
				console.log("adding 15 ");
        document.getElementById('pshield' + text).innerHTML = properties[Number(text)].shield.toString();
    });
		sock.on('eaddShield', (text) => {
			console.log("getting request to add shield to opp prop");
        enemyProperties[Number(text)].shield += 15;
        document.getElementById('shield' + text).innerHTML = enemyProperties[Number(text)].shield.toString();
    });


    sock.on('takeProperty', (text) => {
        var applied = false;
        properties.forEach((property) => {
            if(property.health == 0 && !applied) {
                console.log("taking from property");
                properties[property.number].health = enemyProperties[Number(text)].health;
                document.getElementById('phealth' + property.number).innerHTML = properties[Number(text)].health.toString();

                enemyProperties[Number(text)].health = 0;
                document.getElementById('health' + Number(text)).innerHTML = 0;
                applied = true;
            }
        });
    });
    sock.on('eTakenProperty', (text) => {
        console.log("enemy will decrease");
        console.log("this property: " + Number(text));


        enempyProperties.forEach((property) => {
            if(property.health == 0) {
                enemyProperties[property.number].health = properties[Number(text)].health;
                document.getElementById('health' + text).innerHTML = enemyProperties[Number(text)].health.toString();
            }
        });

        properties[Number(text)].health = 0;
        document.getElementById('phealth' + property.number).innerHTML = properties[Number(text)].health.toString();
        // var applied = false;
        // properties.forEach((property) => {
        //     if(property.health == 0 && !applied) {
        //         properties[property.number].health = enemyProperties[Number(text)].health;
        //         document.getElementById('phealth' + property.number).innerHTML = properties[Number(text)].health.toString();
        //         applied = true;
        //     }
        // });
    });
    // sock.on('freezeOpp', (text) => {
    //
    //     //set opponent's isfrozen totrue
    //     //once end turn, should check if is frozen before trying to play
    //     //afterwards, set isfrozen to false;
    // });
}
