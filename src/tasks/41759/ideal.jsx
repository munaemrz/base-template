import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function HabitCard({ habit, onComplete }) {
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.lastCompleted === today;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div>
          <h3 className="text-lg font-bold">{habit.title}</h3>
          <p>{habit.description}</p>
          <p className="text-sm mt-2">Streak: {habit.streak} days</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap mt-2">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const completed = habit.history.includes(dateStr);
            return (
              <div
                key={dateStr}
                className={`w-6 h-6 m-1 rounded ${
                  completed ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            );
          })}
        </div>
        <Button
          onClick={() => onComplete(habit.id)}
          className="mt-4"
          disabled={isCompletedToday}
        >
          {isCompletedToday ? "Completed Today" : "Mark as Done"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ title: "", description: "" });

  const addHabit = () => {
    if (!newHabit.title.trim()) return;
    setHabits([
      ...habits,
      {
        id: Date.now(),
        title: newHabit.title,
        description: newHabit.description,
        streak: 0,
        lastCompleted: null,
        history: [],
      },
    ]);
    setNewHabit({ title: "", description: "" });
  };

  const completeHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split("T")[0];
          const yesterday = getYesterday();
          const isConsecutive = habit.lastCompleted === yesterday;
          return {
            ...habit,
            streak: isConsecutive ? habit.streak + 1 : 1,
            lastCompleted: today,
            history: [...habit.history, today].slice(-30),
          };
        }
        return habit;
      })
    );
  };

  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Habit Streak Tracker</h1>
      <div className="mb-6">
        <Input
          placeholder="Habit title"
          value={newHabit.title}
          onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
          className="mb-2"
        />
        <Input
          placeholder="Habit description"
          value={newHabit.description}
          onChange={(e) =>
            setNewHabit({ ...newHabit, description: e.target.value })
          }
        />
        <Button onClick={addHabit} className="mt-2 w-full">
          Add Habit
        </Button>
      </div>
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onComplete={completeHabit} />
      ))}
    </div>
  );
}
