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
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  username: string;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions?: Array<string>;
  createdAt?: string;
}

export interface QuizRequestCreate {
  title: string;
  description: string;
  questions: Array<QuestionQuizCreate>;
}

export interface QuestionQuizCreate {
  text: string;
  correct_answer: number;
  options: Array<OptionQuestionCreate>;
}

export interface OptionQuestionCreate {
  reference_id: number;
  text: string;
  is_correct?: boolean;
}

export interface QuizListResponse {
  items: Quiz[];
  total_items: number;
  total_pages: number;
}

export interface QuestionOption {
  id: string;
  reference_id: number;
  text: string;
  order: number;
  is_correct?: boolean;
}

export interface Question {
  id: string;
  text: string;
  quiz_id: string;
  options: QuestionOption[];
  correct_answer: number;
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
