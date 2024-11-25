import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function HabitCard({ habit, onToggle, onReset, onDelete }) {
  const completionPercentage = Math.round(
    (habit.completedDays?.filter(Boolean).length / 7) * 100
  );

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{habit.name}</span>
          <span className="text-sm font-normal">{completionPercentage}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAYS.map((day, index) => (
            <Button
              key={day}
              variant={habit.completedDays[index] ? "default" : "outline"}
              className="p-2 h-auto"
              onClick={() => onToggle(habit.id, index)}
            >
              {day}
            </Button>
          ))}
        </div>
        <Progress value={completionPercentage} className="mb-4" />
        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Reset</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all progress for this habit.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onReset(habit.id)}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this habit.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(habit.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function AddHabitForm({ onAdd }) {
  const [habitName, setHabitName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim());
      setHabitName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter new habit"
          className="flex-grow"
        />
        <Button type="submit">Add Habit</Button>
      </div>
    </form>
  );
}

export default function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name) => {
    setHabits([
      ...habits,
      {
        id: Date.now(),
        name,
        completedDays: Array(7).fill(false),
      },
    ]);
  };

  const toggleHabitDay = (id, dayIndex) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completedDays: habit.completedDays.map((day, index) =>
                index === dayIndex ? !day : day
              ),
            }
          : habit
      )
    );
  };

  const resetHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, completedDays: Array(7).fill(false) }
          : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits?.filter((habit) => habit.id !== id));
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Habit Tracker</h1>
      <AddHabitForm onAdd={addHabit} />
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={toggleHabitDay}
          onReset={resetHabit}
          onDelete={deleteHabit}
        />
      ))}
    </div>
  );
}