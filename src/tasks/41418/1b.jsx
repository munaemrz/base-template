import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const stages = [
  {
    name: "Egg",
    description: "Tiny, round eggs laid on leaves",
    details: "Butterfly eggs are usually laid on plants that will serve as food for the caterpillar once it hatches.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <circle cx="50" cy="50" r="40" fill="#f0f0f0" stroke="#000" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" fill="#ffffd0" />
      </svg>
    ),
  },
  {
    name: "Caterpillar",
    description: "Larva that eats and grows rapidly",
    details: "Caterpillars molt several times as they grow, shedding their exoskeleton to accommodate their increasing size.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M10,50 Q25,30 40,50 T70,50 T100,50" fill="none" stroke="#8fbc8f" strokeWidth="20" strokeLinecap="round" />
        <circle cx="90" cy="50" r="8" fill="#8fbc8f" />
      </svg>
    ),
  },
  {
    name: "Pupa",
    description: "Transformation inside a chrysalis",
    details: "During the pupal stage, the caterpillar's body breaks down and reforms into the adult butterfly structure.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M50,10 L60,90 L40,90 Z" fill="#d2b48c" />
        <line x1="50" y1="10" x2="50" y2="0" stroke="#000" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Butterfly",
    description: "Adult with wings ready to fly",
    details: "Butterflies use their long proboscis to feed on nectar from flowers and play a crucial role in pollination.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M50,50 L30,20 Q50,30 70,20 L50,50 L30,80 Q50,70 70,80 Z" fill="#ff69b4" stroke="#000" strokeWidth="2" />
        <line x1="48" y1="50" x2="52" y2="50" stroke="#000" strokeWidth="4" />
      </svg>
    ),
  },
];

function StageCard({ stage, isActive, onLearnMore }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-lg ${isActive ? "bg-blue-100" : "bg-gray-100"}`}>
      {stage.svg}
      <h3 className="mt-2 font-bold">{stage.name}</h3>
      <p className="text-sm text-center mt-1">{stage.description}</p>
      <Button onClick={onLearnMore} className="mt-2">
        Learn More
      </Button>
    </div>
  );
}

function ProgressTracker({ currentStage }) {
  return (
    <div className="flex justify-between w-full mb-4">
      {stages.map((stage, index) => (
        <div
          key={stage.name}
          className={`w-6 h-6 rounded-full ${
            index <= currentStage ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [expandedStage, setExpandedStage] = useState(null);

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleLearnMore = (index) => {
    setExpandedStage(expandedStage === index ? null : index);
  };

  useEffect(() => {
    const timeline = document.getElementById("timeline");
    const activeCard = timeline.children[currentStage];
    activeCard.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [currentStage]);

  return (
    <div className="max-w-screen-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Butterfly Lifecycle</h1>
      <ProgressTracker currentStage={currentStage} />
      <div id="timeline" className="flex overflow-x-auto pb-4 mb-4 snap-x">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex-shrink-0 w-64 mx-2 snap-center">
            <StageCard
              stage={stage}
              isActive={index === currentStage}
              onLearnMore={() => handleLearnMore(index)}
            />
          </div>
        ))}
      </div>
      <Accordion type="single" collapsible>
        {stages.map((stage, index) => (
          <AccordionItem key={stage.name} value={`item-${index}`}>
            <AccordionTrigger
              onClick={() => handleLearnMore(index)}
              className={expandedStage === index ? "text-blue-500" : ""}
            >
              {expandedStage === index ? "Hide Details" : "Learn More"}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 mb-4">{stage.svg}</div>
                <p className="text-sm">{stage.details}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4 text-center">
        <Button onClick={handleNextStage} disabled={currentStage === stages.length - 1}>
          Next Stage
        </Button>
      </div>
    </div>
  );
}