var player_count = 0;
var hands = [];
var deck = new cards.Deck();
discardpile = new cards.Deck({faceUp:true});
sm = new cards.Deck({faceUp:true});
rd = new cards.Deck({faceUp:true});
deck.y -= 100;
discardpile.y -= 100;
discardpile.x += 250;
sm.y -= 100;
sm.x += -250;
rd.y -= 100;
rd.x += -175;

var turncount = 0;
var tab = '#card-table';
var sums = [];

$('#start').click(function() {
	player_count = document.getElementById('players').value;
	hands = new Array(player_count);
	$('#start').hide();
	$('#playtext').hide();
	$('#players').hide();
   cards.init({table: tab});
   deck.addCards(cards.all);
   deck.render({immediate:true});
    var x_offset = 100;
    for (var i = 0; i < player_count; i++){
        hands[i] = new cards.Hand({
		faceUp:true, 
		x:(300/Math.ceil(player_count/2))+((300/Math.ceil(player_count/2))*(Math.floor(i/2))*2), 
		y:350-300*(i % 2)});
        x_offset += 100
		hands[i].sum = 0;
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
				hands[turncount].score.style.color = "black";
				turncount += 1;
				if (turncount == player_count) {turncount = 0;}
				hands[turncount].score.style.color = "red";
				}
			});
		var hand = hands[i];
		hand.score = document.createElement("p");
		hand.score.parentObject = hand;
		hand.score.id = "hand-"+i;
		hand.score.style.position = "absolute";
		hand.score.style.left = (300/Math.ceil(player_count/2)-30)+((300/Math.ceil(player_count/2))*(Math.floor(i/2))*2)+"px";
		hand.score.style.bottom = 85+180*(i % 2)+"px";
		console.log(hand.score.id);
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
			hands[turncount].score.style.color = "black";
			turncount += 1;
			if (turncount == player_count) {turncount = 0;}
			hands[turncount].score.style.color = "red";
			}
		});
	hands[0].score.style.color = "red";
	discardpile.render();
	rd.render();
	sm.render();
	}		
});

deck.click(function(card){
	if (card === deck.topCard() && card.faceUp == false) {
		card.showCard();
		card.faceUp = true;
		
		if (card.name == "S11") {
			sm.addCard(card);
			sm.render();
			return
		}
		if (card.name == "D12") {
			rd.addCard(card);
			rd.render();
			return
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
				console.log(hands[turncount].length);
				deck.render();
				if (hands[turncount].sum == 25 || card.container.length == 5) {
					clearHand(hands[turncount]);
				} else {
					hands[turncount].node.nodeValue=hands[turncount].name +": "  + hands[turncount].sum;
				}
				hands[turncount].score.style.color = "black";
				turncount += 1;
				if (turncount == player_count) {turncount = 0;}
				hands[turncount].score.style.color = "red";
			}
			else {
				discardpile.addCard(card);
				discardpile.render();
				deck.render();
				hands[turncount].score.style.color = "black";
				turncount += 1;
				if (turncount == player_count) {turncount = 0;}
				hands[turncount].score.style.color = "red";
				
			}
		}
	}
});


function clearHand(hand) {
	while (hand.length > 0) {
		console.log(hand.length);
		discardpile.addCard(hand.topCard());
		discardpile.render();
		hand.render();	
	}
	hand.sum = 0;
	hand.node.nodeValue=hand.name +": "  + hand.sum;
}







