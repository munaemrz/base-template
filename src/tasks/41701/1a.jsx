import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function Clock({ format24 }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = "";

    if (!format24) {
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${format24 ? hours : hours}:${minutes}:${seconds}${ampm}`;
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        {formatTime(currentTime)}
      </h1>
      <p className="text-sm sm:text-base text-gray-500">
        {currentTime.toDateString()}
      </p>
    </div>
  );
}

export default function App() {
  const [is24Hour, setIs24Hour] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 space-y-4">
        <Clock format24={is24Hour} />
        <div className="flex justify-center">
          <Switch
            checked={is24Hour}
            onCheckedChange={() => setIs24Hour(!is24Hour)}
            className="mr-2"
          />
          <label className="text-sm sm:text-base">
            {is24Hour ? "24-Hour Format" : "12-Hour Format"}
          </label>
        </div>
        <Button
          onClick={() => setIs24Hour(!is24Hour)}
          variant="outline"
          size="sm"
          className="w-full mt-4"
        >
          Toggle Time Format
        </Button>
      </div>
    </div>
  );
}
