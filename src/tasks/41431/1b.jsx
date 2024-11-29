import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@shadcn/ui";
import * as math from 'mathjs';

function App() {
  const [functionInput, setFunctionInput] = useState('x^2');
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [range, setRange] = useState({ min: -10, max: 10 });

  useEffect(() => {
    if (functionInput) {
      plotFunction(functionInput);
    }
  }, [functionInput]);

  const validateAndPlot = (funcStr) => {
    try {
      math.parse(funcStr);
      setError(null);
      setFunctionInput(funcStr);
    } catch (e) {
      setError("Invalid function. Please check your input.");
    }
  };

  const plotFunction = (funcStr) => {
    const functionNode = math.parse(funcStr);
    const compiledFunc = functionNode.compile();
    let data = [];
    for (let x = range.min; x <= range.max; x += 0.1) {
      let y;
      try {
        y = compiledFunc.evaluate({ x: x });
        if (!isFinite(y)) y = null; // Handle infinity or NaN
      } catch (e) {
        y = null; // Handle errors in function evaluation
      }
      data.push({ x, y });
    }
    setGraphData(data);
  };

  const reset = () => {
    setFunctionInput('x^2');
    setRange({ min: -10, max: 10 });
    setError(null);
  };

  const presets = [
    'x^2',
    'sin(x)',
    'log(x)',
    'e^x',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">Function Visualizer</h2>
        </CardHeader>
        <CardBody>
          <Input
            value={functionInput}
            onChange={(e) => validateAndPlot(e.target.value)}
            placeholder="Enter a function of x"
            className="mb-4"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label>Range: from 
              <Input 
                type="number" 
                value={range.min} 
                onChange={(e) => setRange({...range, min: Number(e.target.value)})} 
                className="w-20 ml-2 mr-2"
              /> 
              to 
              <Input 
                type="number" 
                value={range.max} 
                onChange={(e) => setRange({...range, max: Number(e.target.value)})} 
                className="w-20 ml-2"
              />
            </label>
          </div>
          <div className="graph-container h-64 border border-gray-300 p-2">
            {graphData.length > 0 && (
              <svg width="100%" height="100%" viewBox={`${range.min} -10 ${range.max - range.min} 20`}>
                <path d={graphData.map((point, i) => 
                  `${i === 0 ? 'M' : 'L'} ${point.x} ${-point.y || 0}`
                ).join(' ')} stroke="blue" fill="none" strokeWidth="0.1"/>
              </svg>
            )}
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <Button key={preset} onClick={() => validateAndPlot(preset)}>
                {preset}
              </Button>
            ))}
            <Button onClick={reset}>Reset</Button>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4 text-sm text-gray-500">
        Note: Use 'x' as the variable. Functions like 'log' for natural logarithm, 'e' for Euler's number are supported.
      </div>
    </div>
  );
}

export default App;