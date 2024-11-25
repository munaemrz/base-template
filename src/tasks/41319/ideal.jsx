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
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState("setup");

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
    setScore(0);
    setTimeLeft(difficulties[difficulty].timeLimit); // Properly set the timer based on difficulty
    setGameState("playing");
  };

  const handleCellClick = (row, col) => {
    if (gameState !== "playing" || revealed[row][col]) return;

    const updatedRevealed = [...revealed];
    updatedRevealed[row][col] = true;
    setRevealed(updatedRevealed);

    const updatedSelected = [...selected, { row, col }];
    setSelected(updatedSelected);

    if (updatedSelected.length === 2) {
      const [first, second] = updatedSelected;
      if (grid[first.row][first.col] === grid[second.row][second.col]) {
        setScore((prev) => prev + 10);
        if (updatedRevealed.flat().every((cell) => cell)) {
          setGameState("won");
        }
      } else {
        setTimeout(() => {
          updatedRevealed[first.row][first.col] = false;
          updatedRevealed[second.row][second.col] = false;
          setRevealed(updatedRevealed);
          setScore((prev) => Math.max(0, prev - 5));
        }, 1000);
      }
      setSelected([]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Puzzle Grid Game</h1>
      {gameState === "setup" && (
        <div className="space-y-4">
          <Input
            type="number"
            value={gridSize.rows}
            onChange={(e) =>
              setGridSize((prev) => ({ ...prev, rows: +e.target.value }))
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
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}
      {gameState === "playing" && (
        <div>
          <GameGrid
            grid={grid}
            revealed={revealed}
            handleCellClick={handleCellClick}
          />
          <div>Score: {score}</div>
          <div>Time Left: {timeLeft}s</div>
        </div>
      )}
      {gameState === "won" && (
        <div>
          <div className="text-green-600 font-bold text-center mb-4">
            You won!
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
