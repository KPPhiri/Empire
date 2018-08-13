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

        ['drawing', 'playing', 'attack'].forEach((action) => {
          player.getSocket().on(action, (text) => {
          if(player.getIsTurn()) {
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
          if(player.getIsTurn()) {
            player.getSocket().emit(action, text);
          } else {
            console.log("IS NOT PLAYERS TURN");
            }
          });
        });

    });
  }



}

module.exports = Game;
