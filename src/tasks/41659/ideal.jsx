import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockWeatherData = {
  London: { temperature: 15, humidity: 60, description: "Cloudy" },
  Paris: { temperature: 18, humidity: 50, description: "Sunny" },
  NewYork: { temperature: 10, humidity: 70, description: "Rainy" },
};

const WeatherCard = ({ weather }) => (
  <Card className="w-full max-w-sm mx-auto sm:mx-0">
    <CardHeader>
      <CardTitle>{weather.city}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Weather: {weather.description}</p>
    </CardContent>
  </Card>
);

const HistoryPanel = ({ history, onSelect }) => (
  <div className="mt-4">
    <h3 className="mb-2 text-lg font-semibold">Search History</h3>
    <ul className="space-y-1">
      {history.map((city, index) => (
        <li
          key={index}
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => onSelect(city)}
        >
          {city}
        </li>
      ))}
    </ul>
  </div>
);

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSearch = (cityName) => {
    if (mockWeatherData[cityName]) {
      const weatherData = { ...mockWeatherData[cityName], city: cityName };
      setWeather(weatherData);
      setHistory((prev) => {
        const updatedHistory = [cityName, ...prev.filter((c) => c !== cityName)];
        return updatedHistory.slice(0, 5);
      });
    } else {
      alert("City not found in mock data");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button onClick={() => handleSearch(city)}>Search</Button>
      </div>
      {weather && <WeatherCard weather={weather} />}
      <HistoryPanel history={history} onSelect={handleSearch} />
    </div>
  );
}
