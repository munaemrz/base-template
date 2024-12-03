import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuizCreator = ({ onQuizCreated }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const addQuestion = () => {
    if (currentQuestion && options.every((opt) => opt) && correctAnswer) {
      setQuestions([
        ...questions,
        { question: currentQuestion, options, correctAnswer },
      ]);
      setCurrentQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    }
  };

  const createQuiz = () => {
    if (questions.length > 0) {
      onQuizCreated(questions);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
            />
          </div>
          {options.map((option, index) => (
            <div key={index}>
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="correct-answer">Correct Answer</Label>
            <Input
              id="correct-answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>
          <Button onClick={addQuestion}>Add Question</Button>
          <Button onClick={createQuiz}>Create Quiz</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const QuizTaker = ({ quiz, onQuizCompleted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleAnswer = (answer) => {
    setSelectedAnswers([...selectedAnswers, answer]);
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onQuizCompleted(selectedAnswers);
    }
  };

  if (currentQuestionIndex >= quiz.length) {
    return null;
  }

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{currentQuestion.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

const QuizResults = ({ quiz, userAnswers }) => {
  const score = quiz.reduce(
    (acc, question, index) =>
      question.correctAnswer === userAnswers[index] ? acc + 1 : acc,
    0
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Your score: {score} out of {quiz.length}
        </p>
        {quiz.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{question.question}</p>
            <p
              className={
                question.correctAnswer === userAnswers[index]
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              Your answer: {userAnswers[index]}
            </p>
            <p className="text-green-600">
              Correct answer: {question.correctAnswer}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [quiz, setQuiz] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleQuizCreated = (newQuiz) => {
    setQuiz(newQuiz);
  };

  const handleQuizCompleted = (answers) => {
    setUserAnswers(answers);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setQuiz(null);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Trivia Quiz Creator
      </h1>
      {!quiz && <QuizCreator onQuizCreated={handleQuizCreated} />}
      {quiz && !quizCompleted && (
        <QuizTaker quiz={quiz} onQuizCompleted={handleQuizCompleted} />
      )}
      {quizCompleted && <QuizResults quiz={quiz} userAnswers={userAnswers} />}
      {(quiz || quizCompleted) && (
        <div className="mt-6 text-center">
          <Button onClick={resetQuiz}>Create New Quiz</Button>
        </div>
      )}
    </div>
  );
}