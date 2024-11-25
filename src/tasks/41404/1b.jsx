import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const words = [
  "JAVASCRIPT",
  "HANGMAN",
  "DEVELOPER",
  "REACT",
  "TAILWIND",
  "SHADCN",
];

const HangmanFigure = ({ wrongGuesses }) => {
  const parts = [
    "head",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];
  return (
    <div className="hangman-figure">
      {parts.slice(0, wrongGuesses).map((part, index) => (
        <div key={index} className={`part ${part}`}></div>
      ))}
    </div>
  );
};

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessed(new Set());
    setWrongGuesses(0);
  };

  const guessedWord = () => {
    return word.split("").map((letter) => (guessed.has(letter) ? letter : "_"));
  };

  const handleGuess = (e) => {
    let letter = e.target.value;
    setGuessed((prev) => new Set(prev).add(letter));
    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const gameStatus = () => {
    if (guessedWord().join("") === word) return "You Win!";
    if (wrongGuesses >= maxWrong) return "Game Over!";
    return `Guesses left: ${maxWrong - wrongGuesses}`;
  };

  const generateButtons = () => {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
      <Button
        key={letter}
        value={letter}
        onClick={handleGuess}
        disabled={guessed.has(letter)}
        variant={guessed.has(letter) ? "secondary" : "default"}
      >
        {letter}
      </Button>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4 sm:p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Hangman Game</h1>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <HangmanFigure wrongGuesses={wrongGuesses} />
          <p className="text-lg">{gameStatus()}</p>
          <div className="word">
            {guessedWord().map((letter, index) => (
              <span key={index} className="text-2xl mx-1">
                {letter}
              </span>
            ))}
          </div>
          <div className="guess-buttons grid grid-cols-7 gap-2 mt-4">
            {generateButtons()}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button onClick={resetGame} className="w-full">
            Restart Game
          </Button>
        </CardFooter>
      </Card>
      {(gameStatus() === "You Win!" || gameStatus() === "Game Over!") && (
        <p
          className={`mt-4 text-xl ${
            gameStatus() === "You Win!" ? "text-green-600" : "text-red-600"
          }`}
        >
          The word was: {word}
        </p>
      )}
    </div>
  );
};

export default Hangman;
