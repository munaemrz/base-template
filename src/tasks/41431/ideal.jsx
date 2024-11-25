import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GRAPH_WIDTH = 300;
const GRAPH_HEIGHT = 200;
const X_RANGE = 20;

function evaluateFunction(func, x) {
  try {
    return Function("x", `return ${func}`)(x);
  } catch {
    return NaN;
  }
}

function validateFunction(func) {
  try {
    Function("x", `return ${func}`);
    return true;
  } catch {
    return false;
  }
}

function Graph({ func }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const newPoints = [];
    for (let i = -X_RANGE / 2; i <= X_RANGE / 2; i += 0.1) {
      const y = evaluateFunction(func, i);
      newPoints.push({ x: i, y });
    }
    setPoints(newPoints);
  }, [func]);

  const xScale = GRAPH_WIDTH / X_RANGE;
  const yScale = GRAPH_HEIGHT / 10;

  return (
    <svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} className="bg-gray-100">
      <line x1="0" y1={GRAPH_HEIGHT / 2} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT / 2} stroke="black" />
      <line x1={GRAPH_WIDTH / 2} y1="0" x2={GRAPH_WIDTH / 2} y2={GRAPH_HEIGHT} stroke="black" />
      {points.map(({ x, y }, index) => (
        <circle
          key={index}
          cx={x * xScale + GRAPH_WIDTH / 2}
          cy={GRAPH_HEIGHT / 2 - y * yScale}
          r="1"
          fill="blue"
        />
      ))}
    </svg>
  );
}

export default function App() {
  const [currentFunction, setCurrentFunction] = useState("x");
  const [error, setError] = useState("");

  const handleSubmit = (func) => {
    if (validateFunction(func)) {
      setCurrentFunction(func);
      setError("");
    } else {
      setError("Invalid function. Please check your input.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Function Visualizer</CardTitle>
          <CardDescription>Input a mathematical function to see its graph.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter a function (e.g., x**2)"
            onChange={(e) => handleSubmit(e.target.value)}
            className="mb-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Graph func={currentFunction} />
        </CardContent>
        <CardFooter>
          <Button onClick={() => setCurrentFunction("x")}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
