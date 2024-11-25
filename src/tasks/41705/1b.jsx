import React, { useState } from "react";
import * as Switch from "@radix-ui/react-switch";

const TemperatureInput = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const ConversionToggle = ({ isCelsius, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${isCelsius ? "font-bold" : ""}`}>°C</span>
      <Switch.Root
        checked={!isCelsius}
        onCheckedChange={() => onChange(!isCelsius)}
        className="w-11 h-6 bg-gray-200 rounded-full relative shadow-inner"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform duration-100 transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <span className={`text-sm ${!isCelsius ? "font-bold" : ""}`}>°F</span>
    </div>
  );
};

const ResultDisplay = ({ value }) => {
  return (
    <div className="text-2xl font-bold text-center p-4 bg-gray-100 rounded-md">
      {value}
    </div>
  );
};

export default function App() {
  const [temperature, setTemperature] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  const convertTemperature = (value, fromCelsius) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";
    if (fromCelsius) {
      return ((numValue * 9) / 5 + 32).toFixed(2);
    } else {
      return (((numValue - 32) * 5) / 9).toFixed(2);
    }
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value);
  };

  const handleToggleChange = (newIsCelsius) => {
    setIsCelsius(newIsCelsius);
    setTemperature(convertTemperature(temperature, !newIsCelsius));
  };

  const convertedTemperature = convertTemperature(temperature, isCelsius);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Temperature Converter
        </h2>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Temperature
              </label>
              <TemperatureInput
                value={temperature}
                onChange={handleTemperatureChange}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <ConversionToggle
              isCelsius={isCelsius}
              onChange={handleToggleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Converted Temperature
            </label>
            <ResultDisplay
              value={`${convertedTemperature} °${isCelsius ? "F" : "C"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
