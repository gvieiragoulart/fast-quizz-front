import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const registerMutation = useRegister()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await registerMutation.mutateAsync({
        email,
        password,
        name: name.trim() || undefined,
      })
      setAuth(response.token)
      navigate('/')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h4" align="center">Fast Quiz</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>Create your account</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Name (optional)"
              id="name"
              name="name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              sx={{ mb: 2 }}
            />

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
              autoComplete="new-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              sx={{ mb: 2 }}
            />

            {registerMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Registration failed. {registerMutation.error instanceof Error ? registerMutation.error.message : 'Please try again.'}
              </Alert>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={(registerMutation as any).isPending}>
              {(registerMutation as any).isPending ? 'Creating account...' : 'Create account'}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">Sign in</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
