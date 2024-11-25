import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const words = [
  "REACT",
  "TAILWIND",
  "JAVASCRIPT",
  "HANGMAN",
  "DEVELOPER",
  "PROGRAMMING",
];
const MAX_ATTEMPTS = 6;

const HangmanDrawing = ({ incorrectGuesses }) => {
  const parts = [
    "head",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];
  return (
    <div className="flex justify-center items-center">
      <svg height="150" width="100" className="border-2 border-gray-300">
        <line x1="10" y1="140" x2="90" y2="140" />
        <line x1="30" y1="140" x2="30" y2="10" />
        <line x1="30" y1="10" x2="50" y2="10" />
        <line x1="50" y1="10" x2="50" y2="20" />
        {parts.slice(0, incorrectGuesses).map((_, index) => (
          <circle
            key={index}
            cx="50"
            cy="30"
            r="20"
            className={`hangman-part ${_}`}
          />
        ))}
      </svg>
    </div>
  );
};

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setRemainingAttempts(MAX_ATTEMPTS);
    setGameStatus("playing");
  };

  const handleGuess = (letter) => {
    if (gameStatus !== "playing" || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      setRemainingAttempts((prev) => prev - 1);
      if (remainingAttempts - 1 === 0) {
        setGameStatus("lost");
      }
    } else if (
      word.split("").every((char) => newGuessedLetters.includes(char))
    ) {
      setGameStatus("won");
    }
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <span key={index} className="text-4xl font-bold mx-1">
        {guessedLetters.includes(letter) ? letter : "_"}
      </span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.map((letter) => (
      <Button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter) || gameStatus !== "playing"}
        className="m-1"
      >
        {letter}
      </Button>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Hangman Game</h1>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <HangmanDrawing
              incorrectGuesses={MAX_ATTEMPTS - remainingAttempts}
            />
          </div>
          <div className="text-center mb-4">{renderWord()}</div>
          <div className="text-center mb-4">
            Remaining attempts: {remainingAttempts}
          </div>
          <div className="flex flex-wrap justify-center mb-4">
            {renderKeyboard()}
          </div>
          <div className="text-center">
            {gameStatus === "won" && (
              <p className="text-green-600 font-bold">You Won!</p>
            )}
            {gameStatus === "lost" && (
              <p className="text-red-600 font-bold">
                Game Over! The word was: {word}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startNewGame} className="w-full">
            Restart Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Hangman;
