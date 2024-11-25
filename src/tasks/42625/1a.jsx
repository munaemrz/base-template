import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabit) {
      setHabits([...habits, { name: newHabit, days: Array(7).fill(false) }]);
      setNewHabit('');
    }
  };

  const toggleDay = (habitIndex, dayIndex) => {
    const updatedHabits = habits.map((habit, index) => 
      index === habitIndex ? { 
        ...habit, 
        days: habit.days.map((day, dIndex) => dIndex === dayIndex ? !day : day) 
      } : habit
    );
    setHabits(updatedHabits);
  };

  const resetHabit = (index) => {
    const updatedHabits = habits.map((habit, i) => 
      i === index ? { ...habit, days: Array(7).fill(false) } : habit
    );
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const completionPercentage = (days) => {
    const completed = days.filter(Boolean).length;
    return completed === 0 ? '0%' : `${Math.round((completed / 7) * 100)}%`;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={newHabit} 
            onChange={(e) => setNewHabit(e.target.value)} 
            placeholder="New habit"
            className="mb-2"
          />
          <Button onClick={addHabit}>Add Habit</Button>
        </CardContent>
      </Card>

      {habits.map((habit, index) => (
        <Card key={index} className="mt-4">
          <CardHeader>
            <CardTitle>{habit.name}</CardTitle>
            <CardDescription>{completionPercentage(habit.days)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {habit.days.map((day, dayIndex) => (
                <Button 
                  key={dayIndex} 
                  variant={day ? "default" : "outline"} 
                  onClick={() => toggleDay(index, dayIndex)}
                  className="p-2 text-xs"
                >
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayIndex]}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => deleteHabit(index)}>Delete</Button>
            <Button onClick={() => resetHabit(index)}>Reset</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Habit Tracker</h1>
        <HabitTracker />
      </div>
    </div>
  );
}