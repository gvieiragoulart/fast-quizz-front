# Fast Quiz - Project Map

## Tech Stack

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 7 |
| Estilizacao | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Estado Servidor | TanStack React Query |
| Estado Auth | React Context API |
| HTTP Client | Axios |
| Roteamento | React Router v7 |
| Testes | Vitest + React Testing Library + MSW |
| Lint | ESLint + typescript-eslint |
| Icones | Lucide React |

---

## Estrutura de Diretórios

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Router + Providers
├── index.css                         # Tailwind + CSS variables
│
├── components/
│   ├── ProtectedRoute.tsx            # Auth guard
│   ├── ui/                           # Atoms (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── textarea.tsx
│   ├── molecules/
│   │   ├── FormField.tsx             # Input + label + erro
│   │   └── QuizCard.tsx              # Card de preview do quiz
│   ├── organisms/
│   │   ├── Navbar.tsx                # Header com nav e auth
│   │   ├── HeroSection.tsx           # Banner hero
│   │   ├── RecentQuizzes.tsx         # Quizzes recentes (grid 4 cols)
│   │   └── AllQuizzes.tsx            # Todos os quizzes + filtros
│   └── templates/
│       └── MainLayout.tsx            # Layout com Navbar + Outlet
│
├── pages/
│   ├── HomePage.tsx                  # Landing page
│   ├── LoginPage.tsx                 # Login
│   ├── RegisterPage.tsx              # Cadastro
│   ├── QuizzesPage.tsx               # Listagem de quizzes
│   ├── QuizPage.tsx                  # Responder quiz
│   ├── ResultsPage.tsx               # Resultados + ranking
│   └── CreateQuizPage.tsx            # Criar quiz (protegido)
│
├── hooks/
│   ├── useAuth.ts                    # Consumer do AuthContext
│   ├── useAuthHook.ts                # Mutations de login/register
│   ├── useApi.ts                     # Queries e mutations (React Query)
│   └── context/
│       └── AuthContext.tsx            # Provider de autenticacao
│
├── services/
│   ├── api.ts                        # Axios instance + interceptors
│   ├── auth.ts                       # Login, register, logout, token
│   └── quiz.ts                       # CRUD de quizzes, questions, results
│
├── types/
│   ├── index.ts                      # Re-exports
│   ├── user.ts                       # User, LoginRequest/Response, RegisterRequest/Response
│   ├── quiz.ts                       # Quiz, QuizRequestCreate, QuizFeedbackMode
│   ├── question.ts                   # Question, QuestionOption, Answer
│   └── result.ts                     # QuizResult, ResultSubmit, ResultResponse
│
├── lib/
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│
└── mocks/
    ├── browser.ts                    # MSW worker setup
    └── handlers.ts                   # Mock API handlers
```

---

## Rotas

| Rota | Pagina | Auth |
|------|--------|------|
| `/` | HomePage | Publica |
| `/login` | LoginPage | Publica |
| `/register` | RegisterPage | Publica |
| `/quiz/:quizId` | QuizPage | Publica |
| `/quiz/:quizId/results` | ResultsPage | Publica |
| `/create` | CreateQuizPage | Protegida |

---

## API Endpoints Consumidos

### Auth
| Metodo | Endpoint | Servico |
|--------|----------|---------|
| POST | `/api/auth/login` | `auth.login()` |
| POST | `/api/auth/register` | `auth.register()` |

### Quizzes
| Metodo | Endpoint | Servico |
|--------|----------|---------|
| GET | `/api/quizzes/latest` | `quiz.getQuizzes()` |
| POST | `/api/quizzes` | `quiz.createQuiz()` |
| POST | `/api/quizzes/:id/submit` | `quiz.submitQuiz()` |

### Questions
| Metodo | Endpoint | Servico |
|--------|----------|---------|
| GET | `/api/questions/quiz?quiz_id=:id` | `quiz.getQuizQuestions()` |
| POST | `/api/questions/answers` | `quiz.submitQuiz()` (fallback) |

### Results
| Metodo | Endpoint | Servico |
|--------|----------|---------|
| POST | `/api/results/` | `quiz.submitResult()` |
| GET | `/api/results/quiz/:id` | `quiz.getResultsByQuiz()` |

---

## Hooks (React Query)

| Hook | Tipo | Descricao |
|------|------|-----------|
| `useQuizzes()` | Query | Lista quizzes |
| `useQuizQuestions(quizId)` | Query | Questoes de um quiz |
| `useQuizResults(quizId, enabled)` | Query | Resultados da comunidade |
| `useLogin()` | Mutation | Login |
| `useRegister()` | Mutation | Cadastro |
| `useSubmitQuiz()` | Mutation | Enviar respostas |
| `useCreateQuiz()` | Mutation | Criar quiz |
| `useSubmitResult()` | Mutation | Salvar resultado |

---

## Types Principais

```typescript
// user.ts
User { id, email, name? }
LoginRequest { email, password }
RegisterRequest { email, password, name?, username }

// quiz.ts
Quiz { id, title, description, estimated_time?, feedback_mode?, questions? }
QuizFeedbackMode = 'final' | 'imediato'
QuizRequestCreate { title, description, estimated_time?, feedback_mode?, questions }

// question.ts
Question { id, text, quiz_id, options, correct_answer }
QuestionOption { id, reference_id, text, order, is_correct? }
Answer { questionId, selectedOption }

// result.ts
ResultSubmit { quiz_id, respondent_name, score, total_questions, user_id? }
ResultResponse { id, quiz_id, respondent_name, score, total_questions, taken_at }
```

---

## Fluxos Principais

### Autenticacao
1. Login/Register -> POST API -> recebe `access_token`
2. Token salvo no `localStorage`
3. Axios interceptor injeta `Authorization: Bearer {token}` em todas as requests
4. `AuthContext` expoe `isAuthenticated` para a app

### Responder Quiz
1. Seleciona quiz na HomePage -> `/quiz/:quizId`
2. Carrega questoes via `useQuizQuestions`
3. Responde questoes (feedback imediato ou no final, conforme `feedback_mode`)
4. Submete -> calcula score -> navega para `/quiz/:quizId/results`
5. Exibe score pessoal + ranking da comunidade

### Criar Quiz
1. Rota protegida `/create` (requer auth)
2. Preenche titulo, descricao, duracao, modo de feedback
3. Adiciona questoes com 4 opcoes cada (marca a correta)
4. Opcao de importar questoes via JSON
5. POST `/api/quizzes` -> redireciona para home

---

## Variaveis de Ambiente

| Variavel | Descricao |
|----------|-----------|
| `VITE_API_BASE_URL` | URL da API em producao |
| `VITE_API_DEV_BASE_URL` | URL da API em desenvolvimento |
| `VITE_ENVIRONMENT` | `development` ou `production` |
| `VITE_MOCK` | `development` para ativar MSW |

---

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Dev server (porta 3000) |
| `npm run build` | TypeScript check + build Vite |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch) |
| `npm run test:run` | Vitest (CI) |
| `npm run test:ui` | Vitest UI |
