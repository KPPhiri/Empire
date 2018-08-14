const Player = require('./player')
class Game {
  constructor(players) {
    this.start = true;
    this.players = players;
    players[0].setIsTurn(true);
    this.setSockListeners();
    this.setSockListeners2();
    this.setSockListeners3();
    this.setSockListeners4();

  }
  getStart() {
    return this.start;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  setSockListeners2() {
    this.players.forEach((player)=> {
        ['drawing', 'playing', 'attack'].forEach((action) => {
          player.getSocket().on(action, (text) => {
          if(player.getIsTurn() || player.getCanRespond()) {
            player.getSocket().broadcast.emit("e" +action, text);
            player.getSocket().emit(action, text);
          } else {
            console.log("IS NOT PLAYERS TURN");
          }
          });
        });
    });
  }

  setSockListeners() {
    this.players.forEach((player)=> {
        ['playingRequest', 'drawingRequest'].forEach((action) => {
          player.getSocket().on(action, (text) => {
          if(player.getIsTurn() || player.getCanRespond()) {
            console.log(player.getUsername() + " is " + action +  " player.getCanRespond(): " +  player.getCanRespond()
            + " player.getIsTurn(): " + player.getIsTurn());
            player.getSocket().emit(action, text);
            player.setCanRespond(false);
          } else {
            console.log(" X" + player.getUsername() + " is " + action +  " player.getCanRespond(): " +  player.getCanRespond()
            + " player.getIsTurn(): " + player.getIsTurn());
            console.log("IS NOT PLAYERS TURN");
            }
          });
        });

    });
  }

  setSockListeners3() {
    this.players.forEach((player)=> {
      player.getSocket().on('requestResponse', (text) => {
        this.players.forEach((opponent)=> {
          if(player.getUsername() == opponent.getUsername()) {
            console.log(player.getUsername() + " has to now wait.");
            player.setIsTurn(false);
          } else {
            opponent.setCanRespond(true);
            console.log(opponent.getUsername() + " can now reply." + opponent.setCanRespond(true));
          }
        });
      });
    });
  }

  setSockListeners4() {
    this.players.forEach((player)=> {
      player.getSocket().on('finishReponse', (text) => {
        this.players.forEach((opponent)=> {
          if(player.getUsername() == opponent.getUsername()) {
            player.setCanRespond(false);
          } else {
            opponent.setIsTurn(true);
          }
        });
      });
    });
  }



}

module.exports = Game;
