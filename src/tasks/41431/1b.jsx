import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as math from 'mathjs';

const Graph = ({ expression, range }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const calculatePoints = () => {
      const xValues = Array.from({length: 200}, (_, i) => range.min + (i * (range.max - range.min) / 200));
      const yValues = xValues.map(x => {
        try {
          return math.evaluate(expression, {x});
        } catch (e) {
          return NaN;
        }
      });
      setPoints(xValues.map((x, i) => [x, yValues[i]]));
    };
    calculatePoints();
  }, [expression, range]);

  return (
    <div className="w-full h-64 sm:h-96">
      <svg viewBox={`${range.min} -10 ${Math.abs(range.max - range.min)} 20`} className="w-full h-full">
        <path d={`M${points.map(p => `${p[0]} ${-p[1]}`).join(' L')}`} fill="none" stroke="blue" strokeWidth="2" />
      </svg>
    </div>
  );
};

const FunctionInfo = ({ expression }) => {
  let info = { type: 'Unknown', degree: 'N/A', domain: 'All real numbers', range: 'N/A' };
  
  try {
    const node = math.parse(expression);
    info.type = node.type;
    if (node.type === 'FunctionNode') {
      const fn = node.fn.name;
      if (fn === 'sin' || fn === 'cos') info.range = '[-1, 1]';
    } else if (node.type === 'PolynomialTerm') {
      info.degree = node.degree;
    }
  } catch (e) {}

  return (
    <div className="mt-4">
      <p><strong>Type:</strong> {info.type}</p>
      <p><strong>Degree:</strong> {info.degree}</p>
      <p><strong>Domain:</strong> {info.domain}</p>
      <p><strong>Range:</strong> {info.range}</p>
    </div>
  );
};

const educationApp = () => {
  const [functionInput, setFunctionInput] = useState('x^2');
  const [error, setError] = useState('');
  const [range, setRange] = useState({ min: -10, max: 10 });
  const examples = ['x', 'x^2', 'sin(x)', 'log(x)', 'e^x'];

  const validateFunction = useCallback(() => {
    try {
      math.evaluate(functionInput, {x: 0});
      setError('');
    } catch (e) {
      setError('Invalid function. Please check your input.');
    }
  }, [functionInput]);

  useEffect(() => {
    validateFunction();
  }, [validateFunction]);

  const handleExampleSelect = (example) => {
    setFunctionInput(example);
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Function Visualizer</CardTitle>
          <CardDescription>Enter a function to see its graph.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="function">Function</Label>
          <Input 
            id="function" 
            value={functionInput} 
            onChange={(e) => setFunctionInput(e.target.value)} 
            className="mb-2"
            onBlur={validateFunction}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="mt-4">
            {examples.map(example => (
              <Button 
                key={example} 
                variant="outline" 
                className="mr-2 mb-2" 
                onClick={() => handleExampleSelect(example)}
              >
                {example}
              </Button>
            ))}
          </div>
          
          <Graph expression={functionInput} range={range} />
          <FunctionInfo expression={functionInput} />
        </CardContent>
        <CardFooter>
          <Button onClick={() => { setFunctionInput(''); setError(''); }}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default educationApp;