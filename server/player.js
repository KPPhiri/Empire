class Player {
  constructor(socket, username) {
    this.socket = socket;
    this.username = username;
    this.score = 10;
    this.isTurn = false;
    this.charImg = "./../client/img/vince.jpg";
  }

  //getters
  getSocket() {
    return this.socket;
  }
  getUsername() {
    return this.username;
  }

  getScore() {
    return this.score;
  }

  getCharImg() {
    return this.charImg;
  }

  //setters
  setScore(score) {
    this.score = score;
  }

  setCharImg(charImg) {
    this.charImg = charImg;
  }

  setIsTurn(isTurn) {
    this.isTurn = isTurn;
  }

  getIsTurn() {
    return isTurn;
  }
}




module.exports = Player;
