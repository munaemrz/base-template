import React, { useState, useRef } from 'react';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";

const ButterflyLifecycle = () => {
  const stages = [
    { name: 'Egg', description: 'The beginning of life.', details: 'Eggs are laid on plants.', img: 'egg.svg' },
    { name: 'Caterpillar', description: 'Growth phase.', details: 'Caterpillars eat leaves and grow.', img: 'caterpillar.svg' },
    { name: 'Pupa', description: 'Transformation stage.', details: 'Inside the chrysalis, it transforms.', img: 'pupa.svg' },
    { name: 'Butterfly', description: 'The adult stage.', details: 'Butterflies can now fly and reproduce.', img: 'butterfly.svg' }
  ];

  const [currentStage, setCurrentStage] = useState(0);
  const scrollRef = useRef(null);

  const scrollToStage = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0].offsetWidth;
      scrollRef.current.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    }
  };

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      scrollToStage(currentStage + 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Butterfly Lifecycle</h1>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {stages.map((_, index) => (
          <div 
            key={index} 
            className={`w-4 h-1 rounded-full ${index <= currentStage ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <div ref={scrollRef} className="flex overflow-x-scroll pb-4">
        {stages.map((stage, idx) => (
          <StageCard 
            key={idx} 
            stage={stage} 
            isExpanded={currentStage === idx} 
            onLearnMore={() => setCurrentStage(idx)} 
          />
        ))}
      </div>
      <Button 
        disabled={currentStage === stages.length - 1} 
        onClick={handleNextStage} 
        className="mt-4 w-full sm:w-auto"
      >
        Next Stage
      </Button>
    </div>
  );
};

const StageCard = ({ stage, isExpanded, onLearnMore }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-w-full sm:min-w-[250px] p-4 border rounded-lg shadow-md m-2 flex-shrink-0">
      <img src={stage.img} alt={stage.name} className="h-24 w-24 mx-auto mb-2" />
      <h2 className="text-lg font-semibold">{stage.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
      <Button onClick={() => { setIsOpen(!isOpen); onLearnMore(); }} variant="outline">
        {isOpen ? 'Hide Details' : 'Learn More'}
      </Button>
      <Accordion open={isExpanded && isOpen}>
        <AccordionItem title="More Information">
          <img src={stage.img} alt={stage.name} className="h-48 w-full object-cover mb-2" />
          <p>{stage.details}</p>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Placeholder SVG paths for demonstration
const svgPaths = {
  'egg.svg': 'M20 30 Q 30 20 40 30 A 10 10 0 1 1 20 30 Z',
  'caterpillar.svg': 'M10,50 C20,60 40,40 50,50 C60,60 80,40 90,50',
  'pupa.svg': 'M30 50 Q 40 70 50 50 Q 40 30 30 50 Z',
  'butterfly.svg': 'M20 50 L40 30 L40 70 L20 50 Z M60 50 L80 30 L80 70 L60 50 Z'
};

// Inline SVG component
const Svg = ({ src, alt }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <path d={svgPaths[src]} fill="currentColor"/>
  </svg>
);

// Mocking the ui components with simple implementations
const MockButton = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>{children}</button>
);

const MockAccordion = ({ children, open }) => (
  <div className={open ? 'block' : 'hidden'}>{children}</div>
);

const MockAccordionItem = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    {children}
  </div>
);

// Replace mock components with actual shadcn components
const components = { Button: MockButton, Accordion: MockAccordion, AccordionItem: MockAccordionItem };

export default function App() {
  return <ButterflyLifecycle components={components} />;
}