import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { QuizResult } from '@/types'
import { useSubmitResult, useQuizResults } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, XCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result as QuizResult | undefined
  const respondentName = location.state?.respondentName as string
  const submitResult = useSubmitResult()
  const submitted = useRef(false)

  useEffect(() => {
    if (!result || submitted.current) return
    submitted.current = true
    submitResult.mutate({
      quiz_id: result.quizId,
      respondent_name: respondentName,
      score: Math.round(result.score),
      total_questions: result.totalQuestions,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const myResultId = submitResult.data?.id
  const { data: communityData } = useQuizResults(
    result?.quizId ?? '',
    submitResult.isSuccess,
  )

  const otherResults = (communityData?.items.filter((r) => r.id !== myResultId) ?? [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
  const avgScore =
    otherResults.length > 0
      ? otherResults.reduce((sum, r) => sum + r.score, 0) / otherResults.length
      : null

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Nenhum resultado encontrado.</p>
          <Button onClick={() => navigate('/')}>Voltar para Quizzes</Button>
        </div>
      </div>
    )
  }

  const percentage = (result.correctAnswers / result.totalQuestions) * 100
  const scoreColor = percentage >= 70 ? 'text-emerald-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = percentage >= 70 ? 'bg-emerald-50' : percentage >= 40 ? 'bg-yellow-50' : 'bg-red-50'

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-2xl px-4 py-10 space-y-6">
        {/* Score card */}
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">Quiz Concluído!</h1>

            <div className={cn('inline-flex flex-col items-center rounded-full w-32 h-32 justify-center', scoreBg)}>
              <span className={cn('text-4xl font-bold', scoreColor)}>{percentage.toFixed(0)}%</span>
            </div>

            <p className="text-muted-foreground">
              Você acertou <strong className="text-foreground">{result.correctAnswers}</strong> de{' '}
              <strong className="text-foreground">{result.totalQuestions}</strong> questões
            </p>

            <Button onClick={() => navigate('/')}>Fazer Outro Quiz</Button>
          </CardContent>
        </Card>

        {/* Community results */}
        {otherResults.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Como a galera está indo</h2>
                <span className="ml-auto text-sm text-muted-foreground">{otherResults.length} resposta{otherResults.length !== 1 ? 's' : ''}</span>
              </div>

              {avgScore !== null && (
                <div className="mb-4 p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Média geral</span>
                  <span className={cn(
                    'font-bold text-lg',
                    avgScore >= 70 ? 'text-emerald-600' : avgScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {avgScore.toFixed(0)}%
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {otherResults
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((r, index) => (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5 text-right">{index + 1}.</span>
                      <span className="flex-1 text-sm truncate">{r.respondent_name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              r.score >= 70 ? 'bg-emerald-500' : r.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            )}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                        <span className={cn(
                          'text-sm font-semibold w-10 text-right',
                          r.score >= 70 ? 'text-emerald-600' : r.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                        )}>
                          {r.score}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed results */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-lg mb-4">Resultados Detalhados</h2>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div key={answer.questionId}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 mt-0.5">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">
                        Questão {index + 1}: {answer.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sua resposta:{' '}
                        <span className={cn('font-semibold', answer.isCorrect ? 'text-emerald-600' : 'text-red-500')}>
                          Opção {answer.selectedOption + 1}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-sm text-muted-foreground">
                          Resposta correta:{' '}
                          <span className="font-semibold text-emerald-600">
                            Opção {answer.correctOption + 1}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
