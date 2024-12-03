import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QuizCreator = ({ onSave }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");

  const handleAddQuestion = () => {
    if (
      currentQuestion.trim() &&
      options.every((opt) => opt.trim()) &&
      correctAnswer.trim()
    ) {
      const newQuestion = {
        id: Date.now(),
        question: currentQuestion,
        options,
        correctAnswer,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setError("");
    } else {
      setError("All fields must be filled to add a question.");
    }
  };

  const handleSaveQuiz = () => {
    if (quizTitle.trim() && questions.length) {
      onSave({ title: quizTitle, questions });
      setQuizTitle("");
      setQuestions([]);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-blue-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold">Create a New Quiz</h2>
      <Input
        placeholder="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="w-full"
      />
      <Input
        placeholder="Question"
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        className="w-full"
      />
      {options.map((opt, index) => (
        <Input
          key={index}
          placeholder={`Option ${index + 1}`}
          value={opt}
          onChange={(e) =>
            setOptions((prev) => {
              const newOptions = [...prev];
              newOptions[index] = e.target.value;
              return newOptions;
            })
          }
          className="w-full"
        />
      ))}
      <Input
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        className="w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between">
        <Button onClick={handleAddQuestion} className="bg-green-500 hover:bg-green-600">
          Add Question
        </Button>
        <Button
          onClick={handleSaveQuiz}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!questions.length}
        >
          Save Quiz
        </Button>
      </div>
    </Card>
  );
};

const QuizAttempt = ({ quiz, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleAnswerChange = (answer) => {
    setAnswers({ ...answers, [quiz.questions[currentIndex].id]: answer });
  };

  const calculateScore = () => {
    return quiz.questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <Card className="p-6 space-y-4 bg-gray-50 shadow-lg rounded-lg">
      {!showResults ? (
        <>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <p className="text-lg font-medium">{quiz.questions[currentIndex].question}</p>
          {quiz.questions[currentIndex].options.map((opt) => (
            <label
              key={opt}
              className={`block p-2 rounded ${
                answers[quiz.questions[currentIndex].id] === opt ? "bg-gray-200" : ""
              }`}
            >
              <input
                type="radio"
                name={quiz.questions[currentIndex].id}
                value={opt}
                checked={answers[quiz.questions[currentIndex].id] === opt}
                onChange={() => handleAnswerChange(opt)}
              />
              {opt}
            </label>
          ))}
          <Button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {currentIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">Quiz Results</h2>
          {quiz.questions.map((question) => (
            <div
              key={question.id}
              className={`p-4 rounded mb-2 ${
                answers[question.id] === question.correctAnswer
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <p className="font-medium">{question.question}</p>
              <p>
                <span className="font-semibold">Your Answer:</span> {answers[question.id]}
              </p>
              <p className="text-green-700">
                <span className="font-semibold">Correct Answer:</span> {question.correctAnswer}
              </p>
            </div>
          ))}
          <p className="text-lg font-medium mt-4">
            Your Score: {calculateScore()} / {quiz.questions.length}
          </p>
          <Button onClick={onComplete} className="bg-blue-500 hover:bg-blue-600 mt-4">
            Back to Homepage
          </Button>
        </>
      )}
    </Card>
  );
};

const App = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleSaveQuiz = (quiz) => {
    setQuizzes([...quizzes, { ...quiz, id: Date.now() }]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Trivia Quiz Creator</h1>
      {selectedQuiz ? (
        <QuizAttempt quiz={selectedQuiz} onComplete={() => setSelectedQuiz(null)} />
      ) : (
        <>
          <QuizCreator onSave={handleSaveQuiz} />
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-4 shadow-md">
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <Button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="bg-blue-500 hover:bg-blue-600 mt-2"
                >
                  Attempt Quiz
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
