import React, { useState, useEffect, useRef } from 'react';

function Timer({ initialSeconds = 0, onFinish }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(intervalRef.current);
      onFinish();
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds, onFinish]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    clearInterval(intervalRef.current);
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return (
    <div className="text-center">
      <div className="text-4xl mb-2">{`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</div>
      <button onClick={toggle} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
    </div>
  );
}

function Interval({ interval, onDelete, onEdit }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <span>{interval.name}</span>
      <span>{interval.duration}s / {interval.rest}s</span>
      <button onClick={() => onEdit(interval)} className="text-blue-500 mr-2">Edit</button>
      <button onClick={() => onDelete(interval)} className="text-red-500">Delete</button>
    </div>
  );
}

export default function App() {
  const [intervals, setIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [newInterval, setNewInterval] = useState({ name: '', duration: 30, rest: 10 });

  const addInterval = () => {
    if (newInterval.name && newInterval.duration > 0 && newInterval.rest >= 0) {
      setIntervals([...intervals, { ...newInterval, id: Date.now() }]);
      setNewInterval({ name: '', duration: 30, rest: 10 });
    }
  };

  const deleteInterval = (intervalToDelete) => {
    setIntervals(intervals.filter(i => i.id !== intervalToDelete.id));
  };

  const startTimer = () => {
    if (intervals.length > 0) setIsRunning(true);
  };

  const handleIntervalFinish = () => {
    if (currentInterval + 1 < intervals.length) {
      setCurrentInterval(currentInterval + 1);
    } else {
      setIsRunning(false);
      setCurrentInterval(0);
    }
  };

  const totalTime = intervals.reduce((acc, curr) => acc + curr.duration + curr.rest, 0) - intervals[intervals.length - 1]?.rest;
  const elapsedTime = intervals.slice(0, currentInterval).reduce((acc, curr) => acc + curr.duration + curr.rest, 0) + (intervals[currentInterval]?.duration - (intervals[currentInterval] ? intervals[currentInterval].duration : 0));

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">Workout Timer</h1>
      <div className="mb-4">
        <input 
          value={newInterval.name} 
          onChange={e => setNewInterval({...newInterval, name: e.target.value})} 
          placeholder="Exercise Name" 
          className="border p-2 mr-2 w-full sm:w-auto"
        />
        <input 
          type="number" 
          value={newInterval.duration} 
          onChange={e => setNewInterval({...newInterval, duration: parseInt(e.target.value)})} 
          placeholder="Duration (s)" 
          className="border p-2 mr-2 w-full sm:w-auto"
        />
        <input 
          type="number" 
          value={newInterval.rest} 
          onChange={e => setNewInterval({...newInterval, rest: parseInt(e.target.value)})} 
          placeholder="Rest (s)" 
          className="border p-2 mr-2 w-full sm:w-auto"
        />
        <button onClick={addInterval} className="bg-green-500 text-white p-2">Add</button>
      </div>
      {intervals.map((interval, index) => (
        <Interval key={interval.id} interval={interval} onDelete={deleteInterval} />
      ))}
      <div className="mt-4">
        {isRunning ? (
          <Timer 
            initialSeconds={intervals[currentInterval].duration} 
            onFinish={handleIntervalFinish} 
          />
        ) : (
          <button onClick={startTimer} disabled={intervals.length === 0} className="bg-green-500 text-white px-4 py-2 rounded w-full">Start Workout</button>
        )}
      </div>
      {isRunning && (
        <div className="mt-4">
          <div>Current: {intervals[currentInterval].name}</div>
          <progress className="w-full" value={elapsedTime} max={totalTime}></progress>
        </div>
      )}
    </div>
  );
}