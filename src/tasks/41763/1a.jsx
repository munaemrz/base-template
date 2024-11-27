import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

function MealInput({ value, onChange, onDelete }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        onClick={onDelete}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
      >
        Delete
      </button>
    </div>
  );
}

function DayPlanner({ day, meals, onMealChange, onMealDelete }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{day}</h3>
      {mealTypes.map((mealType) => (
        <div key={mealType} className="space-y-2">
          <h4 className="text-sm font-medium">{mealType}</h4>
          <MealInput
            value={meals[mealType] || ""}
            onChange={(value) => onMealChange(day, mealType, value)}
            onDelete={() => onMealDelete(day, mealType)}
          />
        </div>
      ))}
    </div>
  );
}

function WeeklySummary({ mealPlan }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Weekly Summary</h2>
      {daysOfWeek.map((day) => (
        <div key={day} className="space-y-2">
          <h3 className="text-lg font-semibold">{day}</h3>
          {mealTypes.map((mealType) => (
            <p key={mealType} className="text-sm">
              <span className="font-medium">{mealType}:</span> {mealPlan[day]?.[mealType] || "Not planned"}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [mealPlan, setMealPlan] = useState({});
  const [activeTab, setActiveTab] = useState("planner");

  useEffect(() => {
    const storedMealPlan = localStorage.getItem("mealPlan");
    if (storedMealPlan) {
      setMealPlan(JSON.parse(storedMealPlan));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const handleMealChange = (day, mealType, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }));
  };

  const handleMealDelete = (day, mealType) => {
    setMealPlan((prev) => {
      const updatedDay = { ...prev[day] };
      delete updatedDay[mealType];
      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Meal Planner</h1>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("planner")}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
            activeTab === "planner" ? "bg-primary/90" : ""
          )}
        >
          Planner
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
            activeTab === "summary" ? "bg-primary/90" : ""
          )}
        >
          Summary
        </button>
      </div>
      {activeTab === "planner" ? (
        <div className="space-y-8">
          {daysOfWeek.map((day) => (
            <DayPlanner
              key={day}
              day={day}
              meals={mealPlan[day] || {}}
              onMealChange={handleMealChange}
              onMealDelete={handleMealDelete}
            />
          ))}
        </div>
      ) : (
        <WeeklySummary mealPlan={mealPlan} />
      )}
    </div>
  );
}