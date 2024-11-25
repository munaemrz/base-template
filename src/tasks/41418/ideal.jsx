import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const stages = [
  {
    name: "Egg",
    description: "The beginning of life.",
    details: "Eggs are laid on plants and are the starting point of a butterfly's lifecycle.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <circle cx="50" cy="50" r="40" fill="#e0f7fa" stroke="#00796b" strokeWidth="3" />
      </svg>
    ),
  },
  {
    name: "Caterpillar",
    description: "The growth stage.",
    details: "Caterpillars consume leaves and grow rapidly before entering transformation.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M10,50 Q30,30 50,50 Q70,70 90,50" fill="none" stroke="#8bc34a" strokeWidth="4" />
      </svg>
    ),
  },
  {
    name: "Pupa",
    description: "Transformation stage.",
    details: "Inside the chrysalis, the caterpillar transforms into a butterfly.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M50,10 L65,90 L35,90 Z" fill="#ffcc80" />
      </svg>
    ),
  },
  {
    name: "Butterfly",
    description: "The adult stage.",
    details: "Butterflies emerge and begin their life as fully grown adults.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M50,50 L30,20 Q50,30 70,20 L50,50 L30,80 Q50,70 70,80 Z" fill="#f48fb1" />
      </svg>
    ),
  },
];

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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Butterfly Lifecycle</h1>
      <div className="flex justify-center mb-4">
        {stages.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full mx-1 ${
              index <= currentStage ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div id="timeline" className="flex overflow-x-auto snap-x mb-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex-shrink-0 w-64 mx-2 snap-center">
            <div
              className={`p-4 rounded-lg shadow ${
                index === currentStage ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {stage.svg}
              <h3 className="mt-2 font-bold">{stage.name}</h3>
              <p className="text-sm text-center">{stage.description}</p>
              <Button className="mt-2" onClick={() => handleLearnMore(index)}>
                {expandedStage === index ? "Hide Details" : "Learn More"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Accordion type="single" collapsible>
        {stages.map((stage, index) => (
          <AccordionItem key={stage.name} value={`item-${index}`}>
            <AccordionTrigger>{stage.name}</AccordionTrigger>
            <AccordionContent>
              <div className="text-center">
                {stage.svg}
                <p className="text-sm mt-2">{stage.details}</p>
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
