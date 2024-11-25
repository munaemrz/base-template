import React, { useState, useEffect } from "react";
import { Button, } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function extractStats(text) {
  const numbers = text.match(/\b\d+(?:[.,]\d+)?%?\b/g) || [];
  const keywords = text.match(/\b[A-Za-z]{5,}\b/g) || [];
  const locations = text.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g) || [];
  return {
    numbers: numbers.map(Number),
    keywords: [...new Set(keywords)].slice(0, 5),
    locations: [...new Set(locations)],
  };
}

const BarChart = ({ data, title }) => (
  <div className="w-full">
    <h3 className="text-center font-bold mb-2">{title}</h3>
    <div className="flex h-40 items-end space-x-2">
      {data.map((value, index) => (
        <div key={index} className="bg-blue-500 w-8" style={{ height: `${(value / Math.max(...data)) * 100}%` }}>
          
            <div className="h-full"></div>
          
        </div>
      ))}
    </div>
  </div>
);

const PieChart = ({ data, title }) => (
  <div className="w-40 h-40 relative mx-auto">
    <h3 className="text-center font-bold mb-2">{title}</h3>
    <svg viewBox="0 0 32 32" className="w-full h-full">
      {data.reduce((acc, { value }, i) => {
        const startAngle = acc.startAngle;
        const endAngle = startAngle + value * 3.6;
        const largeArcFlag = value > 50 ? 1 : 0;
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
          ],
          startAngle: endAngle,
        };
      }, { paths: [], startAngle: 0 }).paths}
    </svg>
  </div>
);

const Map = ({ locations }) => (
  <div className="relative w-full h-64 bg-gray-100 rounded">
    {locations.map((loc, idx) => (
        <div
          className="absolute bg-red-500 w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
        ></div>
        
    ))}
  </div>
);

export default function App() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ numbers: [], keywords: [], locations: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (text.length < 50) {
      setError("Please enter at least 50 characters.");
      setStats({ numbers: [], keywords: [], locations: [] });
    } else {
      setError("");
      setStats(extractStats(text));
    }
  }, [text]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Article Visualizer</h1>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your article here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => setText("")}>Clear</Button>
        </CardFooter>
      </Card>
      {stats.numbers.length > 0 && (
        <div className="mt-4 space-y-4">
          <BarChart data={stats.numbers} title="Numbers in Article" />
          <PieChart
            data={stats.keywords.map((k) => ({ name: k, value: 20 }))}
            title="Key Topics"
          />
          <Map locations={stats.locations} />
        </div>
      )}
    </div>
  );
}
