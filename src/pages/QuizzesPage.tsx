import { useNavigate } from 'react-router-dom'
import { useQuizzes } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

export default function QuizzesPage() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const { data: quizzes, isLoading, isError } = useQuizzes()

  const handleLogout = () => {
    logout()
    navigate('/quizzes')
  }

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`)
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading quizzes...</Typography>
        </Box>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <Alert severity="error">Failed to load quizzes. Please try again.</Alert>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Fast Quiz</Typography>
          <Box>
            {isAuthenticated ? (
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} color="inherit">Login</Button>
                <Button onClick={() => navigate('/register')} variant="contained" color="primary" sx={{ ml: 1 }}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Available Quizzes
          </Typography>
        </Box>

        {quizzes && quizzes.items.length === 0 ? (
          <Box textAlign="center" sx={{ py: 6 }}>
            <Typography color="text.secondary">No quizzes available at the moment.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {quizzes?.items.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
                    {quiz.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{quiz.description}</Typography>
                    )}
                    <Button fullWidth variant="contained" color="primary" onClick={() => handleStartQuiz(quiz.id)}>
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
