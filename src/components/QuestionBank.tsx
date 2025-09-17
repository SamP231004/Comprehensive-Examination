import React, { useState } from 'react';
import { Book, Search, CheckCircle, ArrowLeft, Filter } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionBankProps {
  questions: Question[];
  onBack: () => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewStartRange, setViewStartRange] = useState(1);
  const [viewEndRange, setViewEndRange] = useState(questions.length);
  const [showRangeFilter, setShowRangeFilter] = useState(false);

  // First filter by range, then by search term
  const rangeFilteredQuestions = questions.filter(
    (question) => question.index >= viewStartRange && question.index <= viewEndRange
  );

  const filteredQuestions = rangeFilteredQuestions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.options.some((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <Book className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Question Bank</h1>
                    <p className="text-purple-100">Browse all {questions.length} questions</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRangeFilter(!showRangeFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter Range
              </button>
            </div>
          </div>

          {/* Search and Range Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Range Filter */}
              {showRangeFilter && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">View From:</label>
                      <input
                        type="number"
                        min="1"
                        max={questions.length}
                        value={viewStartRange}
                        onChange={(e) => setViewStartRange(Number(e.target.value))}
                        className="flex-1 sm:w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">To:</label>
                      <input
                        type="number"
                        min="1"
                        max={questions.length}
                        value={viewEndRange}
                        onChange={(e) => setViewEndRange(Number(e.target.value))}
                        className="flex-1 sm:w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Showing {viewEndRange - viewStartRange + 1} questions
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-gray-600">
                Showing {filteredQuestions.length} of {rangeFilteredQuestions.length} questions
                {showRangeFilter && (
                  <span className="ml-1 text-purple-600 font-medium">
                    (Range: {viewStartRange}-{viewEndRange})
                  </span>
                )}
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-500">
                  Search: "{searchTerm}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <div key={question.index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">
                      {question.index}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed break-words">
                      {question.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = option === question.answer;
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                              isCorrect
                                ? 'border-green-300 bg-green-50 text-green-900'
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                  isCorrect
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isCorrect && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <span className="font-medium break-words">{option}</span>
                            </div>
                            {isCorrect && (
                              <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-semibold">Correct</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {searchTerm 
                ? "Try adjusting your search terms or clear the search to see all questions."
                : "Try adjusting your range filter to see questions."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};