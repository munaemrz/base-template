import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components
const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Main App component
export default function App() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ title: "", description: "" });

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabit.title.trim() === "") return;
    setHabits([
      ...habits,
      {
        ...newHabit,
        id: Date.now(),
        streak: 0,
        lastCompleted: null,
        history: [],
      },
    ]);
    setNewHabit({ title: "", description: "" });
  };

  const completeHabit = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split("T")[0];
          const isConsecutive =
            habit.lastCompleted === getPreviousDay(today);
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

  const getPreviousDay = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Habit Streak Tracker</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Habit title"
          value={newHabit.title}
          onChange={(e) =>
            setNewHabit({ ...newHabit, title: e.target.value })
          }
          className="mb-2"
        />
        <Textarea
          placeholder="Habit description"
          value={newHabit.description}
          onChange={(e) =>
            setNewHabit({ ...newHabit, description: e.target.value })
          }
          className="mb-2"
        />
        <Button onClick={addHabit}>Add Habit</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader>
              <CardTitle>{habit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{habit.description}</p>
              <p className="mb-2">Streak: {habit.streak} days</p>
              <Button onClick={() => completeHabit(habit.id)}>
                Complete Today
              </Button>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">30-Day History:</h4>
                <div className="flex flex-wrap">
                  {Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split("T")[0];
                    const completed = habit.history.includes(dateStr);
                    return (
                      <div
                        key={dateStr}
                        className={`w-6 h-6 m-1 rounded-sm ${
                          completed ? "bg-green-500" : "bg-gray-200"
                        }`}
                        title={dateStr}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}