import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const stages = [
  {
    name: "Evaporation",
    description:
      "Evaporation occurs when the sun heats up water in rivers, lakes, or oceans, turning it into vapor that rises into the atmosphere.",
  },
  {
    name: "Condensation",
    description:
      "Condensation happens when water vapor in the air cools down and turns into liquid droplets, forming clouds.",
  },
  {
    name: "Precipitation",
    description:
      "Precipitation occurs when water droplets in clouds become too heavy and fall to the ground as rain, snow, or hail.",
  },
  {
    name: "Collection",
    description:
      "Collection happens when precipitation accumulates in rivers, lakes, and oceans, restarting the water cycle.",
  },
];

const animations = {
  waterUp: {
    animation: "waterUp 2s infinite",
  },
  waterDown: {
    animation: "waterDown 2s infinite",
  },
  cloudForming: {
    animation: "cloudForming 2s infinite",
  },
  collecting: {
    animation: "collecting 2s infinite",
  },
};

const WaterCycleDiagram = ({ currentStage, onStageClick }) => {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-64 mx-auto relative">
      {/* Evaporation */}
      <circle
        cx="150"
        cy="50"
        r="30"
        className={`fill-blue-400 ${
          currentStage === 0 ? "stroke-yellow-500 stroke-[4px]" : ""
        } cursor-pointer`}
        onClick={() => onStageClick(0)}
      />
      <text x="120" y="50" className="text-sm">
        Evaporation
      </text>
      {currentStage === 0 && (
        <g>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={150 + i * 10 - 20}
              cy="100"
              r="5"
              fill="blue"
              style={animations.waterUp}
            />
          ))}
        </g>
      )}
      {/* Condensation */}
      <circle
        cx="50"
        cy="150"
        r="30"
        className={`fill-gray-400 ${
          currentStage === 1 ? "stroke-yellow-500 stroke-[4px]" : ""
        } cursor-pointer`}
        onClick={() => onStageClick(1)}
      />
      <text x="20" y="150" className="text-sm">
        Condensation
      </text>
      {currentStage === 1 && (
        <g>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx="50"
              cy={150 - i * 10 + 30}
              r="5"
              fill="gray"
              style={animations.cloudForming}
            />
          ))}
        </g>
      )}
      {/* Precipitation */}
      <circle
        cx="150"
        cy="250"
        r="30"
        className={`fill-blue-600 ${
          currentStage === 2 ? "stroke-yellow-500 stroke-[4px]" : ""
        } cursor-pointer`}
        onClick={() => onStageClick(2)}
      />
      <text x="120" y="250" className="text-sm">
        Precipitation
      </text>
      {currentStage === 2 && (
        <g>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={150 + i * 10 - 20}
              cy="210"
              r="5"
              fill="blue"
              style={animations.waterDown}
            />
          ))}
        </g>
      )}
      {/* Collection */}
      <circle
        cx="250"
        cy="150"
        r="30"
        className={`fill-green-400 ${
          currentStage === 3 ? "stroke-yellow-500 stroke-[4px]" : ""
        } cursor-pointer`}
        onClick={() => onStageClick(3)}
      />
      <text x="220" y="150" className="text-sm">
        Collection
      </text>
      {currentStage === 3 && (
        <g>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={250 + i * 10 - 20}
              cy="150"
              r="5"
              fill="blue"
              style={animations.collecting}
            />
          ))}
        </g>
      )}
    </svg>
  );
};

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);

  const handleNextStage = () => {
    setCurrentStage((prev) => (prev + 1) % stages.length);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">The Water Cycle</h1>
      <style>
        {`
        @keyframes waterUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes waterDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        @keyframes cloudForming {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes collecting {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1); }
        }
      `}
      </style>
      <WaterCycleDiagram
        currentStage={currentStage}
        onStageClick={(stageIndex) => setCurrentStage(stageIndex)}
      />
      <div className="flex justify-center mt-4">
        <Button onClick={handleNextStage}>Next Stage</Button>
      </div>
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value={stages[currentStage].name}>
          <AccordionTrigger>{stages[currentStage].name}</AccordionTrigger>
          <AccordionContent>
            <p>{stages[currentStage].description}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
