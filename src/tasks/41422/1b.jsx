import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const WaterCycleStage = ({ title, description, svgPath, isCurrent }) => (
  <div className={`flex items-center justify-center mb-4 ${isCurrent ? 'opacity-100' : 'opacity-50'}`}>
    <svg width="100" height="100" viewBox="0 0 100 100" className="mr-4">
      <path d={svgPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
    </svg>
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  </div>
);

const WaterCycleDescription = ({ stage }) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>{stage.title}</AccordionTrigger>
      <AccordionContent>
        {stage.description}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default function App() {
  const stages = [
    {
      title: 'Evaporation',
      description: 'Water turns into vapor and rises into the air.',
      svgPath: 'M50 20 Q 70 40 50 60 Q 30 80 50 100',
    },
    {
      title: 'Condensation',
      description: 'Water vapor cools and turns back into liquid, forming clouds.',
      svgPath: 'M50 20 Q 30 40 50 60 Q 70 80 50 100',
    },
    {
      title: 'Precipitation',
      description: 'Water falls from the clouds as rain, snow, sleet, or hail.',
      svgPath: 'M50 20 V 100',
    },
    {
      title: 'Collection',
      description: 'Water gathers in oceans, rivers, lakes, or is absorbed into the ground.',
      svgPath: 'M50 20 Q 50 40 50 60 Q 50 80 50 100',
    },
  ];

  const [currentStage, setCurrentStage] = useState(0);

  const handleStageClick = (index) => {
    setCurrentStage(index);
  };

  const nextStage = () => {
    setCurrentStage((prev) => (prev + 1) % stages.length);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">The Water Cycle</h1>
      <div className="w-full max-w-sm">
        {stages.map((stage, index) => (
          <div key={index} onClick={() => handleStageClick(index)}>
            <WaterCycleStage 
              {...stage} 
              isCurrent={index === currentStage} 
            />
          </div>
        ))}
        <WaterCycleDescription stage={stages[currentStage]} />
        <Button onClick={nextStage} className="mt-4 w-full">
          Next Stage
        </Button>
      </div>
    </div>
  );
}