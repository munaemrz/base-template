import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const starStages = [
  { id: "nebula", name: "Nebula", description: "A cloud of gas and dust in space.", color: "purple" },
  { id: "protostar", name: "Protostar", description: "The star's earliest formation stage.", color: "blue" },
  { id: "mainSequence", name: "Main Sequence", description: "The star spends most of its life here.", color: "yellow" },
  { id: "redGiant", name: "Red Giant", description: "The star expands as it runs out of fuel.", color: "red" },
  { id: "supernova", name: "Supernova", description: "A powerful stellar explosion.", color: "orange" },
  { id: "blackHole", name: "Black Hole", description: "The remnants of a massive star.", color: "black" },
];

const StageCircle = ({ stage, onClick, isActive }) => (
  <TooltipProvider><Tooltip content={stage.description}>
    <div
      className={`w-16 h-16 rounded-full bg-${stage.color} cursor-pointer ${
        isActive ? "ring-4 ring-white" : ""
      } hover:opacity-80 transition-transform`}
      onClick={() => onClick(stage)}
    />
  </Tooltip>
  </TooltipProvider>
);

const QuizMode = ({ stages, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  const handleDrop = (e, stageId) => {
    const draggedStage = e.dataTransfer.getData("text");
    setAnswers((prev) => ({ ...prev, [stageId]: draggedStage }));
    setFeedback((prev) => ({
      ...prev,
      [stageId]: draggedStage === stageId,
    }));
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onDrop={(e) => handleDrop(e, stage.id)}
            onDragOver={(e) => e.preventDefault()}
            className={`p-4 border-2 ${
              feedback[stage.id] === true
                ? "border-green-500"
                : feedback[stage.id] === false
                ? "border-red-500"
                : "border-dashed border-gray-300"
            } rounded`}
          >
            {answers[stage.id] || "Drop Here"}
          </div>
        ))}
      </div>
      <Button onClick={onComplete} className="mt-4">
        Finish Quiz
      </Button>
    </div>
  );
};

export default function App() {
  const [selectedStage, setSelectedStage] = useState(null);
  const [quizMode, setQuizMode] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Star Lifecycle Explorer</h1>
      {!quizMode ? (
        <div className="flex flex-wrap justify-center gap-4">
          {starStages.map((stage) => (
            <StageCircle
              key={stage.id}
              stage={stage}
              onClick={setSelectedStage}
              isActive={selectedStage?.id === stage.id}
            />
          ))}
        </div>
      ) : (
        <QuizMode
          stages={starStages}
          onComplete={() => setQuizMode(false)}
        />
      )}
      <Button onClick={() => setQuizMode(!quizMode)} className="mt-4">
        {quizMode ? "Exit Quiz Mode" : "Enter Quiz Mode"}
      </Button>
      {selectedStage && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{selectedStage.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{selectedStage.description}</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
