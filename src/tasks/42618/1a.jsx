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

const Card = ({ className, ...props }) => (
  <div
    className={cn("bg-white shadow rounded-lg p-6", className)}
    {...props}
  />
);

const BookForm = ({ addBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && author && totalPages && genre) {
      addBook({ title, author, totalPages: parseInt(totalPages), genre, pagesRead: 0 });
      setTitle("");
      setAuthor("");
      setTotalPages("");
      setGenre("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <Input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full"
      />
      <Input
        type="number"
        placeholder="Total Pages"
        value={totalPages}
        onChange={(e) => setTotalPages(e.target.value)}
        className="w-full"
      />
      <Select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full"
      >
        <option value="">Select Genre</option>
        <option value="Fiction">Fiction</option>
        <option value="Non-fiction">Non-fiction</option>
        <option value="Science Fiction">Science Fiction</option>
        <option value="Mystery">Mystery</option>
        <option value="Fantasy">Fantasy</option>
      </Select>
      <Button type="submit" className="w-full">Add Book</Button>
    </form>
  );
};

const BookList = ({ books, updatePagesRead }) => {
  return (
    <div className="space-y-4">
      {books.map((book, index) => (
        <Card key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h3 className="font-bold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-600">{book.genre}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={book.pagesRead}
              onChange={(e) => updatePagesRead(index, parseInt(e.target.value))}
              className="w-20"
            />
            <span>/ {book.totalPages}</span>
            <span className="text-sm text-gray-600">
              ({Math.round((book.pagesRead / book.totalPages) * 100)}%)
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

const ReadingSummary = ({ books }) => {
  const completedBooks = books.filter((book) => book.pagesRead === book.totalPages);
  const averageProgress =
    books.length > 0
      ? Math.round(
          (books.reduce(
            (sum, book) => sum + (book.pagesRead / book.totalPages) * 100,
            0
          ) /
            books.length) *
            100
        ) / 100
      : 0;

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-4">Reading Summary</h2>
      <p>Total Books: {books.length}</p>
      <p>Completed Books: {completedBooks.length}</p>
      <p>Average Progress: {averageProgress}%</p>
    </Card>
  );
};

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const addBook = (book) => {
    setBooks([...books, book]);
  };

  const updatePagesRead = (index, pagesRead) => {
    const updatedBooks = [...books];
    updatedBooks[index].pagesRead = Math.min(
      pagesRead,
      updatedBooks[index].totalPages
    );
    setBooks(updatedBooks);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Book Reading Tracker</h1>
      <Card className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>
        <BookForm addBook={addBook} />
      </Card>
      <h2 className="text-xl font-bold mb-4">Your Books</h2>
      <BookList books={books} updatePagesRead={updatePagesRead} />
      <ReadingSummary books={books} />
    </div>
  );
}