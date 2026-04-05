import { api } from "@/services/api"
import type {
    Question,
    SubmitQuizRequest,
    QuizResult,
    QuizListResponse,
    QuizRequestCreate,
    QuizUpdateRequest,
    Quiz,
    ResultSubmit,
    ResultResponse,
} from "@/types"

const quizService = {
    async getQuizzes(): Promise<QuizListResponse> {
        const response = await api.get<QuizListResponse>("/api/quizzes/latest")
        return response.data
    },

    async getQuizQuestions(quizId: string): Promise<Question[]> {
        const response = await api.get<Question[]>(
            `/api/questions/quiz?quiz_id=${quizId}`,
        )
        return response.data
    },

    async submitQuiz(data: SubmitQuizRequest): Promise<QuizResult> {
        try {
            const response = await api.post<QuizResult>(
                `/api/quizzes/${data.quizId}/submit`,
                { answers: data.answers },
            )
            return response.data
        } catch {
            const response = await api.post<QuizResult>(
                "/api/questions/answers",
                data,
            )
            return response.data
        }
    },

    async createQuiz(payload: QuizRequestCreate): Promise<Quiz> {
        const response = await api.post("/api/quizzes", payload)
        return response.data
    },

    async submitResult(payload: ResultSubmit): Promise<ResultResponse> {
        const response = await api.post<ResultResponse>(
            "/api/results/",
            payload,
        )
        return response.data
    },

    async getResultsByQuiz(
        quizId: string,
    ): Promise<{ items: ResultResponse[]; total: number }> {
        const response = await api.get(`/api/results/quiz/${quizId}`)
        return response.data
    },

    async getMyQuizzes(page: number = 1): Promise<QuizListResponse> {
        const response = await api.get<QuizListResponse>(
            `/api/quizzes/me/created?page=${page}`,
        )
        return response.data
    },

    async updateQuiz(
        quizId: string,
        data: QuizUpdateRequest,
    ): Promise<Quiz> {
        const response = await api.put<Quiz>(`/api/quizzes/${quizId}`, data)
        return response.data
    },

    async deleteQuiz(quizId: string): Promise<void> {
        await api.delete(`/api/quizzes/${quizId}`)
    },

    async uploadQuizImage(quizId: string, file: File): Promise<Quiz> {
        const formData = new FormData()
        formData.append("file", file)
        const response = await api.post<Quiz>(
            `/api/quizzes/${quizId}/image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        )
        return response.data
    },
}

export { quizService }
