import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

function IntervalInput({ onAddInterval }) {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [rest, setRest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exercise && duration && rest) {
      onAddInterval({ exercise, duration: parseInt(duration), rest: parseInt(rest) });
      setExercise("");
      setDuration("");
      setRest("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Exercise name"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Rest (seconds)"
        value={rest}
        onChange={(e) => setRest(e.target.value)}
      />
      <Button type="submit">Add Interval</Button>
    </form>
  );
}

function Timer({ intervals, onReset }) {
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const totalTime = intervals.reduce((sum, interval) => sum + interval.duration + interval.rest, 0);
  const elapsedTime = intervals.slice(0, currentIntervalIndex).reduce((sum, interval) => sum + interval.duration + interval.rest, 0) + (intervals[currentIntervalIndex]?.duration - timeRemaining);

  useEffect(() => {
    if (intervals.length > 0 && !isRunning) {
      setTimeRemaining(intervals[0].duration);
    }
  }, [intervals]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            if (isResting) {
              setIsResting(false);
              setCurrentIntervalIndex((prevIndex) => {
                if (prevIndex < intervals.length - 1) {
                  return prevIndex + 1;
                } else {
                  setIsRunning(false);
                  return 0;
                }
              });
              return intervals[currentIntervalIndex + 1]?.duration || 0;
            } else {
              setIsResting(true);
              return intervals[currentIntervalIndex].rest;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isResting, intervals, currentIntervalIndex]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentIntervalIndex(0);
    setTimeRemaining(intervals[0]?.duration || 0);
    setIsResting(false);
    onReset();
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="text-2xl font-bold text-center">
        {intervals[currentIntervalIndex]?.exercise || "No exercise"}
      </div>
      <div className="text-xl text-center">
        {isResting ? "Rest" : "Work"}: {timeRemaining}s
      </div>
      <Progress value={(elapsedTime / totalTime) * 100} />
      <div className="flex justify-center space-x-2">
        <Button onClick={isRunning ? handlePause : handleStart}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </Card>
  );
}

export default function App() {
  const [intervals, setIntervals] = useState([]);

  const handleAddInterval = (newInterval) => {
    setIntervals([...intervals, newInterval]);
  };

  const handleReset = () => {
    setIntervals([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Workout Timer</h1>
        <IntervalInput onAddInterval={handleAddInterval} />
        <Timer intervals={intervals} onReset={handleReset} />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Workout Plan</h2>
          {intervals.map((interval, index) => (
            <Card key={index} className="p-2">
              <div className="font-medium">{interval.exercise}</div>
              <div className="text-sm text-gray-600">
                Work: {interval.duration}s, Rest: {interval.rest}s
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}