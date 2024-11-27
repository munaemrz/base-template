import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Mock API for weather - in real scenario, replace with actual API calls
const mockApi = {
  getCurrentWeather: (city) => new Promise((resolve) => {
    setTimeout(() => resolve({
      temp: Math.floor(Math.random() * 40),
      humidity: Math.floor(Math.random() * 100),
      wind: Math.floor(Math.random() * 20),
      city: city
    }), 1000);
  }),
  getForecast: (city) => new Promise((resolve) => {
    setTimeout(() => resolve(
      Array.from({length: 7}, (_, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        temp: Math.floor(Math.random() * 40)
      }))
    ), 1000);
  })
};

function WeatherCard({ title, data }) {
  return (
    <Card className="mb-4">
      <CardHeader>{title}</CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-2">
            <p>Temperature: {data.temp}°C</p>
            <p>Humidity: {data.humidity}%</p>
            <p>Wind Speed: {data.wind} km/h</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}

function ForecastCard({ forecast }) {
  return (
    <Card>
      <CardHeader>7-Day Forecast</CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {forecast.map((day, idx) => (
            <div key={idx} className="text-center p-2 border rounded">
              <p>{day.day}</p>
              <p>{day.temp}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchWeather = async () => {
    const currentWeather = await mockApi.getCurrentWeather(city);
    const weatherForecast = await mockApi.getForecast(city);
    setWeather(currentWeather);
    setForecast(weatherForecast);
  };

  useEffect(() => {
    if (city) fetchWeather();
  }, [city]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-2xl mb-4">Weather Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input 
          type="text" 
          placeholder="Enter city name" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          className="w-full sm:w-64"
        />
        <Button onClick={fetchWeather} disabled={!city}>Search</Button>
      </div>
      {weather && (
        <div className="w-full max-w-lg">
          <WeatherCard title={`Current Weather in ${weather.city}`} data={weather} />
          <ForecastCard forecast={forecast} />
        </div>
      )}
    </div>
  );
}