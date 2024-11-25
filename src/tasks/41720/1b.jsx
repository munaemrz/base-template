import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function WaterIntakeWidget() {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(2000);
  const percentage = Math.min((intake / goal) * 100, 100);

  useEffect(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    const savedGoal = localStorage.getItem('waterGoal');
    if (savedIntake) setIntake(Number(savedIntake));
    if (savedGoal) setGoal(Number(savedGoal));
  }, []);

  useEffect(() => {
    localStorage.setItem('waterIntake', intake);
    localStorage.setItem('waterGoal', goal);
  }, [intake, goal]);

  const addWater = (amount) => {
    setIntake(prev => prev + amount);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <Input 
          type="number" 
          value={intake} 
          onChange={e => setIntake(Number(e.target.value))} 
          placeholder="Current intake (ml)"
          className="w-full sm:w-1/2"
        />
      </div>
      <div>
        <Input 
          type="number" 
          value={goal} 
          onChange={e => setGoal(Number(e.target.value))} 
          placeholder="Set daily goal (ml)"
          className="w-full sm:w-1/2"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => addWater(250)}>Add 250ml</Button>
        <Button onClick={() => addWater(500)}>Add 500ml</Button>
      </div>
      <Progress value={percentage} className="w-full"/>
      <p className="text-center">
        {intake}ml / {goal}ml ({percentage.toFixed(2)}%)
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Water Intake Tracker</h1>
        <WaterIntakeWidget />
      </div>
    </div>
  );
}