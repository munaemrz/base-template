import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const timeZones = [
  { label: "GMT", offset: 0 },
  { label: "EST (Eastern Standard Time)", offset: -5 },
  { label: "PST (Pacific Standard Time)", offset: -8 },
  { label: "CET (Central European Time)", offset: 1 },
  { label: "IST (India Standard Time)", offset: 5.5 },
];

function TimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState(timeZones[0]);
  const [localOffset, setLocalOffset] = useState(
    -new Date().getTimezoneOffset() / 60
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, offset) => {
    const localDate = new Date(date.getTime() + offset * 3600000);
    const hours = is24Hour
      ? localDate.getHours()
      : localDate.getHours() % 12 || 12;
    const minutes = localDate.getMinutes().toString().padStart(2, "0");
    const seconds = localDate.getSeconds().toString().padStart(2, "0");
    const ampm = is24Hour ? "" : localDate.getHours() >= 12 ? " PM" : " AM";
    return `${hours}:${minutes}:${seconds}${ampm}`;
  };

  const timeDifference = selectedTimeZone.offset - localOffset;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Date & Time Widget</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl font-bold">
          {formatTime(currentTime, 0)}
        </div>
        <div className="text-lg text-muted-foreground">
          {currentTime.toDateString()}
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Compare with Timezone:
          </label>
          <select
            value={selectedTimeZone.label}
            onChange={(e) =>
              setSelectedTimeZone(
                timeZones.find((tz) => tz.label === e.target.value)
              )
            }
            className="px-4 py-2 border rounded-md"
          >
            {timeZones.map((tz) => (
              <option key={tz.label} value={tz.label}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 text-lg">
          <div>
            Time in {selectedTimeZone.label}:{" "}
            <span className="font-semibold">
              {formatTime(currentTime, timeDifference)}
            </span>
          </div>
          <div>
            Difference:{" "}
            <span className="font-semibold">
              {timeDifference > 0
                ? `+${timeDifference} hours`
                : `${timeDifference} hours`}
            </span>
          </div>
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
