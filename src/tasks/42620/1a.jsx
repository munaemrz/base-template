import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components (simplified versions)
const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
      className
    )}
    {...props}
  />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

// Study Planner Components
const StudySessionForm = ({ onAddSession }) => {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSession({ subject, date, time, completed: false });
    setSubject("");
    setDate("");
    setTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <Button type="submit">Add Session</Button>
    </form>
  );
};

const CalendarView = ({ sessions }) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysOfWeek.map((day) => (
        <div key={day} className="text-center font-bold">
          {day}
        </div>
      ))}
      {[...Array(7)].map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + index);
        const dateString = date.toISOString().split("T")[0];
        const daySessions = sessions.filter(
          (session) => session.date === dateString
        );

        return (
          <div
            key={dateString}
            className="border p-2 h-24 overflow-y-auto text-sm"
          >
            <div className="font-semibold">{date.getDate()}</div>
            {daySessions.map((session, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-1 mb-1 rounded",
                  session.completed ? "bg-green-200" : "bg-yellow-200"
                )}
              >
                {session.subject} - {session.time}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const DailySummary = ({ sessions }) => {
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((session) => session.date === today);
  const totalHours = todaySessions.reduce((acc, session) => {
    const [hours, minutes] = session.time.split(":");
    return acc + parseInt(hours) + parseInt(minutes) / 60;
  }, 0);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Daily Summary</h2>
      <p>Total planned study hours today: {totalHours.toFixed(2)}</p>
    </div>
  );
};

const WeeklyProgress = ({ sessions }) => {
  const completedSessions = sessions.filter((session) => session.completed);
  const progressPercentage = (completedSessions.length / sessions.length) * 100;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Weekly Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="mt-2">
        {completedSessions.length} out of {sessions.length} sessions completed (
        {progressPercentage.toFixed(2)}%)
      </p>
    </div>
  );
};

export default function App() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem("studySessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studySessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (newSession) => {
    setSessions([...sessions, newSession]);
  };

  const deleteSession = (index) => {
    const updatedSessions = sessions.filter((_, idx) => idx !== index);
    setSessions(updatedSessions);
  };

  const toggleSessionCompletion = (index) => {
    const updatedSessions = sessions.map((session, idx) =>
      idx === index ? { ...session, completed: !session.completed } : session
    );
    setSessions(updatedSessions);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Study Planner</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Add Study Session</h2>
          <StudySessionForm onAddSession={addSession} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          <ul className="space-y-2">
            {sessions.map((session, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {session.subject} - {session.date} {session.time}
                </span>
                <div>
                  <Button
                    onClick={() => toggleSessionCompletion(index)}
                    className="mr-2"
                  >
                    {session.completed ? "Undo" : "Complete"}
                  </Button>
                  <Button onClick={() => deleteSession(index)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Calendar View</h2>
        <CalendarView sessions={sessions} />
      </div>
      <DailySummary sessions={sessions} />
      <WeeklyProgress sessions={sessions} />
    </div>
  );
}