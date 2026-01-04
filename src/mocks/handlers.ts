import { http, HttpResponse } from 'msw';
import type { QuizListResponse } from '../types';

const quizzes = [
  { id: '1', title: 'Quiz de Exemplo', description: 'Mock para desenvolvimento' },
];
const response: QuizListResponse = {
  items: quizzes,
  total_items: quizzes.length,
  total_pages: 1,
};


export const handlers = [
  http.get('http://localhost:8000/api/quizzes/latest', () => {
    return HttpResponse.json(response);
  })
];