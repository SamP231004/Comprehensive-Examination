import React, { useState } from 'react';
import { Play, Settings, Book, Shuffle } from 'lucide-react';

interface QuizSetupProps {
  totalQuestions: number;
  onStartQuiz: (startQuestion: number, endQuestion: number) => void;
  onStartRandomQuiz: (count: number) => void;
  onOpenQuestionBank: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ totalQuestions, onStartQuiz, onStartRandomQuiz, onOpenQuestionBank }) => {
  const [startQuestion, setStartQuestion] = useState(1);
  const [endQuestion, setEndQuestion] = useState(Math.min(5, totalQuestions));
  const [useSlider, setUseSlider] = useState(true);
  const [quizMode, setQuizMode] = useState<'range' | 'random'>('range');
  const [randomCount, setRandomCount] = useState(5);
  const [randomFromRange, setRandomFromRange] = useState(false);
  const [randomStartQuestion, setRandomStartQuestion] = useState(1);
  const [randomEndQuestion, setRandomEndQuestion] = useState(Math.min(10, totalQuestions));

  const handleStartQuiz = () => {
    if (quizMode === 'random') {
      if (randomFromRange) {
        // Pass range info for random selection from range
        onStartRandomQuiz(randomCount, randomStartQuestion, randomEndQuestion);
      } else {
        onStartRandomQuiz(randomCount);
      }
    } else if (startQuestion <= endQuestion && startQuestion >= 1 && endQuestion <= totalQuestions) {
      onStartQuiz(startQuestion, endQuestion);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const range = endQuestion - startQuestion;
    const maxStart = totalQuestions - range;
    
    if (value <= maxStart) {
      setStartQuestion(value);
      setEndQuestion(value + range);
    }
  };

  const handleRangeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    const maxEnd = Math.min(startQuestion + width - 1, totalQuestions);
    setEndQuestion(maxEnd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Setup</h1>
          <p className="text-gray-600">Configure your quiz settings and start practicing</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <button
              onClick={onOpenQuestionBank}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Book className="w-5 h-5" />
              Browse Question Bank
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              📚 Total Questions Available: <span className="font-bold">{totalQuestions}</span>
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-700 font-medium">Quiz Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setQuizMode('range')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  quizMode === 'range'
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Range
              </button>
              <button
                onClick={() => setQuizMode('random')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  quizMode === 'random'
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {quizMode === 'range' && (
            <React.Fragment>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Selection Method:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setUseSlider(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      useSlider 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Slider
                  </button>
                  <button
                    onClick={() => setUseSlider(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !useSlider 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {useSlider ? (
                <div className="space-y-6">
                  <div>
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-800">
                          Questions {startQuestion} - {endQuestion}
                        </div>
                        <div className="text-sm text-blue-600">
                          {endQuestion - startQuestion + 1} questions selected
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Question Range (Total: {totalQuestions})
                      </label>
                      <div className="relative mb-4">
                        <div className="relative h-6">
                          {/* Track background */}
                          <div className="absolute top-2 w-full h-2 bg-gray-200 rounded-lg"></div>
                          
                          {/* Active range */}
                          <div 
                            className="absolute top-2 h-2 bg-blue-500 rounded-lg"
                            style={{
                              left: `${((startQuestion - 1) / (totalQuestions - 1)) * 100}%`,
                              width: `${((endQuestion - startQuestion) / (totalQuestions - 1)) * 100}%`
                            }}
                          />
                          
                          {/* Start handle */}
                          <input
                            type="range"
                            min="1"
                            max={totalQuestions}
                            value={startQuestion}
                            onChange={(e) => {
                              const newStart = Number(e.target.value);
                              if (newStart <= endQuestion) {
                                setStartQuestion(newStart);
                              }
                            }}
                            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer slider"
                            style={{ zIndex: startQuestion > endQuestion - 5 ? 2 : 1 }}
                          />
                          
                          {/* End handle */}
                          <input
                            type="range"
                            min="1"
                            max={totalQuestions}
                            value={endQuestion}
                            onChange={(e) => {
                              const newEnd = Number(e.target.value);
                              if (newEnd >= startQuestion) {
                                setEndQuestion(newEnd);
                              }
                            }}
                            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer slider"
                            style={{ zIndex: endQuestion < startQuestion + 5 ? 2 : 1 }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>{totalQuestions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Question (Max: {totalQuestions})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalQuestions}
                      value={startQuestion}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= totalQuestions) {
                          setStartQuestion(value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Question (Max: {totalQuestions})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalQuestions}
                      value={endQuestion}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= totalQuestions) {
                          setEndQuestion(value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <span className="font-medium">Selected Range: </span> 
                  Questions {startQuestion}-{endQuestion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total questions to attempt: {endQuestion - startQuestion + 1}
                </p>
              </div>
            </React.Fragment>
          )}

          {quizMode === 'random' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shuffle className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700 font-medium">Random Questions</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">Random Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setRandomFromRange(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !randomFromRange
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Questions
                  </button>
                  <button
                    onClick={() => setRandomFromRange(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      randomFromRange
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    From Range
                  </button>
                </div>
              </div>

              {randomFromRange && (
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-orange-700 mb-2">
                        From Question (Max: {totalQuestions})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalQuestions}
                        value={randomStartQuestion}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= totalQuestions) {
                            setRandomStartQuestion(value);
                            if (value > randomEndQuestion) {
                              setRandomEndQuestion(value);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700 mb-2">
                        To Question (Max: {totalQuestions})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalQuestions}
                        value={randomEndQuestion}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= totalQuestions) {
                            setRandomEndQuestion(value);
                            if (randomStartQuestion > value) {
                              setRandomStartQuestion(value);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="text-center text-orange-700 text-sm">
                    Pool: {randomEndQuestion - randomStartQuestion + 1} questions (Questions {randomStartQuestion}-{randomEndQuestion})
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions to Select (Max: {randomFromRange ? (randomEndQuestion - randomStartQuestion + 1) : totalQuestions})
                </label>
                <input
                  type="number"
                  min="1"
                  max={randomFromRange ? (randomEndQuestion - randomStartQuestion + 1) : totalQuestions}
                  value={randomCount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const maxAllowed = randomFromRange ? (randomEndQuestion - randomStartQuestion + 1) : totalQuestions;
                    if (value >= 1 && value <= maxAllowed) {
                      setRandomCount(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available questions: {randomFromRange ? (randomEndQuestion - randomStartQuestion + 1) : totalQuestions}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-800 mb-1">
                    {randomCount} Random Questions
                  </div>
                  <div className="text-sm text-orange-600">
                    {randomFromRange 
                      ? `From questions ${randomStartQuestion}-${randomEndQuestion} (${randomEndQuestion - randomStartQuestion + 1} available)`
                      : `From all ${totalQuestions} available questions`
                    }
                  </div>
                  <div className="text-xs text-orange-500 mt-1">
                    Questions will be shuffled and presented randomly
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartQuiz}
            disabled={
              totalQuestions === 0 || 
              (quizMode === 'range' && startQuestion > endQuestion) || 
              (quizMode === 'random' && (randomCount < 1 || (randomFromRange && randomCount > (randomEndQuestion - randomStartQuestion + 1))))
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {quizMode === 'random' ? <Shuffle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            Start {quizMode === 'random' ? 'Random' : 'Range'} Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
