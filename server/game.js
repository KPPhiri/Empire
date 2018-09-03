const Player = require('./player')
class Game {
    constructor(players) {
        this.start = true;
        this.players = players;
        this.players[0].setIsTurn(true);
        this.players[1].setIsTurn(false);
        this.players[0].getSocket().emit('yourTurn')
        this.updateEnemyFieldListeners();
        this.response();
        this.acceptAttack();
        this.cancelAttack();
        this.changeTurnsListener();
        this.gameInitialization();
        this.swapCharIds();
        this.endGameListener()


    }


    updateEnemyFieldListeners() {
        this.players.forEach((player) => {
            ['updateEnemyHand', 'updateEnemyProperties', 'updateEnemyActionField', 'updateEnemyProgBar'].forEach((action) => {
                player.getSocket().on(action, (data) => {
                    if (player.getIsTurn()) {
                        player.getSocket().broadcast.emit(action, data);
                        console.log("array is: " + data);
                    } else {
                        console.log("IS NOT PLAYERS TURN");
                    }
                });
            });
        });
    }




      gameInitialization() {
        this.players[0].getSocket().emit('startGame', this.players[1].getCharId());
        this.players[0].getSocket().emit('yourTurn', 'ok');;
        this.players[1].getSocket().emit('startGame', this.players[0].getCharId());
        this.players[1].getSocket().emit('opponentTurn', 'ok');

        this.players.forEach((player) => {
            player.getSocket().on('incrNegateCards', (text) => {
                player.setNegateCards(player.getNegateCards() + 1);
                console.log("players neg points are: " + player.getNegateCards());
            });
        });

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
                console.log("!!yes change turns");
              console.log("TEsTING!: " + player.getIsTurn());
              if(player.getIsTurn()) {
                this.players[0].setIsTurn(!this.players[0].getIsTurn());
                this.players[1].setIsTurn(!this.players[1].getIsTurn());
                console.log("CHaing player 1!: " + this.players[1].getIsTurn());

                console.log("going in loop to change");
                if (player == this.players[0]) {
                  this.players[1].getSocket().emit('yourTurn', 'ok');
                  this.players[0].getSocket().emit('opponentTurn', 'ok');

                } else {
                  this.players[1].getSocket().emit('opponentTurn', 'ok');
                  this.players[0].getSocket().emit('yourTurn', 'ok');

                }
                if(player.getUsername() == this.players[1].getUsername()){
                  console.log("Player 2 is done.");

                  player.getSocket().emit('nextRound', 'round done');
                  player.getSocket().broadcast.emit('nextRound', 'round done');
                }
              }

          });
            });
      }


    response() {
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
                        console.log("allowing opponent to play and has " + opponent.getNegateCards() + " negate cards");
                        opponent.getSocket().emit('createPrompt', text);

                        console.log("sending prompt");
                      } else {
                        opponent.getSocket().emit('createPrompt', '-' + text);

                        //if they dont have negate cards,                        //opponent.getSocket().emit('createPrompt', '-1');
                        console.log("opponent cannot respond");

                      }

                    }
                });
            });

            player.getSocket().on('protectProperty', (text) => {
              console.log("!!sending protection");
                player.getSocket().broadcast.emit('protectEProperty', text);
                player.setIsTurn(true);
            });


        });
    }

    acceptAttack() {
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
              player.setNegateCards(player.getNegateCards() - 1);
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



    endGameListener() {
        this.players.forEach((player) => {
            player.getSocket().on('endGame', (text) => {
              player.getSocket().emit('endGame', text);
                player.getSocket().broadcast.emit('endGame', text);
            });

        });
    }

}

module.exports = Game;
