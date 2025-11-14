import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, boardSize }) {
  function handleClick(i) {
    if (calculateWinner(squares, boardSize) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, boardSize);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const cols = [];
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;
      cols.push(
        <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)} 
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {cols}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [boardSize, setBoardSize] = useState(3);
  const [history, setHistory] = useState([Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleTitleClick() {
    window.alert("Wilbert Novelo - 64581");
  }

  function handleBoardSizeChange(newSize) {
    setBoardSize(newSize);
    setHistory([Array(newSize * newSize).fill(null)]);
    setCurrentMove(0);
  }

  function handleReset() {
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game-container"> 
      <h1 className="game-title" onClick={handleTitleClick}>
        Tic Tac Toe
      </h1>
      <div className="board-size-selector">
        <button 
          onClick={() => handleBoardSizeChange(3)}
          className={boardSize === 3 ? 'active' : ''}
        >
          3x3
        </button>
        <button 
          onClick={() => handleBoardSizeChange(4)}
          className={boardSize === 4 ? 'active' : ''}
        >
          4x4
        </button>
        <button 
          onClick={() => handleBoardSizeChange(10)}
          className={boardSize === 10 ? 'active' : ''}
        >
          10x10
        </button>
      </div>
      <div className="game">
        <div className="game-left">
          <button onClick={handleReset} className="reset-button">
            Reiniciar Juego
          </button>
        </div>
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares, boardSize) {
  const winLength = 3;
  const N = boardSize; 

  for (let r = 0; r < N; r++) { 
    for (let c = 0; c < N; c++) { 
      
      const player = squares[r * N + c];
      
      if (!player) {
        continue;
      }

      if (c <= N - winLength) {
        let foundWinner = true;
        for (let k = 1; k < winLength; k++) {
          if (squares[r * N + (c + k)] !== player) {
            foundWinner = false;
            break;
          }
        }
        if (foundWinner) return player;
      }

      if (r <= N - winLength) {
        let foundWinner = true;
        for (let k = 1; k < winLength; k++) {
          if (squares[(r + k) * N + c] !== player) {
            foundWinner = false;
            break;
          }
        }
        if (foundWinner) return player;
      }

      if (r <= N - winLength && c <= N - winLength) {
        let foundWinner = true;
        for (let k = 1; k < winLength; k++) {
          if (squares[(r + k) * N + (c + k)] !== player) {
            foundWinner = false;
            break;
          }
        }
        if (foundWinner) return player;
      }

      if (r <= N - winLength && c >= winLength - 1) {
        let foundWinner = true;
        for (let k = 1; k < winLength; k++) {
          if (squares[(r + k) * N + (c - k)] !== player) {
            foundWinner = false;
            break;
          }
        }
        if (foundWinner) return player;
      }
    }
  }

  return null;
}