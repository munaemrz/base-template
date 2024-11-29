import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Select, SelectItem } from "@shadcn/ui";

function App() {
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 4 });
  const [difficulty, setDifficulty] = useState('medium');
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'won', 'lost'
  const [grid, setGrid] = useState([]);
  const [visibleCells, setVisibleCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const [username, setUsername] = useState('');
  const [scores, setScores] = useState({ human: 0, computer: 0 });

  const difficulties = {
    easy: 120,
    medium: 90,
    hard: 60,
  };

  const setupGame = () => {
    const totalCells = gridSize.rows * gridSize.cols;
    let numbers = [...Array(totalCells / 2).keys(), ...Array(totalCells / 2).keys()].sort(() => Math.random() - 0.5);
    setGrid(numbers.map((num, index) => ({ value: num, id: index, visible: false })));
    setVisibleCells([]);
    setTimer(difficulties[difficulty]);
    setGameState('playing');
    setScores({ human: 0, computer: 0 });
  };

  const handleCellClick = (id) => {
    if (visibleCells.length >= 2 || gameState !== 'playing') return;

    const newVisible = [...visibleCells, id];
    setVisibleCells(newVisible);

    if (newVisible.length === 2) {
      setTimeout(() => {
        const [first, second] = newVisible;
        if (grid[first].value === grid[second].value) {
          setScores(prev => ({...prev, human: prev.human + 1}));
          if (grid.every(cell => cell.visible)) {
            setGameState('won');
          }
        } else {
          setScores(prev => ({...prev, human: prev.human - 1}));
        }
        setVisibleCells([]);
      }, 500);
    }
  };

  const computerTurn = useCallback(() => {
    if (gameState !== 'playing') return;
    let firstPick, secondPick;
    do {
      firstPick = Math.floor(Math.random() * grid.length);
      secondPick = Math.floor(Math.random() * grid.length);
    } while (grid[firstPick].visible || grid[secondPick].visible || firstPick === secondPick);

    setVisibleCells([firstPick, secondPick]);
    setTimeout(() => {
      if (grid[firstPick].value === grid[secondPick].value) {
        setScores(prev => ({...prev, computer: prev.computer + 1}));
        const updatedGrid = grid.map((cell, i) => 
          i === firstPick || i === secondPick ? { ...cell, visible: true } : cell
        );
        setGrid(updatedGrid);
        if (updatedGrid.every(cell => cell.visible)) {
          setGameState('lost'); // Assuming computer wins if it completes the game
        }
      } else {
        setScores(prev => ({...prev, computer: prev.computer - 1}));
      }
      setVisibleCells([]);
    }, 1000);
  }, [gameState, grid]);

  useEffect(() => {
    let interval = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setGameState('lost');
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      if (visibleCells.length === 0) {
        computerTurn();
      }
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, visibleCells, computerTurn]);

  const resetGame = () => {
    setGameState('setup');
    setGrid([]);
  };

  if (gameState === 'setup') {
    return (
      <div className="flex flex-col items-center p-4 space-y-4 sm:p-8">
        <Input 
          type="text" 
          placeholder="Enter your username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <Input 
          type="number" 
          placeholder="Rows" 
          value={gridSize.rows} 
          onChange={(e) => setGridSize(prev => ({...prev, rows: Number(e.target.value)}))} 
        />
        <Input 
          type="number" 
          placeholder="Columns" 
          value={gridSize.cols} 
          onChange={(e) => setGridSize(prev => ({...prev, cols: Number(e.target.value)}))} 
        />
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </Select>
        <Button onClick={setupGame}>Start Game</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <h1 className="text-xl font-bold">Number Match Puzzle</h1>
      <div className="text-lg">Time Left: {timer} seconds</div>
      <div className="grid grid-cols-{gridSize.cols} gap-2">
        {grid.map((cell) => (
          <div 
            key={cell.id} 
            className={`w-16 h-16 sm:w-20 sm:h-20 border border-gray-300 flex items-center justify-center text-xl font-bold 
                        ${cell.visible ? 'bg-green-200' : 'bg-gray-200 hover:bg-gray-300'} 
                        ${visibleCells.includes(cell.id) ? 'bg-yellow-200' : ''}`}
            onClick={() => handleCellClick(cell.id)}
          >
            {cell.visible || visibleCells.includes(cell.id) ? cell.value : ''}
          </div>
        ))}
      </div>
      <div>
        Score - {username}: {scores.human} | Computer: {scores.computer}
      </div>
      <Button onClick={resetGame}>Reset Game</Button>
      <Button onClick={() => setGameState('setup')}>Restart</Button>
      {gameState !== 'playing' && 
        <div className="mt-4 text-2xl">
          {gameState === 'won' ? `You won, ${username}!` : 'Try again!'}
        </div>
      }
    </div>
  );
}

export default App;