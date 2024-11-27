import React, { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

function MealPlanner() {
  const [meals, setMeals] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: { Breakfast: '', Lunch: '', Dinner: '' } }), {})
  );

  const updateMeal = (day, type, meal) => {
    setMeals(prevMeals => ({
      ...prevMeals,
      [day]: { ...prevMeals[day], [type]: meal }
    }));
  };

  const deleteMeal = (day, type) => {
    updateMeal(day, type, '');
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Weekly Meal Planner</h1>
      {days.map(day => (
        <div key={day} className="mb-8">
          <h2 className="text-xl mb-2">{day}</h2>
          {mealTypes.map(type => (
            <div key={type} className="mb-2">
              <input
                value={meals[day][type]}
                onChange={e => updateMeal(day, type, e.target.value)}
                placeholder={`${type} meal`}
                className="px-3 py-2 border rounded w-full sm:w-1/2"
              />
              {meals[day][type] && (
                <button 
                  onClick={() => deleteMeal(day, type)}
                  className="mt-1 ml-2 text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
      <h2 className="text-xl mt-6 mb-2">Weekly Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {days.map(day => (
          <div key={day} className="border p-2">
            <h3>{day}</h3>
            {mealTypes.map(type => meals[day][type] && (
              <p key={type}>{type}: {meals[day][type]}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <MealPlanner />
    </div>
  );
}