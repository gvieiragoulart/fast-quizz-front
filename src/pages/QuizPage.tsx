import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizQuestions, useSubmitQuiz } from '../hooks/useApi';
import type { Answer } from '../types';

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { data: questions, isLoading, isError } = useQuizQuestions(quizId!);
  const submitQuiz = useSubmitQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;

    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
    });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizId || !questions) return;

    // Ensure all questions are answered
    if (answers.length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const result = await submitQuiz.mutateAsync({
        quizId,
        answers,
      });
      navigate(`/quiz/${quizId}/results`, { state: { result } });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const getCurrentAnswer = () => {
    if (!currentQuestion) return undefined;
    return answers.find((a) => a.questionId === currentQuestion.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (isError || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load quiz. Please try again.</p>
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

  const currentAnswer = getCurrentAnswer();
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{answers.length} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion?.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    currentAnswer?.selectedOption === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        currentAnswer?.selectedOption === index
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {currentAnswer?.selectedOption === index && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitQuiz.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
