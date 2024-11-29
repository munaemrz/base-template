import React, { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const timezones = [
  { label: "New York", value: "America/New_York" },
  { label: "London", value: "Europe/London" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Sydney", value: "Australia/Sydney" },
];

function TimeDisplay({ date, is24Hour }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
    });
  };

  return (
    <div className="text-3xl font-bold">
      {date.toDateString()} {formatTime(date)}
    </div>
  );
}

function TimeDifference({ localTime, selectedTime }) {
  const diffInHours = (selectedTime - localTime) / (1000 * 60 * 60);
  const absHours = Math.abs(Math.round(diffInHours * 10) / 10);
  const sign = diffInHours >= 0 ? "+" : "-";

  return (
    <div className="text-lg">
      Time Difference: {sign}{absHours} hours
    </div>
  );
}

function ToggleButton({ is24Hour, setIs24Hour }) {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => setIs24Hour(!is24Hour)}
    >
      Toggle {is24Hour ? "12-hour" : "24-hour"}
    </button>
  );
}

function TimezoneDropdown({ selectedTimezone, setSelectedTimezone }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        {selectedTimezone.label}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white rounded shadow-lg p-2">
        {timezones.map((tz) => (
          <DropdownMenu.Item
            key={tz.value}
            className="px-2 py-1 cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedTimezone(tz)}
          >
            {tz.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default function App() {
  const [localTime, setLocalTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLocalTime(now);
      setSelectedTime(
        new Date(now.toLocaleString("en-US", { timeZone: selectedTimezone.value }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTimezone]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Time Widget</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Local Time</h2>
            <TimeDisplay date={localTime} is24Hour={is24Hour} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Selected Timezone</h2>
            <TimeDisplay date={selectedTime} is24Hour={is24Hour} />
          </div>
          <TimeDifference localTime={localTime} selectedTime={selectedTime} />
          <div className="flex justify-between items-center">
            <ToggleButton is24Hour={is24Hour} setIs24Hour={setIs24Hour} />
            <TimezoneDropdown
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}