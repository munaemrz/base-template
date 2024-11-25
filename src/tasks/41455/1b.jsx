import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const FlowerPart = ({ part, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip content={part.description}>
        <g
          onClick={() => onSelect(part)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`${
            isHovered ? "cursor-pointer opacity-80" : "opacity-100"
          } transition-opacity duration-300`}
        >
          <path d={part.path} fill={part.color} />
        </g>
      </Tooltip>
    </TooltipProvider>
  );
};

const FlowerDiagram = ({ onPartSelect }) => (
  <svg width="300" height="300" viewBox="0 0 300 300">
    {flowerParts.map((part, index) => (
      <FlowerPart key={index} part={part} onSelect={onPartSelect} />
    ))}
  </svg>
);

const QuizLabel = ({ label, isCorrect, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, label)}
    className={`p-2 m-2 bg-blue-100 rounded cursor-move ${
      isCorrect !== null ? (isCorrect ? "bg-green-200" : "bg-red-200") : ""
    }`}
  >
    {label}
  </div>
);

const QuizMode = ({ labels, onDrop, onDragOver, checkAnswer }) => (
  <div className="flex flex-col sm:flex-row items-center justify-center">
    <div className="w-full sm:w-1/2 p-4">
      <FlowerDiagram onPartSelect={() => {}} />
      {flowerParts.map((part, index) => (
        <div
          key={index}
          onDrop={(e) => onDrop(e, part.name)}
          onDragOver={onDragOver}
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        />
      ))}
    </div>
    <div className="w-full sm:w-1/2 flex flex-wrap justify-center">
      {labels.map((label, idx) => (
        <QuizLabel
          key={idx}
          label={label}
          isCorrect={checkAnswer(label)}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  </div>
);

const flowerParts = [
  {
    name: "Petal",
    path: "M50 100 Q100 50 150 100 T250 100",
    color: "#ff69b4",
    description: "Petals attract pollinators.",
  },
  {
    name: "Stamen",
    path: "M100 150 L100 200",
    color: "#ffd700",
    description: "The male part where pollen is produced.",
  },
  {
    name: "Pistil",
    path: "M150 150 L150 220",
    color: "#98fb98",
    description: "The female part where seeds develop.",
  },
  // Add more parts as needed
];

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [labels, setLabels] = useState(
    flowerParts.map((part) => part.name).sort(() => Math.random() - 0.5)
  );
  const [answers, setAnswers] = useState({});

  const onDragStart = (event, label) => {
    event.dataTransfer.setData("text/plain", label);
  };

  const onDrop = (event, partName) => {
    event.preventDefault();
    const label = event.dataTransfer.getData("text");
    setAnswers((prev) => ({ ...prev, [partName]: label === partName }));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const checkAnswer = (label) =>
    answers[label] === label ? true : answers[label] === false ? false : null;

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Flower Anatomy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!quizMode ? (
            <>
              <FlowerDiagram onPartSelect={setSelectedPart} />
              {selectedPart && (
                <div>
                  <h3 className="font-bold">{selectedPart.name}</h3>
                  <p>{selectedPart.description}</p>
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="outline"
                  >
                    {isExpanded ? "Show Less" : "Learn More"}
                  </Button>
                  {isExpanded && (
                    <p className="mt-2">
                      Detailed information about {selectedPart.name}...
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <QuizMode
              labels={labels}
              onDrop={onDrop}
              onDragOver={onDragOver}
              checkAnswer={checkAnswer}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => setQuizMode(!quizMode)}>
            {quizMode ? "View Diagram" : "Quiz Mode"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
