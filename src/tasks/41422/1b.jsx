import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const stages = [
  {
    name: "Evaporation",
    description: "Water turns into vapor due to heat from the sun, rising from oceans, lakes, and land.",
    color: "text-yellow-500",
  },
  {
    name: "Condensation",
    description: "Water vapor cools and forms clouds as it rises in the atmosphere.",
    color: "text-blue-300",
  },
  {
    name: "Precipitation",
    description: "Water falls back to Earth as rain, snow, sleet, or hail when clouds become heavy.",
    color: "text-blue-500",
  },
  {
    name: "Collection",
    description: "Water collects in oceans, lakes, rivers, and underground, ready to start the cycle again.",
    color: "text-green-500",
  },
];

const WaterDroplet = ({ className }) => (
  <svg className={cn("w-4 h-4", className)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L5.5 8.5C2.5 11.5 2.5 16.5 5.5 19.5C8.5 22.5 13.5 22.5 16.5 19.5C19.5 16.5 19.5 11.5 16.5 8.5L12 2Z" />
  </svg>
);

const WaterCycleDiagram = ({ currentStage, onStageClick }) => (
  <div className="relative w-full h-64 bg-sky-100 rounded-lg overflow-hidden">
    {/* Sun */}
    <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400 rounded-full" />

    {/* Ocean */}
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500" />

    {/* Evaporation */}
    <div
      className={cn(
        "absolute bottom-16 left-8 cursor-pointer transition-all",
        currentStage === 0 ? "scale-125" : "scale-100"
      )}
      onClick={() => onStageClick(0)}
    >
      {[...Array(5)].map((_, i) => (
        <WaterDroplet
          key={i}
          className={cn(
            "text-blue-500 absolute animate-bounce",
            `left-${i * 4} bottom-${i * 4}`
          )}
        />
      ))}
    </div>

    {/* Condensation */}
    <div
      className={cn(
        "absolute top-8 left-1/4 w-24 h-12 bg-white rounded-full cursor-pointer transition-all",
        currentStage === 1 ? "scale-125" : "scale-100"
      )}
      onClick={() => onStageClick(1)}
    />

    {/* Precipitation */}
    <div
      className={cn(
        "absolute top-24 right-1/4 cursor-pointer transition-all",
        currentStage === 2 ? "scale-125" : "scale-100"
      )}
      onClick={() => onStageClick(2)}
    >
      {[...Array(5)].map((_, i) => (
        <WaterDroplet
          key={i}
          className={cn(
            "text-blue-500 absolute animate-fall",
            `right-${i * 4} top-${i * 4}`
          )}
        />
      ))}
    </div>

    {/* Collection */}
    <div
      className={cn(
        "absolute bottom-0 right-8 w-24 h-8 bg-blue-700 cursor-pointer transition-all",
        currentStage === 3 ? "scale-125" : "scale-100"
      )}
      onClick={() => onStageClick(3)}
    />
  </div>
);

const StageDescription = ({ stage }) => (
  <div className={cn("p-4 rounded-lg", stage.color)}>
    <h3 className="text-lg font-semibold mb-2">{stage.name}</h3>
    <p>{stage.description}</p>
  </div>
);

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleStageClick = (index) => {
    setCurrentStage(index);
    setIsOpen(true);
  };

  const handleNextStage = () => {
    setCurrentStage((prev) => (prev + 1) % stages.length);
    setIsOpen(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">The Water Cycle</h1>
      <WaterCycleDiagram currentStage={currentStage} onStageClick={handleStageClick} />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isOpen ? "Hide" : "Show"} Stage Description
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <StageDescription stage={stages[currentStage]} />
        </CollapsibleContent>
      </Collapsible>
      <Button onClick={handleNextStage} className="w-full">
        Next Stage
      </Button>
    </div>
  );
}