import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState(null);

  useEffect(() => {
    checkWinner();
  }, [board]);

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const checkWinner = () => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningCombination(lines[i]);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner("draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningCombination(null);
  };

  const renderCell = (index) => {
    const isWinningCell = winningCombination && winningCombination.includes(index);
    return (
      <button
        key={index}
        className={`w-full h-24 text-4xl font-bold border-2 border-gray-300 transition-all duration-300 ease-in-out
          ${board[index] ? "cursor-not-allowed" : "hover:bg-gray-100"}
          ${isWinningCell ? "bg-green-200 animate-pulse" : ""}
        `}
        onClick={() => handleClick(index)}
        disabled={winner || board[index]}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
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
                {winner === "draw" ? "It's a draw!" : `Winner: ${winner}`}
              </p>
            ) : (
              <p className="text-xl font-semibold">Next player: {xIsNext ? "X" : "O"}</p>
            )}
          </div>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            onClick={resetGame}
          >
            Restart Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TicTacToe;