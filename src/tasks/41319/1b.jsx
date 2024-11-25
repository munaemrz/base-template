import React, { useState, useEffect } from "react";

function App() {
  const [gridSize, setGridSize] = useState({ rows: 5, cols: 5 });
  const [difficulty, setDifficulty] = useState("medium");
  const [gameState, setGameState] = useState("setup");
  const [grid, setGrid] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (gameState === "playing") {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [gameState]);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: gridSize.rows }, () =>
      Array(gridSize.cols)
        .fill()
        .map(
          () =>
            Math.random() <
            (difficulty === "easy" ? 0.3 : difficulty === "medium" ? 0.5 : 0.7)
        )
    );
    setGrid(newGrid);
  };

  const startGame = () => {
    initializeGrid();
    setGameState("playing");
    setTimer(0);
    setScore(0);
  };

  const toggleCell = (row, col) => {
    if (gameState !== "playing") return;

    let newScore = score;
    const newGrid = grid.map((r, ri) =>
      r.map((cell, ci) => {
        if (ri === row && ci === col) {
          newScore += cell ? -1 : 1;
          return !cell;
        }
        return cell;
      })
    );
    setGrid(newGrid);
    setScore(newScore);

    if (newScore === gridSize.rows * gridSize.cols) {
      setGameState("won");
      clearInterval(intervalId);
    }
  };

  const resetGame = () => {
    setGameState("setup");
    setTimer(0);
    setScore(0);
    clearInterval(intervalId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Puzzle Grid Game</h1>
      {gameState === "setup" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grid Size:
            </label>
            <input
              type="number"
              value={gridSize.rows}
              onChange={(e) =>
                setGridSize((prev) => ({
                  ...prev,
                  rows: parseInt(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              value={gridSize.cols}
              onChange={(e) =>
                setGridSize((prev) => ({
                  ...prev,
                  cols: parseInt(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState !== "setup" && (
        <div className="w-full max-w-sm">
          <div className="mb-4 flex justify-between">
            <span>Time: {timer}s</span>
            <span>Score: {score}</span>
          </div>
          <div
            className="grid grid-cols-5 gap-1"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
              aspectRatio: `${gridSize.cols} / ${gridSize.rows}`,
            }}
          >
            {grid.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`h-full aspect-square cursor-pointer border-2 border-gray-300 ${
                    cell ? "bg-green-500" : "bg-red-500"
                  } hover:opacity-75`}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                ></div>
              ))
            )}
          </div>
          <button
            onClick={resetGame}
            className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
          >
            Reset Game
          </button>
          {gameState === "won" && (
            <p className="mt-2 text-center text-green-600 font-bold">
              You won!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
