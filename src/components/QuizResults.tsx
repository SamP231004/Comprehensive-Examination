import React from 'react';
import { Trophy, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuizResultsProps {
  questions: Question[];
  answers: Record<number, string>;
  onRestart: () => void;
  onBackToSetup: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  onRestart,
  onBackToSetup,
}) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => answers[q.index] === q.answer).length;
  const attemptedQuestions = Object.keys(answers).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-blue-100">Here are your results</p>
          </div>

          <div className="p-8">
            <div className={`rounded-2xl border-2 p-6 mb-6 ${getScoreBgColor(percentage)}`}>
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-gray-700 mb-4">
                  <span className="font-semibold">{correctAnswers}</span> out of{' '}
                  <span className="font-semibold">{totalQuestions}</span> questions correct
                  <div className="text-sm text-gray-500 mt-1">
                    ({attemptedQuestions} questions attempted)
                  </div>
                </div>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">{correctAnswers}</span>
                    </div>
                    <div className="text-xs text-gray-500">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span className="font-semibold">{attemptedQuestions - correctAnswers}</span>
                    </div>
                    <div className="text-xs text-gray-500">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <span className="w-4 h-4 text-center font-bold">—</span>
                      <span className="font-semibold">{totalQuestions - attemptedQuestions}</span>
                    </div>
                    <div className="text-xs text-gray-500">Skipped</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={onBackToSetup}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                New Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Detailed Review</h2>
            <p className="text-gray-600">Review your answers and see the correct solutions</p>
          </div>

          <div className="p-6 space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[question.index];
              const isCorrect = userAnswer === question.answer;

              return (
                <div key={question.index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {question.question}
                      </h3>

                      <div className="space-y-2">
                        {/* If answered correctly → only show the correct option */}
                        {isCorrect && (
                          <div className="p-3 rounded-lg border border-green-300 bg-green-50 text-green-800">
                            <div className="flex items-center justify-between">
                              <span>{question.answer}</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                        )}

                        {/* If answered wrong → show wrong in red + correct in green */}
                        {!isCorrect && userAnswer && (
                          <>
                            <div className="p-3 rounded-lg border border-red-300 bg-red-50 text-red-800">
                              <div className="flex items-center justify-between">
                                <span>{userAnswer}</span>
                                <XCircle className="w-4 h-4 text-red-600" />
                              </div>
                            </div>
                            <div className="p-3 rounded-lg border border-green-300 bg-green-50 text-green-800">
                              <div className="flex items-center justify-between">
                                <span>{question.answer}</span>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                          </>
                        )}

                        {/* If skipped */}
                        {!userAnswer && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg text-gray-600 text-sm">
                            No answer selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};