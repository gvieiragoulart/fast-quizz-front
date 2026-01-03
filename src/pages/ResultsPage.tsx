import { useLocation, useNavigate } from 'react-router-dom';
import type { QuizResult } from '../types';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as QuizResult | undefined;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">No results found.</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const percentage = (result.correctAnswers / result.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Fast Quiz</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/quizzes')}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Score Summary */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            
            <div className="my-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100 mb-4">
                <span className="text-4xl font-bold text-indigo-600">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              
              <p className="text-xl text-gray-700">
                You scored <span className="font-semibold">{result.correctAnswers}</span> out of{' '}
                <span className="font-semibold">{result.totalQuestions}</span>
              </p>
            </div>

            <button
              onClick={() => navigate('/quizzes')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-lg"
            >
              Take Another Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Results</h3>
            
            <div className="space-y-6">
              {result.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {answer.isCorrect ? (
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        Question {index + 1}: {answer.question}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Your answer:</span>{' '}
                        <span
                          className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}
                        >
                          Option {answer.selectedOption + 1}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Correct answer:</span>{' '}
                          <span className="text-green-700">
                            Option {answer.correctOption + 1}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
