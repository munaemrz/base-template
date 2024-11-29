import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const FlowerPart = ({ part, onSelect, selected, correct }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
   <TooltipProvider> <Tooltip content={part.name}>
      <g
        onClick={() => onSelect(part)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${selected ? 'cursor-pointer fill-green-500' : 'cursor-pointer fill-blue-500'} ${isHovered ? 'opacity-75' : 'opacity-100'} transition-all`}
      >
        {part.path}
      </g>
    </Tooltip></TooltipProvider>
  );
};

const FlowerDescription = ({ part }) => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>{part.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{part.description}</CardDescription>
    </CardContent>
  </Card>
);

const QuizLabel = ({ label, onDragStart, isCorrect, isPlaced }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, label)}
    className={`px-4 py-2 m-2 rounded bg-white shadow-lg cursor-move ${isCorrect ? 'bg-green-100' : isPlaced ? 'bg-red-100' : ''}`}
  >
    {label.name}
  </div>
);

export default function App() {
  const flowerParts = [
    { name: "Petal", description: "Attracts pollinators.", path: <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent" strokeWidth="2"/> },
    { name: "Stamen", description: "The male part where pollen is produced.", path: <circle cx="30" cy="30" r="5" /> },
    { name: "Pistil", description: "The female reproductive part.", path: <rect x="40" y="25" width="10" height="20" /> },
    { name: "Sepal", description: "Protects the flower bud.", path: <path d="M60 60 Q 65 50 70 60" stroke="green" fill="transparent" strokeWidth="2"/> },
  ];

  const [selectedPart, setSelectedPart] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [labels, setLabels] = useState(flowerParts.map(part => ({...part, placed: false, correct: false})));
  const [feedback, setFeedback] = useState({correct: 0, total: flowerParts.length});

  const handlePartSelect = (part) => {
    if (!quizMode) setSelectedPart(part);
  };

  const handleDragStart = (e, label) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(label));
  };

  const handleDrop = (e, part) => {
    e.preventDefault();
    const label = JSON.parse(e.dataTransfer.getData('text'));
    const newLabels = labels.map(l => {
      if (l.name === label.name) {
        return {...l, placed: true, correct: l.name === part.name};
      }
      return l;
    });
    setLabels(newLabels);
    const correctCount = newLabels.filter(l => l.correct).length;
    setFeedback({correct: correctCount, total: newLabels.length});
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="relative w-full max-w-lg">
        <svg width="100%" height="300" viewBox="0 0 80 80">
          {flowerParts.map((part, index) => (
            <FlowerPart 
              key={index} 
              part={part} 
              onSelect={handlePartSelect}
              selected={selectedPart === part}
              onDrop={(e) => handleDrop(e, part)} 
              onDragOver={handleDragOver}
            />
          ))}
        </svg>
        {quizMode && <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center text-lg">Drop labels here!</div>}
      </div>
      
      {!quizMode ? (
        <FlowerDescription part={selectedPart || { name: "Select a part", description: "Click on any part of the flower to learn more." }} />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap justify-center">
            {labels.map((label, idx) => (
              <QuizLabel 
                key={idx} 
                label={label} 
                onDragStart={handleDragStart}
                isCorrect={label.correct}
                isPlaced={label.placed}
              />
            ))}
          </div>
          <Card>
            <CardContent>
              <p>Correct: {feedback.correct}/{feedback.total}</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <button 
        onClick={() => setQuizMode(!quizMode)} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {quizMode ? 'View Mode' : 'Quiz Mode'}
      </button>
    </div>
  );
}