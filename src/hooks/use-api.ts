import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { authService } from "@/services/auth"
import { quizService } from "@/services/quiz"
import { userService } from "@/services/user"
import type {
    LoginRequest,
    RegisterRequest,
    SubmitQuizRequest,
    QuizRequestCreate,
    QuizUpdateRequest,
    UserUpdateRequest,
    ResultSubmit,
} from "@/types"

function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (credentials: LoginRequest) =>
            authService.login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

function useRegister() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userData: RegisterRequest) =>
            authService.register(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

function useQuizzes() {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: () => quizService.getQuizzes(),
    })
}

function useQuizQuestions(quizId: string) {
    return useQuery({
        queryKey: ["quiz", quizId, "questions"],
        queryFn: () => quizService.getQuizQuestions(quizId),
        enabled: !!quizId,
    })
}

function useSubmitQuiz() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SubmitQuizRequest) => quizService.submitQuiz(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["quiz", variables.quizId],
            })
        },
    })
}

function useCreateQuiz() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: QuizRequestCreate) =>
            quizService.createQuiz(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"],
            })
        },
    })
}

function useSubmitResult() {
    return useMutation({
        mutationFn: (payload: ResultSubmit) =>
            quizService.submitResult(payload),
    })
}

function useUploadQuizImage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ quizId, file }: { quizId: string; file: File }) =>
            quizService.uploadQuizImage(quizId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quizzes"],
            })
        },
    })
}

function useQuizResults(quizId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["results", quizId],
        queryFn: () => quizService.getResultsByQuiz(quizId),
        enabled: !!quizId && enabled,
    })
}

function useCurrentUser() {
    return useQuery({
        queryKey: ["user", "me"],
        queryFn: () => userService.getMe(),
    })
}

function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string
            data: UserUpdateRequest
        }) => userService.updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "me"] })
        },
    })
}

function useMyQuizzes(page: number = 1) {
    return useQuery({
        queryKey: ["quizzes", "mine", page],
        queryFn: () => quizService.getMyQuizzes(page),
    })
}

function useDeleteQuiz() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (quizId: string) => quizService.deleteQuiz(quizId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes", "mine"] })
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
        },
    })
}

function useUpdateQuiz() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            quizId,
            data,
        }: {
            quizId: string
            data: QuizUpdateRequest
        }) => quizService.updateQuiz(quizId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes", "mine"] })
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
        },
    })
}

export {
    useLogin,
    useRegister,
    useQuizzes,
    useQuizQuestions,
    useSubmitQuiz,
    useCreateQuiz,
    useSubmitResult,
    useUploadQuizImage,
    useQuizResults,
    useCurrentUser,
    useUpdateUser,
    useMyQuizzes,
    useDeleteQuiz,
    useUpdateQuiz,
}
