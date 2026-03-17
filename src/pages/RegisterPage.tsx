import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister, useLogin } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/molecules/FormField'
import { AlertCircle, Zap } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const loginMutation = useLogin()
  const { login: setAuth } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await registerMutation.mutateAsync({
        email,
        password,
        name: name.trim() || undefined,
        username,
      })
      const response = await loginMutation.mutateAsync({ email, password })
      setAuth(response.access_token)
      navigate('/')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Fast Quiz</CardTitle>
          <CardDescription>Crie sua conta</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="name"
              label="Nome (opcional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />

            <FormField
              id="username"
              label="Usuário"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu_usuario"
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <FormField
              id="password"
              label="Senha"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {registerMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerMutation.error instanceof Error
                    ? registerMutation.error.message
                    : 'Tente novamente.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={(registerMutation as any).isPending}
            >
              {(registerMutation as any).isPending ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
