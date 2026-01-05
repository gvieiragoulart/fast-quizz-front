import { useLocation, useNavigate } from 'react-router-dom'
import type { QuizResult } from '../types'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result as QuizResult | undefined

  if (!result) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <Typography color="error">No results found.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/')}>
            Back to Quizzes
          </Button>
        </Box>
      </Box>
    )
  }

  const percentage = (result.correctAnswers / result.totalQuestions) * 100

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Quiz Complete!</Typography>

            <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Avatar sx={{ width: 128, height: 128, bgcolor: 'primary.light', mb: 2 }}>
                <Typography variant="h3" sx={{ color: 'primary.main' }}>{percentage.toFixed(0)}%</Typography>
              </Avatar>

              <Typography variant="h6" sx={{ mt: 1 }}>You scored <strong>{result.correctAnswers}</strong> out of <strong>{result.totalQuestions}</strong></Typography>
            </Box>

            <Button variant="contained" color="primary" onClick={() => navigate('/')}>Take Another Quiz</Button>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Detailed Results</Typography>
          <Stack spacing={2} divider={<Divider /> }>
            {result.answers.map((answer, index) => (
              <Box key={answer.questionId} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flexShrink: 0, mt: 0.5 }}>
                  {answer.isCorrect ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Question {index + 1}: {answer.question}</Typography>
                  <Typography variant="body2">Your answer: <Box component="span" sx={{ fontWeight: 600, color: answer.isCorrect ? 'success.main' : 'error.main' }}>Option {answer.selectedOption + 1}</Box></Typography>
                  {!answer.isCorrect && (
                    <Typography variant="body2" sx={{ mt: 1 }}>Correct answer: <Box component="span" sx={{ fontWeight: 600, color: 'success.main' }}>Option {answer.correctOption + 1}</Box></Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
