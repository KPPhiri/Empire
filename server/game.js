const Player = require('./player')
class Game {
    constructor(players) {
        this.start = true;
        this.players = players;
        this.players[0].setIsTurn(true);
        this.setSockListeners();
        this.setSockListeners2();
        this.setSockListeners3();
        this.setSockListeners4();
        this.setSockListeners5();
        this.setSockListeners7();
        this.changeTurnsListener();
        this.endGameListener();
        this.addCharIds();
        this.swapCharIds();
        this.players.forEach((player) => {
            player.getSocket().on('incrNegateCards', (text) => {
                player.setNegateCards(player.getNegateCards() + 1);
                console.log("players neg points are: " + player.getNegateCards());
            });
        });
    }


    getStart() {
        return this.start;
    }


    changeTurns() {
      this.players.forEach((player) => {
        player.setIsTurn(!player.getIsTurn());
        if (player.getIsTurn()) {
          player.getSocket().emit('yourTurn', 'ok');
        } else {
          player.getSocket().emit('opponentTurn', 'ok');
        }
        });
      }

      addCharIds() {
        this.players[0].getSocket().emit('startGame', this.players[1].getCharId());
        this.players[0].getSocket().emit('yourTurn', 'ok');;
        this.players[1].getSocket().emit('startGame', this.players[0].getCharId());
        this.players[1].getSocket().emit('opponentTurn', 'ok');;

      }


      swapCharIds() {
          this.players.forEach((player) => {
              player.getSocket().on('swap', (text) => {
                console.log("getting swap request");
                  this.players.forEach((opponent) => {
                      if (player.getUsername() != opponent.getUsername()) {
                          var temp = player.getCharId();
                          player.setCharId(opponent.getCharId());
                          opponent.setCharId(temp);
                          player.getSocket().emit('swapCharId', player.getCharId());
                          opponent.getSocket().emit('swapCharId', opponent.getCharId());
                      }
                  });
              });
          });
      }



      changeTurnsListener() {
          this.players.forEach((player) => {
              player.getSocket().on('endTurn', (text) => {
                console.log("yes change turns");

              if(player.getIsTurn()) {
                this.changeTurns();

                if(player.getUsername() == this.players[1].getUsername()){
                  console.log("Player 2 is done.");

                  player.getSocket().emit('nextRound', 'round done');
                  player.getSocket().broadcast.emit('nextRound', 'round done');
                }
              }

          });
            });
      }

    addPlayer(player) {
        this.players.push(player);
    }

    setSockListeners2() {
        this.players.forEach((player) => {
            ['drawing', 'playing', 'attack'].forEach((action) => {
                player.getSocket().on(action, (text) => {
                    if(action == "attack") {
                      player.setIsTurn(false);
                      console.log("stopping player from attacking again");
                    } else if (text == "counter") {
                        player.getSocket().broadcast.emit("e" + action, text.substring(22, text.length - 1));
                        player.getSocket().emit(action, text.substring(text.length - 1));
                        cancelAttack()
                    }else if (player.getIsTurn()) {
                        player.getSocket().broadcast.emit("e" + action, text.substring(22, text.length - 1));
                        player.getSocket().emit(action, text.substring(text.length - 1));
                    } else {
                        console.log("IS NOT PLAYERS TURN");
                    }
                });
            });
        });
    }

    setSockListeners7() {
        this.players.forEach((player) => {
            ['drawingRequest', 'addShield', 'takeProperty'].forEach((action) => {
                player.getSocket().on(action, (text) => {
                    if (player.getIsTurn()) {
                        console.log(player.getUsername() + " server is emitting drawing");
                        player.getSocket().emit(action, text);
                        if(action == 'addShield') {
                          console.log("sending enemy requst");
                          player.getSocket().broadcast.emit('e' + action, text);
                      } else if(action == 'takeProperty') {
                          console.log("taking enemy property's health");
                          player.getSocket().emit('takeProperty', text);
                          player.getSocket().broadcast.emit('eTakenProperty', text);
                      }
                    } else {
                        console.log(" X" + player.getUsername() + " is " + action + " player.getCanRespond(): " + player.getCanRespond() +
                            " player.getIsTurn(): " + player.getIsTurn());
                        console.log("IS NOT PLAYERS TURN");
                    }
                });
            });

        });
    }
    //
    //
    setSockListeners() {
        this.players.forEach((player) => {
            ['playingRequest'].forEach((action) => {
                player.getSocket().on(action, (text) => {
                  console.log("player is attempting to play");
                    if (player.getIsTurn() || player.getCanRespond()) {
                      console.log("player is playing a counter");

                        player.getSocket().broadcast.emit(action, text);
                        player.setCanRespond(false);
                    } else {
                        console.log(" X" + player.getUsername() + " is " + action + " player.getCanRespond(): " + player.getCanRespond() +
                            " player.getIsTurn(): " + player.getIsTurn());
                        console.log("IS NOT PLAYERS TURN");
                    }
                });
            });

        });
    }

    // setSockListeners6() {
    //   this.players.forEach((player)=> {
    //     player.getSocket().on('requestResponse', (text) => {
    //       this.players.forEach((opponent)=> {
    //         if(player.getUsername() == opponent.getUsername()) {
    //           console.log(player.getUsername() + " has to now wait.");
    //           player.setIsTurn(false);
    //         } else {
    //           opponent.setCanRespond(true);
    //           console.log(opponent.getUsername() + " can now reply." + opponent.setCanRespond(true));
    //         }
    //       });
    //     });
    //

    setSockListeners3() {
        this.players.forEach((player) => {
            player.getSocket().on('requestResponse', (text) => {
              console.log("requesting response");
                this.players.forEach((opponent) => {
                    if (player.getUsername() == opponent.getUsername()) {
                        console.log("diable player from playing");
                    } else {
                      console.log("allowing opponent to respond");
                      if(opponent.getNegateCards() > 0) {
                        opponent.setCanRespond(true);
                        console.log("allowing opponent to play");
                        opponent.getSocket().emit('createPrompt', text);

                        console.log("sending prompt");
                      } else {
                        //if they dont have negate cards,
                        opponent.getSocket().emit('createPrompt', text);
                        //opponent.getSocket().emit('createPrompt', '-1');
                        console.log("opponent cannot respond");

                      }

                    }
                });
            });

            player.getSocket().on('disableHandandDeck', (text) => {
                player.setIsTurn(false);
            });

            player.getSocket().on('enableHandandDeck', (text) => {
                player.setIsTurn(true);
            });


        });
    }

    setSockListeners4() {
        this.players.forEach((player) => {
            player.getSocket().on('acceptAttack', (text) => {
                player.getSocket().broadcast.emit('acceptAttack', text);
                this.players.forEach((opponent) => {
                    if (player.getUsername() == opponent.getUsername()) {
                        player.setCanRespond(false);
                    } else {
                        opponent.setIsTurn(true);
                    }
                });
            });
        });
    }

    cancelAttack() {
        this.players.forEach((player) => {
            player.getSocket().on('cancelAttack', (text) => {
                player.getSocket().broadcast.emit('cancelAttack', text);
                this.players.forEach((opponent) => {
                    if (player.getUsername() == opponent.getUsername()) {
                        player.setCanRespond(false);
                    } else {
                        opponent.setIsTurn(true);
                    }
                });
            });
        });
    }


    setSockListeners5() {
        this.players.forEach((player) => {
            player.getSocket().on('decEnemyProgBar', (text) => {
              console.log("decreasng enemy");
              if(player.getIsTurn()) {
                player.getSocket().broadcast.emit('decEnemyProgBar', text);
              }
            });

        });
    }

    endGameListener() {
        this.players.forEach((player) => {
            player.getSocket().on('requestResponse', (text) => {
                console.log("should ge there");
                player.getSocket().broadcast.emit('endGame', text);
            });

        });
    }



}

module.exports = Game;
