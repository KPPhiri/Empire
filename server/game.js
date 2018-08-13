const Player = require('./player')
class Game {
  constructor(players) {
    this.start = true;
    this.players = players;

    this.setSockListeners();

  }
  getStart() {
    return this.start;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  setSockListeners() {
    this.players.forEach((player)=> {
      ['drawing', 'playing', 'attack'].forEach((action) => {
        player.getSocket().on(action, (text) => {
          player.getSocket().broadcast.emit("e" +action, text);
          player.getSocket().emit(action, text);
        });
      });
    });
  }

  setSockListeners() {
    this.players.forEach((player)=> {
      if(player.getIsTurn()) {
        ['playingRequest', 'drawingRequest'].forEach((action) => {
          player.getSocket().on(action, (text) => {
            player.getSocket().broadcast.emit(action, text);
            player.getSocket().emit(action, text);
          });
        });
      }

    });
  }



}

module.exports = Game;
