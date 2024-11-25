import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const symbols = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🍉', '🍏'];

const shuffleArray = array => [...array].sort(() => Math.random() - 0.5);

const GameCard = ({ symbol, onClick, isFlipped, isMatched }) => (
  <Card className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform transform ${isFlipped || isMatched ? 'rotate-y-180' : ''}`} onClick={onClick}>
    <CardContent className="flex justify-center items-center p-0">
      <div className="back-face absolute w-full h-full bg-slate-200 flex items-center justify-center backface-hidden">
        <span className="text-4xl sm:text-5xl">?</span>
      </div>
      <div className={`front-face absolute w-full h-full flex items-center justify-center ${isFlipped || isMatched ? '' : 'backface-hidden'}`}>
        <span className="text-4xl sm:text-5xl">{symbol}</span>
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      setAttempts(attempts + 1);
      if (firstCard.symbol === secondCard.symbol) {
        setScore(score + 1);
        setCards(cards.map(card => 
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, isMatched: true } : card
        ));
        resetTurn();
      } else {
        const timer = setTimeout(() => {
          resetTurn();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [firstCard, secondCard]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
  };

  const resetGame = () => {
    const doubleSymbols = [...symbols, ...symbols];
    setCards(shuffleArray(doubleSymbols.map((symbol, index) => ({ symbol, id: index, isFlipped: false, isMatched: false }))));
    setScore(0);
    setAttempts(0);
  };

  const handleCardClick = card => {
    if (card.isFlipped || card.isMatched) return;
    if (!firstCard) {
      setFirstCard(card);
      setCards(cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    } else if (!secondCard && firstCard.id !== card.id) {
      setSecondCard(card);
      setCards(cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex flex-col items-center">
      <Card className="mb-4 w-full max-w-lg">
        <CardHeader>
          <CardTitle>Matching Game</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Score: {score} | Attempts: {attempts}</p>
          <Button onClick={resetGame} className="mt-4">Restart Game</Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <GameCard 
            key={card.id} 
            symbol={card.symbol} 
            onClick={() => handleCardClick(card)} 
            isFlipped={card.isFlipped} 
            isMatched={card.isMatched}
          />
        ))}
      </div>
    </div>
  );
}