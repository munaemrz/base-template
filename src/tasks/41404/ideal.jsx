import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const words = ["react", "javascript", "hangman", "tailwind", "component"];

const HangmanDrawing = ({ incorrectGuesses }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
      {/* Base */}
      <line x1="10" y1="90" x2="90" y2="90" stroke="black" strokeWidth="2" />
      {/* Pole */}
      <line x1="30" y1="90" x2="30" y2="10" stroke="black" strokeWidth="2" />
      <line x1="30" y1="10" x2="70" y2="10" stroke="black" strokeWidth="2" />
      <line x1="70" y1="10" x2="70" y2="20" stroke="black" strokeWidth="2" />
      {/* Parts of the hangman */}
      {incorrectGuesses > 0 && <circle cx="70" cy="30" r="5" stroke="black" fill="none" strokeWidth="2" />}
      {incorrectGuesses > 1 && <line x1="70" y1="35" x2="70" y2="50" stroke="black" strokeWidth="2" />}
      {incorrectGuesses > 2 && <line x1="70" y1="40" x2="65" y2="45" stroke="black" strokeWidth="2" />}
      {incorrectGuesses > 3 && <line x1="70" y1="40" x2="75" y2="45" stroke="black" strokeWidth="2" />}
      {incorrectGuesses > 4 && <line x1="70" y1="50" x2="65" y2="55" stroke="black" strokeWidth="2" />}
      {incorrectGuesses > 5 && <line x1="70" y1="50" x2="75" y2="55" stroke="black" strokeWidth="2" />}
    </svg>
  );
};

const WordDisplay = ({ word, guessedLetters }) => {
  return (
    <div className="text-2xl font-bold text-center mt-4">
      {word.split("").map((letter, index) =>
        guessedLetters.includes(letter) ? (
          <span key={index} className="mx-1">
            {letter}
          </span>
        ) : (
          <span key={index} className="mx-1">
            _
          </span>
        )
      )}
    </div>
  );
};

export default function App() {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (word.includes(letter)) {
      const allGuessed = word.split("").every((l) => guessedLetters.includes(l) || l === letter);
      if (allGuessed) {
        setGameWon(true);
        setGameOver(true);
      }
    } else {
      setIncorrectGuesses((prev) => {
        const newCount = prev + 1;
        if (newCount >= 6) {
          setGameOver(true);
        }
        return newCount;
      });
    }
  };

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">Hangman Game</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Game Board</CardTitle>
        </CardHeader>
        <CardContent>
          <HangmanDrawing incorrectGuesses={incorrectGuesses} />
          <WordDisplay word={word} guessedLetters={guessedLetters} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Guess a Letter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
              <Button
                key={letter}
                onClick={() => handleGuess(letter)}
                variant={guessedLetters.includes(letter) ? "secondary" : "default"}
                disabled={guessedLetters.includes(letter) || gameOver}
                className="uppercase"
              >
                {letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        {gameOver && (
          <p className={`text-lg font-bold mb-4 ${gameWon ? "text-green-500" : "text-red-500"}`}>
            {gameWon ? "You Won!" : `You Lost! The word was "${word}".`}
          </p>
        )}
        <Button onClick={resetGame} className="bg-blue-500 text-white">
          Restart Game
        </Button>
      </div>
    </div>
  );
}
