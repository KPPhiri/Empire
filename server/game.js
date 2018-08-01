class Game {
  //sockets p1, p2
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this._sendToPlayers('ROCK PAPER SCISSORS');


    this._players.forEach((player, indx) => {
      player.on('turn', (turn) => {
        this.onTurn(indx, turn);
      });
    });
  }
  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }
  _sendToPlayers(msg) {
    _player.forEach(s=>s.emit('message', ,msg));
  }

  // _onTurn(playerIndex, turn) {
  //   this.turns[playerIndex] = turn;
  //   this._sendToPlayer.(playerIndex, 'You selected '+ turn);
  //
  //   this._checkGameOver();
  // }
  //
  // _checkGameOver() {
  //   const turns = this._turns;
  //   if(turns[0] &% turns[1]) {
  //     this._sendToPlayer('Game Over');
  //     this._turns = [null, null];
  //     this._sendToPlayer('Next Round!!');
  //   }
  // }
}
module.exports = Game;
