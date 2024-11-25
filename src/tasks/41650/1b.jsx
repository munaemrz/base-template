import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-dnd";

const exercises = [
  { id: "push-ups", name: "Push-ups", duration: 10 },
  { id: "squats", name: "Squats", duration: 15 },
  { id: "yoga", name: "Yoga", duration: 30 },
  // Add more exercises here
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function App() {
  const [weeklyPlan, setWeeklyPlan] = useState(() =>
    days.map((day) => ({ day, exercises: [] }))
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(weeklyPlan);
    const [reorderedItem] = items[result.source.droppableId].exercises.splice(
      result.source.index,
      1
    );
    items[result.destination.droppableId].exercises.splice(
      result.destination.index,
      0,
      reorderedItem
    );

    setWeeklyPlan(items);
  };

  const totalDuration = (dayExercises) => {
    return dayExercises.reduce((acc, curr) => acc + curr.duration, 0);
  };

  const resetPlan = () => {
    setWeeklyPlan(days.map((day) => ({ day, exercises: [] })));
  };

  const ExerciseCard = ({ exercise, index, dayIndex }) => (
    <Draggable draggableId={exercise.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-2">
            <CardContent>
              <CardTitle>{exercise.name}</CardTitle>
              <p>Duration: {exercise.duration} min</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Weekly Workout Planner</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Exercises</h2>
            <Droppable droppableId="exercisesList">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mb-4"
                >
                  {exercises.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      dayIndex={-1}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weeklyPlan.map((dayPlan, dayIndex) => (
              <Droppable key={dayPlan.day} droppableId={dayIndex.toString()}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{dayPlan.day}</CardTitle>
                        <p>Total: {totalDuration(dayPlan.exercises)} min</p>
                      </CardHeader>
                      <CardContent>
                        {dayPlan.exercises.map((exercise, index) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            index={index}
                            dayIndex={dayIndex}
                          />
                        ))}
                        {provided.placeholder}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
      <Button onClick={resetPlan} className="mt-4">
        Reset Plan
      </Button>
    </div>
  );
}

export default App;
