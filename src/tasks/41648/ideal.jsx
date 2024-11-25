import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const vocabularyData = [
  { word: "Bonjour", meaning: "Hello" },
  { word: "Merci", meaning: "Thank you" },
  { word: "Au revoir", meaning: "Goodbye" },
];

const grammarQuizData = [
  {
    question: "Which is the correct way to say 'I am' in French?",
    options: ["Je suis", "Tu es", "Il est"],
    correctAnswer: "Je suis",
  },
  {
    question: "What is the plural form of 'le chat' (the cat)?",
    options: ["les chats", "les chat", "la chats"],
    correctAnswer: "les chats",
  },
];

export default function App() {
  const [vocabIndex, setVocabIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);

  const handleFlip = () => setFlipped(!flipped);

  const nextVocabulary = () => {
    setVocabIndex((prev) => (prev + 1) % vocabularyData.length);
    setFlipped(false);
  };

  const answerQuiz = (answer) => {
    const isCorrect = answer === grammarQuizData[quizIndex].correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    setQuizIndex((prev) => (prev + 1) % grammarQuizData.length);
    setQuizHistory((prev) => [
      ...prev,
      { question: grammarQuizData[quizIndex].question, isCorrect },
    ]);
  };

  const resetProgress = () => {
    setVocabIndex(0);
    setQuizIndex(0);
    setScore(0);
    setQuizHistory([]);
    setFlipped(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Language Learning Widget</h1>
      <div className="mb-4">
        <h2 className="font-semibold">Vocabulary</h2>
        <Card onClick={handleFlip} className="cursor-pointer mb-2">
          <CardContent className="text-center">
            {flipped ? vocabularyData[vocabIndex].meaning : vocabularyData[vocabIndex].word}
          </CardContent>
        </Card>
        <Button onClick={nextVocabulary}>Next Word</Button>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">Grammar Quiz</h2>
        <Card>
          <CardHeader>
            <CardTitle>{grammarQuizData[quizIndex].question}</CardTitle>
          </CardHeader>
          <CardContent>
            {grammarQuizData[quizIndex].options.map((option) => (
              <Button
                key={option}
                onClick={() => answerQuiz(option)}
                className="block mb-2"
              >
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">Progress</h2>
        <p>Score: {score}</p>
        <p>Quiz History:</p>
        {quizHistory.map((entry, index) => (
          <p key={index}>
            {entry.question} - {entry.isCorrect ? "Correct" : "Incorrect"}
          </p>
        ))}
      </div>
      <Button onClick={resetProgress} className="mt-4">
        Reset Progress
      </Button>
    </div>
  );
}
