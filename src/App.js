import { useState } from 'react';

import './App.css';

const rowCount = 5, columnCount = 5;

const Square = ({ value, onSquareClick }) => {
  return (
    <button
      className='square'
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

const Board = ({ xIsNext, squares, onPlay }) => {
  const winner = calculateWinner(squares);
  let status;
  status = winner ? `Winner: ${winner}` : `Next: ${xIsNext ? 'X' : 'O'}`;

  const handleClick = i => {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let board = [];
  for (let i = 0; i < rowCount; i++) {
    let row = [];
    for (let j = 0; j < columnCount; j++)
      row = [...row, i * columnCount + j];
    board = [...board, row];
  }
  
  return (
    <div className='board'>
      <div className='status'>
        {status}
      </div>

      {board.map((Row, RowIndex) => (
        <div className='board-row' key={`row-${RowIndex}`}>
          {Row.map((Item) => (
            <Square value={squares[Item]} onSquareClick={() => handleClick(Item)} />
          ))}
        </div>
      ))}
    </div>
  );
}

const Game = () => {
  const [history, setHistory] = useState([Array(rowCount * columnCount).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = nextSquares => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const jumpTo = nextMove => {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    description = move > 0 ? `Go to move #${move}` : 'Go to game start';

    if (move === currentMove)
      return (
        <li key={move}>
          You are at move #{move}
        </li>
      )
    else
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  );
}

function App() {
  return (
    <Game />
  );
}

export default App;

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}