import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip , TooltipProvider} from "@/components/ui/tooltip";

const organSystems = [
  { name: "Circulatory System", description: "Pumps and circulates blood.", details: "Includes the heart, blood vessels, and blood, transporting oxygen and nutrients.", color: "red", path: "M50,50L60,60..." },
  { name: "Respiratory System", description: "Enables breathing.", details: "Includes lungs, trachea, and diaphragm for gas exchange.", color: "blue", path: "M70,70L80,80..." },
  { name: "Nervous System", description: "Controls body functions.", details: "Includes brain, spinal cord, and nerves for communication and control.", color: "purple", path: "M90,90L100,100..." },
];

const Diagram = ({ onSelect }) => (
  <svg viewBox="0 0 300 300" className="w-full h-full">
    {organSystems.map((system, index) => (
      <TooltipProvider><Tooltip key={index} content={system.description}>
        <g
          onClick={() => onSelect(system)}
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          <path d={system.path} fill={system.color} />
        </g>
      </Tooltip></TooltipProvider>
    ))}
  </svg>
);

const InfoCard = ({ system, onExpand, expanded }) => (
  <Card>
    <CardHeader>
      <CardTitle>{system.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{system.description}</p>
      {expanded && <p>{system.details}</p>}
    </CardContent>
    <CardFooter>
      <Button onClick={onExpand}>{expanded ? "Show Less" : "Learn More"}</Button>
    </CardFooter>
  </Card>
);

const Quiz = ({ onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const handleDrop = (e, systemName) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text");
    setAnswers((prev) => ({ ...prev, [systemName]: label }));
  };

  return (
    <div className="flex flex-wrap gap-4">
      {organSystems.map((system) => (
        <div
          key={system.name}
          onDrop={(e) => handleDrop(e, system.name)}
          onDragOver={(e) => e.preventDefault()}
          className="w-1/3 border-dashed border-2 p-4 text-center"
        >
          Drop {system.name} here
        </div>
      ))}
      <Button onClick={() => onSubmit(answers)} className="mt-4">
        Submit Answers
      </Button>
    </div>
  );
};

export default function App() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Human Body Organ Systems</h1>
      <div className="flex gap-4">
        <Diagram onSelect={setSelectedSystem} />
        {selectedSystem && (
          <InfoCard
            system={selectedSystem}
            expanded={expanded}
            onExpand={() => setExpanded(!expanded)}
          />
        )}
      </div>
      <Button onClick={() => setQuizMode(!quizMode)} className="mt-4">
        {quizMode ? "Exit Quiz" : "Start Quiz"}
      </Button>
      {quizMode && <Quiz onSubmit={(answers) => console.log(answers)} />}
    </div>
  );
}
