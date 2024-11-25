import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const difficulties = {
  easy: { mines: 0.1, time: 120 },
  medium: { mines: 0.2, time: 180 },
  hard: { mines: 0.3, time: 240 },
};

function Cell({ value, revealed, flagged, onClick, onContextMenu }) {
  const cellClass = `w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer ${
    revealed ? "bg-gray-200" : "bg-white hover:bg-gray-100"
  }`;

  return (
    <div className={cellClass} onClick={onClick} onContextMenu={onContextMenu}>
      {revealed && value !== 0 && value !== "X" && value}
      {revealed && value === "X" && "💣"}
      {!revealed && flagged && "🚩"}
    </div>
  );
}

function Grid({ grid, revealCell, flagCell }) {
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            value={cell.value}
            revealed={cell.revealed}
            flagged={cell.flagged}
            onClick={() => revealCell(i, j)}
            onContextMenu={(e) => {
              e.preventDefault();
              flagCell(i, j);
            }}
          />
        ))
      )}
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [difficulty, setDifficulty] = useState("easy");
  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState("setup"); // setup, playing, won, lost
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const initializeGrid = () => {
    const newGrid = Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => ({ value: 0, revealed: false, flagged: false }))
      );

    const numMines = Math.floor(rows * cols * difficulties[difficulty].mines);
    let minesPlaced = 0;

    while (minesPlaced < numMines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (newGrid[row][col].value !== "X") {
        newGrid[row][col].value = "X";
        minesPlaced++;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              row + i >= 0 &&
              row + i < rows &&
              col + j >= 0 &&
              col + j < cols &&
              newGrid[row + i][col + j].value !== "X"
            ) {
              newGrid[row + i][col + j].value++;
            }
          }
        }
      }
    }

    setGrid(newGrid);
    setGameState("playing");
    setTime(0);
    setScore(0);
  };

  const revealCell = (row, col) => {
    if (gameState !== "playing") return;

    const newGrid = [...grid];
    if (newGrid[row][col].revealed || newGrid[row][col].flagged) return;

    newGrid[row][col].revealed = true;

    if (newGrid[row][col].value === "X") {
      setGameState("lost");
    } else {
      setScore((prevScore) => prevScore + 1);

      if (newGrid[row][col].value === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              row + i >= 0 &&
              row + i < rows &&
              col + j >= 0 &&
              col + j < cols
            ) {
              revealCell(row + i, col + j);
            }
          }
        }
      }
    }

    setGrid(newGrid);

    if (checkWin(newGrid)) {
      setGameState("won");
    }
  };

  const flagCell = (row, col) => {
    if (gameState !== "playing") return;

    const newGrid = [...grid];
    if (newGrid[row][col].revealed) return;

    newGrid[row][col].flagged = !newGrid[row][col].flagged;
    setGrid(newGrid);
  };

  const checkWin = (grid) => {
    return grid.every((row) =>
      row.every(
        (cell) => cell.revealed || (cell.value === "X" && !cell.revealed)
      )
    );
  };

  const resetGame = () => {
    setGameState("setup");
    setGrid([]);
    setTime(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Puzzle Grid Game</h1>

        {gameState === "setup" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                min="5"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="cols">Columns</Label>
              <Input
                id="cols"
                type="number"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                min="5"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                id="difficulty"
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>
            <Button onClick={initializeGrid}>Start Game</Button>
          </div>
        )}

        {gameState !== "setup" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>Time: {time}s</div>
              <div>Score: {score}</div>
            </div>
            <Grid grid={grid} revealCell={revealCell} flagCell={flagCell} />
            {gameState === "won" && (
              <div className="text-green-600 font-bold">You won!</div>
            )}
            {gameState === "lost" && (
              <div className="text-red-600 font-bold">Try again!</div>
            )}
            <Button onClick={resetGame}>Reset Game</Button>
          </div>
        )}
      </div>
    </div>
  );
}
