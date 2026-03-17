import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizQuestions, useSubmitQuiz } from '@/hooks/useApi'
import type { Answer, Question, QuestionOption, QuizResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { data: questions, isLoading, isError } = useQuizQuestions(quizId!)
  const submitQuiz = useSubmitQuiz()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])

  const currentQuestion = questions?.[currentQuestionIndex] as Question | undefined

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return
    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id)
    newAnswers.push({ questionId: currentQuestion.id, selectedOption: optionIndex })
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1)
  }

  const handleSubmit = async () => {
    if (!quizId || !questions) return
    if (answers.length !== questions.length) {
      alert('Por favor, responda todas as questões antes de enviar.')
      return
    }

    try {
      const detailedAnswers = answers.map((a) => {
        const question = questions.find((q) => q.id === a.questionId) as Question | undefined
        const selectedOptionIndex = a.selectedOption
        const selectedOption = question?.options[selectedOptionIndex]
        const correctOptionIndex = question?.options.findIndex((opt) => opt.is_correct) ?? -1
        const isCorrect = selectedOption?.is_correct === true
        return {
          questionId: a.questionId,
          question: question?.text ?? '',
          selectedOption: selectedOptionIndex,
          correctOption: correctOptionIndex,
          isCorrect,
        }
      })

      const correctCount = detailedAnswers.filter((d) => d.isCorrect).length
      const totalQuestions = questions.length
      const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0

      const localResult: QuizResult = {
        quizId,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        answers: detailedAnswers,
      }

      let apiResult: QuizResult | undefined
      try {
        const response = await submitQuiz.mutateAsync({ quizId, answers })
        if (response && typeof response === 'object' && ('correctAnswers' in response || 'score' in response)) {
          apiResult = response as QuizResult
        }
      } catch (err) {
        console.error('Submit API failed, using local result:', err)
      }

      navigate(`/quiz/${quizId}/results`, { state: { result: apiResult ?? localResult } })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Falha ao enviar. Tente novamente.')
    }
  }

  const getCurrentAnswer = () => {
    if (!currentQuestion) return undefined
    return answers.find((a) => a.questionId === currentQuestion.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    )
  }

  if (isError || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Alert variant="destructive" className="max-w-sm">
            <AlertDescription>Falha ao carregar o quiz. Tente novamente.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')}>Voltar</Button>
        </div>
      </div>
    )
  }

  const currentAnswer = getCurrentAnswer()
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isSubmitting = (submitQuiz as any).isPending || false

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        {/* Progress */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
            <span>{answers.length} respondidas</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">{currentQuestion?.text}</h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option: QuestionOption, index: number) => {
                const selected = currentAnswer?.selectedOption === index
                return (
                  <button
                    key={option.id ?? index}
                    onClick={() => handleSelectOption(index)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-3',
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    {selected && <Check className="w-4 h-4 shrink-0" />}
                    <span>{option.text}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                'Finalizar Quiz'
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>Próxima</Button>
          )}
        </div>
      </div>
    </div>
  )
}
