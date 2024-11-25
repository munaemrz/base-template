import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip } from "@/components/ui/tooltip";

const NLPProcessor = (text) => {
  const numbers = text.match(/\d+(\.\d+)?%?/g) || [];
  const keywords = text.match(/\b[A-Z][a-z]+\b/g) || [];
  const locations = text.match(/\b(New York|Los Angeles|Chicago|Houston|Phoenix|Philadelphia|San Antonio|San Diego|Dallas|San Jose)\b/g) || [];
  return { numbers, keywords, locations };
};

const BarChart = ({ data }) => (
  <div className="flex h-40 items-end space-x-2">
    {data.map((value, index) => (
      <div
        key={index}
        className="bg-blue-500 w-8"
        style={{ height: `${(value / Math.max(...data)) * 100}%` }}
      >
        <Tooltip content={value}>
          <div className="h-full"></div>
        </Tooltip>
      </div>
    ))}
  </div>
);

const PieChart = ({ data }) => (
  <div className="relative w-40 h-40">
    {data.map((value, index) => (
      <div
        key={index}
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from ${index * 360 / data.length}deg, hsl(${index * 360 / data.length}, 70%, 50%) ${value}%, transparent ${value}%)`,
        }}
      >
        <Tooltip content={`${value}%`}>
          <div className="h-full"></div>
        </Tooltip>
      </div>
    ))}
  </div>
);

const USMap = ({ locations }) => (
  <svg viewBox="0 0 959 593" className="w-full h-auto">
    <path d="M161.1 453.7l-0.3 85.4 1.6 1 3.1 0.2 1.5-1.1h2.6l0.2 2.9 7 6.8 0.5 2.6 3.4-1.9 0.6-0.2 0.3-3.1 1-0.5 1.6-2.6 1.5-3.7 1.6-0.8 1.5 1.6 2.3-0.5 1.6-1.5 1.9-0.8 0.3-2.1 1.6-1.5 1.1-0.5 1.9-0.8 1.5 1.3 2.7 0.3 0.5-1.9 0.6-1.9 0.6-2.4 2.1-1.3 0.8-2.4 1.3-1.5 1.6-1 1.3-0.3 0.6 0.5h0.8l1.3-3.7 4.2-2.1 4.7-1.8 1.3 0.3 2.9 2.9 1.6 0.5 1 0.3 3.1-1.3 2.7-3.1v-1l0.6-0.8v-1.9l3.1-1.8 0.8-1.5 0.5-1.1 0.3-1.9-0.5-1.6 0.8-1.5h1.9l1.1-0.5 0.8-1.5 0.8-1.5 1.9-3.7 2.7-1.3 2.1-1.3" fill="#D3D3D3" />
    {locations.map((location, index) => (
      <circle key={index} cx={Math.random() * 959} cy={Math.random() * 593} r="5" fill="red">
        <Tooltip content={location}>
          <circle r="5" />
        </Tooltip>
      </circle>
    ))}
  </svg>
);

export default function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (input.length < 50) {
      setError("Please enter at least 50 characters");
      setData(null);
    } else {
      setError("");
      setData(NLPProcessor(input));
    }
  }, [input]);

  return (
    <div className="p-4 max-w-md mx-auto sm:max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Article Visualizer</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your article here..."
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <div className="mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Numbers</AccordionTrigger>
              <AccordionContent>
                <BarChart data={data.numbers.map(Number)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Keywords</AccordionTrigger>
              <AccordionContent>
                <PieChart data={data.keywords.slice(0, 5).map((_, i) => 100 / 5)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Locations</AccordionTrigger>
              <AccordionContent>
                <USMap locations={data.locations} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button className="mt-4" onClick={() => setInput("")}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}