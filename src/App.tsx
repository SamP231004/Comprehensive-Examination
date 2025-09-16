import React, { useState, useEffect } from 'react';
import { QuizSetup } from './components/QuizSetup';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { SocialLinks } from './components/SocialLinks';
import { Question, QuizState } from './types/quiz';
import questionsData from './data/questions.json';

function App() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    startQuestion: 1,
    endQuestion: 5,
    isQuizStarted: false,
    isQuizCompleted: false,
  });

  const [allQuestions] = useState<Question[]>(questionsData);

  const handleStartQuiz = (startQuestion: number, endQuestion: number) => {
    const selectedQuestions = allQuestions.filter(
      q => q.index >= startQuestion && q.index <= endQuestion
    );

    setQuizState({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startQuestion,
      endQuestion,
      isQuizStarted: true,
      isQuizCompleted: false,
    });
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.index]: answer,
      },
    }));
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handleFinishQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      isQuizCompleted: true,
    }));
  };

  const handleRestart = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      answers: {},
      isQuizCompleted: false,
    }));
  };

  const handleBackToSetup = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      startQuestion: 1,
      endQuestion: 5,
      isQuizStarted: false,
      isQuizCompleted: false,
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!quizState.isQuizStarted || quizState.isQuizCompleted) return;

      if (e.key === 'ArrowLeft' && quizState.currentQuestionIndex > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && quizState.currentQuestionIndex < quizState.questions.length - 1) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quizState]);

  if (!quizState.isQuizStarted) {
    return (
      <>
        <QuizSetup
          totalQuestions={allQuestions.length}
          onStartQuiz={handleStartQuiz}
        />
        <SocialLinks />
      </>
    );
  }

  if (quizState.isQuizCompleted) {
    return (
      <>
        <QuizResults
          questions={quizState.questions}
          answers={quizState.answers}
          onRestart={handleRestart}
          onBackToSetup={handleBackToSetup}
        />
        <SocialLinks />
      </>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.answers[currentQuestion.index];

  return (
    <>
      <QuizQuestion
        question={currentQuestion}
        currentIndex={quizState.currentQuestionIndex}
        totalQuestions={quizState.questions.length}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinishQuiz}
        canGoPrevious={quizState.currentQuestionIndex > 0}
        canGoNext={quizState.currentQuestionIndex < quizState.questions.length - 1}
        isLastQuestion={quizState.currentQuestionIndex === quizState.questions.length - 1}
      />
      <SocialLinks />
    </>
  );
}

export default App;