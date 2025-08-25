import { useState } from "react";

// Ahora el componente principal es Game
export default function Game() {

  // Guardar estados para saber quién es el siguiente jugador y tener el historial de movimientos
  const [history, setHistory] = useState([Array(9).fill(null)]);
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

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Ir al movimiento #" + move;

    } else {
      description = "Ir al inicio del juego";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} currentMove={currentMove} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// export default function Board() {
function Board({ xIsNext, squares, currentMove, onPlay }) {
  // Almacena el estatus del tablero
  //const [squares, setSquares] = useState(Array(9).fill(null));
  // [null, null, null, null, null, null, null, null, null]

  // Para manejar el click dentro de los cuadrados
  function handleClick(i) {

    // Si el cuadrado ya tiene una letra, o ya ganó alguien
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Para determinar cuando haya un ganador
  const winner = calculateWinner(squares, currentMove);
  let status;

  if (winner) {
    if (winner[0] == 'X' || winner[0] == 'O') {
      status = "Ganador: " + winner;

    } else if (winner[0] == '1') {
      status = "Empate!";
    }


  } else {
    status = "Turno de: " + (xIsNext ? "X" : "O");
  }

  // for para armar el tablero
  let renderedLine = [];
  let renderedSquares = [];


  for(let i = 0; i < 9; i++){
    renderedSquares.push(<Square key={i} value={squares[i]} winner={winner} index={i} onSquareClick={() => handleClick(i)} />);

    if((i+1) % 3 == 0){
      renderedLine.push(<div key={i} className="board-row">{renderedSquares}</div>);
      renderedSquares = [];
    }
  }

  // Para regresar más de un elemento se usa (<> </>)
  return (
    <>
      <div className="status">{status}</div>

      {renderedLine}
    </>
  );
}

function Square({ value, winner, index, onSquareClick }) {
  if (winner) {
    let winnerClass = false;
    for (let i = 0; i < winner[1].length; i++) {
      if (index === winner[1][i]) {
        winnerClass = true;
      }
    }

    return (
      <button className={`square ${winnerClass ? 'square-winner' : ''}`} onClick={onSquareClick}>
        {value}
      </button>
    );

  } else {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }


}

// Calcula cuando hay un ganador
function calculateWinner(squares, currentMove) {
  const lines = [
    // Ganar horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Ganar vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Ganar diagonales
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }

  // Si llega acá y currentMove es == 9, es porque hubo un empate
  if (currentMove == 9) {
    return ['1', '1'];
  }

  return null;
}