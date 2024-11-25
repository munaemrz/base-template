import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const stages = [
  {
    title: "Evaporation",
    description: "Water turns into vapor due to heat from the sun.",
    svgPath: "M50 20 Q 70 40 50 60 Q 30 80 50 100",
    color: "text-yellow-400",
  },
  {
    title: "Condensation",
    description: "Water vapor cools and forms clouds.",
    svgPath: "M50 20 Q 30 40 50 60 Q 70 80 50 100",
    color: "text-gray-400",
  },
  {
    title: "Precipitation",
    description: "Water falls from clouds as rain, snow, or hail.",
    svgPath: "M50 20 V 100",
    color: "text-blue-400",
  },
  {
    title: "Collection",
    description: "Water collects in bodies like oceans, lakes, and rivers.",
    svgPath: "M50 20 Q 50 40 50 60 Q 50 80 50 100",
    color: "text-blue-600",
  },
];

const StageDiagram = ({ currentStage, setCurrentStage }) => (
  <div className="flex flex-col items-center space-y-4">
    <svg viewBox="0 0 100 100" className="w-40 h-40">
      <path d={stages[currentStage].svgPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
    </svg>
    <div className="flex space-x-4">
      {stages.map((stage, index) => (
        <button
          key={stage.title}
          onClick={() => setCurrentStage(index)}
          className={`p-2 rounded-full ${index === currentStage ? "bg-blue-100" : ""}`}
        >
          <span className={`w-6 h-6 ${stage.color} block`}>&#9679;</span>
        </button>
      ))}
    </div>
  </div>
);

const StageDetails = ({ currentStage }) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="description">
      <AccordionTrigger>{stages[currentStage].title}</AccordionTrigger>
      <AccordionContent>{stages[currentStage].description}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);

  const handleNextStage = () => {
    setCurrentStage((prev) => (prev + 1) % stages.length);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">The Water Cycle</h1>
      <StageDiagram currentStage={currentStage} setCurrentStage={setCurrentStage} />
      <StageDetails currentStage={currentStage} />
      <div className="mt-4 flex justify-center">
        <Button onClick={handleNextStage}>Next Stage</Button>
      </div>
    </div>
  );
}
