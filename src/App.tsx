import { useState, useEffect } from 'react';
import { QuizSetup } from './components/QuizSetup';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuestionBank } from './components/QuestionBank';
import { SocialLinks } from './components/SocialLinks';
import { Question, QuizState } from './types/quiz';
import questionsData from './data/questions.json';

function App() {
  const [showQuestionBank, setShowQuestionBank] = useState(false);
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
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [attemptKey, setAttemptKey] = useState(0);
  const [scoreRecord, setScoreRecord] = useState<Record<number, boolean>>({});

  const handleStartQuiz = (startQuestion: number, endQuestion: number) => {
    const selectedQuestions = allQuestions.filter(
      (q) => q.index >= startQuestion && q.index <= endQuestion
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

    setQuestionQueue([...selectedQuestions]);
    setAttemptKey(0);
    setScoreRecord({});
  };

  const handleStartRandomQuiz = (count: number, startRange?: number, endRange?: number) => {
    let questionPool = allQuestions;
    
    // If range is specified, filter questions to that range
    if (startRange && endRange) {
      questionPool = allQuestions.filter(
        (q) => q.index >= startRange && q.index <= endRange
      );
    }
    
    // Create a shuffled copy of the question pool
    const shuffledQuestions = [...questionPool].sort(() => Math.random() - 0.5);
    // Take the first 'count' questions
    const selectedQuestions = shuffledQuestions.slice(0, count);

    setQuizState({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startQuestion: 1,
      endQuestion: count,
      isQuizStarted: true,
      isQuizCompleted: false,
    });

    setQuestionQueue([...selectedQuestions]);
    setAttemptKey(0);
    setScoreRecord({});
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questionQueue[quizState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.answer;

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.index]: answer,
      },
    }));

    if (!(currentQuestion.index in scoreRecord)) {
      setScoreRecord((prev) => ({
        ...prev,
        [currentQuestion.index]: isCorrect,
      }));
    }

    if (!isCorrect) {
      const insertPos = Math.min(
        quizState.currentQuestionIndex + 3,
        questionQueue.length
      );
      const newQueue = [...questionQueue];
      newQueue.splice(insertPos, 0, currentQuestion);
      setQuestionQueue(newQueue);
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleNext = () => {
    const currentQuestion = questionQueue[quizState.currentQuestionIndex];
    const userAnswer = quizState.answers[currentQuestion.index];
    const isCorrect = userAnswer === currentQuestion.answer;

    if (!isCorrect && userAnswer) {
      setQuizState((prev) => {
        const newAnswers = { ...prev.answers };
        delete newAnswers[currentQuestion.index];
        return { ...prev, answers: newAnswers };
      });
      setAttemptKey((prev) => prev + 1);
    }

    if (quizState.currentQuestionIndex < questionQueue.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handleFinishQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      isQuizCompleted: true,
    }));
  };

  const handleRestart = () => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      answers: {},
      isQuizCompleted: false,
    }));
    setQuestionQueue([]);
    setAttemptKey(0);
    setScoreRecord({});
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
    setQuestionQueue([]);
    setAttemptKey(0);
    setScoreRecord({});
  };

  const handleOpenQuestionBank = () => {
    setShowQuestionBank(true);
  };

  const handleBackFromQuestionBank = () => {
    setShowQuestionBank(false);
  };

  const handleStartQuizFromBank = (startQuestion: number, endQuestion: number) => {
    setShowQuestionBank(false);
    handleStartQuiz(startQuestion, endQuestion);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!quizState.isQuizStarted || quizState.isQuizCompleted) return;

      if (e.key === 'ArrowLeft' && quizState.currentQuestionIndex > 0) {
        handlePrevious();
      } else if (
        e.key === 'ArrowRight' &&
        quizState.currentQuestionIndex < questionQueue.length - 1
      ) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quizState, questionQueue]);

  if (showQuestionBank) {
    return (
      <>
        <QuestionBank
          questions={allQuestions}
          onBack={handleBackFromQuestionBank}
        />
        <SocialLinks />
      </>
    );
  }

  if (!quizState.isQuizStarted) {
    return (
      <>
        <QuizSetup
          totalQuestions={allQuestions.length}
          onStartQuiz={handleStartQuiz}
          onStartRandomQuiz={handleStartRandomQuiz}
          onOpenQuestionBank={handleOpenQuestionBank}
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
          scoreRecord={scoreRecord}
          onRestart={handleRestart}
          onBackToSetup={handleBackToSetup}
        />
        <SocialLinks />
      </>
    );
  }

  const currentQuestion = questionQueue[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.answers[currentQuestion.index];

  // Defensive check: if currentQuestion is undefined, return to setup
  if (!currentQuestion) {
    return (
      <>
        <QuizSetup
          totalQuestions={allQuestions.length}
          onStartQuiz={handleStartQuiz}
          onStartRandomQuiz={handleStartRandomQuiz}
          onOpenQuestionBank={handleOpenQuestionBank}
        />
        <SocialLinks />
      </>
    );
  }

  return (
    <>
      <QuizQuestion
        key={`${currentQuestion.index}-${attemptKey}`}
        question={currentQuestion}
        currentIndex={quizState.currentQuestionIndex}
        totalQuestions={questionQueue.length}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinishQuiz}
        canGoPrevious={quizState.currentQuestionIndex > 0}
        canGoNext={quizState.currentQuestionIndex < questionQueue.length - 1}
        isLastQuestion={quizState.currentQuestionIndex === questionQueue.length - 1}
      />
      <SocialLinks />
    </>
  );
}

export default App;
