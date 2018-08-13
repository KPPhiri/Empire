const Player = require('./player')
class Game {
  constructor(players) {
    this.start = true;
    this.players = players;
    players[0].setIsTurn(true);
    this.setSockListeners();
    this.setSockListeners2();

  }
  getStart() {
    return this.start;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  setSockListeners2() {
    this.players.forEach((player)=> {
      if(player.getIsTurn()) {
        ['drawing', 'playing', 'attack'].forEach((action) => {
          player.getSocket().on(action, (text) => {
            console.log("ENEYMY PLAYING:");
            player.getSocket().broadcast.emit("e" +action, text);
            player.getSocket().emit(action, text);
          });
        });
      }
    });
  }

  setSockListeners() {
    this.players.forEach((player)=> {
      if(player.getIsTurn()) {
        ['playingRequest', 'drawingRequest'].forEach((action) => {
          console.log("PLAYINGREWUESTTTT");
          player.getSocket().on(action, (text) => {
            player.getSocket().emit(action, text);
          });
        });
      }

    });
  }



}

module.exports = Game;
