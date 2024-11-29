import React, { useState, useEffect } from "react";
import * as math from "mathjs";

// Shadcn components (simplified versions)
const Button = ({ children, onClick, className }) => (
  <button
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded px-2 py-1 ${className}`}
  />
);

const Select = ({ options, value, onChange, className }) => (
  <select
    value={value}
    onChange={onChange}
    className={`border rounded px-2 py-1 ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Graph component
const Graph = ({ func, xRange, yRange }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const generatePoints = () => {
      const newPoints = [];
      for (let x = xRange[0]; x <= xRange[1]; x += 0.1) {
        try {
          const y = func(x);
          if (!isNaN(y) && isFinite(y)) {
            newPoints.push({ x, y });
          }
        } catch (error) {
          // Skip invalid points
        }
      }
      setPoints(newPoints);
    };

    generatePoints();
  }, [func, xRange]);

  const width = 300;
  const height = 200;
  const xScale = width / (xRange[1] - xRange[0]);
  const yScale = height / (yRange[1] - yRange[0]);

  return (
    <svg width={width} height={height} className="border">
      {/* X and Y axes */}
      <line
        x1={0}
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke="black"
      />
      <line
        x1={width / 2}
        y1={0}
        x2={width / 2}
        y2={height}
        stroke="black"
      />

      {/* Plot points */}
      <polyline
        points={points
          .map(
            ({ x, y }) =>
              `${(x - xRange[0]) * xScale},${height - (y - yRange[0]) * yScale}`
          )
          .join(" ")}
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />
    </svg>
  );
};

// Main App component
export default function App() {
  const [input, setInput] = useState("");
  const [func, setFunc] = useState(null);
  const [error, setError] = useState("");
  const [xRange, setXRange] = useState([-10, 10]);
  const [yRange, setYRange] = useState([-10, 10]);

  const presetFunctions = [
    { label: "Select a preset", value: "" },
    { label: "y = x^2", value: "x^2" },
    { label: "y = sin(x)", value: "sin(x)" },
    { label: "y = e^x", value: "e^x" },
  ];

  const handleInputChange = (e) => {
    setInput(e.target.value);
    validateAndSetFunction(e.target.value);
  };

  const validateAndSetFunction = (expression) => {
    try {
      const compiledFunc = math.compile(expression);
      setFunc((x) => compiledFunc.evaluate({ x }));
      setError("");
    } catch (err) {
      setError("Invalid function");
      setFunc(null);
    }
  };

  const handlePresetChange = (e) => {
    setInput(e.target.value);
    validateAndSetFunction(e.target.value);
  };

  const handleReset = () => {
    setInput("");
    setFunc(null);
    setError("");
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Function Visualizer</h1>
      <div className="space-y-4">
        <div>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Enter a function (e.g., x^2)"
            className="w-full"
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <Select
            options={presetFunctions}
            value={input}
            onChange={handlePresetChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={handleReset}>Reset</Button>
        </div>
        {func && (
          <div>
            <Graph func={func} xRange={xRange} yRange={yRange} />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Function Information</h2>
              <p>Expression: y = {input}</p>
              <p>Domain: All real numbers (for most functions)</p>
              <p>Range: Depends on the specific function</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}