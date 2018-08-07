
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
var cardDeck = [new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg")];

//Initializing and declaring deck arrays
var cardHand = [new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg")];



function handRemover(position) {
	while(position + 1 < cardDeck.length && cardHand[position + 1] != null) {
		console.log("REMOVING");
		cardHand[position] = cardHand[position + 1];
		position++;
	}
	cardHand[position] = new Character(null, "");
}

for(i = 0; i < cardHand.length; i++) {
	document.getElementById('handPos' + i).src = cardHand[i].imgURL

}
//adding action listeners to all 7 cards in hand
for (i =0; i < 7; i++){
	button = document.getElementById('handPos' + i);
	button.addEventListener('click', (event)=> {
		cardRemover(Number(event.srcElement.id[7]));
		console.log("Removing: " + Number(event.srcElement.id[7]));
	});
}


//adding characters
document.getElementById('playerChar').src = "img/vince.jpg";
document.getElementById('oppChar').src = "img/jane.jpg";

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




//adding action lister to deck
