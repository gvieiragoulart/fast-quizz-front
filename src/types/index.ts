export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questionCount?: number;
  createdAt?: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctAnswer?: number;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
}

export interface SubmitQuizRequest {
  quizId: string;
  answers: Answer[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionId: string;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }[];
}
