import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { quizService } from '../services/quiz';
import type { LoginRequest, RegisterRequest, SubmitQuizRequest } from '../types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizService.getQuizzes(),
  });
};

export const useQuizQuestions = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId, 'questions'],
    queryFn: () => quizService.getQuizQuestions(quizId),
    enabled: !!quizId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SubmitQuizRequest) => quizService.submitQuiz(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};
