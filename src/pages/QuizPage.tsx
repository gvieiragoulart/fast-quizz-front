import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizQuestions, useSubmitQuiz } from '../hooks/useApi'
import type { Answer, Question, QuestionOption, QuizResult } from '../types'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check'

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
    newAnswers.push({
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
    })

    if (currentQuestion.options[optionIndex]?.is_correct) {
      console.log('Selected correct option:', currentQuestion.options[optionIndex])
    }
    
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quizId || !questions) return

    if (answers.length !== questions.length) {
      alert('Please answer all questions before submitting.')
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

      // Attempt to submit to API; if API returns a result use it, otherwise fallback to localResult
      let apiResult: QuizResult | undefined
      try {
        const response = await submitQuiz.mutateAsync({ quizId, answers })
        if (response && typeof response === 'object' && ('correctAnswers' in response || 'score' in response)) {
          apiResult = response as QuizResult
        }
      } catch (err) {
        console.error('Submit API failed, will use local result:', err)
      }

      navigate(`/quiz/${quizId}/results`, { state: { result: apiResult ?? localResult } })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    }
  }

  const getCurrentAnswer = () => {
    if (!currentQuestion) return undefined
    return answers.find((a) => a.questionId === currentQuestion.id)
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading quiz...</Typography>
        </Box>
      </Box>
    )
  }

  if (isError || !questions || questions.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <Alert severity="error">Failed to load quiz. Please try again.</Alert>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/')}>
            Back to Quizzes
          </Button>
        </Box>
      </Box>
    )
  }

  const currentAnswer = getCurrentAnswer()
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isSubmitting = (submitQuiz as any).isPending || (submitQuiz as any).isLoading || false

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Question {currentQuestionIndex + 1} of {questions.length}</Typography>
            <Typography variant="body2">{answers.length} answered</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 2 }} />
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{currentQuestion?.text}</Typography>

            <Grid container spacing={2}>
              {currentQuestion?.options.map((option: QuestionOption, index: number) => {
                const selected = currentAnswer?.selectedOption === index
                return (
                  <Grid item xs={12} key={option.id ?? index}>
                    <Button
                      onClick={() => handleSelectOption(index)}
                      fullWidth
                      variant={selected ? 'contained' : 'outlined'}
                      color={selected ? 'primary' : 'inherit'}
                      sx={{ justifyContent: 'flex-start', py: 2, textTransform: 'none' }}
                      startIcon={selected ? <CheckIcon /> : undefined}
                    >
                      <Box sx={{ textAlign: 'left' }}>{option.text}</Box>
                    </Button>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  )
}
