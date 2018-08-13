// *********Object Constructors**********

function Character(name, imgURL, propertyType, progressPoints) {
this.name = name;
this.imgURL =imgURL;
this.propertyType = propertyType;
this.progressPoints = progressPoints;
}

function Card(name, imgURL, action, cost) {
	this.name = name;
	this.imgURL = imgURL;
	this.action = action;
	this.cost = cost;
}



// function Action(name, imgURL, cost, ability, isWildCard) {
// 	this.name = name,
// 	this.imgURL = imgURL;
// 	This.cost = cost;
// 	This.abiltiy = ability;
// 	this.isWildCard = isWildCard
// }

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




// *********Action Listeners**********

//adding action listeners to all 7 cards in hand
for (i =0; i < 7; i++){
	button = document.getElementById('handPos' + i);
	button.addEventListener('dblclick', (event)=> {
		var path = event.target.getAttribute('src');
		 if(path.substr(path.length - 13) != "emptyCard.png") {
			 cardRemover(Number(event.srcElement.id[7]));
		 }
	});

	button.onmouseover = function (event) {
	var path = event.target.getAttribute('src');
	var img = document.getElementById('cardDescription');
   img.src = path;
	 img.style.opacity = "0.8";

};

button.onmouseout = function () {
 document.getElementById('cardDescription').style.opacity = "0";
 document.getElementById('cardDescription').src = "";
};


}

//Adding action listener to deck that adds cards to player hand
document.getElementById('playerDeck').addEventListener('click', () => {
		var pos = 0;
		var temp = document.getElementById('handPos' + pos).src;
		while(temp.substr(temp.length - 13) != "emptyCard.png" && pos< 6) {
			pos++;
			temp = document.getElementById('handPos' + pos).src;
		}
		if((temp.substr(temp.length - 13)) == "emptyCard.png") {
			var index = Math.floor(Math.random()*deckCards.length);
			rand = deckCards[index];
			document.getElementById('handPos' + pos).src = rand.imgURL;
		}

	});




// *********Game Initialization**********
//Initializing and declaring deck array
var deckCards = [new Card("Bob", "img/bob.jpg"), new Card("Jane", "img/jane.jpg"), new Card("Vince", "img/vince.jpg")];

//Initializing and declaring hand array
var handCards = [new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg"), new Character("Jane", "img/jane.jpg"), new Character("Vince", "img/bob.jpg"),
new Character("Bob", "img/bob.jpg")];




//adding characters
document.getElementById('playerChar').src = "img/vince.jpg";
document.getElementById('oppChar').src = "img/jane.jpg";






function cardRemover(position) {
	while(position + 1 < handCards.length && handCards[position + 1].name != null) {
		handCards[position] = handCards[position + 1];
		position++;
	};
	document.getElementById('actionCard').src = handCards[position].imgURL;
	handCards[position] = new Character(null, "img/emptyCard.png");

	drawHand();
}

//updating deck html with array contents
function drawHand() {
	for(i = 0; i < handCards.length; i++) {
		document.getElementById('handPos' + i).src = handCards[i].imgURL

	}
}
drawHand();


















//IN PROGRESS WORK
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




//character selection buttons
const Play = () => {
    const parent = document.querySelector('.ch-select');

    //add functionality so that when you choose a card it's applied to the game board
    parent.style.display = 'none';
};




const removePrompt = () => {
    const parent = document.querySelector('.prompt');
		console.log("REMVOING");
    //add functionality so that when you choose a card it's applied to the game board
    parent.style.display = 'none';
};
