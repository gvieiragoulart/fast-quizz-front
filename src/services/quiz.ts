import api from './api';
import { authService } from './auth';
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
  async createQuiz(payload: { title: string; description?: string; questions: Array<{ text: string; correct_answer: string; options: Array<{ text: string; is_correct?: boolean }> }> }) {
    try {
      const response = await api.post('/api/quizzes', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },
};
