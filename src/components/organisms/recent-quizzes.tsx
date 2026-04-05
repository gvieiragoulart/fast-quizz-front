import { Flame, ArrowRight } from "lucide-react"

import { Button } from "@/components/atoms/button"
import { QuizCard } from "@/components/molecules/quiz-card"
import type { Quiz } from "@/types"

interface RecentQuizzesProps {
    quizzes: Quiz[] | undefined
    onStartQuiz: (id: number | string) => void
}

function RecentQuizzes({ quizzes, onStartQuiz }: RecentQuizzesProps) {
    if (!quizzes || quizzes.length === 0) return null

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                        <Flame className="w-7 h-7 text-orange-500" />
                        Ultimos Quizzes
                    </h2>
                    <Button variant="ghost" className="text-blue-600 font-bold">
                        Ver Todos
                        <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {quizzes.slice(0, 4).map((quiz) => (
                        <QuizCard
                            key={quiz.id}
                            quiz={quiz}
                            onStartQuiz={onStartQuiz}
                            showNewBadge
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export { RecentQuizzes }
export type { RecentQuizzesProps }
