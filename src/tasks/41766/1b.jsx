import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Label, Textarea } from "@/components/ui/shadcn";

const App = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', category: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (currentNote.title && currentNote.content) {
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
      setCurrentNote({ title: '', content: '', category: '' });
    }
  };

  const updateNote = () => {
    if (editMode) {
      setNotes(notes.map(note => note.id === currentNote.id ? currentNote : note));
      setEditMode(false);
      setCurrentNote({ title: '', content: '', category: '' });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (note) => {
    setCurrentNote(note);
    setEditMode(true);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-8 space-y-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="w-full sm:w-1/2"
        />
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">{editMode ? 'Edit Note' : 'New Note'}</h2>
          </Card.Header>
          <Card.Body className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={currentNote.title} 
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} 
            />
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              value={currentNote.content} 
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})} 
            />
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              value={currentNote.category} 
              onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})} 
            />
            <Button onClick={editMode ? updateNote : addNote}>
              {editMode ? 'Update Note' : 'Add Note'}
            </Button>
          </Card.Body>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="p-4">
              <Card.Header>
                <h3 className="text-md font-medium">{note.title}</h3>
                <p className="text-sm text-muted-foreground">{note.category}</p>
              </Card.Header>
              <Card.Body>
                <p>{note.content}</p>
              </Card.Body>
              <Card.Footer className="flex justify-between">
                <Button variant="outline" onClick={() => startEdit(note)}>Edit</Button>
                <Button variant="destructive" onClick={() => deleteNote(note.id)}>Delete</Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;