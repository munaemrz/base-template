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
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const TextArea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

// Note component
const Note = ({ note, onEdit, onDelete }) => (
  <div className="bg-white p-4 rounded shadow mb-4">
    <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
    <p className="mb-2">{note.content}</p>
    <p className="text-sm text-gray-500 mb-2">Category: {note.category}</p>
    <div className="flex justify-end space-x-2">
      <Button onClick={() => onEdit(note)}>Edit</Button>
      <Button onClick={() => onDelete(note.id)} className="bg-red-500 hover:bg-red-600">
        Delete
      </Button>
    </div>
  </div>
);

// NoteForm component
const NoteForm = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: note?.id, title, content, category });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2"
        required
      />
      <TextArea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-2"
        rows={4}
        required
      />
      <Input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4"
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="submit">Save</Button>
        <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Main App component
export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = (note) => {
    if (note.id) {
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
    } else {
      setNotes([...notes, { ...note, id: Date.now() }]);
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter(
    (note) =>
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || note.category === selectedCategory)
  );

  const categories = [...new Set(notes.map((note) => note.category))];

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Notes Organizer</h1>
      <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 mb-2 sm:mb-0"
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      {editingNote ? (
        <NoteForm
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <Button onClick={() => setEditingNote({})}>Add New Note</Button>
      )}
      <div className="mt-6">
        {filteredNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            onEdit={setEditingNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
}