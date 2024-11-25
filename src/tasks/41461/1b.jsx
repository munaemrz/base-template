import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const organSystems = [
  { name: 'Circulatory', description: 'Transports nutrients, gases, and waste.', color: 'red' },
  { name: 'Respiratory', description: 'Involves oxygen intake and carbon dioxide expulsion.', color: 'blue' },
  { name: 'Nervous', description: 'Coordinates and controls body activities.', color: 'purple' },
  // Add more systems here...
];

const BodyDiagram = ({ onSelectSystem }) => (
  <svg width="100%" height="100%" viewBox="0 0 300 600" className="cursor-pointer">
    {organSystems.map((system, index) => (
      <TooltipProvider>
        <Tooltip key={index} content={system.name}>
        <path 
          d="M100,100...path_data..." // Simplified path data
          fill={`rgba(${system.color}, 0.3)`}
          stroke={system.color}
          onClick={() => onSelectSystem(system.name)}
          className="hover:opacity-80 transition-opacity"
        />
      </Tooltip>
      </TooltipProvider>
    ))}
  </svg>
);

const SystemInfoCard = ({ system, isExpanded, onToggleExpand }) => (
  <Card className="mt-4 sm:mt-0">
    <CardHeader>
      <CardTitle>{system.name}</CardTitle>
      <CardDescription>{system.description}</CardDescription>
    </CardHeader>
    <CardContent>
      {isExpanded && <p>Detailed information about the {system.name} system goes here.</p>}
    </CardContent>
    <CardFooter>
      <Button onClick={onToggleExpand}>{isExpanded ? 'Show Less' : 'Learn More'}</Button>
    </CardFooter>
  </Card>
);

const QuizMode = ({ systems }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleDragStart = (e, name) => {
    setDraggedItem(name);
  };

  const handleDrop = (e, systemName) => {
    setAnswers(prev => ({...prev, [systemName]: draggedItem === systemName}));
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {systems.map(system => (
          <div 
            key={system.name}
            onDrop={(e) => handleDrop(e, system.name)} 
            onDragOver={(e) => e.preventDefault()}
            className={`p-2 border-2 border-${answers[system.name] === true ? 'green-500' : answers[system.name] === false ? 'red-500' : 'gray-300'} rounded-md w-full sm:w-1/3`}
          >
            <Label>{system.name}</Label>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {systems.map(system => (
          <div 
            key={system.name} 
            draggable 
            onDragStart={(e) => handleDragStart(e, system.name)}
            className="p-2 bg-blue-100 rounded cursor-move"
          >
            {system.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    if (!isQuizMode) {
      setIsExpanded(false);
    }
  }, [isQuizMode]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Human Body Organ Systems</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <BodyDiagram onSelectSystem={setSelectedSystem} />
        </div>
        <div className="flex-1">
          {selectedSystem && (
            <SystemInfoCard 
              system={organSystems.find(s => s.name === selectedSystem)} 
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
            />
          )}
          <Button onClick={() => setIsQuizMode(!isQuizMode)} className="mt-4 w-full sm:w-auto">
            {isQuizMode ? 'Exit Quiz' : 'Start Quiz'}
          </Button>
          {isQuizMode && <QuizMode systems={organSystems} />}
        </div>
      </div>
    </div>
  );
}