import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useQuizQuestions, useSubmitQuiz } from '@/hooks/useApi'
import type { Answer, Question, QuestionOption, QuizResult, QuizListResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function playSound(type: 'correct' | 'wrong') {
  try {
    const ctx = new AudioContext()
    if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99] // C5 E5 G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const t = ctx.currentTime + i * 0.12
        gain.gain.setValueAtTime(0.3, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
        osc.start(t)
        osc.stop(t + 0.18)
      })
    } else {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
      osc.start()
      osc.stop(ctx.currentTime + 0.45)
    }
  } catch {
    // AudioContext pode estar bloqueado pelo browser
  }
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const quizList = queryClient.getQueryData<QuizListResponse>(['quizzes'])
  const quiz = quizList?.items.find((q) => q.id === quizId)
  const isImediato = quiz?.feedback_mode === 'imediato'

  const { data: questions, isLoading, isError } = useQuizQuestions(quizId!)
  const submitQuiz = useSubmitQuiz()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [respondentName, setRespondentName] = useState('')
  const [revealingAnswer, setRevealingAnswer] = useState(false)

  const currentQuestion = questions?.[currentQuestionIndex] as Question | undefined

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return
    if (isImediato && revealingAnswer) return

    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id)
    newAnswers.push({ questionId: currentQuestion.id, selectedOption: optionIndex })
    setAnswers(newAnswers)

    if (isImediato) {
      const isCorrect = currentQuestion.options[optionIndex]?.is_correct === true
      playSound(isCorrect ? 'correct' : 'wrong')
      setRevealingAnswer(true)
      setTimeout(() => {
        setRevealingAnswer(false)
        if (questions && currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((i) => i + 1)
        }
      }, 1200)
    }
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
    if (!respondentName.trim()) {
      alert('Por favor, informe seu nome antes de enviar.')
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

      navigate(`/quiz/${quizId}/results`, {
        state: {
          result: apiResult ?? localResult,
          respondentName: respondentName.trim(),
        },
      })
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
  const allAnswered = answers.length === questions.length

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
                const isCorrectOption = option.is_correct === true
                const isSelectedWrong = selected && !isCorrectOption

                if (isImediato && revealingAnswer) {
                  return (
                    <button
                      key={option.id ?? index}
                      disabled
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium flex items-center gap-3 transition-all',
                        isCorrectOption
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : isSelectedWrong
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-input opacity-40'
                      )}
                    >
                      {isCorrectOption ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : isSelectedWrong ? (
                        <X className="w-4 h-4 shrink-0" />
                      ) : null}
                      <span>{option.text}</span>
                    </button>
                  )
                }

                return (
                  <button
                    key={option.id ?? index}
                    onClick={() => handleSelectOption(index)}
                    disabled={isImediato && !!currentAnswer}
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

        {/* Modo imediato: nome + submit após última resposta revelada */}
        {isImediato && allAnswered && !revealingAnswer && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Seu nome <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Como devemos te chamar?"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                maxLength={200}
              />
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                'Finalizar Quiz'
              )}
            </Button>
          </div>
        )}

        {/* Modo final: navegação normal */}
        {!isImediato && (
          <>
            {allAnswered && (
              <div className="mb-4 space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Seu nome <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Como devemos te chamar?"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  maxLength={200}
                />
              </div>
            )}
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
          </>
        )}
      </div>
    </div>
  )
}
