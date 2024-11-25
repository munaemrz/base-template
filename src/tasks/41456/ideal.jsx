import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const symbols = ["🍎", "🍌", "🍓", "🍒", "🍇", "🍉", "🍍", "🥝"];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const GameCard = ({ symbol, isFlipped, isMatched, onClick }) => (
  <Card
    className={`w-16 h-16 sm:w-20 sm:h-20 cursor-pointer transition-transform ${
      isFlipped || isMatched ? "rotate-y-180" : ""
    }`}
    onClick={onClick}
  >
    <CardContent className="flex items-center justify-center h-full text-2xl sm:text-3xl">
      {isFlipped || isMatched ? symbol : "❓"}
    </CardContent>
  </Card>
);

export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = shuffleArray([...symbols, ...symbols]);
    setCards(shuffled.map((symbol, index) => ({ symbol, id: index })));
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setAttempts(0);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
        setScore((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Memory Match Game</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Score: {score} | Attempts: {attempts}</p>
          <Button className="mt-4" onClick={initializeGame}>
            Restart Game
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {cards.map((card, index) => (
          <GameCard
            key={card.id}
            symbol={card.symbol}
            isFlipped={flippedCards.includes(index)}
            isMatched={matchedCards.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
