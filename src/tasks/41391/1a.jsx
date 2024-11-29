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
  easy: 180,
  medium: 120,
  hard: 60,
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateGrid(rows, cols) {
  const numbers = [];
  for (let i = 1; i <= (rows * cols) / 2; i++) {
    numbers.push(i, i);
  }
  return shuffleArray(numbers);
}

function Cell({ value, isRevealed, onClick }) {
  return (
    <button
      className={cn(
        "w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center text-lg font-bold",
        isRevealed ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-200"
      )}
      onClick={onClick}
    >
      {isRevealed ? value : ""}
    </button>
  );
}

function Grid({ grid, revealed, onCellClick }) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${Math.sqrt(grid.length)}, 1fr)`,
      }}
    >
      {grid.map((value, index) => (
        <Cell
          key={index}
          value={value}
          isRevealed={revealed[index]}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
}

function Timer({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return (
    <div className="text-xl font-bold">
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}

function ScoreBoard({ scores }) {
  return (
    <div className="flex justify-between w-full mb-4">
      <div>
        {scores.human.name}: {scores.human.score}
      </div>
      <div>Computer: {scores.computer.score}</div>
    </div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState("setup");
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [difficulty, setDifficulty] = useState("medium");
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [time, setTime] = useState(0);
  const [username, setUsername] = useState("");
  const [scores, setScores] = useState({
    human: { name: "", score: 0 },
    computer: { name: "Computer", score: 0 },
  });
  const [currentPlayer, setCurrentPlayer] = useState("human");

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer);
            setGameState("gameover");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (currentPlayer === "computer" && gameState === "playing") {
      setTimeout(computerTurn, 1000);
    }
  }, [currentPlayer, gameState]);

  const startGame = () => {
    const newGrid = generateGrid(rows, cols);
    setGrid(newGrid);
    setRevealed(new Array(newGrid.length).fill(false));
    setTime(difficulties[difficulty]);
    setGameState("playing");
    setScores({
      human: { name: username, score: 0 },
      computer: { name: "Computer", score: 0 },
    });
    setCurrentPlayer("human");
  };

  const resetGame = () => {
    setSelectedCells([]);
    setRevealed(new Array(grid.length).fill(false));
    setTime(difficulties[difficulty]);
    setScores({
      human: { name: username, score: 0 },
      computer: { name: "Computer", score: 0 },
    });
    setCurrentPlayer("human");
  };

  const handleCellClick = (index) => {
    if (currentPlayer !== "human" || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    const newSelectedCells = [...selectedCells, index];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length === 2) {
      if (grid[newSelectedCells[0]] === grid[newSelectedCells[1]]) {
        setScores((prevScores) => ({
          ...prevScores,
          human: {
            ...prevScores.human,
            score: prevScores.human.score + 1,
          },
        }));
      } else {
        setTimeout(() => {
          const resetRevealed = [...newRevealed];
          newSelectedCells.forEach((cellIndex) => {
            resetRevealed[cellIndex] = false;
          });
          setRevealed(resetRevealed);
        }, 1000);
      }
      setSelectedCells([]);
      setCurrentPlayer("computer");
    }

    if (newRevealed.every((cell) => cell)) {
      setGameState("gameover");
    }
  };

  const computerTurn = () => {
    const availableCells = revealed
      .map((cell, index) => (cell ? -1 : index))
      .filter((index) => index !== -1);

    if (availableCells.length === 0) {
      setGameState("gameover");
      return;
    }

    const firstCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const newRevealed = [...revealed];
    newRevealed[firstCell] = true;
    setRevealed(newRevealed);

    setTimeout(() => {
      const secondCell = availableCells.find(
        (cell) => cell !== firstCell && grid[cell] === grid[firstCell]
      );

      if (secondCell !== undefined) {
        newRevealed[secondCell] = true;
        setRevealed(newRevealed);
        setScores((prevScores) => ({
          ...prevScores,
          computer: {
            ...prevScores.computer,
            score: prevScores.computer.score + 1,
          },
        }));
      } else {
        const randomSecondCell = availableCells.find((cell) => cell !== firstCell);
        newRevealed[randomSecondCell] = true;
        setRevealed(newRevealed);

        setTimeout(() => {
          newRevealed[firstCell] = false;
          newRevealed[randomSecondCell] = false;
          setRevealed(newRevealed);
        }, 1000);
      }

      setCurrentPlayer("human");
    }, 1000);
  };

  if (gameState === "setup") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Number Matching Puzzle</h1>
        <div className="w-full max-w-xs space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              min="2"
              max="8"
            />
          </div>
          <div>
            <Label htmlFor="cols">Columns</Label>
            <Input
              id="cols"
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
              min="2"
              max="8"
            />
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
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
          <Button onClick={startGame} disabled={!username}>
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Number Matching Puzzle</h1>
      <ScoreBoard scores={scores} />
      <Timer time={time} />
      <div className="mb-4">Current Player: {currentPlayer}</div>
      <Grid grid={grid} revealed={revealed} onCellClick={handleCellClick} />
      {gameState === "gameover" && (
        <div className="mt-4 text-xl font-bold">
          {revealed.every((cell) => cell) ? "You won!" : "Try again!"}
        </div>
      )}
      <div className="mt-4 space-x-2">
        {gameState === "playing" && (
          <Button onClick={resetGame}>Reset Game</Button>
        )}
        <Button
          onClick={() => {
            setGameState("setup");
            resetGame();
          }}
        >
          Restart
        </Button>
      </div>
    </div>
  );
}