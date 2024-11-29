import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const generateCards = () => {
  const symbols = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝"];
  const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  return shuffledSymbols.map((symbol, index) => ({
    id: index,
    symbol,
    isMatched: false,
    isFlipped: false,
  }));
};

const Card = ({ card, onClick }) => (
  <div
    className={`w-16 h-20 sm:w-20 sm:h-24 border flex items-center justify-center text-2xl sm:text-3xl cursor-pointer ${
      card.isFlipped || card.isMatched ? "bg-white" : "bg-gray-300"
    }`}
    onClick={() => !card.isFlipped && !card.isMatched && onClick(card.id)}
  >
    {card.isFlipped || card.isMatched ? card.symbol : ""}
  </div>
);

export default function App() {
  const [cards, setCards] = useState(generateCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const resetGame = () => {
    setCards(generateCards());
    setSelectedCards([]);
    setScore(0);
    setAttempts(0);
    setGameFinished(false);
  };

  const handleCardClick = (id) => {
    if (selectedCards.length < 2) {
      const updatedCards = cards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      );
      setCards(updatedCards);
      setSelectedCards((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [firstId, secondId] = selectedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        const updatedCards = cards.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        setScore((prev) => prev + 1);
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(updatedCards);
        }, 1000);
      }
      setAttempts((prev) => prev + 1);
      setSelectedCards([]);
    }
  }, [selectedCards, cards]);

  useEffect(() => {
    if (cards.every((card) => card.isMatched)) {
      setGameFinished(true);
      setTimeout(resetGame, 3000); // Automatically reset the game after 3 seconds
    }
  }, [cards]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">Matching Card Game</h1>
      {gameFinished && (
        <div className="text-center text-lg font-bold text-green-600 mb-4">
          You Won! Resetting the game...
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 justify-center">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="text-lg font-semibold">Score: {score}</div>
        <div className="text-lg font-semibold">Attempts: {attempts}</div>
        <Button onClick={resetGame} className="bg-blue-500 text-white">
          Restart Game
        </Button>
      </div>
    </div>
  );
}
