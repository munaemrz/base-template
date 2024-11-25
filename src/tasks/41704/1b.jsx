import React, { useState, useEffect } from "react";
import { cn } from "./lib/utils";

// Shadcn components
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

// BMI Calculator component
function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
    if (weight && height) {
      const weightInKg = parseFloat(weight);
      const heightInM = parseFloat(height) / 100;
      const calculatedBMI = weightInKg / (heightInM * heightInM);
      setBMI(calculatedBMI.toFixed(2));

      if (calculatedBMI < 18.5) {
        setInterpretation("Underweight");
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setInterpretation("Normal weight");
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setInterpretation("Overweight");
      } else {
        setInterpretation("Obese");
      }
    } else {
      setBMI(null);
      setInterpretation("");
    }
  }, [weight, height]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter height in cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      {bmi !== null && (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Your BMI: <span className="text-blue-600">{bmi}</span>
          </p>
          <p className="text-md">
            Interpretation:{" "}
            <span className="font-medium text-green-600">{interpretation}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">BMI Calculator</h1>
        <BMICalculator />
      </div>
    </div>
  );
}

// Utility function for Shadcn components
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}