import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { useQuizzes } from "@/hooks/use-api"
import { Button } from "@/components/atoms/button"
import { Card, CardContent } from "@/components/atoms/card"
import { Alert, AlertDescription } from "@/components/atoms/alert"

function QuizzesPage() {
    const navigate = useNavigate()
    const { data: quizzes, isLoading, isError } = useQuizzes()

    const handleStartQuiz = (quizId: string) => navigate(`/quiz/${quizId}`)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                        Carregando quizzes...
                    </p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <Alert variant="destructive" className="max-w-sm">
                        <AlertDescription>
                            Falha ao carregar quizzes. Tente novamente.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <h2 className="text-xl font-semibold mb-6">
                    Quizzes Disponiveis
                </h2>

                {quizzes && quizzes.items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">
                            Nenhum quiz disponivel no momento.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {quizzes?.items.map((quiz) => (
                            <Card
                                key={quiz.id}
                                className="h-full flex flex-col"
                            >
                                <CardContent className="flex-1 pt-6">
                                    <h3 className="font-semibold text-lg mb-2">
                                        {quiz.title}
                                    </h3>
                                    {quiz.description && (
                                        <p className="text-muted-foreground text-sm mb-4">
                                            {quiz.description}
                                        </p>
                                    )}
                                    <Button
                                        className="w-full"
                                        onClick={() => handleStartQuiz(quiz.id)}
                                    >
                                        Iniciar Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export { QuizzesPage }
