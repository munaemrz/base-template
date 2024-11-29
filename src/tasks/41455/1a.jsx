import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const flowerParts = [
  { id: "petal", name: "Petal", description: "Colorful part that attracts pollinators" },
  { id: "sepal", name: "Sepal", description: "Protects the flower bud before it opens" },
  { id: "stamen", name: "Stamen", description: "Male reproductive part of the flower" },
  { id: "pistil", name: "Pistil", description: "Female reproductive part of the flower" },
  { id: "receptacle", name: "Receptacle", description: "Base of the flower that supports other parts" },
];

const FlowerSVG = ({ onPartClick, highlightedPart }) => (
  <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
    {/* Receptacle */}
    <path
      d="M200 350 Q150 300 150 250 Q150 200 200 200 Q250 200 250 250 Q250 300 200 350 Z"
      fill="#8B4513"
      onClick={() => onPartClick("receptacle")}
      className={cn("cursor-pointer hover:opacity-80", {
        "stroke-2 stroke-blue-500": highlightedPart === "receptacle",
      })}
    />
    {/* Sepals */}
    <path
      d="M180 270 Q150 220 180 170 L220 170 Q250 220 220 270 Z"
      fill="#228B22"
      onClick={() => onPartClick("sepal")}
      className={cn("cursor-pointer hover:opacity-80", {
        "stroke-2 stroke-blue-500": highlightedPart === "sepal",
      })}
    />
    {/* Petals */}
    <path
      d="M200 50 Q150 100 150 150 Q150 200 200 200 Q250 200 250 150 Q250 100 200 50 Z"
      fill="#FF69B4"
      onClick={() => onPartClick("petal")}
      className={cn("cursor-pointer hover:opacity-80", {
        "stroke-2 stroke-blue-500": highlightedPart === "petal",
      })}
    />
    {/* Stamen */}
    <line x1="180" y1="150" x2="180" y2="100" stroke="#FFD700" strokeWidth="4" />
    <circle
      cx="180"
      cy="95"
      r="5"
      fill="#FFD700"
      onClick={() => onPartClick("stamen")}
      className={cn("cursor-pointer hover:opacity-80", {
        "stroke-2 stroke-blue-500": highlightedPart === "stamen",
      })}
    />
    {/* Pistil */}
    <line x1="220" y1="150" x2="220" y2="80" stroke="#9932CC" strokeWidth="4" />
    <path
      d="M215 80 Q220 70 225 80 L225 90 Q220 100 215 90 Z"
      fill="#9932CC"
      onClick={() => onPartClick("pistil")}
      className={cn("cursor-pointer hover:opacity-80", {
        "stroke-2 stroke-blue-500": highlightedPart === "pistil",
      })}
    />
  </svg>
);

const DraggableLabel = ({ part, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, part.id)}
    className="bg-gray-200 p-2 rounded cursor-move mb-2"
  >
    {part.name}
  </div>
);

const QuizMode = ({ onCorrectAnswer, onIncorrectAnswer }) => {
  const [draggedPart, setDraggedPart] = useState(null);
  const [completedParts, setCompletedParts] = useState([]);

  const handleDragStart = (e, partId) => {
    setDraggedPart(partId);
  };

  const handleDrop = (e, targetPart) => {
    e.preventDefault();
    if (draggedPart === targetPart) {
      onCorrectAnswer();
      setCompletedParts([...completedParts, targetPart]);
    } else {
      onIncorrectAnswer();
    }
    setDraggedPart(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center">
      <div className="w-full sm:w-1/2">
        <FlowerSVG
          onPartClick={() => {}}
          highlightedPart={null}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, draggedPart)}
        />
      </div>
      <div className="w-full sm:w-1/2 p-4">
        <h3 className="text-lg font-semibold mb-4">Drag labels to the correct parts:</h3>
        {flowerParts
          .filter((part) => !completedParts.includes(part.id))
          .map((part) => (
            <DraggableLabel key={part.id} part={part} onDragStart={handleDragStart} />
          ))}
      </div>
    </div>
  );
};

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handlePartClick = (partId) => {
    setSelectedPart(flowerParts.find((part) => part.id === partId));
  };

  const handleCorrectAnswer = () => {
    setFeedback({ type: "success", message: "Correct!" });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleIncorrectAnswer = () => {
    setFeedback({ type: "error", message: "Try again!" });
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flower Parts Educational Widget</h1>
      <div className="mb-4">
        <Button onClick={() => setQuizMode(!quizMode)} className="mr-2">
          {quizMode ? "Exit Quiz Mode" : "Enter Quiz Mode"}
        </Button>
      </div>
      {quizMode ? (
        <QuizMode onCorrectAnswer={handleCorrectAnswer} onIncorrectAnswer={handleIncorrectAnswer} />
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center">
          <div className="w-full sm:w-1/2">
            <TooltipProvider>
              {flowerParts.map((part) => (
                <Tooltip key={part.id}>
                  <TooltipTrigger asChild>
                    <g>
                      <FlowerSVG onPartClick={handlePartClick} highlightedPart={selectedPart?.id} />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>{part.name}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <div className="w-full sm:w-1/2 p-4">
            {selectedPart && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{selectedPart.name}</h3>
                  <p>{selectedPart.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      {feedback && (
        <div
          className={cn("fixed bottom-4 right-4 p-4 rounded", {
            "bg-green-500 text-white": feedback.type === "success",
            "bg-red-500 text-white": feedback.type === "error",
          })}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}