import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

function TemperatureConverter() {
  const [temperature, setTemperature] = useState("");
  const [isCelsiusToFahrenheit, setIsCelsiusToFahrenheit] = useState(true);
  const [error, setError] = useState("");

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
      setTemperature(value);
      setError("");
    } else {
      setError("Please enter a valid number.");
    }
  };

  const convertTemperature = () => {
    if (!temperature) return "";

    const temp = parseFloat(temperature);
    if (isNaN(temp)) return "";

    const result = isCelsiusToFahrenheit
      ? (temp * 9) / 5 + 32
      : ((temp - 32) * 5) / 9;

    return result.toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Temperature Converter
        </h1>
        <div className="mb-4">
          <Input
            type="text"
            value={temperature}
            onChange={handleTemperatureChange}
            placeholder={
              isCelsiusToFahrenheit
                ? "Enter temperature in Celsius"
                : "Enter temperature in Fahrenheit"
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Temperature Input"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Celsius to Fahrenheit</span>
          <Switch
            checked={isCelsiusToFahrenheit}
            onCheckedChange={() =>
              setIsCelsiusToFahrenheit(!isCelsiusToFahrenheit)
            }
            aria-label="Toggle Conversion Direction"
          />
          <span className="text-sm">Fahrenheit to Celsius</span>
        </div>
       {temperature.length > 0 && (
        <div
          className={`${
            temperature && !error ? "bg-blue-100" : "bg-gray-100"
          } border-l-4 border-blue-500 text-blue-700 p-4 rounded`}
        >
          <p className="font-medium">
            Converted Temperature:{" "}
            <span className="font-normal">
              {convertTemperature()} {isCelsiusToFahrenheit ? "°F" : "°C"}
            </span>
          </p>
        </div>
        )}
        <Button
          onClick={() => {
            setTemperature("");
            setError("");
          }}
          className="mt-4 w-full"
        >
          Clear
        </Button>
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
