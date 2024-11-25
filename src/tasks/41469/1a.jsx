import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const starStages = [
  { id: "nebula", name: "Nebula", color: "bg-purple-500" },
  { id: "protostar", name: "Protostar", color: "bg-blue-500" },
  { id: "mainSequence", name: "Main Sequence", color: "bg-yellow-500" },
  { id: "redGiant", name: "Red Giant", color: "bg-red-500" },
  { id: "supernova", name: "Supernova", color: "bg-orange-500" },
  { id: "blackHole", name: "Black Hole", color: "bg-gray-900" },
];

const stageDescriptions = {
  nebula: "A cloud of gas and dust in space.",
  protostar: "A very young star that is still gathering mass from its parent molecular cloud.",
  mainSequence: "A star that is fusing hydrogen atoms to form helium atoms in its core.",
  redGiant: "A luminous giant star of low or intermediate mass in a late phase of stellar evolution.",
  supernova: "A powerful and luminous stellar explosion.",
  blackHole: "A region of spacetime where gravity is so strong that nothing can escape from it.",
};

const StageCircle = ({ stage, onClick, isActive }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`w-16 h-16 rounded-full ${stage.color} cursor-pointer transition-transform hover:scale-110 ${
            isActive ? "ring-4 ring-white" : ""
          }`}
          onClick={() => onClick(stage.id)}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{stage.name}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const StageInfo = ({ stageId, isOpen, onToggle }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>{starStages.find((s) => s.id === stageId).name}</CardTitle>
      <CardDescription>{stageDescriptions[stageId]}</CardDescription>
    </CardHeader>
    <CardContent>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-2">
            {isOpen ? "Hide Details" : "Learn More"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm">
            Detailed information about the {starStages.find((s) => s.id === stageId).name} stage...
          </p>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
);

const QuizMode = ({ onComplete }) => {
  const [draggedStage, setDraggedStage] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const handleDragStart = (e, stageId) => {
    setDraggedStage(stageId);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedStage === targetId) {
      setCorrectAnswers({ ...correctAnswers, [targetId]: true });
    } else {
      setCorrectAnswers({ ...correctAnswers, [targetId]: false });
    }
    setDraggedStage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isQuizComplete = Object.keys(correctAnswers).length === starStages.length;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Quiz Mode</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {starStages.map((stage) => (
          <div
            key={stage.id}
            className="flex flex-col items-center"
            onDrop={(e) => handleDrop(e, stage.id)}
            onDragOver={handleDragOver}
          >
            <div
              className={`w-16 h-16 rounded-full ${stage.color} border-2 border-dashed border-white flex items-center justify-center`}
            >
              {correctAnswers[stage.id] !== undefined && (
                <span className={correctAnswers[stage.id] ? "text-green-500" : "text-red-500"}>
                  {correctAnswers[stage.id] ? "✓" : "✗"}
                </span>
              )}
            </div>
            <div
              className="mt-2 bg-gray-200 p-2 rounded cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, stage.id)}
            >
              {stage.name}
            </div>
          </div>
        ))}
      </div>
      {isQuizComplete && (
        <Button className="mt-4" onClick={onComplete}>
          Finish Quiz
        </Button>
      )}
    </div>
  );
};

export default function App() {
  const [selectedStage, setSelectedStage] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  const handleStageClick = (stageId) => {
    setSelectedStage(stageId);
    setIsInfoOpen(true);
  };

  const handleQuizComplete = () => {
    setIsQuizMode(false);
    setSelectedStage(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Star Lifecycle Visualization</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {starStages.map((stage) => (
          <StageCircle
            key={stage.id}
            stage={stage}
            onClick={handleStageClick}
            isActive={selectedStage === stage.id}
          />
        ))}
      </div>
      {selectedStage && (
        <StageInfo
          stageId={selectedStage}
          isOpen={isInfoOpen}
          onToggle={() => setIsInfoOpen(!isInfoOpen)}
        />
      )}
      <div className="mt-4">
        <Button onClick={() => setIsQuizMode(!isQuizMode)}>
          {isQuizMode ? "Exit Quiz Mode" : "Enter Quiz Mode"}
        </Button>
      </div>
      {isQuizMode && <QuizMode onComplete={handleQuizComplete} />}
    </div>
  );
}