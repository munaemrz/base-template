import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const boardCopy = [...board];
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i) => {
    return (
      <button 
        className="w-full h-full border border-gray-300 flex justify-center items-center text-4xl font-bold transition-colors duration-300 hover:bg-gray-100"
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every(Boolean)) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="mb-4 w-96 sm:w-80">
        <CardContent className="p-4">
          <div className="text-center text-2xl mb-4">{status}</div>
          <div className="grid grid-cols-3 gap-2">
            {board.map((_, index) => renderSquare(index))}
          </div>
        </CardContent>
      </Card>
      <Button onClick={restartGame} className="mt-4">Restart Game</Button>
      {winner && 
        <div className="mt-4 text-green-500 animate-pulse">Congratulations to {winner}!</div>}
      {!winner && board.every(Boolean) && 
        <div className="mt-4 text-yellow-500 animate-pulse">Game Over! It's a draw.</div>}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;