import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";

const GRID_SIZE = 10;
const CELL_TYPES = {
  EMPTY: 0,
  BARRIER: 1,
  START: 2,
  END: 3,
  PATH: 4,
};

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export default function App() {
  const [grid, setGrid] = useState(() =>
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(CELL_TYPES.EMPTY))
  );
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [pathFound, setPathFound] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (start && end) {
      findPath();
    }
  }, [start, end, grid]);

  const toggleCell = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      if (newGrid[row][col] === CELL_TYPES.EMPTY) {
        newGrid[row][col] = CELL_TYPES.BARRIER;
      } else if (newGrid[row][col] === CELL_TYPES.BARRIER) {
        newGrid[row][col] = CELL_TYPES.EMPTY;
      }
      return newGrid;
    });
  };

  const setPoint = (type) => {
    return (row, col) => {
      if (grid[row][col] !== CELL_TYPES.EMPTY) return;
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => [...r]);
        if (type === CELL_TYPES.START) {
          if (start) newGrid[start.row][start.col] = CELL_TYPES.EMPTY;
          setStart({ row, col });
        } else {
          if (end) newGrid[end.row][end.col] = CELL_TYPES.EMPTY;
          setEnd({ row, col });
        }
        newGrid[row][col] = type;
        return newGrid;
      });
    };
  };

  const resetGrid = () => {
    setGrid(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(CELL_TYPES.EMPTY))
    );
    setStart(null);
    setEnd(null);
    setPathFound(false);
    setMessage("");
  };

  const findPath = () => {
    const queue = [[start.row, start.col]];
    const visited = new Set();
    const parent = {};

    while (queue.length > 0) {
      const [row, col] = queue.shift();
      const key = `${row},${col}`;

      if (row === end.row && col === end.col) {
        reconstructPath(parent);
        return;
      }

      if (!visited.has(key)) {
        visited.add(key);

        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          const newKey = `${newRow},${newCol}`;

          if (
            newRow >= 0 &&
            newRow < GRID_SIZE &&
            newCol >= 0 &&
            newCol < GRID_SIZE &&
            grid[newRow][newCol] !== CELL_TYPES.BARRIER &&
            !visited.has(newKey)
          ) {
            queue.push([newRow, newCol]);
            parent[newKey] = key;
          }
        }
      }
    }

    setMessage("No path found!");
    setPathFound(false);
  };

  const reconstructPath = (parent) => {
    let current = `${end.row},${end.col}`;
    const path = [];

    while (current !== `${start.row},${start.col}`) {
      const [row, col] = current.split(",").map(Number);
      path.unshift([row, col]);
      current = parent[current];
    }

    animatePath(path);
  };

  const animatePath = (path) => {
    setPathFound(true);
    path.forEach(([row, col], index) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          if (
            newGrid[row][col] !== CELL_TYPES.START &&
            newGrid[row][col] !== CELL_TYPES.END
          ) {
            newGrid[row][col] = CELL_TYPES.PATH;
          }
          return newGrid;
        });
      }, index * 100);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pathfinding Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 mb-4">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md cursor-pointer transition-all duration-300 ${
                      cell === CELL_TYPES.EMPTY
                        ? "bg-white"
                        : cell === CELL_TYPES.BARRIER
                        ? "bg-gray-800"
                        : cell === CELL_TYPES.START
                        ? "bg-green-500"
                        : cell === CELL_TYPES.END
                        ? "bg-red-500"
                        : "bg-blue-500 animate-pulse"
                    }`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setPoint(CELL_TYPES.START)(rowIndex, colIndex);
                    }}
                    onDoubleClick={() =>
                      setPoint(CELL_TYPES.END)(rowIndex, colIndex)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-4">
            <Button onClick={resetGrid} className="mr-2">
              Reset Grid
            </Button>
          </div>
          <div className="text-center text-sm">
            <p>Click to toggle barriers</p>
            <p>Right-click to set start point</p>
            <p>Double-click to set end point</p>
          </div>
          {message && (
            <Toast variant="destructive" className="mt-4">
              {message}
            </Toast>
          )}
        </CardContent>
      </Card>
    </div>
  );
}