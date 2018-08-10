const Player = require('./player')
class Game {
  constructor(players) {
    this.players = players;

    this.setSockListeners();
    // this.players.forEach((player)=> {
    //     player.getSocket().on('message', (text) => {
    //       //player.getSocket().broadcast.emit("emessage", text);
    //       player.getSocket().emit("emessage", text);
    //       console.log("EMITTINGG");
    //
    //
    //   });
    // });

  }

  addPlayer(player) {
    this.players.push(player);
  }

  setSockListeners() {
    this.players.forEach((player)=> {
      ['drawing', 'playing', 'attack'].forEach((action) => {
        player.getSocket().on(action, (text) => {
          player.getSocket().broadcast.emit("e" +action, text);
        });
      });
    });
  }

}

module.exports = Game;
