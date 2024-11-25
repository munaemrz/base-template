import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { id: Date.now(), name: newHabit.trim(), progress: Array(7).fill(false) }]);
      setNewHabit("");
    }
  };

  const toggleDay = (habitId, dayIndex) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, progress: habit.progress.map((val, i) => (i === dayIndex ? !val : val)) }
          : habit
      )
    );
  };

  const resetHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, progress: Array(7).fill(false) } : habit
      )
    );
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
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
            placeholder="Enter habit name"
          />
          <Button className="mt-4" onClick={addHabit}>
            Add Habit
          </Button>
        </CardContent>
      </Card>

      {habits.map((habit) => (
        <Card key={habit.id} className="mt-4">
          <CardHeader>
            <CardTitle>{habit.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day, index) => (
                <Button
                  key={index}
                  variant={habit.progress[index] ? "default" : "outline"}
                  onClick={() => toggleDay(habit.id, index)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => resetHabit(habit.id)}>Reset</Button>
            <Button variant="destructive" onClick={() => deleteHabit(habit.id)}>
              Delete
            </Button>
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
        <h1 className="text-2xl font-bold text-center mb-6">Habit Tracker</h1>
        <HabitTracker />
      </div>
    </div>
  );
}
