import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const stages = [
  { name: 'Nebula', description: 'A cloud of gas and dust in space.' },
  { name: 'Protostar', description: 'The initial stage where gravity causes the nebula to collapse.' },
  { name: 'Main Sequence', description: 'The star spends most of its life here, fusing hydrogen into helium.' },
  { name: 'Red Giant', description: 'The star expands as it runs out of hydrogen fuel.' },
  { name: 'Supernova', description: 'A powerful explosion that can lead to a neutron star or black hole.' },
  { name: 'Neutron Star/Black Hole', description: 'The remnants after a supernova, extremely dense or a gravity singularity.' }
];

function StarStage({ stage, onClick, isDragging, provided }) {
  return (
    <div 
      ref={provided?.innerRef} 
      {...provided?.draggableProps} 
      {...provided?.dragHandleProps}
      className={`cursor-pointer transform transition-transform hover:scale-105 ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onClick(stage)}
    >
      <TooltipProvider><Tooltip content={stage.description}>
        <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
          {stage.name}
        </div>
      </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function QuizMode({ stages, setSelectedStage }) {
  const [answers, setAnswers] = useState(Array(stages.length).fill(null));
  const [isCorrect, setIsCorrect] = useState(Array(stages.length).fill(null));

  const handleDrop = (index) => (event) => {
    const draggedIndex = parseInt(event.dataTransfer.getData("text"));
    const newAnswers = [...answers];
    newAnswers[index] = stages[draggedIndex].name;
    setAnswers(newAnswers);

    const newIsCorrect = [...isCorrect];
    newIsCorrect[index] = stages[index].name === stages[draggedIndex].name;
    setIsCorrect(newIsCorrect);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {stages.map((stage, idx) => (
          <div 
            key={idx} 
            onDrop={handleDrop(idx)} 
            onDragOver={(e) => e.preventDefault()} 
            className={`border-2 ${isCorrect[idx] === true ? 'border-green-500' : isCorrect[idx] === false ? 'border-red-500' : 'border-dashed border-gray-300'} p-4 rounded-lg min-h-[100px]`}
          >
            {answers[idx] || "Drop Here"}
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        {stages.map((stage, idx) => (
          <StarStage 
            key={idx} 
            stage={stage} 
            onClick={setSelectedStage}
            isDragging={false}
            provided={{
              draggableProps: {
                key: idx,
                draggable: "true",
                onDragStart: (e) => e.dataTransfer.setData("text", idx)
              },
              dragHandleProps: {},
              innerRef: () => {}
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedStage, setSelectedStage] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const cardRef = useRef(null);

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center sm:px-2">
      <h1 className="text-2xl font-bold mb-4">Star Lifecycle Explorer</h1>
      <div className="mb-4">
        <Button onClick={() => setIsQuizMode(!isQuizMode)}>
          {isQuizMode ? 'View Mode' : 'Quiz Mode'}
        </Button>
      </div>
      {isQuizMode ? (
        <QuizMode stages={stages} setSelectedStage={setSelectedStage} />
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {stages.map((stage, idx) => (
            <StarStage key={idx} stage={stage} onClick={setSelectedStage} />
          ))}
        </div>
      )}
      {selectedStage && (
        <div ref={cardRef} className="mt-4 w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>{selectedStage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{selectedStage.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button onClick={() => cardRef.current.scrollIntoView({ behavior: 'smooth' })}>Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}