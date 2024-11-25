import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Mock API call for weather data
const fetchWeather = async (city) => {
  // This is a placeholder. In a real app, you'd call an actual weather API.
  return {
    temperature: Math.floor(Math.random() * 30) + 10, // Random temp for demo
    humidity: Math.floor(Math.random() * 100),
    description: 'Sunny', // Static for demo
    city: city,
  };
};

function WeatherCard({ weather }) {
  return (
    <Card className="w-full max-w-sm mx-auto sm:mx-0">
      <CardHeader>
        <CardTitle>{weather.city}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Temperature: {weather.temperature}°C</p>
        <p>Humidity: {weather.humidity}%</p>
        <p>Weather: {weather.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => fetchWeather(weather.city)}>Refresh</Button>
      </CardFooter>
    </Card>
  );
}

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="city">City</Label>
      <Input 
        id="city" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="Enter city name"
      />
      <Button onClick={() => onSearch(city)}>Search</Button>
    </div>
  );
}

function HistoryPanel({ history, onSelect }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">History</h3>
      <ul className="space-y-1">
        {history.map((city, index) => (
          <li key={index} className="cursor-pointer text-blue-600 hover:underline" onClick={() => onSelect(city)}>
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (city) => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      setHistory(prev => {
        const newHistory = [city, ...prev.filter(c => c !== city)].slice(0, 5);
        return newHistory;
      });
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('London'); // Default city
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : weather && <WeatherCard weather={weather} />}
      <HistoryPanel history={history} onSelect={handleSearch} />
    </div>
  );
}