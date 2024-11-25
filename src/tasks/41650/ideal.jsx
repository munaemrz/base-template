import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const exercises = [
  { id: 1, name: "Push-ups", duration: 10 },
  { id: 2, name: "Squats", duration: 15 },
  { id: 3, name: "Yoga", duration: 30 },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  const [weeklyPlan, setWeeklyPlan] = useState(() =>
    days.map((day) => ({ day, exercises: [] }))
  );

  const handleAddExercise = (dayIndex, exercise) => {
    setWeeklyPlan((prev) => {
      const newPlan = [...prev];
      newPlan[dayIndex].exercises.push(exercise);
      return newPlan;
    });
  };

  const handleRemoveExercise = (dayIndex, exerciseIndex) => {
    setWeeklyPlan((prev) => {
      const newPlan = [...prev];
      newPlan[dayIndex].exercises.splice(exerciseIndex, 1);
      return newPlan;
    });
  };

  const totalDurations = useMemo(() => {
    return weeklyPlan.map((day) =>
      day.exercises.reduce((total, ex) => total + ex.duration, 0)
    );
  }, [weeklyPlan]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Planner</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Exercises</h2>
          {exercises.map((exercise) => (
            <div key={exercise.id} className="p-2 bg-gray-100 rounded mb-2">
              {exercise.name} ({exercise.duration} min)
              <div className="flex space-x-2 mt-2">
                {days.map((day, dayIndex) => (
                  <Button
                    key={day}
                    size="sm"
                    onClick={() => handleAddExercise(dayIndex, exercise)}
                  >
                    Add to {day}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {weeklyPlan.map((dayPlan, dayIndex) => (
            <Card key={dayPlan.day}>
              <CardHeader>
                <CardTitle>{dayPlan.day}</CardTitle>
              </CardHeader>
              <CardContent>
                {dayPlan.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="p-2 bg-gray-100 rounded mb-2 flex justify-between"
                  >
                    {exercise.name} ({exercise.duration} min)
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="mt-4 font-bold">
                  Total: {totalDurations[dayIndex]} min
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {weeklyPlan.map((dayPlan, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 bg-gray-200 rounded"
            >
              <div className="text-lg font-bold">{dayPlan.day}</div>
              <div>{totalDurations[index]} min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
