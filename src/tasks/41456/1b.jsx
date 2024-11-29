import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const symbols = ['🍏', '🍌', '🍒', '🍇', '🍋', '🍑', '🍓', '🍉'];

const CardItem = ({ symbol, onClick, flipped, matched }) => (
  <Card 
    className={`w-20 h-20 sm:w-16 sm:h-16 m-2 transition-transform transform ${flipped || matched ? 'rotate-y-180' : ''}`}
    onClick={matched ? null : onClick}
  >
    <CardContent className="p-0 flex items-center justify-center">
      <div className="back-face absolute w-full h-full bg-blue-500 flex items-center justify-center text-2xl text-white">
        ?
      </div>
      <div className="front-face absolute w-full h-full bg-white flex items-center justify-center text-2xl">
        {symbol}
      </div>
    </CardContent>
  </Card>
);

function App() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState({ matches: 0, attempts: 0 });
  const [isLocked, setIsLocked] = useState(false);

  const shuffleCards = () => {
    const shuffledSymbols = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }));
    setCards(shuffledSymbols);
  };

  useEffect(shuffleCards, []);

  const handleCardClick = (clickedCard) => {
    if (isLocked || clickedCard.flipped || clickedCard.matched) return;

    if (!firstCard) {
      setFirstCard(clickedCard);
      setCards(cards.map(c => c.id === clickedCard.id ? { ...c, flipped: true } : c));
    } else if (!secondCard && clickedCard.id !== firstCard.id) {
      setSecondCard(clickedCard);
      setCards(cards.map(c => c.id === clickedCard.id ? { ...c, flipped: true } : c));
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      setIsLocked(true);
      if (firstCard.symbol === secondCard.symbol) {
        setCards(cards => cards.map(c => 
          c.id === firstCard.id || c.id === secondCard.id ? { ...c, matched: true } : c
        ));
        setScore({...score, matches: score.matches + 1, attempts: score.attempts + 1});
        resetCards();
      } else {
        setTimeout(() => {
          setCards(cards => cards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id ? { ...c, flipped: false } : c
          ));
          setScore({...score, attempts: score.attempts + 1});
          resetCards();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const resetCards = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsLocked(false);
  };

  const restartGame = () => {
    setScore({ matches: 0, attempts: 0 });
    shuffleCards();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-2">
      <CardHeader className="mb-4">
        <h1 className="text-2xl font-bold">Memory Match</h1>
        <p>Score: {score.matches} | Attempts: {score.attempts}</p>
      </CardHeader>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-3">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            symbol={card.symbol} 
            flipped={card.flipped} 
            matched={card.matched}
            onClick={() => handleCardClick(card)} 
          />
        ))}
      </div>
      <Button onClick={restartGame} className="mt-4">Restart Game</Button>
    </div>
  );
}

export default App;