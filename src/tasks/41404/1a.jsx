import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const words = ["react", "tailwind", "shadcn", "javascript", "hangman"];

const HangmanDrawing = ({ incorrectGuesses }) => {
  const parts = [
    <circle key="head" cx="50" cy="25" r="20" />,
    <line key="body" x1="50" y1="45" x2="50" y2="100" />,
    <line key="leftArm" x1="50" y1="60" x2="30" y2="80" />,
    <line key="rightArm" x1="50" y1="60" x2="70" y2="80" />,
    <line key="leftLeg" x1="50" y1="100" x2="30" y2="130" />,
    <line key="rightLeg" x1="50" y1="100" x2="70" y2="130" />,
  ];

  return (
    <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 150">
      <line x1="10" y1="140" x2="90" y2="140" />
      <line x1="30" y1="140" x2="30" y2="10" />
      <line x1="30" y1="10" x2="50" y2="10" />
      <line x1="50" y1="10" x2="50" y2="25" />
      {parts.slice(0, incorrectGuesses)}
    </svg>
  );
};

const Keyboard = ({ onGuess, guessedLetters }) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {alphabet.map((letter) => (
        <Button
          key={letter}
          onClick={() => onGuess(letter)}
          disabled={guessedLetters.includes(letter)}
          className="w-8 h-8 text-sm"
        >
          {letter}
        </Button>
      ))}
    </div>
  );
};

export default function App() {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus("playing");
  };

  const handleGuess = (letter) => {
    if (gameStatus !== "playing") return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setIncorrectGuesses((prev) => prev + 1);
    }

    checkGameStatus(letter);
  };

  const checkGameStatus = (newLetter) => {
    const updatedGuessedLetters = [...guessedLetters, newLetter];
    const isWordGuessed = word
      .split("")
      .every((letter) => updatedGuessedLetters.includes(letter));

    if (isWordGuessed) {
      setGameStatus("won");
    } else if (incorrectGuesses + (word.includes(newLetter) ? 0 : 1) >= 6) {
      setGameStatus("lost");
    }
  };

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Hangman Game</h1>
        <HangmanDrawing incorrectGuesses={incorrectGuesses} />
        <div className="text-center">
          <p
            className={`text-2xl font-mono ${
              gameStatus !== "playing" ? "text-green-600 font-bold" : ""
            }`}
          >
            {gameStatus === "playing" ? displayWord : word}
          </p>
          {gameStatus !== "playing" && (
            <p className="mt-2 text-lg font-semibold">
              {gameStatus === "won" ? "You won!" : "You lost!"}
            </p>
          )}
        </div>
        <div className="text-center">
          <p>Incorrect Guesses: {incorrectGuesses}</p>
          <p>
            Guessed Letters:{" "}
            {guessedLetters
              .sort()
              .join(", ")
              .toUpperCase()}
          </p>
        </div>
        {gameStatus === "playing" ? (
          <Keyboard onGuess={handleGuess} guessedLetters={guessedLetters} />
        ) : (
          <Button onClick={startNewGame} className="w-full">
            Play Again
          </Button>
        )}
      </Card>
    </div>
  );
}