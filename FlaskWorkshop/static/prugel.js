player_count = 0;
hands = [];
turncount = 0;
tab = '#card-table';
deck = new cards.Deck();
sm = new cards.Deck({faceUp:true});
rd = new cards.Deck({faceUp:true});
discardpile = new cards.Deck({faceUp:true});
deck.y -= 100;
discardpile.y -= 100;
discardpile.x += 250;
sm.y -= 100;
sm.x += -250;
rd.y -= 100;
rd.x += -175;


function resetGame() {

for (var i = 0; i < player_count; i++) {
	document.getElementById("hand-"+i).remove();
}
	while (discardpile.length > 0) {
		discardpile.removeCard(discardpile.topCard());	
	}
	while (sm.length > 0) {
		sm.removeCard(sm.topCard());
	}
	while (rd.length > 0) {
		rd.removeCard(rd.topCard());
	}
	for (var x = 0; x < player_count; x++) {
		while (hands[x].length > 0) {
			hands[x].removeCard(hands[x].topCard());
		}
	}
	for (var x = 0; x < player_count; x++) {
		hands[x].render();
	}
	cards.cleanTable();
	
player_count = 0;
hands = [];
turncount = 0;
}

$('#start').click(function(){
	player_count = document.getElementById('players').value;
	$('#start').hide();
	$('#playtext').hide();
	$('#players').hide();
	newGame();
});

function endGame() {
	var endString = "";
	endString += "Game over, number of wins:\n";
	for (var i = 0; i < player_count; i++){
		endString += hands[i].name + ": " + hands[i].wins + "\n";
	}
	endString += "Start a new game?";
	if(confirm(endString)) {
		resetGame();
		player_count = prompt("Please enter amount of players:");
		newGame();
	} else {
		alert("Thank you for playing!");
	};
}

function newGame(){
	cards.init({table: tab, smp: confirm("Spar mogens prügel?")});
	deck.addCards(cards.all);
	deck.render({immediate:true});
	hands = new Array(player_count);
    for (var i = 0; i < player_count; i++){
        hands[i] = new cards.Hand({
		faceUp:true, 
		x:(300/Math.ceil(player_count/2))+((300/Math.ceil(player_count/2))*(Math.floor(i/2))*2), 
		y:350-300*(i % 2)});
		hands[i].sum = 0;
		hands[i].wins = 0;
		hands[i].name = prompt("Please enter name of player"+(i+1),"Player"+(i+1))
		hands[i].click(function(card){
			if ((deck.topCard().faceUp == true) && (deck.topCard().suit == 'd' || deck.topCard().suit == 'h') && ((deck.topCard().rank + card.container.sum) < 26)) {
				card.container.sum += deck.topCard().rank;
				card.container.addCard(deck.topCard());
				card.container.render();
				deck.render();
				if (card.container.sum == 25 || card.container.length == 5) {
					clearHand(card.container);
				} else {
					card.container.node.nodeValue=card.container.name +": " + card.container.sum;
				}
				nextTurn();
				}
				checkEnd()
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
		if ((deck.topCard().faceUp == true) && (deck.topCard().suit == 'd' || deck.topCard().suit == 'h') && ((deck.topCard().rank + this.parentObject.sum) < 26)) {
			this.parentObject.sum += deck.topCard().rank;
			this.parentObject.addCard(deck.topCard());
			this.parentObject.render();
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
	rd.render();
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
			rd.addCard(card);
			rd.render();
			nextTurn();
			if (!checkEnd()){return}
			
		}
		
		if (card.suit == 'h' || card.suit == 'd') {
			for (var i = 0; i < player_count; i ++) {
				if ((hands[i].sum + card.rank) <= 25) {
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
			if ((hands[turncount].sum + card.rank) <= 25) {
				hands[turncount].sum += card.rank;
				hands[turncount].addCard(deck.topCard());
				hands[turncount].render();
				deck.render();
				if (hands[turncount].sum == 25 || card.container.length == 5) {
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


function clearHand(hand) {
	while (hand.length > 0) {
		discardpile.addCard(hand.topCard());
		discardpile.render();
		hand.render();	
	}
	hand.sum = 0;
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



