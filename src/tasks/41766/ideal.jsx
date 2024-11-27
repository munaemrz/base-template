import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="text-lg font-bold">{note.title}</h3>
        <p className="text-sm text-muted-foreground">{note.category}</p>
      </CardHeader>
      <CardContent>
        <p>{note.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(note.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: "", content: "", category: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleSaveNote = () => {
    if (!currentNote.title || !currentNote.content) return;

    if (editMode) {
      setNotes(notes.map((note) => (note.id === currentNote.id ? currentNote : note)));
    } else {
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
    }

    setEditMode(false);
    setCurrentNote({ title: "", content: "", category: "" });
  };

  const handleEditNote = (note) => {
    setEditMode(true);
    setCurrentNote(note);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Notes Organizer</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>
      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-xl font-bold">{editMode ? "Edit Note" : "New Note"}</h2>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            className="mb-2"
          />
          <Textarea
            placeholder="Content"
            value={currentNote.content}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Category"
            value={currentNote.category}
            onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={handleSaveNote}>{editMode ? "Update" : "Add"}</Button>
          {editMode && (
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="grid gap-4">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
}
