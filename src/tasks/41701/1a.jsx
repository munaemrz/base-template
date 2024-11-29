import React, { useState, useEffect } from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/shadcn-ui";

const timeZones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
];

function formatTime(date, format24) {
  const hours = format24 ? date.getHours() : (date.getHours() % 12 || 12);
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = format24 ? '' : (date.getHours() >= 12 ? 'PM' : 'AM');
  return `${hours}:${minutes}:${seconds}${ampm}`;
}

function getTimeDifference(localDate, selectedZone) {
  const localOffset = localDate.getTimezoneOffset() * 60000;
  const selectedOffset = new Date(localDate.toLocaleString("en-US", {timeZone: selectedZone})).getTime() - localDate.getTime();
  const difference = (selectedOffset - localOffset) / 3600000;
  return {
    hours: Math.floor(Math.abs(difference)),
    sign: difference > 0 ? '+' : '-'
  };
}

function Clock({ timezone, format24 }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>{formatTime(new Date(time), format24)}</div>;
}

export default function App() {
  const [format24, setFormat24] = useState(false);
  const [selectedZone, setSelectedZone] = useState('UTC');

  const localDate = new Date();
  const { hours: diffHours, sign } = getTimeDifference(localDate, selectedZone);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">World Clock</h1>
          <Clock timezone={selectedZone} format24={format24} />
          <div className="mt-2 text-sm text-gray-500">
            Local Time: <Clock timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} format24={format24} />
          </div>
          <div className="mt-2">
            <Button onClick={() => setFormat24(!format24)}>
              Switch to {format24 ? '12-hour' : '24-hour'} format
            </Button>
          </div>
          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{selectedZone}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Timezone</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {timeZones.map(zone => (
                  <DropdownMenuItem key={zone.value} onClick={() => setSelectedZone(zone.value)}>
                    {zone.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4 text-sm">
            Time difference: {sign}{diffHours} hours
          </div>
        </div>
      </div>
    </div>
  );
}