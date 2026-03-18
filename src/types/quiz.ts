export interface Quiz {
  id: string;
  title: string;
  description: string;
  estimated_time?: number;
  feedback_mode?: QuizFeedbackMode;
  questions?: Array<string>;
  createdAt?: string;
}

export interface QuizListResponse {
  items: Quiz[];
  total_items: number;
  total_pages: number;
}

export type QuizFeedbackMode = 'final' | 'imediato'

export interface QuizRequestCreate {
  title: string;
  description: string;
  estimated_time?: number;
  feedback_mode?: QuizFeedbackMode;
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