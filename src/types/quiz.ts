export interface Question {
  index: number;
  question: string;
  options: string[];
  answer: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startQuestion: number;
  endQuestion: number;
  isQuizStarted: boolean;
  isQuizCompleted: boolean;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
}