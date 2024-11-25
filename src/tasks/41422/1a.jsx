import React, { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const WaterDroplet = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L5.5 8.5C2.5 11.5 2.5 16.5 5.5 19.5C8.5 22.5 13.5 22.5 16.5 19.5C19.5 16.5 19.5 11.5 16.5 8.5L12 2Z" />
  </svg>
);

const Sun = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Cloud = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const stages = [
  {
    name: "Evaporation",
    description: "Water turns into vapor due to heat from the sun.",
    icon: <Sun className="w-12 h-12 text-yellow-400 animate-pulse" />,
  },
  {
    name: "Condensation",
    description: "Water vapor cools and forms clouds.",
    icon: <Cloud className="w-12 h-12 text-gray-400 animate-bounce" />,
  },
  {
    name: "Precipitation",
    description: "Water falls from clouds as rain, snow, or hail.",
    icon: <WaterDroplet className="w-12 h-12 text-blue-400 animate-bounce" />,
  },
  {
    name: "Collection",
    description: "Water collects in bodies like oceans, lakes, and rivers.",
    icon: <WaterDroplet className="w-12 h-12 text-blue-600" />,
  },
];

const StageIcon = ({ stage, isActive }) => (
  <div className={`p-4 rounded-full ${isActive ? "bg-blue-100" : ""}`}>
    {stage.icon}
  </div>
);

const WaterCycleDiagram = ({ activeStage, setActiveStage }) => (
  <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
    {stages.map((stage, index) => (
      <button
        key={stage.name}
        onClick={() => setActiveStage(index)}
        className="focus:outline-none"
      >
        <StageIcon stage={stage} isActive={index === activeStage} />
      </button>
    ))}
  </div>
);

const StageDescription = ({ stage }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="description">
      <AccordionTrigger>{stage.name}</AccordionTrigger>
      <AccordionContent>{stage.description}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default function App() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNextStage = () => {
    setActiveStage((prev) => (prev + 1) % stages.length);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">The Water Cycle</h1>
      <WaterCycleDiagram activeStage={activeStage} setActiveStage={setActiveStage} />
      <StageDescription stage={stages[activeStage]} />
      <div className="mt-4 text-center">
        <Button onClick={handleNextStage}>Next Stage</Button>
      </div>
    </div>
  );
}