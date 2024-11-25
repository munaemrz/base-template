import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem } from "@shadcn/ui";

const DIFFICULTY = {
  easy: { time: 120, grid: 4 },
  medium: { time: 180, grid: 6 },
  hard: { time: 240, grid: 8 },
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateNumbers(size) {
  const numbers = Array.from({ length: (size * size) / 2 }, (_, i) => i + 1);
  return shuffleArray([...numbers, ...numbers]);
}

function Cell({ number, onClick, revealed }) {
  return (
    <Button 
      variant={revealed ? "default" : "ghost"} 
      className={`h-16 w-16 sm:h-20 sm:w-20 justify-center items-center ${revealed ? 'bg-green-200' : ''}`}
      onClick={onClick}
    >
      {revealed ? number : ''}
    </Button>
  );
}

function GameBoard({ size, onEndGame }) {
  const [board, setBoard] = useState([]);
  const [firstPick, setFirstPick] = useState(null);
  const [secondPick, setSecondPick] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    resetBoard();
  }, [size]);

  const resetBoard = () => {
    const numbers = generateNumbers(size);
    setBoard(numbers.map((num, index) => ({ id: index, number: num, revealed: false })));
    setFirstPick(null);
    setSecondPick(null);
    setScore(0);
    setAttempts(0);
  };

  const handleCellClick = (cell) => {
    if (cell.revealed || (firstPick && secondPick)) return;

    const updatedBoard = board.map(c => 
      c.id === cell.id ? { ...c, revealed: true } : c
    );

    if (!firstPick) {
      setFirstPick(cell);
    } else if (!secondPick) {
      setSecondPick(cell);
      setAttempts(attempts + 1);
      if (firstPick.number === cell.number) {
        setScore(score + 10);
        if (updatedBoard.every(c => c.revealed)) {
          onEndGame(true, attempts);
        }
      } else {
        setTimeout(() => {
          setBoard(prev => prev.map(c => 
            c.id === firstPick.id || c.id === cell.id ? { ...c, revealed: false } : c
          ));
          setFirstPick(null);
          setSecondPick(null);
        }, 1000);
        setScore(score - 2);
      }
    }

    setBoard(updatedBoard);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2">
      {board.map(cell => (
        <Cell key={cell.id} number={cell.number} revealed={cell.revealed} onClick={() => handleCellClick(cell)} />
      ))}
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [difficulty, setDifficulty] = useState('easy');
  const [time, setTime] = useState(DIFFICULTY.easy.time);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState({ status: false, won: false, attempts: 0 });

  useEffect(() => {
    setTime(DIFFICULTY[difficulty].time);
  }, [difficulty]);

  useEffect(() => {
    let interval = null;
    if (running && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setRunning(false);
      setGameOver({ status: true, won: false, attempts: 0 });
    }
    return () => clearInterval(interval);
  }, [running, time]);

  const startGame = () => {
    setRunning(true);
    setGameOver({ status: false, won: false, attempts: 0 });
  };

  const handleEndGame = (won, attempts) => {
    setRunning(false);
    setGameOver({ status: true, won, attempts });
  };

  const gridSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Number Match Puzzle</h1>
      {!running && !gameOver.status && (
        <div className="space-y-2">
          <Input type="number" placeholder="Rows" value={rows} onChange={(e) => setRows(Number(e.target.value))} />
          <Input type="number" placeholder="Columns" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
          <Select onValueChange={setDifficulty}>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </Select>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}
      {running && (
        <div>
          <div>Time: {time}s</div>
          <GameBoard size={gridSize} onEndGame={handleEndGame} />
        </div>
      )}
      {gameOver.status && (
        <div>
          {gameOver.won ? `You won! Attempts: ${gameOver.attempts}` : 'Time's up! Try again!'}
          <Button onClick={startGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}