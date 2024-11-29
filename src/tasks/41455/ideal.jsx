import React, { useState } from "react";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const parts = [
  {
    id: "petal",
    name: "Petal",
    description: "The petals are often brightly colored to attract pollinators.",
  },
  {
    id: "stamen",
    name: "Stamen",
    description:
      "The stamen is the male reproductive part of a flower that produces pollen.",
  },
  {
    id: "pistil",
    name: "Pistil",
    description:
      "The pistil is the female reproductive part of a flower that produces seeds.",
  },
  {
    id: "sepal",
    name: "Sepal",
    description:
      "The sepals are the small leaves under the flower that protect it before it blooms.",
  },
];

const FlowerDiagram = ({ onPartClick }) => {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-64 mx-auto">
      {/* Petal */}
      <TooltipProvider>
        <Tooltip content="Petal">
          <path
            d="M150 50 Q170 90 150 120 Q130 90 150 50"
            fill="#FFB3B3"
            className="cursor-pointer"
            onClick={() => onPartClick("petal")}
          />
        </Tooltip>
      </TooltipProvider>
      {/* Stamen */}
      <TooltipProvider>
        <Tooltip content="Stamen">
          <circle
            cx="150"
            cy="100"
            r="10"
            fill="#FFC107"
            className="cursor-pointer"
            onClick={() => onPartClick("stamen")}
          />
        </Tooltip>
      </TooltipProvider>
      {/* Pistil */}
      <TooltipProvider>
        <Tooltip content="Pistil">
          <rect
            x="145"
            y="105"
            width="10"
            height="40"
            fill="#4CAF50"
            className="cursor-pointer"
            onClick={() => onPartClick("pistil")}
          />
        </Tooltip>
      </TooltipProvider>
      {/* Sepal */}
      <TooltipProvider>
        <Tooltip content="Sepal">
          <path
            d="M150 140 Q170 160 150 180 Q130 160 150 140"
            fill="#8BC34A"
            className="cursor-pointer"
            onClick={() => onPartClick("sepal")}
          />
        </Tooltip>
      </TooltipProvider>
    </svg>
  );
};

const QuizMode = ({ onAnswer }) => {
  const [draggedLabel, setDraggedLabel] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleDrop = (e, partId) => {
    e.preventDefault();
    if (draggedLabel === partId) {
      setFeedback("Correct!");
      onAnswer(partId, true);
    } else {
      setFeedback("Incorrect! Try again.");
      onAnswer(partId, false);
    }
    setDraggedLabel(null);
  };

  return (
    <div>
      <div className="flex justify-center gap-4 mb-4">
        {parts.map((part) => (
          <div
            key={part.id}
            draggable
            onDragStart={() => setDraggedLabel(part.id)}
            className="p-2 bg-blue-200 text-center cursor-pointer rounded-md"
          >
            {part.name}
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 300" className="w-full h-64 mx-auto">
        {parts.map((part) => (
          <g
            key={part.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, part.id)}
          >
            {part.id === "petal" && (
              <path
                d="M150 50 Q170 90 150 120 Q130 90 150 50"
                fill="#FFB3B3"
                stroke="black"
              />
            )}
            {part.id === "stamen" && (
              <circle cx="150" cy="100" r="10" fill="#FFC107" />
            )}
            {part.id === "pistil" && (
              <rect x="145" y="105" width="10" height="40" fill="#4CAF50" />
            )}
            {part.id === "sepal" && (
              <path
                d="M150 140 Q170 160 150 180 Q130 160 150 140"
                fill="#8BC34A"
                stroke="black"
              />
            )}
          </g>
        ))}
      </svg>
      <div className="text-center mt-4 text-lg font-bold">{feedback}</div>
    </div>
  );
};

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [quizMode, setQuizMode] = useState(false);

  const handlePartClick = (partId) => {
    const part = parts.find((p) => p.id === partId);
    setSelectedPart(part);
  };

  const handleQuizAnswer = (partId, isCorrect) => {
    console.log(`Answered for ${partId}: ${isCorrect ? "Correct" : "Incorrect"}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Parts of a Flower</h1>
      {quizMode ? (
        <QuizMode onAnswer={handleQuizAnswer} />
      ) : (
        <FlowerDiagram onPartClick={handlePartClick} />
      )}
      <div className="flex justify-center mt-4">
        <Button onClick={() => setQuizMode(!quizMode)}>
          {quizMode ? "Exit Quiz Mode" : "Enter Quiz Mode"}
        </Button>
      </div>
      {selectedPart && (
        <Card className="mt-4 max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{selectedPart.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{selectedPart.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
