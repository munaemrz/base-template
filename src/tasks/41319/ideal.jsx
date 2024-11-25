import React, { useState, useEffect } from "react";

function shuffleArray() {
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // Randomly pick a tile
    [array[i], array[j]] = [array[j], array[i]]; // Swap the tiles
  }
  return array;
}

function Timer({ time, setTime, timerActive }) {
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1); // Increment the time every second
      }, 1000);
    } else {
      clearInterval(interval); // Stop the timer when inactive
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [timerActive]);

  return <p>Time: {time}s</p>;
}

function FilledTile({ index, value, dragStart }) {
  return (
    <div
      id={`place-${index + 1}`} // Corrected here
      className={`shadow w-20 h-20 flex items-center justify-center rounded cursor-pointer ${
        index === value - 1
          ? "bg-gradient-to-r from-pink-500 to-yellow-500"
          : "bg-gray-900"
      }`}
    >
      <p
        id={`tile-${value}`} // Corrected here
        draggable="true"
        onDragStart={dragStart}
        className="text-xl text-white"
      >
        {value}
      </p>
    </div>
  );
}

function EmptyTile({ dragOver, dropped, index }) {
  return (
    <div
      onDragOver={dragOver}
      onDrop={dropped}
      id={`place-${index + 1}`} // Corrected here
      className="bg-gray-900 shadow w-20 h-20 rounded"
    ></div>
  );
}

function App() {
  const [shuffledArray, setShuffledArray] = useState(shuffleArray());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [win, setWin] = useState(false);

  const newGame = () => {
    setMoves(0);
    setTime(0);
    setTimerActive(false);
  };

  useEffect(() => {
    if (moves === 1) setTimerActive(true); // Start the timer when first move is made
    let won = true;
    for (let i = 0; i < shuffledArray.length - 1; i++) {
      const value = shuffledArray[i];
      if (i !== value - 1) {
        won = false;
        break;
      }
    }
    if (won) {
      setWin(true);
      setTimerActive(false); // Stop the timer when game is won
    }
  }, [moves]);

  const dragStart = (e) => e.dataTransfer.setData("tile", e.target.id); // Handle drag start
  const dragOver = (e) => e.preventDefault(); // Allow dropping tiles
  const dropped = (e) => {
    e.preventDefault();
    const tile = e.dataTransfer.getData("tile");
    const oldPlace =
      Number(document.getElementById(tile)?.parentElement?.id.slice(6)) - 1;
    const newPlace = Number(e.target.id.slice(6)) - 1;

    if (
      !(
        Math.abs(oldPlace - newPlace) === 4 ||
        Math.abs(oldPlace - newPlace) === 1
      )
    )
      return;

    const [i, j] = [Math.min(oldPlace, newPlace), Math.max(oldPlace, newPlace)];
    setShuffledArray([
      ...shuffledArray.slice(0, i),
      shuffledArray[j],
      ...shuffledArray.slice(i + 1, j),
      shuffledArray[i],
      ...shuffledArray.slice(j + 1),
    ]);
    setMoves(moves + 1);
  };

  return (
    <div className="h-screen flex text-gray-300 bg-gray-950">
      <div className="mx-auto mt-8">
        {win && (
          <div className="rounded-md border-l-4 border-green-500 bg-green-100 p-2 mb-2">
            <div className="flex items-center justify-center space-x-4">
              <p className="font-medium text-green-600">
                HURRAY!! You have won the game
              </p>
            </div>
          </div>
        )}
        <h1 className="text-3xl text-emerald-600 font-bold text-center">
          15 Puzzle Game
        </h1>
        <div className="flex justify-between px-6 mt-2">
          <p>Moves: {moves}</p>
          <Timer time={time} timerActive={timerActive} setTime={setTime} />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-6 px-6 rounded">
          {shuffledArray.map((value, index) => {
            if (value === "")
              return (
                <EmptyTile
                  dragOver={dragOver}
                  dropped={dropped}
                  index={index}
                />
              );
            return (
              <FilledTile index={index} value={value} dragStart={dragStart} />
            );
          })}
        </div>
        <div className="px-6 mt-4">
          <button
            onClick={newGame}
            className="text-black font-bold block bg-gray-900 p-2 rounded w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
