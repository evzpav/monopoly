const INITIAL_BALANCE = 500;
const GO_FIELD_VALUE = 200;
const RentType = "Rent"
const GoType = "Go"
const UtilityType = "utility"
this.players = [];
this.diceSum = 0;

const boardData = {
    "1": { type: "Go", value: 0 },
    "2": { type: "Rent", value: -30 },
    "3": { type: "utility", value: -20 },
    "4": { type: "utility", value: -20 },
    "5": { type: "Rent", value: -30 },
    "6": { type: "utility", value: -20 },
    "7": { type: "Rent", value: -30 },
    "8": { type: "Rent", value: -30 },
    "9": { type: "Rent", value: -30 },
    "10": { type: "utility", value: -20 },
    "11": { type: "utility", value: -20 },
    "12": { type: "Rent", value: -30 },
    "13": { type: "utility", value: -20 },
    "14": { type: "Rent", value: -30 },
    "15": { type: "Rent", value: -30 },
    "16": { type: "utility", value: -20 }
}
class Player {
    constructor(number, colorClass) {
        this.number = number;
        this.colorClass = colorClass;
        this.balance = INITIAL_BALANCE;
        this.position = 1;
        this.isPlaying = false;
    }

    changePositions(positions) {
        let newPosition = this.position + positions

        if (newPosition > 16) {
            newPosition = newPosition - 16;
            this.changeBalance(GO_FIELD_VALUE)
        }

        this.position = newPosition;
    }

    changeBalance(value) {
        let newBalance = this.balance + value;

        if (newBalance <= 0) {
            this.balance = 0;
            return
        }

        this.balance = newBalance;
    }

}

class PlayerFactory {
    constructor() { }

    createPlayer(number) {
        let colorClass;
        switch (number) {
            case 1:
                colorClass = "primary"
                break;
            case 2:
                colorClass = "secondary"
                break;
            case 3:
                colorClass = "warning"
                break;
            case 4:
                colorClass = "danger"
                break;
            default:
                colorClass = "primary"

        }
        return new Player(number, colorClass)
    }
}


function startGame() {
    console.log("Monopoly started")

    document.getElementById("number_of_players_button").disabled = true

    players.forEach((p) => {
        addPlayerToField(p)
    })
    players[0].isPlaying = true;

    document.getElementById("playBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("instructions_div").innerText = `Now click "PLAY"`
}

function play() {
    const instructionsDiv = document.getElementById("instructions_div")

    document.getElementById("startBtn").disabled = true;
    document.getElementById("dices_div").style.display = "block";

    let { die1, die2 } = rollDice();

    document.getElementById("die1").innerHTML = die1;
    document.getElementById("die2").innerHTML = die2;
    diceSum = die1 + die2;

    document.getElementById("totalDice").innerHTML = diceSum;

    let playerIndex;

    let whoIsPlaying = players.find((p, i) => {
        playerIndex = i;
        return p.isPlaying && p.balance > 0;
    });

    let playersWithpositiveBalance = players.filter(p => p.balance > 0);

    if (playersWithpositiveBalance.length === 1) {
        let winner = playersWithpositiveBalance[0].number
        instructionsDiv.innerText = `Winner is player ${winner}!`
        alert("END OF THE GAME! Winner is player: " + winner)
        return false
    }

    instructionsDiv.innerText = `Player ${whoIsPlaying.number} is playing.`

    movePlayer(whoIsPlaying, diceSum)

    whoIsPlaying.isPlaying = false;

    if (whoIsPlaying.number < players.length) {
        players[++playerIndex].isPlaying = true;
    } else {
        let next = players.find(p => p.balance > 0)
        next.isPlaying = true;
    }

}

function addPlayerToField(player) {
    const playerIcon = document.createElement("span")
    playerIcon.innerHTML = `<span id="player_${player.number}" class="badge badge-${player.colorClass}">${player.number}</span>`
    document.getElementById(`field_${player.position}`).appendChild(playerIcon)
}

function removePlayerFromField(player) {
    const elem = document.getElementById(`player_${player.number}`);
    elem.parentNode.removeChild(elem);
    return false;
}

function movePlayer(player, positions) {
    removePlayerFromField(player)

    player.changePositions(positions)

    player.changeBalance(boardData[player.position + ""].value * positions);

    document.getElementById(`balance_${player.number}`).innerText = player.balance;

    addPlayerToField(player)

}

function rollDice() {
    let die1 = Math.floor(Math.random() * 6) + 1;
    let die2 = Math.floor(Math.random() * 6) + 1;
    return { die1, die2 }
};

function setNumberOfPlayers(num) {
    const playersDiv = document.getElementById("players_balance_div")
    playersDiv.innerHTML = ""

    const playerFactory = new PlayerFactory()
    for (let i = 1; i < num + 1; i++) {
        const playerDiv = document.createElement("div")
        player = playerFactory.createPlayer(i)

        playerDiv.innerHTML = `
        <div class="card" style="width: 14rem;">
            <div class="card-body">
                <h4>Player <span class="badge badge-${player.colorClass}">${player.number}</span></h4>
                <div>Balance:
                <span>$</span> <span id="balance_${player.number}">${player.balance}</span>
                </div>
                         
            </div>
        </div>
        `

        this.players.push(player)
        playersDiv.appendChild(playerDiv)

    }

    document.getElementById("startBtn").disabled = false;
    document.getElementById("instructions_div").innerText = `Please click "START"`

}

window.onload = function () {
    document.getElementById("instructions_div").innerText = `Please select the number of players`
}