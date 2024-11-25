import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const WeatherCard = ({ weather }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{weather.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          <p className="text-lg">Humidity: {weather.main.humidity}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

const HistoryPanel = ({ history, onHistoryItemClick }) => {
  return (
    <Card className="w-full max-w-md mt-4">
      <CardHeader>
        <CardTitle>Search History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {history.map((city, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full text-left"
              onClick={() => onHistoryItemClick(city)}
            >
              {city}
            </Button>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeather(data);
      setError("");
      updateHistory(cityName);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  const updateHistory = (cityName) => {
    setHistory((prevHistory) => {
      const newHistory = [cityName, ...prevHistory.filter((c) => c !== cityName)];
      return newHistory.slice(0, 5);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const handleRefresh = () => {
    if (weather) {
      fetchWeather(weather.name);
    }
  };

  const handleHistoryItemClick = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              setWeather(data);
              updateHistory(data.name);
            })
            .catch((err) => setError("Error fetching weather data"));
        },
        (err) => setError("Error getting location")
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Weather Dashboard</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-4">
        <div className="flex">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-grow mr-2"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {weather && (
        <div className="w-full max-w-md mb-4">
          <WeatherCard weather={weather} />
          <Button onClick={handleRefresh} className="mt-2 w-full">
            Refresh
          </Button>
        </div>
      )}
      <HistoryPanel history={history} onHistoryItemClick={handleHistoryItemClick} />
    </div>
  );
}