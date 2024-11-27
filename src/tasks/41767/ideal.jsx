import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Mock API for weather data
const mockApi = {
  getCurrentWeather: (city) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          name: city,
          main: {
            temp: Math.floor(Math.random() * 35) + 5, // Random temperature
            humidity: Math.floor(Math.random() * 100), // Random humidity
          },
          wind: {
            speed: Math.floor(Math.random() * 20) + 5, // Random wind speed
          },
          weather: [{ description: "Clear sky" }],
        });
      }, 1000)
    ),
  getForecast: (city) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(
          Array.from({ length: 7 }, (_, i) => ({
            dt: Date.now() / 1000 + i * 86400,
            temp: { day: Math.floor(Math.random() * 35) + 5 },
            weather: [{ description: "Sunny" }],
          }))
        );
      }, 1000)
    ),
};

function WeatherDetails({ data }) {
  return (
    <Card className="p-4 mb-4">
      <CardHeader className="text-xl font-bold">{data.name}</CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <p className="text-4xl">{Math.round(data.main.temp)}°C</p>
          <div>
            <p>{data.weather[0].description}</p>
            <p>Humidity: {data.main.humidity}%</p>
            <p>Wind: {data.wind.speed} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Forecast({ data }) {
  return (
    <Card className="p-4">
      <CardHeader className="text-xl font-bold">7-Day Forecast</CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.map((day, idx) => (
            <div key={idx} className="text-center">
              <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</p>
              <p>{Math.round(day.temp.day)}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCity(value);
    }
  };

  const fetchWeather = async () => {
    try {
      setError(null);
      const currentWeather = await mockApi.getCurrentWeather(city);
      const weatherForecast = await mockApi.getForecast(city);
      setWeather(currentWeather);
      setForecast(weatherForecast);
    } catch (err) {
      setError("Failed to fetch data.");
      setWeather(null);
      setForecast(null);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
          className="flex-grow"
        />
        <Button onClick={fetchWeather} disabled={!city.trim()}>Search</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {weather && <WeatherDetails data={weather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}
