import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
      className={cn(
        "w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center text-lg font-bold",
        isRevealed ? "bg-blue-200" : "bg-white hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      {isRevealed ? value : "?"}
    </button>
  );
}

function GameGrid({ grid, revealedCells, onCellClick }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            isRevealed={revealedCells[rowIndex][colIndex]}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [difficulty, setDifficulty] = useState("easy");
  const [grid, setGrid] = useState([]);
  const [revealedCells, setRevealedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState("setup");

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameState("lost");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const generateGrid = () => {
    const numbers = [];
    const maxNumber = difficulties[difficulty].maxNumber;
    for (let i = 1; i <= (rows * cols) / 2; i++) {
      numbers.push(i % maxNumber + 1);
      numbers.push(i % maxNumber + 1);
    }
    numbers.sort(() => Math.random() - 0.5);

    const newGrid = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(numbers[index++]);
      }
      newGrid.push(row);
    }
    return newGrid;
  };

  const startGame = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setRevealedCells(Array(rows).fill().map(() => Array(cols).fill(false)));
    setSelectedCells([]);
    setScore(0);
    setTimeLeft(difficulties[difficulty].timeLimit);
    setGameState("playing");
  };

  const handleCellClick = (row, col) => {
    if (gameState !== "playing" || revealedCells[row][col]) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[row][col] = true;
    setRevealedCells(newRevealedCells);

    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length === 2) {
      const [first, second] = newSelectedCells;
      if (grid[first.row][first.col] === grid[second.row][second.col]) {
        setScore((prevScore) => prevScore + 10);
        if (newRevealedCells.every((row) => row.every((cell) => cell))) {
          setGameState("won");
        }
      } else {
        setTimeout(() => {
          const resetRevealedCells = [...newRevealedCells];
          resetRevealedCells[first.row][first.col] = false;
          resetRevealedCells[second.row][second.col] = false;
          setRevealedCells(resetRevealedCells);
          setScore((prevScore) => Math.max(0, prevScore - 5));
        }, 1000);
      }
      setSelectedCells([]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Number Matching Puzzle</h1>
      {gameState === "setup" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="2"
                max="8"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="cols">Columns</Label>
              <Input
                id="cols"
                type="number"
                min="2"
                max="8"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select onValueChange={setDifficulty} defaultValue={difficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}
      {gameState !== "setup" && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
          </div>
          <GameGrid
            grid={grid}
            revealedCells={revealedCells}
            onCellClick={handleCellClick}
          />
          {gameState === "won" && (
            <div className="text-green-600 font-bold text-center">You won!</div>
          )}
          {gameState === "lost" && (
            <div className="text-red-600 font-bold text-center">Try again!</div>
          )}
          <Button onClick={() => setGameState("setup")}>Reset Game</Button>
        </div>
      )}
    </div>
  );
}