import React, { useState } from "react";

// Shadcn Switch component
const Switch = ({ checked, onCheckedChange }) => (
  <div
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`w-11 h-6 bg-gray-300 rounded-full relative cursor-pointer ${
      checked ? "bg-blue-500" : ""
    }`}
  >
    <div
      className={`h-5 w-5 bg-white rounded-full shadow transition-transform ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    ></div>
  </div>
);

export default function App() {
  const [temperature, setTemperature] = useState("");
  const [isCelsiusToFahrenheit, setIsCelsiusToFahrenheit] = useState(true);

  const handleInputChange = (e) => {
    setTemperature(e.target.value.replace(/[^0-9.-]/g, ""));
  };

  const convertTemperature = () => {
    if (!temperature) return "";
    const value = parseFloat(temperature);
    return isNaN(value)
      ? ""
      : isCelsiusToFahrenheit
      ? ((value * 9) / 5 + 32).toFixed(2)
      : (((value - 32) * 5) / 9).toFixed(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Temperature Converter
        </h1>
        <input
          type="text"
          value={temperature}
          onChange={handleInputChange}
          placeholder="Enter temperature"
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Celsius to Fahrenheit</span>
          <Switch
            checked={isCelsiusToFahrenheit}
            onCheckedChange={setIsCelsiusToFahrenheit}
          />
          <span className="text-sm">Fahrenheit to Celsius</span>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-lg">
            Converted Temperature:{" "}
            <span className="font-bold">
              {convertTemperature()} {isCelsiusToFahrenheit ? "°F" : "°C"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
