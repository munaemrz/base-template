import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

function MealInput({ meal, onChange, onDelete }) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        value={meal}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter meal"
        className="flex-grow"
      />
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

function DayPlanner({ day, meals, onMealChange, onMealDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader className="text-lg font-bold">{day}</CardHeader>
      <CardContent>
        {mealTypes.map((type) => (
          <div key={type} className="mb-2">
            <h4 className="font-medium">{type}</h4>
            <MealInput
              meal={meals[type] || ""}
              onChange={(value) => onMealChange(day, type, value)}
              onDelete={() => onMealDelete(day, type)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WeeklySummary({ mealPlan }) {
  return (
    <Card>
      <CardHeader className="text-lg font-bold">Weekly Summary</CardHeader>
      <CardContent>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4">
            <h3 className="text-md font-medium">{day}</h3>
            {mealTypes.map((type) => (
              <p key={type}>
                <strong>{type}:</strong> {mealPlan[day]?.[type] || "Not planned"}
              </p>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [mealPlan, setMealPlan] = useState({});
  const [view, setView] = useState("planner");

  const handleMealChange = (day, type, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const handleMealDelete = (day, type) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: "" },
    }));
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Meal Planner</h1>
      <div className="flex space-x-2 mb-4">
        <Button onClick={() => setView("planner")} variant={view === "planner" ? "default" : "outline"}>
          Planner
        </Button>
        <Button onClick={() => setView("summary")} variant={view === "summary" ? "default" : "outline"}>
          Summary
        </Button>
      </div>
      {view === "planner" ? (
        daysOfWeek.map((day) => (
          <DayPlanner
            key={day}
            day={day}
            meals={mealPlan[day] || {}}
            onMealChange={handleMealChange}
            onMealDelete={handleMealDelete}
          />
        ))
      ) : (
        <WeeklySummary mealPlan={mealPlan} />
      )}
    </div>
  );
}
