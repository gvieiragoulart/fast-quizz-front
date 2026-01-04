import api from './api';
import type { Question, SubmitQuizRequest, QuizResult, QuizListResponse } from '../types';

export const quizService = {
  async getQuizzes(): Promise<QuizListResponse> {
    try {
      const response = await api.get<QuizListResponse>('/api/quizzes/latest');
      console.log('Fetched quizzes:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  async getQuizQuestions(quizId: string): Promise<Question[]> {
    // Try first endpoint format
    try {
      const response = await api.get<Question[]>(`/api/questions/quiz?quiz_id=${quizId}`);
      return response.data;
    } catch (error) {
      console.log(`Falling back to alternative endpoint for quizId: ${quizId}`);
      console.log('Error details:', error);
      throw error;
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
