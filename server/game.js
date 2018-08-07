const Player = require('./player')
class Game {
  constructor(players) {
    this.players = players;

    this.setSockListeners();
  }

  addPlayer(player) {
    this.players.push(player);
  }

  setSockListeners() {
    this.players.forEach((player)=> {
      ['drawing', 'playing', 'message', 'attack'].forEach((action) => {
        player.getSocket().on(action, (text) => {
          player.getSocket().broadcast.emit("e" +action, text);
        });
      });
    });
  }

}

module.exports = Game;
