import { LibraryBig } from "lucide-react"

import { QuizCard } from "@/components/molecules/quiz-card"
import type { Quiz } from "@/types"

interface AllQuizzesProps {
    quizzes: Quiz[] | undefined
    isLoading?: boolean
    isError?: boolean
    onStartQuiz: (id: number | string) => void
}

function AllQuizzes({
    quizzes,
    isLoading,
    isError,
    onStartQuiz,
}: AllQuizzesProps) {
    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-muted-foreground">Carregando quizzes...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-destructive">
                    Falha ao carregar quizzes. Tente novamente.
                </p>
            </div>
        )
    }

    if (!quizzes) return null

    return (
        <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
                    <LibraryBig className="w-7 h-7 text-blue-600" />
                    Todos os Quizzes
                </h2>

                {quizzes.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">
                            Nenhum quiz encontrado com os filtros selecionados
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                onStartQuiz={onStartQuiz}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export { AllQuizzes }
export type { AllQuizzesProps }
