import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = is24Hour
      ? currentTime.getHours()
      : currentTime.getHours() % 12 || 12;
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    const ampm = is24Hour ? "" : currentTime.getHours() >= 12 ? " PM" : " AM";
    return `${hours}:${minutes}:${seconds}${ampm}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Date & Time Widget</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl font-bold">{formatTime()}</div>
        <div className="text-lg text-muted-foreground">
          {currentTime.toDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          {is24Hour ? "Switch to 12-Hour" : "Switch to 24-Hour"}
        </button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TimeWidget />
    </div>
  );
}
