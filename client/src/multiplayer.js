// *********Object Constructors**********
function Character(name, imgURL, propertyType, progressPoints) {
    this.name = name;
    this.imgURL = imgURL;
    this.propertyType = propertyType;
    this.progressPoints = progressPoints;
}

function Card(name, imgURL, action, cost, probability) {
    this.name = name;
    this.imgURL = imgURL;
    this.action = action;
    this.cost = cost;
    this.probability = probability;
}

function Property(number, imgURL, health, shield, isAttackable) {
    this.number = number;
    this.imgURL = imgURL;
    this.health = health;
    this.shield = shield;
    this.isAttackable = true;
}

// function Action(name, imgURL, cost, ability, isWildCard) {
// 	this.name = name,
// 	this.imgURL = imgURL;
// 	This.cost = cost;
// 	This.abiltiy = ability;
// 	this.isWildCard = isWildCard
// }


charCards = [new Card("Maro", "img/maro.jpg"), new Card("Momo", "img/momoko.jpg"), new Card("CatMagi", "img/catMagicCard.jpg"), new Card("Ches", "img/chesu.jpg")];

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
for (i = 0; i < 7; i++) {
    button = document.getElementById('handPos' + i);

    button.onmouseover = function(event) {
        var path = event.target.getAttribute('src');
        var img = document.getElementById('cardDescription');
        img.src = path;
        img.style.opacity = "0.8";

    };

    button.onmouseout = function() {
        document.getElementById('cardDescription').style.opacity = "0";
        document.getElementById('cardDescription').src = "";
    };
}




// *********Game Initialization**********
var properties = [new Property(0, "img/properties/prop1.png", 100, 0, true), new Property(1, "img/properties/prop1.png", 100, 0, true), new Property(2, "img/properties/prop1.png", 100, 0, true), new Property(3, "img/properties/prop1.png", 100, 0, true)];

var enemyProperties = [new Property(0, "img/properties/prop1.png", 100, 0,true), new Property(1, "img/properties/prop1.png", 100, 0,true), new Property(2, "img/properties/prop1.png", 100, 0,true), new Property(3, "img/properties/prop1.png", 100, 0,true)];

//Initializing and declaring deck array
var weightedDeck = [];
// var deckCards = [new Card("Attack","img/basicCard.jpg","attack",1,0.357), new Card("Reject","img/basicCard.jpg","defence",2, 0.143),
//                 new Card("Counter","img/basicCard.jpg","defence",0, 0.043), new Card("Swap","img/basicCard.jpg","wildCard",4, 0.043),
//                 new Card("Defend","img/basicCard.jpg","defence",3,0.214), new Card("No Cost","img/basicCard.jpg","wildCard",5, 0.028),
//                 new Card("Double Points","img/basicCard.jpg","wildCard",5, 0.029)];
// var deckCards = [new Card("Attack","img/basicCard.jpg","attack",1,35), new Card("Reject","img/basicCard.jpg","attack",2, 14),
//                 new Card("Counter","img/basicCard.jpg","defence",0, 4), new Card("Swap","img/basicCard.jpg","wildCard",4, 4),
//                 new Card("Defend","img/basicCard.jpg","defence",3,21), new Card("No Cost","img/basicCard.jpg","wildCard",5, 2),
//                 new Card("Double Points","img/basicCard.jpg","wildCard",5,2)];

// var deckCards = [new Card("attack", "img/attack.png", "attack", 1, 35), new Card("reject", "img/basicCard.jpg", "defense", 3, 14),
//     new Card("counter", "img/basicCard.jpg", "attack", 0, 4), new Card("swap", "img/basicCard.jpg", "attack", 4, 4),
//     new Card("defend", "img/basicCard.jpg", "defense", 2, 21), new Card("no cost", "img/basicCard.jpg", "attack", 5, 2),
//     new Card("double points", "img/basicCard.jpg", "attack", 5, 2)
// ];
var deckCards;
var deckCards0 = [new Card("attack", "img/maroDeck1.jpg", "attack", 1, 35), new Card("reject", "img/maroDeck3.jpg", "defense", 3, 14),
    new Card("counter", "img/maroDeck0.jpg", "attack", 0, 4), new Card("swap", "img/maroDeck4.jpg", "attack", 4, 4),
    new Card("defend", "img/maroDeck2.jpg", "defense", 2, 21), new Card("no cost", "img/maroDeckNo5.jpg", "attack", 5, 2),
    new Card("double points", "img/maroDeck5.jpg", "attack", 5, 2)
];
var deckCards1 = [new Card("attack", "img/momoDeck1.jpg", "attack", 1, 35), new Card("reject", "img/momoDeck3.jpg", "defense", 3, 14),
    new Card("counter", "img/momoDeck0.jpg", "attack", 0, 4), new Card("swap", "img/momoDeck4.jpg", "attack", 4, 4),
    new Card("defend", "img/momoDeck2.jpg", "defense", 2, 21), new Card("no cost", "img/momoDeckNo5.jpg", "attack", 5, 2),
    new Card("double points", "img/momoDeck5.jpg", "attack", 5, 2)
];
var deckCards2 = [new Card("attack", "img/catDeck1.jpg", "attack", 1, 35), new Card("reject", "img/catDeck3.jpg", "defense", 3, 14),
    new Card("counter", "img/catDeck0.jpg", "attack", 0, 4), new Card("swap", "img/catDeck4.jpg", "attack", 4, 4),
    new Card("defend", "img/catDeck2.jpg", "defense", 2, 21), new Card("no cost", "img/catDeckNo5.jpg", "attack", 5, 2),
    new Card("double points", "img/catDeck5.jpg", "attack", 5, 2)
];
var deckCards3 = [new Card("attack", "img/chesDeck1.jpg", "attack", 1, 35), new Card("reject", "img/chesDeck3.jpg", "defense", 3, 14),
    new Card("counter", "img/chesDeck0.jpg", "attack", 0, 4), new Card("swap", "img/chesDeck4.jpg", "attack", 4, 4),
    new Card("defend", "img/chesDeck2.jpg", "defense", 2, 21), new Card("no cost", "img/chesDeckNo5.jpg", "attack", 5, 2),
    new Card("double points", "img/chesDeck5.jpg", "attack", 5, 2)
];
//basic cards new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2),
// new Card("Counter","img/basicCard.jpg","defence",0), new Card("Swap","img/basicCard.jpg","wildCard",4), new Card("Defend","img/basicCard.jpg","defence",3), new Card("No Cost","img/basicCard.jpg","wildCard",5),
// new Card("Double Points","img/basicCard.jpg","wildCard",5)
//Character Special Cards Deck
var specialCards = [new Card("Rebuild", "img/maroDeckSpecial.jpg", "character", 4, 14), new Card("Freeze", "img/momoDeckSpecial.jpg", "character", 4, 14),
    new Card("Disappear", "img/catDeckSpecial.jpg", "character", 4, 14), new Card("Destroy", "img/chesDeckSpecial.jpg", "character", 4, 14),
    new Card("Protect", "img/basicCard.jpg", "character", 4, 14), new Card("Redirect", "img/basicCard.jpg", "character", 4, 14)
];

//Initializing and declaring hand array
var handCards = [];
// var handCards= [new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2), new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2),
//                 new Card("Attack","img/basicCard.jpg","attack",1), new Card("Attack","img/basicCard.jpg","attack",1), new Card("Reject","img/basicCard.jpg","defence",2)];


function cardRemover(pos) {
    var position = Number(pos);
    var pts = document.getElementById('pt1');
    var points;
    if (pts.textContent.length == 17) {
        points = pts.textContent.slice(0, -16);
    } else {
        points = pts.textContent.slice(0, pts.textContent.length - 3);
    }
    document.getElementById('actionCard').src = handCards[position].imgURL;
    progress(handCards[position].cost);

    while (position + 1 < handCards.length && handCards[position + 1].name != null) {
      console.log("Shifting card position: " + position + " with position: " + (position + 1));
        handCards[position] = handCards[position + 1];
        position++;
    }
    //makes the empty card same as the card it had before but 0 cost
    handCards[position] = new Card(null, "img/emptyCard.png", handCards[position].action, 0, handCards[position].probability);
    drawHand();
}



/**** Draws hand from character deck****/
function initializeDeck(characterId) {
    //deck elems
    if(characterId == 0) {
        deckCards = deckCards0;
    } else if(characterId == 1) {
        deckCards = deckCards1;
    } else if(characterId == 2) {
        deckCards = deckCards2;
    } else if(characterId == 3) {
        deckCards = deckCards3;
    }
    var totalWeights = 96;
    var weights = [35, 14, 4, 4, 21, 2, 2, 14];
    var curElem = 0;
    while (curElem <= deckCards.length) {
        for (i = 0; i < weights[curElem]; i++) {
            if (curElem === 7) {
                weightedDeck.push(specialCards[characterId]);
            } else {
                weightedDeck.push(deckCards[curElem]);
            }
        }
        curElem++;
    }
}

function drawInitialHand() {

    for (i = 0; i < 7; i++) {
        var index = Math.floor(Math.random() * weightedDeck.length);
        rand = weightedDeck[index];
        if (rand.name == "counter") {
            // console.log("incrementing");
            incrementNegatePoints();
        }
        handCards[i]=rand;
        // console.log("adding: " + rand);
    }
    for (i = 0; i < handCards.length; i++) {
        document.getElementById('handPos' + i).src = handCards[i].imgURL;
        // console.log("drawing: " + rand.name + " pos " + i);

    }
}

function drawHand() {
    for (i = 0; i < handCards.length; i++) {
        // console.log(handCards[i].imgURL);
        console.log("Hand length: " + handCards.length);
        document.getElementById('handPos' + i).src = handCards[i].imgURL;
    }
}
//drawHand(); only called when new card drawn



/**** Progress Bar ****/

function nextRound() {
    var pts = document.getElementById('pt1');
    var ptsOp = document.getElementById('pt');

    var newpts = pts.textContent.slice(0, document.getElementById('pt1').textContent.length - 3);
    var round = document.getElementById('round').textContent.slice(5);
    // console.log(pts);
    //reset points to new max amount
    // console.log("pts is " + pts);
    newpts = parseInt(round) + 2;
    // console.log("you have " + pts);
    pts.innerHTML = newpts + "pts";
    ptsOp.innerHTML = newpts + "pts";
    // console.log("concat" + pts);

    //reset progressbar
    var prg = document.getElementById('progress');
    prg.style.width = 200 + 'px';
    var prgOp = document.getElementById('progress-op');
    prgOp.style.width = 200 + 'px';


    //var round = document.getElementById('round').textContent.slice(5);
    round = parseInt(round) + 1;
    document.getElementById('round').innerHTML = "Round " + round;
}

function progress(cost) {
    var prg = document.getElementById('progress');
    var pts = document.getElementById('pt1');
    // console.log("you have this many pts " + pts.innerHTML);
    // console.log("cost is " + cost);
    //counter is the number of points
    var counter;
    //console.log(pts.textContent.length) length of p is 17 initially
    if (pts.textContent.length == 17) {
        counter = pts.textContent.slice(0, -16);
    } else {
        counter = pts.textContent.slice(0, pts.textContent.length - 3);
    }
    //var counter = pts.textContent.slice(0,pts.textContent.length-3);
    var progress = 200;
    var increment = 200 * (1 / counter);
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
        if (progress == 0 || cost == 0) {
            clearInterval(id);
        } else {
            progress -= (increment);
            counter -= 1;
            cost -= 1;
            prg.style.width = progress + 'px';
            pts.innerHTML = counter + 'pts';
        }
    }
}


function eProgress(cost) {
    var prg = document.getElementById('progress-op');
    var pts = document.getElementById('pt');
    // console.log("you have this many pts " + pts.innerHTML);
    // console.log("cost is " + cost);
    //counter is the number of points
    var counter;
    //console.log(pts.textContent.length) length of p is 17 initially
    if (pts.textContent.length == 17) {
        counter = pts.textContent.slice(0, -16);
    } else {
        counter = pts.textContent.slice(0, pts.textContent.length - 3);
    }
    //var counter = pts.textContent.slice(0,pts.textContent.length-3);
    var progress = 200;
    var increment = 200 * (1 / counter);
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
        if (progress == 0 || cost == 0) {
            clearInterval(id);
        } else {
            // console.log("frame");
            // console.log("increment is " + increment);
            progress -= (increment);
            counter -= 1;
            cost -= 1;
            prg.style.width = progress + 'px';
            pts.innerHTML = counter + 'pts';
            // console.log(pts.textContent);
        }
    }
}

/**** Character Selection ****/
var characterId;

function Select(charId) {
		// console.log("cardDescContainer: " + document.getElementById('cardDescContainer').style.zIndex);
		// console.log("playerProperties: " + document.getElementById('playerProperties').style.zIndex);
		// console.log("progress-bar : " + document.getElementsByClassName('progress-bar ')[0].style.zIndex);


    characterId = charId;
    //initialize that character deck
    //deckCards.push(specialCards[charId]);
}

function ready() {
  if(characterId != null) {
    emitPlayerIsReady(characterId);
  } else {
    document.getElementById('warning').style.visibility = 'visible';
  }

}
function play(text){
  // console.log("Game is starting");

    const parent = document.querySelector('.ch-select');
    // console.log("GETTING PLAYERS CHARID: " + characterId);
    document.getElementById('playerChar').src = Player(characterId).imgURL;
    document.getElementById('opponent').src = Player(text).imgURL;
    parent.style.display = 'none';
    initializeDeck(characterId);
    // weightedDeck.push(specialCards[characterId]);
    drawInitialHand();
};

function swap(text){
  // console.log("Game is starting");

    const parent = document.querySelector('.ch-select');
    // console.log("chosen player charid is " + Player(characterId).imgURL);

    document.getElementById('playerChar').src = Player(text).imgURL;
    // console.log("enemy char id: " + Player(text).imgURL);
    document.getElementById('opponent').src = Player(characterId).imgURL;
    characterId = text;

    parent.style.display = 'none';
    weightedDeck = [];

    initializeDeck(characterId);
    drawInitialHand();

};




//adding action lister to deck


const removePrompt = () => {
    const parent = document.querySelector('.prompt');
    //add functionality so that when you choose a card it's applied to the game board
    parent.style.display = 'none';
};
