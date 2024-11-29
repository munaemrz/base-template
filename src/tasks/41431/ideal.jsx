import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const parseFunction = (func) => {
  try {
    // Test function parsing by evaluating it with a dummy x value
    const x = 1;
    const y = eval(func);
    if (typeof y === "number" && !isNaN(y)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

const generateGraphPoints = (func, range = [-10, 10], step = 0.1) => {
  const points = [];
  for (let x = range[0]; x <= range[1]; x += step) {
    try {
      const y = eval(func.replace(/x/g, `(${x})`));
      points.push({ x, y });
    } catch {
      // Skip invalid evaluations
    }
  }
  return points;
};

const Graph = ({ points }) => (
  <svg
    viewBox="-12 -12 24 24"
    className="w-full h-64 border bg-gray-100 rounded-md"
  >
    <line
      x1="-12"
      x2="12"
      y1="0"
      y2="0"
      stroke="black"
      strokeWidth="0.05"
    />
    <line
      x1="0"
      x2="0"
      y1="-12"
      y2="12"
      stroke="black"
      strokeWidth="0.05"
    />
    {points.map((point, index) => (
      <circle
        key={index}
        cx={point.x}
        cy={-point.y}
        r="0.1"
        fill="blue"
      />
    ))}
  </svg>
);

export default function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [points, setPoints] = useState([]);
  const [info, setInfo] = useState("");

  const handlePlot = () => {
    if (parseFunction(input)) {
      const points = generateGraphPoints(input);
      setPoints(points);
      setError("");
      setInfo(`Plotting the graph for: y = ${input}`);
    } else {
      setError("Invalid function. Please use a valid mathematical expression.");
      setPoints([]);
      setInfo("");
    }
  };

  const reset = () => {
    setInput("");
    setError("");
    setPoints([]);
    setInfo("");
  };

  const presets = [
    "x*x",
    "Math.sin(x)",
    "Math.cos(x)",
    "Math.exp(x)",
    "Math.log(x)",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        Interactive Function Grapher
      </h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Input Function</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter a function of x, e.g., x*x or Math.sin(x)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handlePlot} className="mr-2">
            Plot
          </Button>
          <Button onClick={reset} variant="secondary">
            Reset
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
      {info && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Function Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{info}</p>
          </CardContent>
        </Card>
      )}
      {points.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <Graph points={points} />
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Preset Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <Button
                key={index}
                onClick={() => setInput(preset)}
                variant="outline"
                className="text-sm"
              >
                {preset}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
