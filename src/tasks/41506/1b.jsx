import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PieChart, BarChart } from "./Charts"; // Assume these are custom components for charts

function extractStats(text) {
  const numbers = text.match(/\b\d+(?:[.,]\d+)?\b/g) || [];
  const keywords = text.match(/\b\w{5,}\b/g) || [];
  const locations = text.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g) || [];
  return {
    numbers,
    keywords: [...new Set(keywords)].slice(0, 5),
    locations: [...new Set(locations)],
  };
}

function Map({ locations }) {
  return (
    <div className="relative w-full h-64 bg-gray-100 rounded">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs">Map Placeholder</p>
        {locations.map((loc, idx) => (
          <Tooltip key={idx} content={loc}>
            <div
              className="absolute bg-blue-500 w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    numbers: [],
    keywords: [],
    locations: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (text.length > 0 && text.length < 50) {
      setError("Input must be at least 50 characters long.");
    } else if (text.length === 0) {
      setError("Please enter some text.");
    } else {
      setError("");
      setStats(extractStats(text));
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Article Visualizer</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste or type your article here..."
            value={text}
            onChange={handleTextChange}
            className="w-full min-h-[200px]"
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => setText("")}>Clear</Button>
        </CardFooter>
      </Card>

      {stats.numbers.length > 0 && (
        <div className="w-full space-y-4">
          <BarChart data={stats.numbers} title="Numbers in Article" />
          <PieChart
            data={stats.keywords.map((k) => ({ name: k, value: 1 }))}
            title="Key Topics"
          />
          <Map locations={stats.locations} />
        </div>
      )}
    </div>
  );
}
