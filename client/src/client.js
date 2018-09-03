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
        // console.log("there is a player available");
        const vsButton = document.getElementsByClassName("btn-vs")[0];
        vsButton.style.background = "yellow";

    });

    sock.on('gameStarted', () => {

        // console.log("no player available");
        const vsButton = document.getElementsByClassName("btn-vs")[0];
        vsButton.style.background = "lightblue";

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
    var isTurn = false;
    var canDraw = false;
    var canPlay = false;
    var canRespond = false;
    var canClickEProperty = false;
    var canClickProperty = false;




    sock.on('updateField', (text) => {
        console.log("doing startGame: " + text)
        enemyProperties = text;
    });





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
        if (canDraw) {
          console.log("can draw")
          drawCard()
          sock.emit('updateEnemyHand', 'NA');
        }


    });


    //
    for (i = 0; i < 7; i++) {
        button = document.getElementById('handPos' + i);
        button.addEventListener('dblclick', (event) => {
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
            if (canPlay && (imgSrc != "emptyCard.png") && (handCards[position].cost <= points) && !hasConstraints(handCards[position].name)) {
                console.log("Playing card at position: " + position);
                sock.emit('updateEnemyProgBar', handCards[position].cost);
                var temp = handCards[position];
                cardRemover(position);
                sock.emit('updateEnemyActionField', event.srcElement.src + position);
                checkIfAction(temp, position);
            } else if (canRespond && handCards[position].name == 'counter'){
                canRespond = false;
                cardRemover(position);
                console.log("canceling attack")
                sock.emit('cancelAttack');
            } else {

            }
        });
    }

    function hasConstraints(card) {
        if (card == "attack") {
            console.log("checking constraints and is attack");

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
                if (property.shield == 0) {
                    violates = false;
                } else {
                    console.log("none of your properties have 0 health");
                }
            });
        } else {
            return false;
        }
    }

    function emitPlayerIsReady(charId) {
        console.log("CLIENT SENDING");
        sock.emit('sendCharID', charId);
    }

    function changeTurns() {
        clearActionField();
        clearERejectProtection();
        console.log("ending turn");
        sock.emit('endTurn', 'turns');
        isTurn = false;
        canDraw = true;
        canPlay = false;
        canRespond = false;
        canClickEProperty = false;
        canClickProperty = false;


    }

    function clearActionField() {
        document.getElementById('actionCard').src = "img/emptyCard.png";
    }

    function clearEActionField() {
        document.getElementById('eActionCard').src = "img/emptyCard.png";
    }


    sock.on('startGame', (text) => {
        console.log("doing startGame: " + text)
        play(text);
    });

    sock.on('cancelAttack', (text) => {
        console.log("Enemy has declined attack");
        canDraw = true;
        canPlay = true;
    });

    sock.on('protectEProperty', (text) => {
      console.log("adding shield to enemy proprety: " + text);
        enemyProperties[text].isAttackable = false;

    });





    /** Card Types Implementation to use on Properties**/
    function checkIfAction(cardUsed, position) {
        console.log("#! " + cardUsed.name + " was played.")
        if (cardUsed.name == "attack" || cardUsed.name == "Destroy") {
            console.log("attack was used");
            canClickEProperty = true;
            canPlay = false;
            canDraw = false;
            enableEnemyPropListener(position, cardUsed);
        } else if (cardUsed.name == "defend" || cardUsed.name == "reject" || cardUsed.name == "Rebuild") {
            canClickProperty = true;
            canPlay = false;
            canDraw = false;
            console.log("reject");
            enablePlayerPropListener(cardUsed);
            //console.log("defense is now " + properties[propertyId].shield);
        } else if (cardUsed.name == "swap") {
            console.log("sending swap");
            sock.emit('swap', 'ok');
        } else if (cardUsed.name == "Freeze") {
            console.log("is a freeze card");
            sock.emit('freezeOpp', 'true');
            //makes it so that the opponent's turn will be skipped once the player's turn is done
        } else if (cardUsed.name == "Disappear") {
            console.log("will take as own");
            enableEnemyPropListener(position, cardUsed);
        }
    }



    function enablePlayerPropListener(cardUsed) {
        document.getElementById('cardDescContainer').style.zIndex = '20';
        var used = false;
        console.log("used is now: " + used);
        for (i = 0; i < 4; i++) {
            property = document.getElementById('prop' + i);
            property.addEventListener('dblclick', (event) => {
                if(canClickProperty) {
                  canPlay = true;
                  canDraw = true;
                  canClickProperty = false;
                  document.getElementById('cardDescContainer').style.zIndex = '24';
                  console.log(event.srcElement.id[4] + " OK");

                  propertyId = event.srcElement.id[4];
                  if (properties[propertyId].isAttackable && cardUsed.name == "reject" && !used) {
                      properties[propertyId].isAttackable = false;
                      sock.emit('protectProperty', propertyId);
                      console.log("makes not attackable");
                  } else if (properties[propertyId].shield < 30 && cardUsed.name == "defend" && !used) {
                      console.log("requesting server to add shield to property");
                      properties[propertyId].shield += 15;
                      sock.emit('updateEnemyProperties', properties);

                      document.getElementById('pshield' + propertyId).innerHTML = properties[propertyId].shield.toString();
                      used = true;

                  } else if (cardUsed.name == "Rebuild" && !used) {
                      properties[propertyId].health = 100;
                      document.getElementById('phealth' + propertyId).innerHTML = properties[propertyId].health.toString();
                  } else {
                      //or reject card was already used on property
                      console.log("cannot put more shields or youve used the card");
                  }
                }
            });
        }
    }


    //var propi;
    function enableEnemyPropListener(position, cardUsed) {
        //use selected card on selected property
        document.getElementById('cardDescContainer').style.zIndex = '20';
        var used = false;
        for (i = 0; i < 4; i++) {
            property = document.getElementById('eprop' + i);
            property.addEventListener('dblclick', (event) => {
                document.getElementById('cardDescContainer').style.zIndex = '24';

                console.log("emmitting enemy response");
                propertyId = event.srcElement.id[5];
                //propi = propertyId;
                //sock.emit('requestResponse', event.srcElement.id[5]);
                if (!used) {
                    if (!(enemyProperties[propertyId].isAttackable)) { //if the property they want to attack isnt attackable, just remove card without affecting health
                        console.log("not attack");
                        cardRemover(position);
                        canPlay = true;
                        canDraw= true;
                    } else if (cardUsed.name == "Destroy") {
                        console.log("destroys");
                        enemyProperties[propertyId].health = 0;
                        document.getElementById('health' + propertyId).innerHTML = enemyProperties[propertyId].health.toString();
                        canPlay = true;
                        canDraw= true;
                    } else if (cardUsed.name == "Disappear") {
                        console.log("disappear");
                        sock.emit('takeProperty', event.srcElement.id[5]);
                        canPlay = true;
                        canDraw= true;
                    } else {
                        console.log("regular attack");
                        //check if the property is attackable
                        if (enemyProperties[propertyId].isAttackable) {
                            sock.emit('requestResponse', event.srcElement.id[5]);
                        }
                    }
                    used = true;
                }
            });
        }
    }


    function incrementNegatePoints() {
        // console.log("adding negate increment");
        sock.emit('incrNegateCards', 'OK');
    }

    var isEnd = false;
    //**Check if game is over
    function isEndGame() {
        var count = 0;
        // console.log("checking end game");
        enemyProperties.forEach((property) => {
            if (property.health == 0) {
                count++;
                // console.log("counting healths 0");
            }
        });
        if (count == 4) {
            // console.log("end of game");
            isEnd = true;
        }
        console.log(isEnd);
        return isEnd;
    }

    sock.on('swapCharId', (text) => {
        swap(text);
    });

    sock.on('updateEnemyProperties', (array) => {
        console.log("Enemy properties are" + array);
        enemyProperties = array;
        updateEnemyProperties();
    });

    function updateEnemyProperties(){
      console.log(enemyProperties);
      for(i = 0; i < 4; i++) {
        document.getElementById('shield' + i).innerHTML = enemyProperties[i].shield.toString();
      }

    }


    sock.on('updateEnemyProgBar', (cost) => {

        eProgress(cost);
    });

    function drawCard() {
      console.log("drawing")
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
                incrementNegatePoints();
            }
            document.getElementById('handPos' + pos).src = rand.imgURL;
            handCards[pos]=rand;
        }
    }



    sock.on('e_updateActionField', (imgURL) => {
        //when opponent is playing a card, decrease opponents hand size by 1
        document.getElementById('eActionCard').src = imgURL;
        var pos = 6;
        var temp = document.getElementById('ehandPos' + pos).src;
        while (temp.substr(temp.length - 13) == "emptyCard.png" && pos > 0) {
            pos--;
            temp = document.getElementById('ehandPos' + pos).src;
        }
        document.getElementById('ehandPos' + pos).src = "img/emptyCard.png";

    });

    var propi = 0;
    sock.on('createPrompt', (text) => {
        propi = Number(text.substring(1, text.length));
        // console.log("creating prompt: " + text);
        if (Number(text) >= 0) {
            const parent = document.querySelector('.prompt');
            parent.style.display = 'flex';
            propi = Number(text);
        } else {
            propi = Number(text.substring(1, text.length));
            console.log("propi id: " + propi);
            properties[propi].health -= 15;
            document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
            sock.emit("acceptAttack", propi);
        }
    });

    document.getElementById('no').addEventListener('click', () => {
        if (properties[propi].shield > 0) {
            properties[Number(propi)].shield -= 15;
            document.getElementById('pshield' + propi).innerHTML = properties[Number(propi)].shield;
        } else {
            properties[propi].health -= 15;
            document.getElementById('phealth' + propi).innerHTML = properties[propi].health.toString();
        }
        sock.emit("acceptAttack", propi);
    });

    document.getElementById('yes').addEventListener('click', () => {
        canRespond = true;
    });



    //** This is going to opponent who is accepting attack
    sock.on('acceptAttack', (text) => {
        //play card on the field and remove from hand
        // console.log("accpting");
        // console.log(properties[Number(text)].shield);
        if (enemyProperties[Number(text)].shield > 0) {
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
        if (isEnd) {
            //display ending popup
            // console.log("end game was true");
            const game = document.querySelector('.endGame');
            document.getElementById('status').innerHTML += "win! Congratulations!";
            game.style.display = 'flex';
            // console.log("emit end game");
            sock.emit('endGame', 'ended');
        }
        //enemyProperties[Number(text)].health -= 15;
        //document.getElementById('health' + text).innerHTML = enemyProperties[text].health.toString();

    });

    //!!this is actually called before the "no" click goes through
    sock.on('endGame', () => {
      // console.log("ending game");
        // console.log("ending the game here");
        // console.log("health decreased to " + properties[3].health);
        //check if it's the end for the opponent
        if (isEnd) {
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

    function clearRejectProtection() {
        for (i = 0; i < 4; i++) {
            if (!properties[i].isAttackable) {
                properties[i].isAttackable = true;
                console.log("Removing property " + propertyId + " reject protection");
            }

        }

    }

    function clearERejectProtection() {
        for (i = 0; i < 4; i++) {
            if (!enemyProperties[i].isAttackable) {
                enemyProperties[i].isAttackable = true;
                console.log("Removing property " + i + " reject protection from enemy");
            }

        }
      }


        sock.on('yourTurn', () => {
            isTurn = true;
            canDraw = true;
            canPlay = true;

            clearRejectProtection();
            clearEActionField();
            console.log("your turn color activate");

            document.getElementById('player').style.filter = 'drop-shadow(5px 5px 5px #dddddd)';
            document.getElementById('player').style.webkitFilter = 'drop-shadow(5px 5px 5px #dddddd)';
            document.getElementById('oppChar').style.filter = 'none';

        });
        sock.on('opponentTurn', () => {
            // console.log("opponents turn color activate");
            document.getElementById('oppChar').style.filter = 'drop-shadow(5px 5px 5px #dddddd)';
            document.getElementById('oppChar').style.webkitFilter = 'drop-shadow(5px 5px 5px #dddddd)';
            document.getElementById('player').style.filter = 'none';

        });

        sock.on('waitingPlayer', () => {
            // console.log("waiting");
            const sButton = document.getElementById("start");
            sButton.innerHTML = "Waiting on player...";
            document.getElementById('warning').style.visibility = 'hidden';
            sButton.style.background = "yellow";
            sButton.style.fontSize = "12px";

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
            // console.log("getting request to add shield to opp prop");
            enemyProperties[Number(text)].shield += 15;
            document.getElementById('shield' + text).innerHTML = enemyProperties[Number(text)].shield.toString();
        });


        sock.on('takeProperty', (text) => {
            var applied = false;
            properties.forEach((property) => {
                if (property.health == 0 && !applied) {
                    // console.log("taking from property");
                    properties[property.number].health = enemyProperties[Number(text)].health;
                    document.getElementById('phealth' + property.number).innerHTML = properties[Number(text)].health.toString();

                    enemyProperties[Number(text)].health = 0;
                    document.getElementById('health' + Number(text)).innerHTML = 0;
                    applied = true;
                }
            });
        });
        sock.on('eTakenProperty', (text) => {
            enempyProperties.forEach((property) => {
                if (property.health == 0) {
                    enemyProperties[property.number].health = properties[Number(text)].health;
                    document.getElementById('health' + text).innerHTML = enemyProperties[Number(text)].health.toString();
                }
            });

            properties[Number(text)].health = 0;
            document.getElementById('phealth' + property.number).innerHTML = properties[Number(text)].health.toString();
        });
    }
