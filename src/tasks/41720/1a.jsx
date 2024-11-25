import React, { useState, useEffect } from "react";
import * as Progress from "@radix-ui/react-progress";

const DEFAULT_GOAL = 2000;

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <Progress.Root
      className="relative overflow-hidden bg-gray-200 rounded-full w-full h-6"
      style={{
        transform: "translateZ(0)",
      }}
      value={value}
    >
      <Progress.Indicator
        className="bg-blue-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  );
}

export default function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [intakeInput, setIntakeInput] = useState("");
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [goalInput, setGoalInput] = useState(DEFAULT_GOAL.toString());

  useEffect(() => {
    const savedWaterIntake = localStorage.getItem("waterIntake");
    const savedGoal = localStorage.getItem("goal");
    if (savedWaterIntake) setWaterIntake(parseInt(savedWaterIntake));
    if (savedGoal) {
      setGoal(parseInt(savedGoal));
      setGoalInput(savedGoal);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("waterIntake", waterIntake.toString());
    localStorage.setItem("goal", goal.toString());
  }, [waterIntake, goal]);

  const handleAddWater = (e) => {
    e.preventDefault();
    const intake = parseInt(intakeInput);
    if (!isNaN(intake) && intake > 0) {
      setWaterIntake((prev) => prev + intake);
      setIntakeInput("");
    }
  };

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    const newGoal = parseInt(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
    }
  };

  const progress = Math.min((waterIntake / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Water Intake Tracker</h2>
                <form onSubmit={handleAddWater}>
                  <Input
                    label="Add Water Intake (ml)"
                    value={intakeInput}
                    onChange={(e) => setIntakeInput(e.target.value)}
                    type="number"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Water
                  </button>
                </form>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h3 className="text-xl font-bold mb-2">Progress</h3>
                <ProgressBar value={progress} />
                <p className="text-center">
                  {waterIntake} ml / {goal} ml ({progress.toFixed(1)}%)
                </p>
                <button
                  onClick={() => setWaterIntake(0)}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reset Progress
                </button>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h3 className="text-xl font-bold mb-2">Update Goal</h3>
                <form onSubmit={handleUpdateGoal}>
                  <Input
                    label="Daily Goal (ml)"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    type="number"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Update Goal
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}