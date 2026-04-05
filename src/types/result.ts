export interface SubmitQuizRequest {
    quizId: string
    answers: { questionId: string; selectedOption: number }[]
}

export interface QuizResult {
    quizId: string
    score: number
    totalQuestions: number
    correctAnswers: number
    answers: {
        questionId: string
        question: string
        selectedOption: number
        correctOption: number
        isCorrect: boolean
    }[]
}

export interface ResultSubmit {
    quiz_id: string
    respondent_name: string
    score: number
    total_questions: number
    user_id?: string
}

export interface ResultResponse {
    id: string
    quiz_id: string
    respondent_name: string
    score: number
    total_questions: number
    user_id?: string
    taken_at: string
}
