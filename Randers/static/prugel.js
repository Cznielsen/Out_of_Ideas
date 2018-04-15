player_count = 0;
hands = [];
turncount = 0;
tab = '#card-table';
deck = new cards.Deck();
sm = new cards.Deck({faceUp:true});
rh = new cards.Deck({faceUp:true});
discardpile = new cards.Deck({faceUp:true});
deck.y -= 100;
discardpile.y -= 100;
discardpile.x += 250;
sm.y -= 100;
sm.x += -250;
rh.y -= 100;
rh.x += -175;

/***
Resets the game board
***/
function resetGame() {
	for (var i = 0; i < player_count; i++) {document.getElementById("hand-"+i).remove();}
	while (discardpile.length > 0) {discardpile.removeCard(discardpile.topCard());}
	while (sm.length > 0) {sm.removeCard(sm.topCard());}
	while (rh.length > 0) {rh.removeCard(rh.topCard());}
	for (var x = 0; x < player_count; x++) {
		while (hands[x].length > 0) {
			hands[x].removeCard(hands[x].topCard());
		}
	}
	cards.cleanTable();
	player_count = 0;
	turncount = 0;
	hands = [];
}

/***
Ends the game. 
Prompts user with number of wins per player and asks to start new game.
***/
function endGame() {
	var endString = "Game over, number of wins:\n";
	for (var i = 0; i < player_count; i++){endString += hands[i].name + ": " + hands[i].wins + "\n";}
	endString += "Start a new game?";
	if(confirm(endString)) {
		resetGame();
		player_count = prompt("Please enter amount of players:\n(limited to maximum 10)");
		newGame();
	} else {
		alert("Thank you for playing!");
	}
}

/***
Initialises new game
***/
function newGame(){
	//Corrects player_count if too high or low
    if (player_count > 10) {player_count = 10}
    if (player_count < 1) {player_count = 1}
	
	//Prompts user to start game as Spar Mogens Prügel
	cards.init({table: tab, smp: confirm("Spar mogens prügel?\n(OK for yes, cancel for no)"), acesHigh: true});
	
	//Adds all cards to the deck and renders the deck for the first time.
	deck.addCards(cards.all);
	deck.render({immediate:true});
	
	//Creates all hands and initialises each player as a hand object
	hands = new Array(player_count);
    for (var i = 0; i < player_count; i++){
        hands[i] = new cards.Hand({
		faceUp:true, 
		x:(300/Math.ceil(player_count/2))+((300/Math.ceil(player_count/2))*(Math.floor(i/2))*2), 
		y:350-300*(i % 2)});
		hands[i].sum = 0;
		hands[i].minSum = 0;
		hands[i].wins = 0;
		hands[i].name = prompt("Please enter name of player"+(i+1),"Player"+(i+1))
		hands[i].click(function(card){
		if ((deck.topCard().faceUp == true) && (deck.topCard().suit == 'd' || deck.topCard().suit == 'h') && (((deck.topCard().rank + card.container.minSum) < 26)) || (deck.topCard().rank == 14 && (card.container.minSum+1 < 26))) {
				drawCard(card.container,deck.topCard());
				//Clears hand if hand is full, otherwise update player sum visual
				if (card.container.sum == 25 || card.container.length == 5) {
					clearHand(card.container);
				} else {
					card.container.node.nodeValue=card.container.name +": " + card.container.sum;
				}
				nextTurn();
				}
				checkEnd();
			});
		var hand = hands[i];
		hand.score = document.createElement("p");
		hand.score.parentObject = hand;
		hand.score.id = "hand-"+i;
		hand.score.style.position = "absolute";
		hand.score.style.left = (300/Math.ceil(player_count/2)-30)+((300/Math.ceil(player_count/2))*(Math.floor(i/2))*2)+"px";
		hand.score.style.bottom = 85+180*(i % 2)+"px";
		hand.node = document.createTextNode(hand.name +": "  + hand.sum);
		hand.score.appendChild(hand.node);
		document.getElementById("card-table").appendChild(hand.score);
		hand.score.addEventListener("click", function(){
		if ((deck.topCard().faceUp == true) && (deck.topCard().suit == 'd' || deck.topCard().suit == 'h') && (((deck.topCard().rank + this.parentObject.minSum) < 26)) || (deck.topCard().rank == 14 && this.parentObject.minSum+1 < 26)) {
			drawCard(this.parentObject,deck.topCard());
			deck.render();
			if (this.parentObject.sum == 25 || this.parentObject.length == 5) {
				clearHand(this.parentObject);
			} else {
				this.parentObject.node.nodeValue=this.parentObject.name +": "  + this.parentObject.sum;	
			}
			nextTurn();
			}
			checkEnd()
		});
	hands[0].score.style.color = "red";
	discardpile.render();
	rh.render();
	sm.render();
	}		
};

deck.click(function(card){
	if (card === deck.topCard() && card.faceUp == false) {
		card.showCard();
		card.faceUp = true;
		
		if (card.name == "S11") {
			hands[turncount].wins += 1;
			sm.addCard(card);
			sm.render();
			nextTurn();
			if (!checkEnd()) {return}
		}
		if (card.name == "D12") {
			hands[turncount].wins += 1;
			rh.addCard(card);
			rh.render();
			nextTurn();
			if (!checkEnd()){return}
			
		}
		
		if (card.suit == 'h' || card.suit == 'd') {
			for (var i = 0; i < player_count; i ++) {
				if ((hands[i].minSum + card.rank <= 25) || (hands[i].minSum + 1 <= 25 && card.rank == 14)) {
					return
				}
			}
			discardpile.addCard(card);
			discardpile.render();
			deck.render();
		}
	}
	else if (card === deck.topCard() && card.faceUp == true) {
		if (card.suit == 'c' || card.suit == 's') {
			if ((hands[turncount].minSum + card.rank) <= 25 || (hands[turncount].minSum + 1 <= 25 && card.rank == 14)) {
				drawCard(hands[turncount],card);
				if (hands[turncount].sum == 25 || hands[turncount].length == 5) {
					clearHand(hands[turncount]);
				} else {
					hands[turncount].node.nodeValue=hands[turncount].name +": "  + hands[turncount].sum;
				}
				nextTurn();
			}
			else {
				discardpile.addCard(card);
				discardpile.render();
				deck.render();
				nextTurn();
				
			}
		}
	}
	checkEnd();
});

function drawCard(hand, card) {
	if (card.rank == 14) {
		hand.minSum += 1;
	} else {
	hand.minSum += card.rank;	
	}
	if (hand.minSum <= 25 && ((hand.sum + card.rank) > 25)) {
		hand.sum -= 13;
	}
		hand.sum += card.rank;
		hand.addCard(card);
		hand.render();
		deck.render();	
}


function clearHand(hand) {
	while (hand.length > 0) {
		discardpile.addCard(hand.topCard());
		discardpile.render();
		hand.render();	
	}
	hand.sum = 0;
	hand.minSum = 0;
	hand.wins += 1;
	hand.node.nodeValue=hand.name +": "  + hand.sum;
}


function checkEnd() {
	if (deck.length == 0) {endGame(); return true} else {return false}
}

function nextTurn() {
hands[turncount].score.style.color = "black";
turncount += 1;
if (turncount == player_count) {turncount = 0;}
hands[turncount].score.style.color = "red";
}

$('#start').click(function(){
	player_count = document.getElementById('players').value;
	$('#start').hide();
	$('#playtext').hide();
	$('#players').hide();
	newGame();
});



