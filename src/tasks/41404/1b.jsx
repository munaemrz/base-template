import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const words = ['JAVASCRIPT', 'REACT', 'TAILWIND', 'SHADCN', 'HANGMAN'];

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;
  const parts = ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'];

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  }, []);

  const handleGuess = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setWrongGuesses(wrongGuesses + 1);
      }
    }
  };

  const displayWord = word
    .split('')
    .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');

  const gameWon = word.split('').every(letter => guessedLetters.includes(letter));
  const gameLost = wrongGuesses >= maxWrong;

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 sm:px-4">
      <h1 className="text-4xl font-bold mb-4">Hangman</h1>
      <div className="mb-4">
        {parts.map((part, index) => (
          <div key={part} className={`${index < wrongGuesses ? 'block' : 'hidden'} w-8 h-8 bg-red-500 m-1 inline-block`} />
        ))}
      </div>
      <div className="text-3xl mb-4">
        {displayWord}
      </div>
      <div>
        {gameWon && <p className="text-green-500 text-xl">You Win! The word was {word}</p>}
        {gameLost && <p className="text-red-500 text-xl">You Lose! The word was {word}</p>}
      </div>
      <div className="mb-4">
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(letter => (
          <button 
            key={letter} 
            onClick={() => handleGuess(letter)} 
            className={`m-1 p-2 ${guessedLetters.includes(letter) ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700 text-white'} rounded`}
            disabled={guessedLetters.includes(letter) || gameWon || gameLost}
          >
            {letter}
          </button>
        ))}
      </div>
      <Button onClick={resetGame} className="mt-4">Restart Game</Button>
    </div>
  );
};

export default function App() {
  return <Hangman />;
}