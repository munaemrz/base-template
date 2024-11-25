import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const exercises = [
  { name: "Push-ups", duration: 15 },
  { name: "Squats", duration: 20 },
  { name: "Yoga", duration: 30 },
  { name: "Running", duration: 25 },
  { name: "Plank", duration: 10 },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Exercise = ({ name, duration }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "exercise",
    item: { name, duration },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-gray-100 rounded cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {name} ({duration} min)
    </div>
  );
};

const DayCard = ({ day, exercises, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "exercise",
    drop: (item) => onDrop(day, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);

  return (
    <Card
      ref={drop}
      className={`mb-4 ${isOver ? "border-blue-500" : ""}`}
    >
      <CardHeader>
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent>
        {exercises.map((ex, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{ex.name} ({ex.duration} min)</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(day, index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="mt-4 font-bold">Total: {totalDuration} min</div>
      </CardContent>
    </Card>
  );
};

const WeeklyOverview = ({ schedule }) => {
  const data = {
    labels: days,
    datasets: [
      {
        label: "Total Duration (minutes)",
        data: days.map(
          (day) =>
            schedule[day].reduce((sum, ex) => sum + ex.duration, 0)
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Workout Duration",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default function App() {
  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem("workoutSchedule");
    return savedSchedule
      ? JSON.parse(savedSchedule)
      : Object.fromEntries(days.map((day) => [day, []]));
  });

  useEffect(() => {
    localStorage.setItem("workoutSchedule", JSON.stringify(schedule));
  }, [schedule]);

  const handleDrop = (day, item) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], item],
    }));
  };

  const handleRemove = (day, index) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleReset = () => {
    setSchedule(Object.fromEntries(days.map((day) => [day, []])));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Workout Planner</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>
            {exercises.map((ex) => (
              <Exercise key={ex.name} {...ex} />
            ))}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
            {days.map((day) => (
              <DayCard
                key={day}
                day={day}
                exercises={schedule[day]}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
          <WeeklyOverview schedule={schedule} />
        </div>
        <div className="mt-8">
          <Button onClick={handleReset} variant="destructive">
            Reset Schedule
          </Button>
        </div>
      </div>
    </DndProvider>
  );
}