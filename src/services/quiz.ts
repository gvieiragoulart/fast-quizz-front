import api from './api';
import type { Quiz, Question, SubmitQuizRequest, QuizResult } from '../types';

export const quizService = {
  async getQuizzes(): Promise<Quiz[]> {
    const response = await api.get<Quiz[]>('/api/quizzes');
    return response.data;
  },

  async getQuizQuestions(quizId: string): Promise<Question[]> {
    // Try first endpoint format
    try {
      const response = await api.get<Question[]>(`/api/questions?quiz_id=${quizId}`);
      return response.data;
    } catch {
      // Fallback to alternative endpoint format if first fails
      const response = await api.get<{ questions: Question[] }>(
        `/api/quizzes/${quizId}?include_questions=true`
      );
      return response.data.questions;
    }
  },

  async submitQuiz(data: SubmitQuizRequest): Promise<QuizResult> {
    // Try first endpoint format
    try {
      const response = await api.post<QuizResult>(
        `/api/quizzes/${data.quizId}/submit`,
        { answers: data.answers }
      );
      return response.data;
    } catch {
      // Fallback to alternative endpoint format if first fails
      const response = await api.post<QuizResult>('/api/questions/answers', data);
      return response.data;
    }
  },
};
