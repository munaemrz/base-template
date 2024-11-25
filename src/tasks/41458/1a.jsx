import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MAZE_SIZE = 10;

const generateMaze = () => {
  const maze = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(1));
  const stack = [[0, 0]];
  maze[0][0] = 0;

  while (stack.length) {
    const [x, y] = stack.pop();
    const directions = [
      [0, -1], [0, 1], [-1, 0], [1, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2, ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < MAZE_SIZE && ny < MAZE_SIZE && maze[ny][nx] === 1) {
        maze[y + dy][x + dx] = 0;
        maze[ny][nx] = 0;
        stack.push([nx, ny]);
      }
    }
  }

  maze[MAZE_SIZE - 1][MAZE_SIZE - 1] = 0;
  return maze;
};

const Cell = ({ type }) => {
  const cellClass = type === 1 ? "bg-gray-800" : "bg-white";
  return <div className={`w-full h-full ${cellClass}`}></div>;
};

const Player = () => (
  <div className="w-full h-full bg-blue-500 rounded-full"></div>
);

const Goal = () => (
  <div className="w-full h-full bg-green-500 rounded-full"></div>
);

const ControlButton = ({ onClick, children }) => (
  <Button
    className="w-12 h-12 text-lg font-bold"
    onClick={onClick}
  >
    {children}
  </Button>
);

const MazeGame = () => {
  const [maze, setMaze] = useState(() => generateMaze());
  const [playerPos, setPlayerPos] = useState([0, 0]);

  const resetMaze = useCallback(() => {
    setMaze(generateMaze());
    setPlayerPos([0, 0]);
  }, []);

  const movePlayer = useCallback((dx, dy) => {
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
        return [newX, newY];
      }
      return [x, y];
    });
  }, [maze]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp": movePlayer(0, -1); break;
        case "ArrowDown": movePlayer(0, 1); break;
        case "ArrowLeft": movePlayer(-1, 0); break;
        case "ArrowRight": movePlayer(1, 0); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (playerPos[0] === MAZE_SIZE - 1 && playerPos[1] === MAZE_SIZE - 1) {
      alert("Congratulations! You've escaped the maze!");
      resetMaze();
    }
  }, [playerPos, resetMaze]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Maze Escape Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-1 mb-4">
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className="aspect-square">
                {x === playerPos[0] && y === playerPos[1] ? (
                  <Player />
                ) : x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 ? (
                  <Goal />
                ) : (
                  <Cell type={cell} />
                )}
              </div>
            ))
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div></div>
          <ControlButton onClick={() => movePlayer(0, -1)}>↑</ControlButton>
          <div></div>
          <ControlButton onClick={() => movePlayer(-1, 0)}>←</ControlButton>
          <div></div>
          <ControlButton onClick={() => movePlayer(1, 0)}>→</ControlButton>
          <div></div>
          <ControlButton onClick={() => movePlayer(0, 1)}>↓</ControlButton>
          <div></div>
        </div>
        <Button onClick={resetMaze} className="w-full">
          Reset Maze
        </Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <MazeGame />
    </div>
  );
}