export interface QuestionOption {
    id: string
    reference_id: number
    text: string
    order: number
    is_correct?: boolean
}

export interface Question {
    id: string
    text: string
    quiz_id: string
    options: QuestionOption[]
    correct_answer: number
}

export interface Answer {
    questionId: string
    selectedOption: number
}
