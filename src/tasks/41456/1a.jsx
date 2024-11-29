import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const symbols = [
  "🍎", "🍌", "🍒", "🍓", "🍊", "🍋", "🍍", "🥝",
  "🍎", "🍌", "🍒", "🍓", "🍊", "🍋", "🍍", "🥝"
];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function GameCard({ symbol, isFlipped, onClick }) {
  return (
    <Card
      className={cn(
        "w-16 h-24 sm:w-20 sm:h-28 flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform",
        isFlipped ? "bg-white" : "bg-gray-300",
        isFlipped && "rotate-y-180"
      )}
      onClick={onClick}
    >
      {isFlipped ? symbol : "?"}
    </Card>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    restartGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedPairs([...matchedPairs, cards[firstIndex]]);
        setScore(score + 1);
      }
      setAttempts(attempts + 1);
      const timer = setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flippedIndices]);

  const handleCardClick = (index) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index)) {
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  const restartGame = () => {
    setCards(shuffleArray(symbols));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Match Game</h1>
      <div className="mb-4">
        <p className="text-lg">
          Score: {score} | Attempts: {attempts}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
        {cards.map((symbol, index) => (
          <GameCard
            key={index}
            symbol={symbol}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(symbol)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <Button onClick={restartGame}>Restart Game</Button>
    </div>
  );
}