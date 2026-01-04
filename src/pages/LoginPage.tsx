import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const loginMutation = useLogin()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await loginMutation.mutateAsync({ email, password })
      setAuth(response.token)
      navigate('/quizzes')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h4" align="center">Fast Quiz</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>Sign in to your account</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              sx={{ mb: 2 }}
            />

            {loginMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Login failed. {loginMutation.error instanceof Error ? loginMutation.error.message : 'Please check your credentials.'}
              </Alert>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={(loginMutation as any).isPending}>
              {(loginMutation as any).isPending ? 'Signing in...' : 'Sign in'}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register">Create one</Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Link component={RouterLink} to="/quizzes">Continue as guest</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
