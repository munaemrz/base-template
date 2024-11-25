import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const organSystems = {
  circulatory: {
    name: "Circulatory System",
    description: "Pumps and circulates blood throughout the body.",
    details: "The circulatory system consists of the heart, blood vessels, and blood. It's responsible for transporting oxygen, nutrients, hormones, and waste products throughout the body.",
  },
  respiratory: {
    name: "Respiratory System",
    description: "Enables breathing and gas exchange.",
    details: "The respiratory system includes the lungs, trachea, and diaphragm. It facilitates the intake of oxygen and the release of carbon dioxide.",
  },
  nervous: {
    name: "Nervous System",
    description: "Controls and coordinates body functions.",
    details: "The nervous system comprises the brain, spinal cord, and nerves. It processes sensory information and controls voluntary and involuntary actions.",
  },
};

const HumanBodySVG = ({ selectedSystem, onSystemClick }) => (
  <svg viewBox="0 0 100 200" className="w-full max-w-md mx-auto">
    <g onClick={() => onSystemClick("circulatory")} className="cursor-pointer hover:opacity-75 transition-opacity">
      <circle cx="50" cy="60" r="20" fill={selectedSystem === "circulatory" ? "red" : "pink"} />
      <text x="50" y="65" textAnchor="middle" fill="white" fontSize="6">Heart</text>
    </g>
    <g onClick={() => onSystemClick("respiratory")} className="cursor-pointer hover:opacity-75 transition-opacity">
      <rect x="35" y="85" width="30" height="40" fill={selectedSystem === "respiratory" ? "lightblue" : "skyblue"} />
      <text x="50" y="105" textAnchor="middle" fill="white" fontSize="6">Lungs</text>
    </g>
    <g onClick={() => onSystemClick("nervous")} className="cursor-pointer hover:opacity-75 transition-opacity">
      <ellipse cx="50" cy="30" rx="15" ry="20" fill={selectedSystem === "nervous" ? "purple" : "lavender"} />
      <text x="50" y="35" textAnchor="middle" fill="white" fontSize="6">Brain</text>
    </g>
  </svg>
);

const SystemInfo = ({ system }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>{organSystems[system].name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{organSystems[system].description}</p>
      <Collapsible className="mt-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Learn More</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <p>{organSystems[system].details}</p>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
);

const QuizMode = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  const handleDrop = (e, system) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text/plain");
    setAnswers(prev => ({ ...prev, [system]: label }));
  };

  const handleDragStart = (e, label) => {
    e.dataTransfer.setData("text/plain", label);
  };

  const checkAnswers = () => {
    const newFeedback = {};
    Object.entries(answers).forEach(([system, answer]) => {
      newFeedback[system] = answer.toLowerCase() === organSystems[system].name.toLowerCase();
    });
    setFeedback(newFeedback);
    if (Object.values(newFeedback).every(v => v)) {
      onComplete();
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Quiz Mode</h2>
      <p className="mb-4">Drag the labels to the correct organ systems:</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.values(organSystems).map(system => (
          <span
            key={system.name}
            draggable
            onDragStart={(e) => handleDragStart(e, system.name)}
            className="bg-blue-100 px-2 py-1 rounded cursor-move"
          >
            {system.name}
          </span>
        ))}
      </div>
      <HumanBodySVG
        selectedSystem={null}
        onSystemClick={() => {}}
      />
      <div className="mt-4 space-y-2">
        {Object.keys(organSystems).map(system => (
          <div
            key={system}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, system)}
            className={`border-2 p-2 rounded ${answers[system] ? 'bg-gray-100' : ''}`}
          >
            {answers[system] || `Drop ${organSystems[system].name} here`}
            {feedback[system] !== undefined && (
              <span className={`ml-2 ${feedback[system] ? 'text-green-500' : 'text-red-500'}`}>
                {feedback[system] ? '✓' : '✗'}
              </span>
            )}
          </div>
        ))}
      </div>
      <Button onClick={checkAnswers} className="mt-4">Check Answers</Button>
    </div>
  );
};

export default function App() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [quizMode, setQuizMode] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Human Body Organ Systems</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <TooltipProvider>
            {Object.keys(organSystems).map(system => (
              <Tooltip key={system}>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <HumanBodySVG
                      selectedSystem={selectedSystem}
                      onSystemClick={setSelectedSystem}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{organSystems[system].name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div>
          {!quizMode && selectedSystem && <SystemInfo system={selectedSystem} />}
          {!quizMode && (
            <Button onClick={() => setQuizMode(true)} className="mt-4">
              Start Quiz
            </Button>
          )}
          {quizMode && (
            <QuizMode onComplete={() => setQuizMode(false)} />
          )}
        </div>
      </div>
    </div>
  );
}