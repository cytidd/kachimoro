// machi koro

<script>
var player = {
    num_dice: 1,
    landmarks: {
        city_hall: { active: true, cost: 0 },
        harbor: { active: false, cost: 2 },
        train_station: { active: false, cost: 4 },
        shopping_mall: { active: false, cost: 10 },
        amusement_park: { active: false, cost: 16 },
        moon_tower: { active: false, cost: 22 },
        airport: { active: false, cost: 30 }
    },
    coins: 3,
    cards: [
        { num: [1],     id: "wheat_field",   cost: 1,    color: "blue",      industry: "farm",         value: 1 },
        { num: [2,3],   id: "bakery",        cost: 1,    color: "green",     industry: "shop",         value: 1 }
    ]
}

var cards = [
{ num: [1],       id: "wheat_field",          cost: 1,    color: "blue",      industry: "farm",           value: 1,   supply: 6 },
{ num: [1],       id: "sushi_bar",            cost: 4,    color: "red",       industry: "restaurant",     value: 1,   supply: 6 },
{ num: [2],       id: "ranch",                cost: 1,    color: "blue",      industry: "cow",            value: 1,   supply: 6 },
{ num: [2,3],   id: "bakery",               cost: 1,    color: "green",     industry: "shop",           value: 1,   supply: 6 },
{ num: [3],       id: "cafe",                 cost: 2,    color: "red",       industry: "restaurant",     value: 1,   supply: 6 },
{ num: [4],       id: "flower_orchard",       cost: 2,    color: "blue",      industry: "floral",         value: 1,   supply: 6 },
{ num: [5],       id: "forest",               cost: 3,    color: "blue",      industry: "mech",           value: 1,   supply: 6 },
{ num: [6],       id: "flower_shop",          cost: 1,    color: "green",     industry: "floral",         value: 1,   supply: 6, sources: "floral" },
{ num: [6],       id: "stadium",              cost: 6,    color: "purple",    industry: "",               value: 2,   supply: 6 },
{ num: [7],       id: "pizza_joint",          cost: 1,    color: "red",       industry: "restaurant",     value: 1,   supply: 6,  sources: "cow" },
{ num: [7],       id: "cheese_factory",       cost: 5,    color: "green",     industry: "cow",            value: 1,   supply: 6,  sources: "" },
{ num: [7],       id: "publisher",            cost: 5,    color: "purple",    industry: "",               value: 1,   supply: 6,  sources: ["restaurant, shop"], other_players: true },
{ num: [8],       id: "furniture_factory",    cost: 3,    color: "green",     industry: "mech",           value: 1,   supply: 6,  sources: "mech" },
{ num: [8],       id: "mackeral_boat",        cost: 2,    color: "blue",      industry: "boat",           value: 3,   supply: 6,  sources: "mech", requires: "harbor" },
{ num: [8,9],   id: "tax_office",           cost: 4,    color: "purple",    industry: "",               value: 0.5, supply: 6,  sources: "", other_players: true, minimum_coins: 10 },
{ num: [9,10],  id: "family_restaurant",    cost: 3,    color: "red",       industry: "restaurant",     value: 2,   supply: 6 },
{ num: [10],      id: "apple_orchard",        cost: 3,    color: "green",     industry: "cow",            value: 1,   supply: 6,  sources: "cow" },
{ num: [11,12], id: "fruit_and_vegetable_market", cost: 2,  color: "green",     industry: "factory",    value: 2,   supply: 6,  sources: "restaurant" },
{ num: [12,13], id: "food_warehouse",       cost: 2,    color: "green",     industry: "factory",        value: 2,   supply: 6,  sources: "restaurant" },
{ num: [12,13,14], id: "tuna_boat",         cost: 5,    color: "blue",      industry: "ship",           value: "s", supply: 6, requires: "harbor" }
]

var players = []
var decks = []
var piles = []

function startGame(numPlayers) {
    initPlayers(numPlayers)
    initDecks()
    initPiles()
}

function initPlayers(numPlayers) {
    players = []
    for (var i = 0; i < numPlayers; i++) {
        players.push(player)
    }
}

function initPiles() {
    piles = []
    piles.push([[],[],[],[]])
    piles.push([[],[],[],[]])
    piles.push([[],[]])

    while(canFlip(0)) {
        nextCard(0);
    }
    while(canFlip(1)) {
        nextCard(1);
    }
    while(canFlip(2)) {
        nextCard(2);
    }
}

function initDecks() {
    decks = []
    decks = [[],[],[]]

    var numCards = cards.length;
    for (var i = 0; i < numCards; i++) {
        if (cards[i].num.reduce(getSum) <= 6) {
            for (var n = 0; n < cards[i].supply; n++) {
                decks[0].push(cards[i])
            }            
        }
        else if (cards[i].color.indexOf("purple") < 0) {
            for (var n = 0; n < cards[i].supply; n++) {
                decks[1].push(cards[i])
            }            
        }
        else {
            for (var n = 0; n < cards[i].supply; n++) {
                decks[2].push(cards[i])
            }            
        }
    }

    shuffle(decks[0])
    shuffle(decks[1])
    shuffle(decks[2])
}

function getSum(total, num) {
    return total + num;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function rollDice(numDice) {
    var dice = []
    for (var i = 0; i < numDice; i++) {
        dice += Math.floor(Math.random() * ((6 - 1) + 1) + 1)
    }
    return dice
}

function chooseDice(rollResult) {
    return shift(rollResult)
}

function canFlip(deck) {
    if (decks[deck].length === 0) {
        return false
    }

    // see if there's an open spot in the piles
    for (var i = 0; i < piles[deck].length; i++) {
        if (piles[deck][i].length == 0) {
            return true
        }
    }
      
    return false
}

function nextCard(deck) {
    var card = decks[deck].shift();
    for (var i = 0; i < piles[deck].length; i++) {
        if (piles[deck][i].length > 0) {
            if(piles[deck][i][0].id.indexOf(card.id) >= 0) {
                piles[deck][i].push(card);
            }
        } else {
            piles[deck][i].push(card);
        }
    }
}

</script>
