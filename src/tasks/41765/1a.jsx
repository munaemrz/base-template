import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Checkbox } from "@/components/ui";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [newTerm, setNewTerm] = useState('');
  const [newTranslation, setNewTranslation] = useState('');

  useEffect(() => {
    const storedFlashcards = JSON.parse(localStorage.getItem('flashcards') || '[]');
    setFlashcards(storedFlashcards);
  }, []);

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = () => {
    if (newTerm && newTranslation) {
      setFlashcards([...flashcards, { term: newTerm, translation: newTranslation, learned: false }]);
      setNewTerm('');
      setNewTranslation('');
    }
  };

  const toggleLearned = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index].learned = !updatedFlashcards[index].learned;
    setFlashcards(updatedFlashcards);
  };

  const shuffleFlashcards = () => {
    let array = [...flashcards];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setFlashcards(array);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Language Flashcards</h1>
      <Card className="w-full max-w-lg p-6">
        <Input 
          value={newTerm} 
          onChange={(e) => setNewTerm(e.target.value)} 
          placeholder="Term" 
          className="mb-2"
        />
        <Input 
          value={newTranslation} 
          onChange={(e) => setNewTranslation(e.target.value)} 
          placeholder="Translation" 
          className="mb-4"
        />
        <Button onClick={addFlashcard} className="w-full">Add Flashcard</Button>
      </Card>

      <Button onClick={shuffleFlashcards} className="mt-4">Shuffle</Button>

      <div className="mt-4 space-y-4 w-full max-w-lg">
        {flashcards.map((card, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{card.term}</p>
                <p>{card.translation}</p>
              </div>
              <Checkbox 
                checked={card.learned} 
                onCheckedChange={() => toggleLearned(index)} 
                className="ml-4"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;