import React, { useState } from "react";

// Custom Shadcn-styled Input component
const Input = ({ label, value, onChange, type = "number" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Progress bar component
const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <div
      className="bg-blue-500 h-full rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [inputAmount, setInputAmount] = useState("");

  const handleAddWater = () => {
    const intake = parseInt(inputAmount);
    if (!isNaN(intake) && intake > 0) {
      setWaterIntake((prev) => prev + intake);
      setInputAmount("");
    }
  };

  const handleUpdateGoal = (e) => {
    const newGoal = parseInt(e.target.value);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
    }
  };

  const progress = Math.min((waterIntake / goal) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Water Intake Tracker</h1>
        <Input
          label="Add Water Intake (ml)"
          value={inputAmount}
          onChange={(value) => setInputAmount(value)}
        />
        <button
          onClick={handleAddWater}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
        >
          Add Water
        </button>
        <ProgressBar value={progress} />
        <p className="text-center mt-2">
          {waterIntake} ml / {goal} ml ({progress.toFixed(1)}%)
        </p>
        <Input
          label="Set Daily Goal (ml)"
          value={goal}
          onChange={handleUpdateGoal}
        />
      </div>
    </div>
  );
}
