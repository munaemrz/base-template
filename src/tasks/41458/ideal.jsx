import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast, ToastProvider } from "@/components/ui/toast";

const MAZE_SIZE = 10;

// Generates a random maze using recursive backtracking
const generateMaze = () => {
    const maze = Array(MAZE_SIZE)
      .fill()
      .map(() => Array(MAZE_SIZE).fill(1));
    const visited = Array(MAZE_SIZE)
      .fill()
      .map(() => Array(MAZE_SIZE).fill(false));
    const stack = [[0, 0]];
    maze[0][0] = 0;
    visited[0][0] = true;
  
    while (stack.length) {
      const [x, y] = stack.pop();
      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ].sort(() => Math.random() - 0.5);
  
      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
  
        if (nx >= 0 && ny >= 0 && nx < MAZE_SIZE && ny < MAZE_SIZE && !visited[ny][nx]) {
          maze[y + dy][x + dx] = 0; // Open the wall between
          maze[ny][nx] = 0;         // Open the new cell
          visited[ny][nx] = true;
          stack.push([nx, ny]);
        }
      }
    }
  
    // Ensure a clear path to the end
    if (maze[MAZE_SIZE - 2][MAZE_SIZE - 1] === 1 && maze[MAZE_SIZE - 1][MAZE_SIZE - 2] === 1) {
      maze[MAZE_SIZE - 2][MAZE_SIZE - 1] = 0;
    }
    maze[MAZE_SIZE - 1][MAZE_SIZE - 1] = 0;
    return maze;
  };
  

// Cell component for rendering maze grid
const Cell = ({ type }) => {
  const cellClass = {
    0: "bg-white",
    1: "bg-gray-800",
    start: "bg-blue-500 rounded-full",
    end: "bg-green-500 rounded-full animate-pulse",
  }[type];

  return <div className={`w-full h-full ${cellClass}`}></div>;
};

export default function App() {
  const [maze, setMaze] = useState(() => generateMaze());
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [toast, setToast] = useState("");

  const resetMaze = useCallback(() => {
    setMaze(generateMaze());
    setPlayerPos([0, 0]);
    setToast("");
  }, []);

  const movePlayer = useCallback(
    (dx, dy) => {
      setPlayerPos(([x, y]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 &&
          newY >= 0 &&
          newX < MAZE_SIZE &&
          newY < MAZE_SIZE &&
          maze[newY][newX] === 0
        ) {
          if (newX === MAZE_SIZE - 1 && newY === MAZE_SIZE - 1) {
            setToast("Congratulations! You escaped the maze!");
          }
          return [newX, newY];
        }
        return [x, y];
      });
    },
    [maze]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Maze Escape Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1 mb-4">
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${x}-${y}`} className="aspect-square">
                  {x === playerPos[0] && y === playerPos[1] ? (
                    <Cell type="start" />
                  ) : x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 ? (
                    <Cell type="end" />
                  ) : (
                    <Cell type={cell} />
                  )}
                </div>
              ))
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button onClick={() => movePlayer(0, -1)}>↑</Button>
            <Button onClick={() => movePlayer(-1, 0)}>←</Button>
            <Button onClick={() => movePlayer(1, 0)}>→</Button>
            <Button onClick={() => movePlayer(0, 1)}>↓</Button>
          </div>
          <Button onClick={resetMaze} className="w-full">
            Reset Maze
          </Button>
          {toast && <ToastProvider><Toast>{toast}</Toast></ToastProvider>}
        </CardContent>
      </Card>
    </div>
  );
}
