import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

// Predefined list of valid countries and major cities
const validLocations = [
  "United States",
  "Canada",
  "India",
  "Germany",
  "France",
  "New York",
  "Los Angeles",
  "London",
  "Paris",
  "Berlin",
  "Tokyo",
  "Beijing",
  "Sydney",
  "Mexico City",
];

function extractStats(text) {
  // Extract numbers in sentences with "in [year]" or percentage-related context
  const numberPattern = /in\s(\d{4}).*?by\s(\d+)%/gi;
  const matches = [...text.matchAll(numberPattern)];
  const numbers = matches.map((match) => ({
    year: parseInt(match[1]),
    percentage: parseInt(match[2]),
  }));

  // Extract valid locations
  const locationPattern = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g;
  const allLocations = text.match(locationPattern) || [];
  const locations = allLocations.filter((loc) => validLocations.includes(loc));

  // Extract keywords (5+ letter words, top 5 unique)
  const keywordPattern = /\b[A-Za-z]{5,}\b/g;
  const keywords = [...new Set(text.match(keywordPattern) || [])].slice(0, 5);

  return {
    numbers,
    locations,
    keywords,
  };
}

const BarChart = ({ data, title }) => (
  <div className="w-full">
    <h3 className="text-center font-bold mb-2">{title}</h3>
    <TooltipProvider>
      <div className="flex flex-col space-y-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center">
            <span className="w-12 text-sm text-right mr-2">{entry.year}</span>
            <Tooltip content={`${entry.percentage}%`} placement="top">
              <div
                className="bg-blue-500 h-6 text-xs text-white flex items-center justify-center"
                style={{ width: `${entry.percentage}%` }}
              >
                {entry.percentage}%
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  </div>
);

const PieChart = ({ data, title }) => (
  <div className="w-40 h-40 relative mx-auto">
    <h3 className="text-center font-bold mb-2">{title}</h3>
    <svg viewBox="0 0 32 32" className="w-full h-full">
      {data.reduce(
        (acc, keyword, i) => {
          const startAngle = acc.startAngle;
          const endAngle = startAngle + (360 / data.length);
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
          const x1 = 16 + 16 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 16 - 16 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 16 + 16 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 16 - 16 * Math.sin((Math.PI * endAngle) / 180);
          return {
            paths: [
              ...acc.paths,
              <path
                key={i}
                d={`M16,16 L${x1},${y1} A16,16 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                fill={`hsl(${i * 72}, 70%, 50%)`}
              />,
              <text
                key={`label-${i}`}
                x={16 + 12 * Math.cos((Math.PI * (startAngle + endAngle)) / 360)}
                y={16 - 12 * Math.sin((Math.PI * (startAngle + endAngle)) / 360)}
                fontSize="0.1rem"
                fill="#000"
                textAnchor="middle"
              >
                {keyword}
              </text>,
            ],
            startAngle: endAngle,
          };
        },
        { paths: [], startAngle: 0 }
      ).paths}
    </svg>
  </div>
);

const Map = ({ locations, onClickLocation }) => (
  <div className="relative w-full h-64 bg-gray-100 rounded">
    {locations.map((loc, idx) => (
      <div
        key={idx}
        className="absolute flex items-center justify-center"
        style={{
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
        }}
      >
        <TooltipProvider>
          <Tooltip content={loc}>
            <div
              className="bg-red-500 w-2 h-2 rounded-full cursor-pointer"
              onClick={() => onClickLocation(loc)}
            ></div>
          </Tooltip>
        </TooltipProvider>
        <span className="absolute top-4 text-xs">{loc}</span>
      </div>
    ))}
  </div>
);

export default function App() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ numbers: [], locations: [], keywords: [] });
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    setStats(extractStats(text));
  }, [text]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardTitle>
          <h1 className="text-xl font-bold">Article Visualizer</h1>
        </CardTitle>
        <CardContent>
          <Textarea
            placeholder="Paste your article here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={() => setText("")}>Clear</Button>
        </CardFooter>
      </Card>
      {stats.numbers.length > 0 && (
        <div className="mt-4 space-y-4">
          <BarChart data={stats.numbers} title="Numbers in Context" />
          <PieChart data={stats.keywords} title="Key Topics" />
          <Map
            locations={stats.locations}
            onClickLocation={(loc) => setSelectedLocation(loc)}
          />
          {selectedLocation && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
                Details about: {selectedLocation}
              </p>
              <p>Extracted details related to this location go here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
