import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const difficulties = {
  easy: { timeLimit: 120, maxNumber: 8 },
  medium: { timeLimit: 90, maxNumber: 12 },
  hard: { timeLimit: 60, maxNumber: 16 },
};

function Cell({ value, isRevealed, onClick }) {
  return (
    <button
      className={`w-12 h-12 border text-center text-lg ${
        isRevealed ? "bg-blue-300" : "bg-gray-100"
      }`}
      onClick={onClick}
    >
      {isRevealed ? value : "?"}
    </button>
  );
}

function GameGrid({ grid, revealed, handleCellClick }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            isRevealed={revealed[rowIndex][colIndex]}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
export default function App() {
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 4 });
  const [difficulty, setDifficulty] = useState("easy");
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [selected, setSelected] = useState([]);
  const [playerScores, setPlayerScores] = useState({ human: 0, computer: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState("setup");
  const [currentPlayer, setCurrentPlayer] = useState("human");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (gameState === "playing") {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setGameState("lost");
      }
    }
    else if(gameState === "setup"){
      setUsername("");
      setSelected([]);
      setPlayerScores({ human: 0, computer: 0 });
      setTimeLeft(difficulties[difficulty].timeLimit);
      setGridSize({ rows: 4, cols: 4 });
      setDifficulty("easy");
    }
  }, [gameState, timeLeft]);

  const generateGrid = () => {
    const maxNumber = difficulties[difficulty].maxNumber;
    const numbers = Array.from(
      { length: (gridSize.rows * gridSize.cols) / 2 },
      (_, i) => (i % maxNumber) + 1
    );
    const shuffledNumbers = [...numbers, ...numbers].sort(
      () => Math.random() - 0.5
    );

    return Array.from({ length: gridSize.rows }, (_, i) =>
      shuffledNumbers.slice(i * gridSize.cols, (i + 1) * gridSize.cols)
    );
  };

  const startGame = () => {
    setGrid(generateGrid());
    setRevealed(
      Array.from({ length: gridSize.rows }, () =>
        Array(gridSize.cols).fill(false)
      )
    );
    setSelected([]);
    setPlayerScores({ human: 0, computer: 0 });
    setTimeLeft(difficulties[difficulty].timeLimit);
    setGameState("playing");
    setCurrentPlayer("human");
  };

  const resetGame = () => {
    // Resets timer, score, and hides all cards
    setRevealed(
      Array.from({ length: gridSize.rows }, () =>
        Array(gridSize.cols).fill(false)
      )
    );
    setSelected([]);
    setPlayerScores({ human: 0, computer: 0 });
    setTimeLeft(difficulties[difficulty].timeLimit);
    setCurrentPlayer("human");
  };

  const handleCellClick = (row, col) => {
    if (
      gameState !== "playing" ||
      revealed[row][col] ||
      currentPlayer !== "human"
    )
      return;

    const updatedRevealed = [...revealed];
    updatedRevealed[row][col] = true;
    setRevealed(updatedRevealed);

    const updatedSelected = [...selected, { row, col }];
    setSelected(updatedSelected);

    if (updatedSelected.length === 2) {
      const [first, second] = updatedSelected;
      if (grid[first.row][first.col] === grid[second.row][second.col]) {
        setPlayerScores((prev) => ({
          ...prev,
          human: prev.human + 10,
        }));
        if (updatedRevealed.flat().every((cell) => cell)) {
          setGameState("won");
        }
      } else {
        setTimeout(() => {
          updatedRevealed[first.row][first.col] = false;
          updatedRevealed[second.row][second.col] = false;
          setRevealed(updatedRevealed);
        }, 1000);
      }
      setSelected([]);
      setCurrentPlayer("computer");
    }
  };

  const computerMove = () => {
    if (gameState !== "playing" || currentPlayer !== "computer") return;

    const unrevealedCells = [];
    revealed.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (!cell) unrevealedCells.push({ row: rowIndex, col: colIndex });
      })
    );

    if (unrevealedCells.length > 0) {
      const [first, second] = unrevealedCells.sort(() => Math.random() - 0.5);
      const updatedRevealed = [...revealed];
      updatedRevealed[first.row][first.col] = true;
      updatedRevealed[second.row][second.col] = true;
      setRevealed(updatedRevealed);

      if (grid[first.row][first.col] === grid[second.row][second.col]) {
        setPlayerScores((prev) => ({
          ...prev,
          computer: prev.computer + 10,
        }));
      } else {
        setTimeout(() => {
          updatedRevealed[first.row][first.col] = false;
          updatedRevealed[second.row][second.col] = false;
          setRevealed(updatedRevealed);
        }, 1000);
      }
      setCurrentPlayer("human");
    }
  };

  useEffect(() => {
    if (currentPlayer === "computer") {
      setTimeout(computerMove, 1000);
    }
  }, [currentPlayer]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      {gameState === "setup" && (
        <div className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Rows"
            value={gridSize.rows}
            onChange={(e) =>
              setGridSize((prev) => ({ ...prev, rows: +e.target.value }))
            }
          />
          <Input
            type="number"
            placeholder="Columns"
            value={gridSize.cols}
            onChange={(e) =>
              setGridSize((prev) => ({ ...prev, cols: +e.target.value }))
            }
          />
          <Select onValueChange={setDifficulty} defaultValue={difficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={startGame}
            disabled={!username.trim()} // Disable button until username is provided
          >
            Start Game
          </Button>
        </div>
      )}
      {gameState === "playing" && (
        <div>
          <GameGrid
            grid={grid}
            revealed={revealed}
            handleCellClick={handleCellClick}
          />
          <div className="flex justify-between mt-4">
            <div>{username}: {playerScores.human}</div>
            <div>Computer: {playerScores.computer}</div>
          </div>
          <div>Time Left: {timeLeft}s</div>
          <div className="flex space-x-4 mt-4">
            <Button onClick={resetGame}>Reset</Button>
            <Button onClick={() => setGameState("setup")}>Restart</Button>
          </div>
        </div>
      )}
      {gameState === "won" && (
        <div>
          <div className="text-green-600 font-bold text-center mb-4">
            {username} won!
          </div>
          <Button onClick={() => setGameState("setup")}>Play Again</Button>
        </div>
      )}
      {gameState === "lost" && (
        <div>
          <div className="text-red-600 font-bold text-center mb-4">
            Try again!
          </div>
          <Button onClick={() => setGameState("setup")}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
