export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions?: Array<string>;
  createdAt?: string;
}

export interface QuizListResponse {
  items: Quiz[];
  total_items: number;
  total_pages: number;
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
