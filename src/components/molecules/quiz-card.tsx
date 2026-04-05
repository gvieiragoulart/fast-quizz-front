import { Clock } from "lucide-react"

import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardFooter } from "@/components/atoms/card"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/services/api"
import type { Quiz, QuizDifficulty } from "@/types"

const difficultyConfig: Record<
    QuizDifficulty,
    { label: string; className: string }
> = {
    facil: { label: "Facil", className: "bg-emerald-500 text-white" },
    medio: { label: "Medio", className: "bg-yellow-500 text-white" },
    dificil: {
        label: "Dificil",
        className: "bg-orange-500 text-white",
    },
    expert: { label: "Expert", className: "bg-red-500 text-white" },
}

interface QuizCardProps {
    quiz: Quiz
    onStartQuiz: (id: number | string) => void
    showNewBadge?: boolean
}

function QuizCard({ quiz, onStartQuiz, showNewBadge = false }: QuizCardProps) {
    const difficultyInfo = quiz.difficulty
        ? difficultyConfig[quiz.difficulty]
        : null

    return (
        <Card
            className={cn(
                "h-full flex flex-col relative transition-all duration-300",
                "hover:-translate-y-2 hover:shadow-lg",
            )}
        >
            <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                {showNewBadge && (
                    <Badge className="bg-orange-500 text-white font-bold">
                        NOVO
                    </Badge>
                )}
                {difficultyInfo && (
                    <Badge className={difficultyInfo.className}>
                        {difficultyInfo.label}
                    </Badge>
                )}
            </div>

            {quiz.image_url ? (
                <img
                    src={`${API_BASE_URL}${quiz.image_url}`}
                    alt={quiz.title}
                    className="h-40 w-full object-cover rounded-t-lg"
                />
            ) : (
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg" />
            )}

            <CardContent className="flex-1 pt-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {quiz.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 min-h-[40px] line-clamp-2">
                    {quiz.description}
                </p>

                <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {quiz.estimated_time || "N/A"} min
                    </span>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => onStartQuiz(quiz.id)}
                >
                    Iniciar Quiz
                </Button>
            </CardFooter>
        </Card>
    )
}

export { QuizCard }
export type { QuizCardProps }
