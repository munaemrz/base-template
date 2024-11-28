import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@/components/ui/shadcn";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', totalPages: '', genre: '' });
  const [pagesRead, setPagesRead] = useState(0);

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(storedBooks);
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (newBook.title && newBook.author && newBook.totalPages && newBook.genre) {
      setBooks([...books, { ...newBook, currentPage: 0, id: Date.now() }]);
      setNewBook({ title: '', author: '', totalPages: '', genre: '' });
    }
  };

  const updatePagesRead = (id, pages) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, currentPage: Math.min(pages, book.totalPages) } : book
    ));
  };

  const calculatePercentage = (current, total) => {
    return total > 0 ? ((current / total) * 100).toFixed(2) : 0;
  };

  const totalBooksRead = books.filter(book => book.currentPage === book.totalPages).length;
  const avgProgress = calculatePercentage(
    books.reduce((sum, book) => sum + book.currentPage, 0),
    books.reduce((sum, book) => sum + parseInt(book.totalPages), 0)
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Book Reading Tracker</h1>
      
      {/* Add Book Form */}
      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg">Add New Book</h2>
        </CardHeader>
        <CardBody>
          <Input 
            value={newBook.title} 
            onChange={e => setNewBook({...newBook, title: e.target.value})} 
            placeholder="Title" 
            className="mb-2"
          />
          <Input 
            value={newBook.author} 
            onChange={e => setNewBook({...newBook, author: e.target.value})} 
            placeholder="Author" 
            className="mb-2"
          />
          <Input 
            type="number" 
            value={newBook.totalPages} 
            onChange={e => setNewBook({...newBook, totalPages: e.target.value})} 
            placeholder="Total Pages" 
            className="mb-2"
          />
          <Input 
            value={newBook.genre} 
            onChange={e => setNewBook({...newBook, genre: e.target.value})} 
            placeholder="Genre" 
          />
        </CardBody>
        <CardFooter>
          <Button onClick={addBook}>Add Book</Button>
        </CardFooter>
      </Card>

      {/* Book List */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {books.map(book => (
          <Card key={book.id}>
            <CardBody>
              <h3 className="font-semibold">{book.title}</h3>
              <p>By: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.currentPage}/{book.totalPages}</p>
              <progress className="progress w-full" value={book.currentPage} max={book.totalPages}></progress>
              <Input 
                type="number" 
                value={pagesRead} 
                onChange={e => setPagesRead(e.target.value)} 
                placeholder="Update pages read"
                className="mt-2"
              />
            </CardBody>
            <CardFooter>
              <Button onClick={() => updatePagesRead(book.id, pagesRead)}>Update</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Reading Summary */}
      <Card className="mt-4">
        <CardBody>
          <h2 className="text-lg font-bold">Reading Summary</h2>
          <p>Total Books Read: {totalBooksRead}</p>
          <p>Average Progress: {avgProgress}%</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default App;