//Object Constructors
function Character(name, imgURL, propertyType) {
this.name = name;
this.imgURL =imgURL;
this.propertyType = propertyType;
}

function Action(name, imgURL, cost, ability, isWildCard) {
	this.name = name,
this.imgURL = imgURL;
This.cost = cost;
This.abiltiy = ability;
this.isWildCard = isWildCard
}

function Player(charIndex) {
  this.playerChar = charCards[charIndex];
}

Player.prototype = {
  constructor: Player,
  deckDraw: function() {
  	  return actionDeck[Math.floor(Math.random() * actionDeck.length)];
  },
  playCard: function() {
  	playerPoints -= actionDeck[choiceIndex].cost;
  	 actionDeck[choiceIndex].ability();
  }
}

//Initializing and declaring deck arrays
var charDeck = [new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg")];

//var actionDeck = [action1, action1, action3, action4 … ]


//adding characters
document.getElementById('character').src = "img/vince.jpg";
document.getElementById('opponent').src = "img/jane.jpg";

//opponents points progress bar
function progress() {
    var prg = document.getElementById('progress');
    var pts = document.getElementById('pt');
    var counter = 10;
    //5
    var progress = 200;
    var id = setInterval(frame, 50);

    function frame() {
        // if(progress == 500 && counter == 100) {
        //     clearInterval(id);
        // } else {
        //     progress += 5;
        //     counter+= 1;
        //     prg.style.width = progress + 'px';
        //     pts.innerHTML = counter + 'pts';
        // }
        if(progress == 0 || counter == 0) {
            clearInterval(id);
        } else {
            progress -= 20;
            counter -= 1;
            prg.style.width = progress + 'px';
            pts.innerHTML = counter + 'pts';
        }
    }
}
//progress();

//character selection buttons
const Play = () => {
    const parent = document.querySelector('.ch-select');
    //add functionality so that when you choose a card it's applied to the game board
	console.log("WORKINGG");
    parent.style.display = 'none';
};
