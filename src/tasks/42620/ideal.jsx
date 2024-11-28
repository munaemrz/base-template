import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

const App = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState({
    subject: "",
    date: "",
    time: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveSession = () => {
    if (currentSession.id) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id ? { ...s, ...currentSession } : s
        )
      );
    } else {
      setSessions((prev) => [
        ...prev,
        { ...currentSession, id: Date.now(), completed: false },
      ]);
    }
    resetForm();
  };

  const handleEditSession = (session) => {
    setCurrentSession(session);
    setDialogOpen(true);
  };

  const handleDeleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const resetForm = () => {
    setCurrentSession({ subject: "", date: "", time: "" });
    setDialogOpen(false);
  };

  const toggleCompletion = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      )
    );
  };

  const filteredSessions = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dailySummary = () => {
    const today = new Date().toISOString().split("T")[0];
    return filteredSessions.filter((s) => s.date === today).length;
  };

  const addSession = () => {
    resetForm();
    setDialogOpen(true);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Study Planner</h1>
      <Input
        placeholder="Search sessions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={(e) => addSession()}
      >
        Add Session
      </Button>
      <div className="grid gap-4 mt-4">
        {filteredSessions.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold">{s.subject}</h2>
            <p>
              {s.date} at {s.time}
            </p>
            <div className="flex space-x-2 mt-2">
              <Button onClick={() => toggleCompletion(s.id)}>
                {s.completed ? "Undo" : "Complete"}
              </Button>
              <Button onClick={() => handleEditSession(s)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteSession(s.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-bold">Daily Summary</h2>
        <p>Planned sessions: {dailySummary()}</p>
      </div>
     {dialogOpen && ( 
     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="p-4">
          <Input
            placeholder="Subject"
            value={currentSession.subject}
            onChange={(e) =>
              setCurrentSession((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Date"
            type="date"
            value={currentSession.date}
            onChange={(e) =>
              setCurrentSession((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Time"
            type="time"
            value={currentSession.time}
            onChange={(e) =>
              setCurrentSession((prev) => ({
                ...prev,
                time: e.target.value,
              }))
            }
          />
          <Button onClick={handleSaveSession} className="mt-4">
            Save
          </Button>
        </div>
      </Dialog>
      )}
    </div>
  );
};

export default App;
