import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState([]);

  const calculateWinner = (squares) => {
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
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningCombination([a, b, c]);
        return squares[a];
      }
    }
    return squares.every(Boolean) ? "Draw" : null;
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const gameWinner = calculateWinner(newBoard);
    setWinner(gameWinner);
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningCombination([]);
  };

  const renderCell = (index) => (
    <button
      key={index}
      className={`w-full h-24 text-4xl font-bold border-2 border-gray-300 
        ${winningCombination.includes(index) ? "bg-green-200 animate-pulse" : "hover:bg-gray-100"}
        ${board[index] ? "cursor-not-allowed" : ""}`}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Tic-Tac-Toe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((_, index) => renderCell(index))}
          </div>
          <div className="text-center mb-4">
            {winner ? (
              <p className="text-xl font-semibold">
                {winner === "Draw" ? "It's a draw!" : `Winner: ${winner}`}
              </p>
            ) : (
              <p className="text-xl font-semibold">Next player: {xIsNext ? "X" : "O"}</p>
            )}
          </div>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            onClick={restartGame}
          >
            Restart Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TicTacToe;