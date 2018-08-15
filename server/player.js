class Player {
  constructor(socket, username) {
    this.socket = socket;
    this.username = username;
    this.score = 10;
    this.negateCards = 0;
    this.isTurn = false;
    this.canRespond = false;
    this.isFrozen = false;
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

  getIsFrozen() {
      return this.isFrozen;
  }
  //setters
  setNegateCards(negateCards) {
    this.negateCards = negateCards;
  }

  getNegateCards() {
    return this.negateCards;
  }

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
    return this.isTurn;
  }

  setCanRespond(canRespond) {
    this.canRespond = canRespond;
  }

  getCanRespond() {
    return this.canRespond;
  }

  setIsFrozen(isFrozen) {
      this.isFrozen = isFrozen;
  }
}




module.exports = Player;
