import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  { name: 'Evaporation', description: 'Water changes from a liquid to a gas or vapor, entering the atmosphere.' },
  { name: 'Condensation', description: 'Water vapor in the air cools down and condenses back into liquid form, forming clouds.' },
  { name: 'Precipitation', description: 'Water falls back to the earth from the clouds as rain, snow, sleet, or hail.' },
  { name: 'Collection', description: 'Water accumulates in bodies of water or as groundwater when it reaches the surface.' },
];

function WaterDrop({ stage, currentStage, onClick }) {
  const isActive = stage.name === currentStage.name;
  return (
    <div 
      onClick={() => onClick(stage)} 
      className={`cursor-pointer transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-75'} m-4`}
    >
      <svg width="50" height="50" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.238-5-5s2.239-5 5-5 5 2.238 5 5-2.239 5-5 5z" 
          fill={isActive ? '#3b82f6' : '#6b7280'} />
      </svg>
      <p className="text-center text-sm">{stage.name}</p>
    </div>
  );
}

function StageDescription({ stage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mt-4">
      <CardHeader onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <CardTitle>{stage.name}</CardTitle>
      </CardHeader>
      <CardContent className={isOpen ? "block" : "hidden"}>
        <p>{stage.description}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [currentStage, setCurrentStage] = useState(stages[0]);
  const [stageIndex, setStageIndex] = useState(0);

  const handleNextStage = () => {
    let newIndex = stageIndex + 1;
    if (newIndex >= stages.length) newIndex = 0;
    setStageIndex(newIndex);
    setCurrentStage(stages[newIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">The Water Cycle</h1>
      <div className="flex flex-wrap justify-center">
        {stages.map(stage => (
          <WaterDrop 
            key={stage.name} 
            stage={stage} 
            currentStage={currentStage} 
            onClick={setCurrentStage}
          />
        ))}
      </div>
      <StageDescription stage={currentStage} />
      <Button onClick={handleNextStage} className="mt-4">Next Stage</Button>
    </div>
  );
}