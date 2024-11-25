import React, { useState, useEffect } from 'react';

// Custom components using Shadcn UI style
const Input = ({ label, value, onChange, type = 'number' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
  </div>
);

const Button = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
  >
    {children}
  </button>
);

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [interpretation, setInterpretation] = useState('');

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBMI(bmiValue.toFixed(2));
      
      if (bmiValue < 18.5) setInterpretation('Underweight');
      else if (bmiValue < 25) setInterpretation('Normal weight');
      else if (bmiValue < 30) setInterpretation('Overweight');
      else setInterpretation('Obese');
    } else {
      setBMI(null);
      setInterpretation('');
    }
  }, [weight, height]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-6 text-center">BMI Calculator</h2>
        <Input label="Weight (kg)" value={weight} onChange={setWeight} />
        <Input label="Height (cm)" value={height} onChange={setHeight} />
        
        {bmi && (
          <div className="mt-4 text-center">
            <p className="text-lg">Your BMI: <span className="font-bold">{bmi}</span></p>
            <p className="text-sm mt-2 text-gray-600">Interpretation: {interpretation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <BMICalculator />;
}