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



function Action(name, imgURL, cost, ability, isWildCard) {
	this.name = name,
	this.imgURL = imgURL;
	This.cost = cost;
	This.abiltiy = ability;
	this.isWildCard = isWildCard
}
charCards = [new Card("Maro", "img/maro.jpg"), new Card("Momo", "img/maro.jpg")];
function Player(charIndex) {
  this.playerChar = charCards[charIndex];
  return playerChar;
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
            console.log(deckCards.length);
			document.getElementById('handPos' + pos).src = rand.imgURL;
		}

	});




// *********Game Initialization**********
//Initializing and declaring deck array
var deckCards = [new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2),new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2)];
//new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2),
// new Card("Counter","img/basicCard.jpg","defence",0), new Card("Swap","img/basicCard.jpg","wildCard",4), new Card("Defend","img/basicCard.jpg","defence",3), new Card("No Cost","img/basicCard.jpg","wildCard",5),
// new Card("Double Points","img/basicCard.jpg","wildCard",5), new Card("Freeze","img/basicCard.jpg","character",4),new Card("Rebuild","img/basicCard.jpg","character",4),new Card("Destroy","img/basicCard.jpg","character",4),
// new Card("Protect","img/basicCard.jpg","character",4), new Card("Disappear","img/basicCard.jpg","character",4), new Card("Redirect","img/basicCard.jpg","character",4)

//Initializing and declaring hand array
var handCards = [new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2), new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2),
                new Card("Attack","img/basicCard.jpg","attack",1), new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2)];







function cardRemover(position) {
    var pts = document.getElementById('pt1');
    var points;
    if (pts.textContent.length == 17) {
        points = pts.textContent.slice(0,-16);
    } else {
        points = pts.textContent.slice(0,pts.textContent.length-3);
    }
    //checks to see if sufficient amount of points to play card
    if (handCards[position].cost <= points) {
        while(position + 1 < handCards.length && handCards[position + 1].name != null) {
    		handCards[position] = handCards[position + 1];
    		position++;
    	};
    	document.getElementById('actionCard').src = handCards[position].imgURL;
        progress(handCards[position].cost);
    	handCards[position] = new Character(null, "img/emptyCard.png");

    	drawHand();
    } else {
        console.log(points);
        console.log(handCards[position].cost);
        console.log("cannot perform move");
    }
}

//updating deck html with array contents
function drawHand() {
	for(i = 0; i < handCards.length; i++) {
		document.getElementById('handPos' + i).src = handCards[i].imgURL;

	}
}
drawHand();



/**** Progress Bar ****/

function nextRound() {
    var pts = document.getElementById('pt1');
    var newpts= pts.textContent.slice(0,document.getElementById('pt1').textContent.length-3);
    console.log(pts);
    //pts = pts.textContent.slice(0, pts.length-3);
    //console.log(pts.textContent.length);
    console.log("pts is " + pts);
    newpts = parseInt(newpts) + 1;
    console.log("you have " + pts);
    pts.innerHTML = newpts + "pts";
    console.log("concat" + pts);

    //reset progressbar
    var prg = document.getElementById('progress');
    prg.style.width = 200 + 'px';
    var round = document.getElementById('round').textContent.slice(5);
    round = parseInt(round) + 1;
    document.getElementById('round').innerHTML = "Round " + round;
}
function progress(cost) {
    var prg = document.getElementById('progress');
    var pts = document.getElementById('pt1');
    console.log("you have this many pts " + pts.innerHTML);
    console.log("cost is " + cost);
    //counter is the number of points
    var counter;
    //console.log(pts.textContent.length) length of p is 17 initially
    if (pts.textContent.length == 17) {
        counter = pts.textContent.slice(0,-16);
    } else {
        counter = pts.textContent.slice(0,pts.textContent.length-3);
    }
    //var counter = pts.textContent.slice(0,pts.textContent.length-3);
    var progress = 200;
    var increment = 200* (1/counter);
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
        if(progress == 0 || cost == 0) {
            clearInterval(id);
        } else {
            console.log("frame");
            console.log("increment is " + increment);
            progress -= (increment);
            counter -= 1;
            cost -= 1;
            prg.style.width = progress + 'px';
            pts.innerHTML = counter + 'pts';
            console.log(pts.textContent);
        }
    }
}

/**** Character Selection ****/
var characterId;
function Select(charId) {
    characterId = charId;
}
const Play = () => {
    const parent = document.querySelector('.ch-select');

    document.getElementById('playerChar').src = Player(characterId).imgURL;
    //document.getElementById('oppChar').src = "img/jane.jpg";
    parent.style.display = 'none';
};




//adding action lister to deck
