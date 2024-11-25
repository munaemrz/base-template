import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vocabularyData = [
  { word: "Bonjour", meaning: "Hello" },
  { word: "Merci", meaning: "Thank you" },
  { word: "Au revoir", meaning: "Goodbye" },
];

const grammarQuizData = [
  {
    question: "Which is the correct way to say 'I am' in French?",
    options: ["Je suis", "Tu es", "Il est", "Nous sommes"],
    correctAnswer: "Je suis",
  },
  {
    question: "What is the plural form of 'le chat' (the cat)?",
    options: ["les chat", "les chats", "le chats", "la chats"],
    correctAnswer: "les chats",
  },
];

const FlashCard = ({ word, meaning, isFlipped, onFlip }) => {
  return (
    <Card className="w-64 h-40 cursor-pointer" onClick={onFlip}>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-2xl font-bold">{isFlipped ? meaning : word}</p>
      </CardContent>
    </Card>
  );
};

const GrammarQuiz = ({ question, options, onAnswer }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => (
            <Button key={index} onClick={() => onAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProgressChart = ({ percentage }) => {
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="2"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
        {percentage}%
      </div>
    </div>
  );
};

export default function App() {
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const totalQuestions = grammarQuizData.length + vocabularyData.length;
    const progressPercentage = Math.round((quizScore / totalQuestions) * 100);
    setOverallProgress(progressPercentage);
  }, [quizScore]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextVocab = () => {
    setCurrentVocabIndex((prevIndex) => (prevIndex + 1) % vocabularyData.length);
    setIsFlipped(false);
    setQuizScore((prevScore) => prevScore + 1);
  };

  const handleQuizAnswer = (answer) => {
    const isCorrect = answer === grammarQuizData[currentQuizIndex].correctAnswer;
    if (isCorrect) {
      setQuizScore((prevScore) => prevScore + 1);
    }
    setQuizHistory((prevHistory) => [
      ...prevHistory,
      { question: grammarQuizData[currentQuizIndex].question, isCorrect },
    ]);
    setCurrentQuizIndex((prevIndex) => (prevIndex + 1) % grammarQuizData.length);
  };

  const handleReset = () => {
    setCurrentVocabIndex(0);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizHistory([]);
    setOverallProgress(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Language Learning Widget</h1>
      <Tabs defaultValue="vocabulary" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="grammar">Grammar Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="vocabulary" className="mt-4">
          <div className="flex flex-col items-center">
            <FlashCard
              word={vocabularyData[currentVocabIndex].word}
              meaning={vocabularyData[currentVocabIndex].meaning}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
            <Button className="mt-4" onClick={handleNextVocab}>
              Next Word
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="grammar" className="mt-4">
          <div className="flex flex-col items-center">
            <GrammarQuiz
              question={grammarQuizData[currentQuizIndex].question}
              options={grammarQuizData[currentQuizIndex].options}
              onAnswer={handleQuizAnswer}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Progress</h2>
        <ProgressChart percentage={overallProgress} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        <div className="space-y-2">
          {quizHistory.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={item.isCorrect ? "text-green-500" : "text-red-500"}>
                  {item.isCorrect ? "Correct" : "Incorrect"}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={handleReset}>Reset Progress</Button>
      </div>
    </div>
  );
}