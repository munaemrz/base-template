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
  } catch (error) {
    return NaN;
  }
}

function validateFunction(func) {
  try {
    Function("x", `return ${func}`);
    return true;
  } catch (error) {
    return false;
  }
}

function getFunctionInfo(func) {
  if (func.includes("**2") || func.includes("Math.pow")) {
    return "Quadratic function";
  } else if (func.includes("Math.sin") || func.includes("Math.cos") || func.includes("Math.tan")) {
    return "Trigonometric function";
  } else if (func.includes("x") && !func.includes("**") && !func.includes("Math.pow")) {
    return "Linear function";
  } else {
    return "Unknown function type";
  }
}

function Graph({ func }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const newPoints = [];
    for (let i = -X_RANGE / 2; i <= X_RANGE / 2; i += 0.1) {
      const x = i;
      const y = evaluateFunction(func, x);
      newPoints.push({ x, y });
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

function FunctionInput({ onSubmit }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFunction(input)) {
      setError("");
      onSubmit(input);
    } else {
      setError("Invalid function. Please check your input.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a function (e.g., x**2)"
        className="w-full"
      />
      <Button type="submit">Graph</Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

function FunctionInfo({ func }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">Function Information:</h3>
      <p>Type: {getFunctionInfo(func)}</p>
      <p>Domain: All real numbers (for most functions)</p>
      <p>Range: Depends on the function</p>
    </div>
  );
}

function ExampleFunctions({ onSelect }) {
  const examples = [
    { label: "Linear", func: "2 * x + 1" },
    { label: "Quadratic", func: "x**2" },
    { label: "Sine", func: "Math.sin(x)" },
    { label: "Cosine", func: "Math.cos(x)" },
  ];

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an example function" />
      </SelectTrigger>
      <SelectContent>
        {examples.map((example, index) => (
          <SelectItem key={index} value={example.func}>
            {example.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FunctionExplanations() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Common Functions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Linear:</strong> f(x) = mx + b, where m is the slope and b is the y-intercept.
          </li>
          <li>
            <strong>Quadratic:</strong> f(x) = ax² + bx + c, forms a parabola.
          </li>
          <li>
            <strong>Trigonometric:</strong> sin(x), cos(x), tan(x) - periodic functions.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

const educationalApp = () => {
  const [currentFunction, setCurrentFunction] = useState("x");

  const handleReset = () => {
    setCurrentFunction("x");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Function Visualizer</CardTitle>
          <CardDescription>Enter a function to see its graph and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FunctionInput onSubmit={setCurrentFunction} />
            <ExampleFunctions onSelect={setCurrentFunction} />
            <Graph func={currentFunction} />
            <FunctionInfo func={currentFunction} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Reset
          </Button>
        </CardFooter>
      </Card>
      <FunctionExplanations />
    </div>
  );
}

export default educationalApp;