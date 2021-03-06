// Program: tic-tac-toe.js
// Author:  Ron Pulcer
// Date:    March 5, 2019
// Version: Initial version (through Names coding story)

const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

let board = ["1","2","3","4","5","6","7","8","9"];
let players = [
    { player: "X", name: "" },
    { player: "O", name: "" }
];


function printBoard() {
    for(let r=0; r<=2; r++) {
        console.log(" " + board[0+(r*3)] + " | " + board[1+(r*3)] + " | " + board[2+(r*3)] + " ");
        if(r<2) {
            console.log("--- --- ---");
        }
        else {
            console.log("");
        }
    }
}

function rePrompt(idx) {
    console.log("Player " + players[idx].player + " - " + players[idx].name + ", please try again.")
}

function check3Cells(cells, fillChar) {
    let winner = "";
    // console.log(cells);
    if(cells.length == 3) {
        // console.log(
        //     board[cells[0]] + " " +
        //     board[cells[1]] + " " +
        //     board[cells[2]]
        // );
        if(board[cells[0]] == board[cells[1]] && board[cells[0]]== board[cells[2]]) {
            winner = board[cells[0]];
            board[cells[0]] = fillChar;
            board[cells[1]] = fillChar;
            board[cells[2]] = fillChar;
            // Refresh the board with fill character to designate how player won
            printBoard();
        }
    }
    // console.log("Winner is ... " + winner);
    return winner;
}

function check4Winner() {
    let winner = "";
    let win = false;

    // Remember cell # are 0-offset, not as users view cell #.
    winner = check3Cells([0,1,2], '-');
    if(winner != "") {
        congrats(winner);
        win = true;
    }

    if(! win) {
        winner = check3Cells([3,4,5], '-');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([6,7,8], '-');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([0,3,6], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([1,4,7], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([2,5,8], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([0,4,8], '\\');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([2,4,6], '/');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    return win;
}

function congrats(winner) {
    let winIndex = 0;
    if(winner == "O") { winIndex = 1; }
    console.log("CONGRATULATIONS Player " + players[winIndex].player + " - " + players[winIndex].name + ", YOU WON !!!");
}

function computerChoice() {
    let choiceOK = false;
    // Choose random # between 1 and 9
    let choice = 1 + Math.floor(Math.random() * 9);
    while(! choiceOK) {
        console.log("Computer's choice is ... " + choice);
        if(board[choice - 1] == "X" || board[choice - 1] == "O" ) {
            // Try again - cell has already been previously chosen
            choice = 1 + Math.floor(Math.random() * 9);
        }
        else {
            choiceOK = true;
        }
    }

    return choice;
}

start();

async function start() {
    let gameOver = false;
    let turn = 0;
    let computerPlayer = false;
    let answer = "";
    let squareNum = 0;

    // Get user choices and process according to game rules
    // First ask if this game is Person vs. Person or Person vs. Computer
    let prompt1 = "Please select game option:\n1. Person vs. Person\n2. Person vs. Computer\n3. Exit program\n> ";
    let answer1 = await ask(prompt1);
    answer1 = answer1.trim();
    if(answer1 == "3") { process.exit(0); }
    
    // Get user names
    let answer2 = await ask("Player X name? ");
    answer2 = answer2.trim();
    players[0].name = answer2;

    if(answer1 == "2") {
        players[1].name = "COMPUTER";
        computerPlayer = true;
    }
    else {
        answer2 = await ask("Player O name? ");
        answer2 = answer2.trim();
        players[1].name = answer2;
    }

    console.log("\nTic-Tac-Toe Game");
    console.log("----------------");
    console.log("Player X: " + players[0].name);
    console.log("Player O: " + players[1].name + "\n");

    printBoard();
    playerIndex = turn % 2;

    while(! gameOver && turn < 9) {
        console.log("Turn: " + turn);

        if(playerIndex == 1 && computerPlayer) {
            squareNum = computerChoice();
        }
        else {
            answer = await ask(players[playerIndex].name + "'s turn (" + players[playerIndex].player + "): ");
            answer = answer.trim();
            // console.log(answer);
            squareNum = Number.parseInt(answer);
        }

        if(squareNum) {
            if(squareNum >= 1 && squareNum <=9) {
                if(board[squareNum - 1] == "X" || board[squareNum - 1] == "O" ) {
                    console.log("Invalid choice: " + squareNum + " has already been selected.");
                    rePrompt(playerIndex);
                }
                else {
                    board[squareNum - 1] = players[playerIndex].player;
                    printBoard();
                    gameOver = check4Winner();
                    if(! gameOver) {
                        turn++;
                        playerIndex = turn % 2;
                    }
                }
            }
            else {
                console.log("Invalid choice: " + squareNum + " is not in the range of 1 - 9.");
                rePrompt(playerIndex);
            }
        }
        else {
            console.log("Invalid choice: " + answer);
            rePrompt(playerIndex);
        }

        if(! gameOver && turn==9) {
            console.log("STALEMATE - Cat's Game - Nobody Won\n");
        }

    }  // End of Game Over loop

    process.exit(0);
}
