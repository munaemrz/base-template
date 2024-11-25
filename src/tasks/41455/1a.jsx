import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const flowerParts = [
  { id: "petal", name: "Petal", description: "Colorful part that attracts pollinators", details: "Petals are modified leaves that surround the reproductive parts of flowers. They are often brightly colored to attract insects and other pollinators." },
  { id: "sepal", name: "Sepal", description: "Protects the flower bud", details: "Sepals are the outermost parts of the flower. They are typically green and leaf-like, protecting the flower bud before it opens." },
  { id: "stamen", name: "Stamen", description: "Male reproductive part", details: "Stamens are the male reproductive organs of a flower. They consist of a filament (stalk) and an anther, which produces pollen." },
  { id: "pistil", name: "Pistil", description: "Female reproductive part", details: "The pistil is the female reproductive organ of a flower. It consists of the stigma, style, and ovary, which contains ovules." },
  { id: "receptacle", name: "Receptacle", description: "Base of the flower", details: "The receptacle is the part of the flower stalk where the flower parts are attached. It can be flat, concave, or convex." },
];

const FlowerDiagram = ({ selectedPart, setSelectedPart, isQuizMode, handleDrop }) => (
  <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
    {/* Simplified flower diagram */}
    <circle cx="200" cy="200" r="150" fill="#f0e68c" className="transition-all duration-300 hover:fill-yellow-300" onClick={() => setSelectedPart("receptacle")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "receptacle")} />
    <circle cx="200" cy="200" r="100" fill="#98fb98" className="transition-all duration-300 hover:fill-green-300" onClick={() => setSelectedPart("sepal")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "sepal")} />
    <circle cx="200" cy="200" r="80" fill="#ff69b4" className="transition-all duration-300 hover:fill-pink-400" onClick={() => setSelectedPart("petal")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "petal")} />
    <circle cx="180" cy="180" r="20" fill="#ffd700" className="transition-all duration-300 hover:fill-yellow-400" onClick={() => setSelectedPart("stamen")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "stamen")} />
    <circle cx="220" cy="220" r="20" fill="#ff6347" className="transition-all duration-300 hover:fill-red-400" onClick={() => setSelectedPart("pistil")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "pistil")} />
    {!isQuizMode && flowerParts.map(part => (
      <text key={part.id} x={part.id === "receptacle" ? 320 : part.id === "sepal" ? 320 : part.id === "petal" ? 280 : part.id === "stamen" ? 160 : 240} y={part.id === "receptacle" ? 380 : part.id === "sepal" ? 320 : part.id === "petal" ? 180 : part.id === "stamen" ? 160 : 240} fill="black" fontSize="16">{part.name}</text>
    ))}
  </svg>
);

const PartDescription = ({ part }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>{part.name}</CardTitle>
      <CardDescription>{part.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">Learn More</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <p>{part.details}</p>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
);

const QuizMode = ({ handleDragStart, feedback }) => (
  <div className="mt-4">
    <h2 className="text-xl font-bold mb-2">Quiz Mode</h2>
    <div className="flex flex-wrap justify-center gap-2">
      {flowerParts.map(part => (
        <div key={part.id} draggable onDragStart={(e) => handleDragStart(e, part.id)} className="bg-blue-100 p-2 rounded cursor-move">
          {part.name}
        </div>
      ))}
    </div>
    {feedback && (
      <p className={`mt-2 text-center ${feedback.correct ? "text-green-600" : "text-red-600"}`}>
        {feedback.message}
      </p>
    )}
  </div>
);

export default function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleDragStart = (e, partId) => {
    e.dataTransfer.setData("text/plain", partId);
  };

  const handleDrop = (e, targetPart) => {
    e.preventDefault();
    const draggedPartId = e.dataTransfer.getData("text");
    if (draggedPartId === targetPart) {
      setFeedback({ correct: true, message: "Correct! Well done!" });
    } else {
      setFeedback({ correct: false, message: "Oops! Try again." });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Flower Parts Visualizer</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <FlowerDiagram
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            isQuizMode={isQuizMode}
            handleDrop={handleDrop}
          />
        </div>
        <div className="w-full sm:w-1/2">
          {selectedPart && !isQuizMode && (
            <PartDescription part={flowerParts.find(p => p.id === selectedPart)} />
          )}
          {isQuizMode && (
            <QuizMode handleDragStart={handleDragStart} feedback={feedback} />
          )}
          <Button
            onClick={() => setIsQuizMode(!isQuizMode)}
            className="mt-4 w-full"
          >
            {isQuizMode ? "Exit Quiz Mode" : "Enter Quiz Mode"}
          </Button>
        </div>
      </div>
    </div>
  );
}