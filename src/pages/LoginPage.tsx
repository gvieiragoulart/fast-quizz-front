import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/molecules/FormField'
import { AlertCircle, Zap } from 'lucide-react'

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
      setAuth(response.access_token)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
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
          <CardDescription>Entre na sua conta</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {loginMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : 'Verifique suas credenciais.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={(loginMutation as any).isPending}
            >
              {(loginMutation as any).isPending ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Crie uma
              </Link>
            </p>
          </form>

          <div className="mt-4 pt-4 border-t text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Continuar como visitante
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
