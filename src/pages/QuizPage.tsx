import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizQuestions, useSubmitQuiz } from '../hooks/useApi'
import type { Answer } from '../types'
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

  const currentQuestion = questions?.[currentQuestionIndex]

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return

    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id)
    newAnswers.push({
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
    })
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
      const result = await submitQuiz.mutateAsync({ quizId, answers })
      navigate(`/quiz/${quizId}/results`, { state: { result } })
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
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/quizzes')}>
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
              {currentQuestion?.options.map((option, index) => {
                const selected = currentAnswer?.selectedOption === index
                return (
                  <Grid item xs={12} key={index}>
                    <Button
                      onClick={() => handleSelectOption(index)}
                      fullWidth
                      variant={selected ? 'contained' : 'outlined'}
                      color={selected ? 'primary' : 'inherit'}
                      sx={{ justifyContent: 'flex-start', py: 2, textTransform: 'none' }}
                      startIcon={selected ? <CheckIcon /> : undefined}
                    >
                      <Box sx={{ textAlign: 'left' }}>{option}</Box>
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
