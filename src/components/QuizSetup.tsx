import React, { useState } from 'react';
import { Play, Settings } from 'lucide-react';

interface QuizSetupProps {
  totalQuestions: number;
  onStartQuiz: (startQuestion: number, endQuestion: number) => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ totalQuestions, onStartQuiz }) => {
  const [startQuestion, setStartQuestion] = useState(1);
  const [endQuestion, setEndQuestion] = useState(Math.min(5, totalQuestions));
  const [useSlider, setUseSlider] = useState(true);

  const handleStartQuiz = () => {
    if (startQuestion <= endQuestion && startQuestion >= 1 && endQuestion <= totalQuestions) {
      onStartQuiz(startQuestion, endQuestion);
    }
  };

  const handleSliderChange = (value: number) => {
    setEndQuestion(value);
    if (startQuestion > value) {
      setStartQuestion(1);
    }
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
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Total Questions Available: <span className="font-bold">{totalQuestions}</span>
            </p>
          </div>

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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions: {endQuestion}
                </label>
                <input
                  type="range"
                  min="1"
                  max={totalQuestions}
                  value={endQuestion}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>{totalQuestions}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Question
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalQuestions}
                  value={startQuestion}
                  onChange={(e) => setStartQuestion(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Question
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalQuestions}
                  value={endQuestion}
                  onChange={(e) => setEndQuestion(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <span className="font-medium">Selected Range:</span> 
              {useSlider ? ` Questions 1-${endQuestion}` : ` Questions ${startQuestion}-${endQuestion}`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total questions to attempt: {useSlider ? endQuestion : (endQuestion - startQuestion + 1)}
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={startQuestion > endQuestion}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};