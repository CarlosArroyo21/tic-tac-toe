const GameBoard = function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board);
  };

  const addPlayerMove = (row, col, player) => {
    if (board[row][col] !== null) {
      throw new Error("Invalid move", { cause: "not-empty-cell" });
    }

    board[row][col] = player.symbol;
  };

  return { getBoard, printBoard, addPlayerMove };
};

const Player = function (name, symbol) {
  return { name, symbol };
};

const GameController = function (gameboard, player1, player2) {
  let currentPlayer = player1;

  const switchPlayerTurn = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const getCurrentPlayer = () => currentPlayer;

  const displayPlayerTurn = () => {
    console.log(`${currentPlayer.name}'s turn`);
  };

  const startGame = () => {
    gameboard.printBoard();
    displayPlayerTurn();
  };

  const checkWinnerOrTie = () => {
    const player1Symbol = player1.symbol;
    const player2Symbol = player2.symbol;

    const board = gameboard.getBoard();
    // First lets check if there is a winner
    // within any row
    for (let i = 0; i < board.length; i++) {
      const boardRow = board[i];

      const player1Wins = boardRow.every((cell) => cell === player1Symbol);

      if (player1Wins) {
        return { winner: player1, isTie: false, gameOver: true };
      }

      const player2Wins = boardRow.every((cell) => cell === player2Symbol);

      if (player2Wins) {
        return { winner: player2, isTie: false, gameOver: true };
      }
    }

    // Then check if there is a winner
    // within any column
    for (let i = 0; i < board.length; i++) {
      const boardColumn = board.map((row) => row[i]);

      const player1Wins = boardColumn.every((cell) => cell === player1Symbol);

      if (player1Wins) {
        return { winner: player1, isTie: false, gameOver: true };
      }

      const player2Wins = boardColumn.every((cell) => cell === player2Symbol);

      if (player2Wins) {
        return { winner: player2, isTie: false, gameOver: true };
      }
    }

    // Then check if there is a winner
    // within any diagonal
    const positiveDiagonal = board.map((row, index) => row[index]);
    const negativeDiagonal = board.map(
      (row, index) => row[row.length - index - 1]
    );
    const diagonals = [positiveDiagonal, negativeDiagonal];

    const player1Wins = diagonals.some((diagonal) =>
      diagonal.every((cell) => cell === player1Symbol)
    );

    if (player1Wins) {
      return { winner: player1, isTie: false, gameOver: true };
    }

    const player2Wins = diagonals.some((diagonal) =>
      diagonal.every((cell) => cell === player2Symbol)
    );

    if (player2Wins) {
      return { winner: player2, isTie: false, gameOver: true };
    }

    // Then check if there is a tie
    const isTie = board.every((row) => row.every((cell) => cell !== null));

    if (isTie) {
      return { winner: null, isTie: true, gameOver: true };
    }

    return { winner: null, isTie: false, gameOver: false };
  };

  const makeMove = (row, col) => {
    try {
      gameboard.addPlayerMove(row, col, currentPlayer);

      const { winner, isTie, gameOver } = checkWinnerOrTie();

      if (gameOver) {
        if (isTie) {
          console.log("It's a tie");
        } else {
          console.log(`${winner.name} wins`);
        }

        return { winner, isTie, gameOver };
      }

      switchPlayerTurn();
    } catch (error) {
      if (error.cause === "not-empty-cell") {
        console.log("La celda se encuentra ocupada, elige otra");
        return null;
      }
    }

    gameboard.printBoard();
    displayPlayerTurn();

    return { winner: null, isTie: false, gameOver: false };
  };

  return { getCurrentPlayer, startGame, makeMove };
};

const ticTacToe = (function () {
  const gameBoard = GameBoard();
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  const gameController = GameController(gameBoard, player1, player2);

  return { gameController };
})();

const UiController = function () {
  const startGame = () => {
    const boardElement = document.getElementById("board");

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        
        boardElement.appendChild(cell);
      }
    }

    boardElement.addEventListener('click' , (event) => {
      const cell = event.target;
      
      if (cell.id === "board") return;
      
      const currentPlayer = ticTacToe.gameController.getCurrentPlayer();
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      const moveResult = ticTacToe.gameController.makeMove(row, col);
        
      // If the move is invalid
      if (!moveResult) return;
    
      cell.textContent = currentPlayer.symbol;

      if (moveResult.gameOver) {
        if (moveResult.isTie) {
            alert("It's a tie");
        } else {
            alert(`${moveResult.winner.name} wins`);
        }
      }
    })
  };    

  const makeMove = (row, col) => {
    ticTacToe.gameController.makeMove(row, col);
  };

  return { startGame, makeMove };
};

const uiController = UiController();
uiController.startGame();
