# ⚡ Fast Quiz

Plataforma moderna para **criar, compartilhar e responder quizzes** de forma rápida e intuitiva. Construída com React, TypeScript e shadcn/ui seguindo Atomic Design.

## Screenshots

### Página Inicial
![Página Inicial](docs/screenshots/home.png)

### Criar Quiz
![Criar Quiz](docs/screenshots/create-quiz.png)

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + TypeScript |
| Estilização | Tailwind CSS v4 + shadcn/ui |
| Build | Vite 7 |
| Roteamento | React Router v7 |
| Data fetching | TanStack Query (React Query) |
| HTTP | Axios |
| Testes | Vitest + Testing Library |
| Deploy | AWS S3 (via GitHub Actions) |

## Funcionalidades

- **Autenticação JWT** — login seguro com token armazenado no localStorage
- **Explorar Quizzes** — navegue pelos quizzes disponíveis na plataforma
- **Criar Quiz** — crie quizzes personalizados com múltipla escolha e importação via JSON
- **Meus Quizzes** — gerencie os quizzes que você criou
- **Responder Quiz** — interface intuitiva com navegação por questões e progresso em tempo real
- **Resultados** — veja sua pontuação, ranking e resultados da comunidade
- **Design Responsivo** — funciona em desktop e mobile

## Estrutura do Projeto (Atomic Design)

```
src/
├── components/
│   ├── ui/              # Atoms — componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── molecules/       # Compostos de atoms
│   │   ├── FormField.tsx
│   │   └── QuizCard.tsx
│   ├── organisms/       # Seções complexas
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AllQuizzes.tsx
│   │   └── RecentQuizzes.tsx
│   └── templates/       # Layouts de página
│       └── MainLayout.tsx
├── pages/               # Rotas
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CreateQuizPage.tsx
│   ├── QuizzesPage.tsx
│   ├── QuizPage.tsx
│   └── ResultsPage.tsx
├── hooks/               # Custom hooks
├── services/            # Camada de API
├── types/               # Tipos TypeScript
└── lib/
    └── utils.ts         # cn() helper
```

## Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Instalação

```bash
git clone https://github.com/gvieiragoulart/fast-quizz-front.git
cd fast-quizz-front
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Defina a URL da API:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento (http://localhost:5173)
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Linting
npm test          # Testes em modo watch
npm run test:run  # Testes (CI)
```

## API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Cadastro |

### Quizzes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/quizzes` | Listar quizzes |
| POST | `/api/quizzes` | Criar quiz |
| GET | `/api/quizzes/:id` | Detalhes do quiz |
| POST | `/api/quizzes/:id/submit` | Submeter respostas |

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL base da API | `http://localhost:3000` |

## Deploy

O projeto faz deploy automático para **AWS S3** via GitHub Actions a cada push na branch `main`.

## Contribuindo

1. Fork o repositório
2. Crie sua branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## Licença

MIT
