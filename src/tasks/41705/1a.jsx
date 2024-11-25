import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

function TemperatureConverter() {
  const [temperature, setTemperature] = useState("");
  const [isCelsiusToFahrenheit, setIsCelsiusToFahrenheit] = useState(true);

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    setTemperature(value.replace(/[^0-9.-]/g, "")); // Allow only numbers, minus, and dot
  };

  const convertTemperature = () => {
    if (!temperature) return "";

    let result;
    if (isCelsiusToFahrenheit) {
      result = (parseFloat(temperature) * 9) / 5 + 32;
    } else {
      result = ((parseFloat(temperature) - 32) * 5) / 9;
    }

    return result.toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Temperature Converter
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={temperature}
            onChange={handleTemperatureChange}
            placeholder="Enter temperature"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Celsius to Fahrenheit</span>
          <Switch
            checked={isCelsiusToFahrenheit}
            onCheckedChange={() =>
              setIsCelsiusToFahrenheit(!isCelsiusToFahrenheit)
            }
          />
          <span className="text-sm">Fahrenheit to Celsius</span>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <p className="font-medium">
            Converted Temperature:{" "}
            <span className="font-normal">
              {convertTemperature()} {isCelsiusToFahrenheit ? "°F" : "°C"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <TemperatureConverter />
    </React.StrictMode>
  );
}
