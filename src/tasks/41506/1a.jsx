import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState({ name: '', questions: [] });
  const [isCreating, setIsCreating] = useState(true);
  const [attemptedQuiz, setAttemptedQuiz] = useState(null);

  const handleCreateQuestion = () => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, { question: '', answers: ['', '', '', ''], correctAnswer: 0 }]
    });
  };

  const handleSubmitQuiz = () => {
    if (currentQuiz.name && currentQuiz.questions.length > 0) {
      setQuizzes([...quizzes, currentQuiz]);
      setCurrentQuiz({ name: '', questions: [] });
      setIsCreating(false);
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = currentQuiz.questions.map((q, qi) => 
      qi === questionIndex ? { 
        ...q, 
        answers: q.answers.map((a, ai) => ai === answerIndex ? value : a)
      } : q
    );
    setCurrentQuiz({...currentQuiz, questions: updatedQuestions});
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = currentQuiz.questions.map((q, i) => i === index ? {...q, question: value} : q);
    setCurrentQuiz({...currentQuiz, questions: updatedQuestions});
  };

  const handleCorrectAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = currentQuiz.questions.map((q, i) => 
      i === questionIndex ? {...q, correctAnswer: answerIndex} : q
    );
    setCurrentQuiz({...currentQuiz, questions: updatedQuestions});
  };

  const attemptQuiz = (quiz) => {
    setAttemptedQuiz({ quiz, answers: Array(quiz.questions.length).fill(null) });
  };

  const submitAttempt = () => {
    setAttemptedQuiz(null);
    setIsCreating(false);
  };

  const QuizCreator = () => (
    <Card className="mt-6 w-full sm:w-96">
      <CardHeader color="blue-gray" className="mb-4">
        <h2 className="text-2xl">Create a New Quiz</h2>
      </CardHeader>
      <CardBody>
        <Input label="Quiz Name" value={currentQuiz.name} onChange={(e) => setCurrentQuiz({...currentQuiz, name: e.target.value})} />
        {currentQuiz.questions.map((q, qi) => (
          <div key={qi} className="mt-4">
            <Input label={`Question ${qi + 1}`} value={q.question} onChange={(e) => handleQuestionChange(qi, e.target.value)} />
            {q.answers.map((a, ai) => (
              <div key={ai} className="flex items-center mt-2">
                <Input label={`Answer ${ai + 1}`} value={a} onChange={(e) => handleAnswerChange(qi, ai, e.target.value)} />
                <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === ai} onChange={() => handleCorrectAnswer(qi, ai)} className="ml-2" />
              </div>
            ))}
          </div>
        ))}
        <Button onClick={handleCreateQuestion} className="mt-4">Add Question</Button>
      </CardBody>
      <CardFooter>
        <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
      </CardFooter>
    </Card>
  );

  const QuizAttempt = ({ quiz, answers, onChangeAnswer, onSubmit }) => (
    <Card className="mt-6 w-full sm:w-96">
      <CardHeader color="blue-gray" className="mb-4">
        <h2 className="text-2xl">{quiz.name}</h2>
      </CardHeader>
      <CardBody>
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="mb-4">
            <h3>{q.question}</h3>
            {q.answers.map((a, ai) => (
              <div key={ai} className="flex items-center">
                <input type="radio" name={`question-${qi}`} checked={answers[qi] === ai} onChange={() => onChangeAnswer(qi, ai)} className="mr-2" />
                <label>{a}</label>
              </div>
            ))}
          </div>
        ))}
      </CardBody>
      <CardFooter>
        <Button onClick={onSubmit}>Submit Attempt</Button>
      </CardFooter>
    </Card>
  );

  const ResultView = ({ quiz, answers }) => {
    let score = 0;
    return (
      <Card className="mt-6 w-full sm:w-96">
        <CardHeader color="blue-gray" className="mb-4">
          <h2 className="text-2xl">Results</h2>
        </CardHeader>
        <CardBody>
          {quiz.questions.map((q, qi) => {
            const isCorrect = q.correctAnswer === answers[qi];
            if (isCorrect) score++;
            return (
              <div key={qi} className={`mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                <p>{q.question}</p>
                <p>Your Answer: {q.answers[answers[qi]]}</p>
                <p>Correct Answer: {q.answers[q.correctAnswer]}</p>
              </div>
            );
          })}
          <p className="mt-4">Your Score: {score}/{quiz.questions.length}</p>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="App flex flex-col items-center p-4">
      {isCreating ? <QuizCreator /> : attemptedQuiz ? (
        attemptedQuiz.answers.some(a => a === null) ? (
          <QuizAttempt 
            quiz={attemptedQuiz.quiz} 
            answers={attemptedQuiz.answers} 
            onChangeAnswer={(qi, ai) => setAttemptedQuiz({...attemptedQuiz, answers: attemptedQuiz.answers.map((a, i) => i === qi ? ai : a)})}
            onSubmit={() => setAttemptedQuiz({...attemptedQuiz, submitted: true})}
          />
        ) : (
          <ResultView quiz={attemptedQuiz.quiz} answers={attemptedQuiz.answers} />
        )
      ) : (
        <div>
          <Button onClick={() => setIsCreating(true)} className="mb-4">Create New Quiz</Button>
          {quizzes.map((quiz, idx) => (
            <Card key={idx} className="mb-4 w-full sm:w-96">
              <CardBody>
                <h3>{quiz.name}</h3>
                <Button onClick={() => attemptQuiz(quiz)}>Attempt Quiz</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;