import React, { useState, useEffect } from "react";

// Shadcn-styled Input component
const Input = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />
  </div>
);

export default function App() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBMI(bmiValue.toFixed(2));

      if (bmiValue < 18.5) {
        setInterpretation("Underweight");
      } else if (bmiValue < 25) {
        setInterpretation("Normal weight");
      } else if (bmiValue < 30) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 text-center">BMI Calculator</h1>
        <Input label="Weight (kg)" value={weight} onChange={setWeight} />
        <Input label="Height (cm)" value={height} onChange={setHeight} />
        {bmi && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">Your BMI: {bmi}</p>
            <p className="text-sm text-gray-600">Interpretation: {interpretation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
