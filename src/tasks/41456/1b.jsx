import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const symbols = [
  "🍎", "🍌", "🍒", "🍓", "🍊", "🍋", "🍉", "🍇",
  "🍍", "🥝", "🥑", "🍅", "🍆", "🥕", "🌽", "🥦"
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MemoryCard = ({ symbol, isFlipped, onClick }) => {
  return (
    <Card
      className={`w-16 h-16 sm:w-20 sm:h-20 cursor-pointer transition-all duration-300 transform ${
        isFlipped ? "rotate-y-180" : ""
      } hover:scale-105`}
      onClick={onClick}
    >
      <CardContent className="flex items-center justify-center h-full text-3xl sm:text-4xl">
        {isFlipped ? symbol : "❓"}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledSymbols = shuffleArray([...symbols, ...symbols]);
    setCards(shuffledSymbols);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedPairs((prev) => [...prev, firstIndex, secondIndex]);
        setScore((prev) => prev + 1);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Match Game</h1>
      <div className="mb-4 flex gap-4">
        <Badge variant="secondary" className="text-lg p-2">
          Score: {score}
        </Badge>
        <Badge variant="secondary" className="text-lg p-2">
          Attempts: {attempts}
        </Badge>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
        {cards.map((symbol, index) => (
          <MemoryCard
            key={index}
            symbol={symbol}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <Button onClick={initializeGame} className="mt-4">
        Restart Game
      </Button>
    </div>
  );
}