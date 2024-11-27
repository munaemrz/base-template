import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FlashCard = ({ card, onStatusChange, isFlipped, onFlip }) => {
  return (
    <Card
      className={cn(
        "w-full max-w-sm mx-auto cursor-pointer transition-all duration-300 transform hover:scale-105",
        isFlipped ? "bg-blue-100" : "bg-white"
      )}
      onClick={onFlip}
    >
      <CardContent className="p-6">
        <div className="text-2xl font-bold mb-4">
          {isFlipped ? card.translation : card.term}
        </div>
        <Select
          value={card.status}
          onValueChange={(value) => onStatusChange(card.id, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-learn">To Learn</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="learned">Learned</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

const AddCardForm = ({ onAddCard }) => {
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term && translation) {
      onAddCard({ term, translation });
      setTerm("");
      setTranslation("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Term"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Translation"
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Add Flashcard
      </Button>
    </form>
  );
};

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState("add"); // 'add' or 'practice'

  useEffect(() => {
    const storedCards = localStorage.getItem("flashcards");
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
  }, [cards]);

  const addCard = (newCard) => {
    setCards([
      ...cards,
      { ...newCard, id: Date.now(), status: "to-learn" },
    ]);
  };

  const updateCardStatus = (id, status) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, status } : card))
    );
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "add" ? "practice" : "add"));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Language Learning Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4 mb-4">
              <Button onClick={toggleMode}>
                {mode === "add" ? "Practice Mode" : "Add Cards"}
              </Button>
              {mode === "practice" && (
                <Button onClick={shuffleCards}>Shuffle Cards</Button>
              )}
            </div>
            {mode === "add" ? (
              <AddCardForm onAddCard={addCard} />
            ) : cards.length > 0 ? (
              <div className="space-y-4">
                <FlashCard
                  card={cards[currentCardIndex]}
                  onStatusChange={updateCardStatus}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
                <div className="flex justify-center">
                  <Button onClick={nextCard}>Next Card</Button>
                </div>
              </div>
            ) : (
              <p className="text-center">No cards available. Add some first!</p>
            )}
          </CardContent>
        </Card>
        {mode === "add" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Flashcards</h2>
            {cards.map((card) => (
              <Card key={card.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{card.term}</strong>: {card.translation}
                  </div>
                  <Select
                    value={card.status}
                    onValueChange={(value) => updateCardStatus(card.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-learn">To Learn</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="learned">Learned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}