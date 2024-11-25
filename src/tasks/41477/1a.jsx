import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GridCell = ({ x, y, state, toggleBarrier, setStart, setEnd }) => {
  let bgColor = 'bg-slate-200';
  if (state === 'start') bgColor = 'bg-green-500';
  else if (state === 'end') bgColor = 'bg-red-500';
  else if (state === 'barrier') bgColor = 'bg-black';
  else if (state === 'path') bgColor = 'bg-blue-500 animate-pulse';

  return (
    <div 
      className={`w-8 h-8 sm:w-10 sm:h-10 border border-slate-300 ${bgColor} cursor-pointer`}
      onClick={() => {
        if (state === 'empty') toggleBarrier(x, y);
        else if (state === 'empty' || state === 'barrier') {
          if (!setStart(x, y)) setEnd(x, y);
        }
      }}
    ></div>
  );
};

function bfs(grid, start, end) {
  const queue = [{...start, path: [start]}];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === end.x && current.y === end.y) return current.path;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of directions) {
      const nx = current.x + dx, ny = current.y + dy;
      if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10 && grid[nx][ny] !== 'barrier' && !visited.has(`${nx},${ny}`)) {
        queue.push({x: nx, y: ny, path: [...current.path, {x: nx, y: ny}]});
        visited.add(`${nx},${ny}`);
      }
    }
  }
  return null;
}

export default function App() {
  const [grid, setGrid] = useState(() => Array(10).fill().map(() => Array(10).fill('empty')));
  const [start, setStartPoint] = useState(null);
  const [end, setEndPoint] = useState(null);
  const [path, setPath] = useState([]);

  const toggleBarrier = (x, y) => {
    setGrid(prev => {
      const newGrid = [...prev.map(row => [...row])];
      newGrid[x][y] = newGrid[x][y] === 'barrier' ? 'empty' : 'barrier';
      return newGrid;
    });
  };

  const findPath = () => {
    const result = bfs(grid, start, end);
    setPath(result || []);
  };

  const resetGrid = () => {
    setGrid(Array(10).fill().map(() => Array(10).fill('empty')));
    setStartPoint(null);
    setEndPoint(null);
    setPath([]);
  };

  useEffect(() => {
    if (start && end) findPath();
  }, [start, end, grid]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pathfinding Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1 mb-4">
            {grid.flatMap((row, x) => row.map((cell, y) => (
              <GridCell 
                key={`${x}-${y}`} 
                x={x} 
                y={y} 
                state={cell === 'empty' && path.find(p => p.x === x && p.y === y) ? 'path' : cell}
                toggleBarrier={toggleBarrier}
                setStart={() => {
                  if (cell === 'empty' || cell === 'barrier') {
                    setStartPoint({x, y});
                    return true;
                  }
                  return false;
                }}
                setEnd={() => {
                  if (cell === 'empty' || cell === 'barrier') {
                    setEndPoint({x, y});
                    return true;
                  }
                  return false;
                }}
              />
            )))}
          </div>
          {(!path.length && start && end) && <p>No path found!</p>}
          <Button onClick={resetGrid}>Reset Grid</Button>
        </CardContent>
      </Card>
    </div>
  );
}