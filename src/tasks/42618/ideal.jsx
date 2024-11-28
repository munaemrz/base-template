import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BookForm = ({ book, onSave, onCancel }) => {
  const [form, setForm] = useState(
    book || { title: "", author: "", totalPages: "", genre: "", pagesRead: 0 }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "totalPages" || name === "pagesRead" ? parseInt(value) || 0 : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.author && form.totalPages > 0 && form.genre) {
      onSave({ ...form, id: book?.id || Date.now() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Book Title"
        required
      />
      <Input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <Input
        name="totalPages"
        type="number"
        value={form.totalPages}
        onChange={handleChange}
        placeholder="Total Pages"
        min="1"
        required
      />
      <Input
        name="genre"
        value={form.genre}
        onChange={handleChange}
        placeholder="Genre"
        required
      />
      <Input
        name="pagesRead"
        type="number"
        value={form.pagesRead}
        onChange={handleChange}
        placeholder="Pages Read"
        min="0"
        max={form.totalPages}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const BookList = ({ books, onEdit }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold mb-4">Your Books</h2>
    {books.length > 0 ? (
      books.map((book) => (
        <Card key={book.id} className="p-4">
          <h3 className="text-lg font-bold">{book.title}</h3>
          <p className="text-sm text-gray-600">Author: {book.author}</p>
          <p className="text-sm text-gray-600">Genre: {book.genre}</p>
          <p className="text-sm text-gray-600">
            Progress: {book.pagesRead}/{book.totalPages} pages (
            {((book.pagesRead / book.totalPages) * 100).toFixed(1)}%)
          </p>
          <div className="mt-2">
            <Button size="sm" onClick={() => onEdit(book)}>
              Edit Progress
            </Button>
          </div>
        </Card>
      ))
    ) : (
      <p>No books added yet. Start tracking your reading!</p>
    )}
  </div>
);

export default function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const handleSaveBook = (book) => {
    setBooks((prevBooks) =>
      prevBooks.some((b) => b.id === book.id)
        ? prevBooks.map((b) => (b.id === book.id ? book : b))
        : [...prevBooks, book]
    );
    setEditingBook(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Book Reading Tracker</h1>
      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>
        <Button onClick={() => setEditingBook({})} className="w-full">
          Add Book
        </Button>
      </Card>
      <BookList books={books} onEdit={setEditingBook} />
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Card className="p-6 w-full max-w-md">
            <BookForm
              book={editingBook}
              onSave={handleSaveBook}
              onCancel={() => setEditingBook(null)}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
