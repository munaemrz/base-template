import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const words = [
  "react",
  "tailwind",
  "javascript",
  "hangman",
  "developer",
  "programming",
];

const MAX_ATTEMPTS = 6;

const HangmanDrawing = ({ incorrectGuesses }) => {
  const parts = [
    <circle cx="50" cy="30" r="20" />, // Head
    <line x1="50" y1="50" x2="50" y2="100" />, // Body
    <line x1="50" y1="60" x2="30" y2="80" />, // Left arm
    <line x1="50" y1="60" x2="70" y2="80" />, // Right arm
    <line x1="50" y1="100" x2="30" y2="130" />, // Left leg
    <line x1="50" y1="100" x2="70" y2="130" />, // Right leg
  ];

  return (
    <svg height="150" width="100" className="border-2 border-gray-300">
      <line x1="10" y1="140" x2="90" y2="140" />
      <line x1="30" y1="140" x2="30" y2="10" />
      <line x1="30" y1="10" x2="50" y2="10" />
      <line x1="50" y1="10" x2="50" y2="20" />
      {parts.slice(0, incorrectGuesses).map((part, index) => (
        <motion.g
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {part}
        </motion.g>
      ))}
    </svg>
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
      const newRemainingAttempts = remainingAttempts - 1;
      setRemainingAttempts(newRemainingAttempts);

      if (newRemainingAttempts === 0) {
        setGameStatus("lost");
      }
    } else {
      const allLettersGuessed = word
        .split("")
        .every((char) => newGuessedLetters.includes(char));
      if (allLettersGuessed) {
        setGameStatus("won");
      }
    }
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <motion.span
        key={index}
        className="text-4xl font-bold mx-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {guessedLetters.includes(letter) || gameStatus !== "playing"
          ? letter
          : "_"}
      </motion.span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    return alphabet.map((letter) => (
      <Button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={
          guessedLetters.includes(letter) || gameStatus !== "playing"
        }
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
          <CardTitle className="text-center text-2xl font-bold">
            Hangman Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <HangmanDrawing incorrectGuesses={MAX_ATTEMPTS - remainingAttempts} />
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
              <motion.p
                className="text-green-600 font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                Congratulations! You won!
              </motion.p>
            )}
            {gameStatus === "lost" && (
              <motion.p
                className="text-red-600 font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                Game Over. The word was: {word}
              </motion.p>
            )}
          </div>
          <div className="text-center mt-4">
            <Button onClick={startNewGame}>New Game</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Hangman;