import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

function WeatherIcon({ icon }) {
  return (
    <img
      src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="Weather icon"
      className="w-16 h-16"
    />
  );
}

function CurrentWeather({ data }) {
  if (!data) return null;

  return (
    <Card className="p-4 mb-4">
      <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
      <div className="flex items-center">
        <WeatherIcon icon={data.weather[0].icon} />
        <div className="ml-4">
          <p className="text-4xl font-bold">{Math.round(data.main.temp)}°C</p>
          <p className="text-lg">{data.weather[0].description}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <p>Humidity: {data.main.humidity}%</p>
        <p>Wind: {data.wind.speed} m/s</p>
      </div>
    </Card>
  );
}

function ForecastDay({ data }) {
  const date = new Date(data.dt * 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <Card className="p-2 text-center">
      <p className="font-bold">{dayName}</p>
      <WeatherIcon icon={data.weather[0].icon} />
      <p className="text-sm">{Math.round(data.temp.day)}°C</p>
    </Card>
  );
}

function Forecast({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
      {data.daily.slice(0, 7).map((day) => (
        <ForecastDay key={day.dt} data={day} />
      ))}
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setError(null);
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentResponse.json();

      if (currentData.cod !== 200) {
        throw new Error(currentData.message);
      }

      setCurrentWeather(currentData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, [city]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Weather Dashboard</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={fetchWeather}>Search</Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <CurrentWeather data={currentWeather} />
      <h2 className="text-2xl font-bold mb-2">7-Day Forecast</h2>
      <Forecast data={forecast} />
    </div>
  );
}