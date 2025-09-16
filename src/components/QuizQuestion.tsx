import React from 'react';
import { ChevronLeft, ChevronRight, Clock, Target, Flag } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  onFinish,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Jumble options for display
  const jumbledOptions = React.useMemo(() => {
    const options = [...question.options];
    // Simple shuffle algorithm using question index as seed for consistency
    const seed = question.index;
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(((seed * (i + 1)) % 1000) / 1000 * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [question.options, question.index]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Target className="w-5 h-5" />
              </div>
              <span className="font-semibold">Quiz in Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Question {currentIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {jumbledOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-4 order-last sm:order-none">
              <div className="text-sm text-gray-500 text-center">
                {selectedAnswer ? 'Answer selected' : 'Select an answer'}
              </div>
              <button
                onClick={onFinish}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                <Flag className="w-4 h-4" />
                Finish Quiz
              </button>
            </div>

            {isLastQuestion ? (
              <button
                onClick={onFinish}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};