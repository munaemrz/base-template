import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MazeGame = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({x: 0, y: 0});
  const [goalPos, setGoalPos] = useState({x: 9, y: 9});

  const generateMaze = useCallback((width = 10, height = 10) => {
    let newMaze = Array(height).fill().map(() => Array(width).fill(true));
    function carvePath(x, y) {
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      directions.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        let nx = x + dx * 2, ny = y + dy * 2;
        if (0 <= nx && nx < width && 0 <= ny && ny < height && newMaze[ny][nx]) {
          newMaze[y + dy][x + dx] = false;
          newMaze[ny][nx] = false;
          carvePath(nx, ny);
        }
      }
    }

    carvePath(0, 0);
    newMaze[0][0] = false; // Ensure start is open
    newMaze[height - 1][width - 1] = false; // Ensure goal is open
    setMaze(newMaze);
    setPlayerPos({x: 0, y: 0});
    setGoalPos({x: width - 1, y: height - 1});
  }, []);

  useEffect(() => {
    generateMaze();
    const handleKeyDown = (e) => {
      let newPos = { ...playerPos };
      switch(e.key) {
        case 'ArrowUp': if (playerPos.y > 0 && !maze[playerPos.y - 1][playerPos.x]) newPos.y -= 1; break;
        case 'ArrowDown': if (playerPos.y < maze.length - 1 && !maze[playerPos.y + 1][playerPos.x]) newPos.y += 1; break;
        case 'ArrowLeft': if (playerPos.x > 0 && !maze[playerPos.y][playerPos.x - 1]) newPos.x -= 1; break;
        case 'ArrowRight': if (playerPos.x < maze[0].length - 1 && !maze[playerPos.y][playerPos.x + 1]) newPos.x += 1; break;
        default: return;
      }
      setPlayerPos(newPos);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, playerPos, generateMaze]);

  const movePlayer = (dx, dy) => {
    const newPos = {x: playerPos.x + dx, y: playerPos.y + dy};
    if (newPos.x >= 0 && newPos.x < maze[0].length && newPos.y >= 0 && newPos.y < maze.length && !maze[newPos.y][newPos.x]) {
      setPlayerPos(newPos);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Maze Escape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1 mb-4">
            {maze.map((row, y) => row.map((cell, x) => (
              <div key={x + '-' + y} className={`w-6 h-6 ${cell ? 'bg-gray-800' : 'bg-white'} 
                ${x === playerPos.x && y === playerPos.y ? 'bg-blue-500' : ''}
                ${x === goalPos.x && y === goalPos.y ? 'bg-green-500' : ''}
                border border-gray-300`}></div>
            )))}
          </div>
          <div className="flex justify-center space-x-2 mb-2 sm:hidden">
            <Button onClick={() => movePlayer(0, -1)}>↑</Button>
            <div>
              <Button onClick={() => movePlayer(-1, 0)}>←</Button>
              <Button onClick={() => movePlayer(1, 0)}>→</Button>
            </div>
            <Button onClick={() => movePlayer(0, 1)}>↓</Button>
          </div>
          <Button className="w-full" onClick={generateMaze}>Reset Maze</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <MazeGame />;
}