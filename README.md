# Fast Quiz Front

A React + TypeScript quiz application built with Vite, featuring JWT authentication, quiz management, and real-time quiz taking capabilities.

## Features

- **JWT Authentication**: Secure login using JWT tokens
- **Quiz Management**: Browse available quizzes
- **Interactive Quiz Taking**: Answer questions with a clean, intuitive UI
- **Real-time Progress Tracking**: See your progress as you take quizzes
- **Results Display**: View detailed results with correct/incorrect answers
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing

## Prerequisites

- Node.js 18+ and npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gvieiragoulart/fast-quizz-front.git
cd fast-quizz-front
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test
```

Run tests once (CI mode):
```bash
npm run test:run
```

## Project Structure

```
src/
├── components/       # Reusable React components
│   └── ProtectedRoute.tsx
├── hooks/           # Custom React hooks
│   ├── useApi.ts
│   └── useAuth.tsx
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── QuizzesPage.tsx
│   ├── QuizPage.tsx
│   └── ResultsPage.tsx
├── services/        # API service layer
│   ├── api.ts
│   ├── auth.ts
│   └── quiz.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
├── App.tsx          # Main app component
├── main.tsx         # App entry point
└── index.css        # Global styles
```

## API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - Login with email and password
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, email, name } }`

### Quizzes
- `GET /api/quizzes` - List all available quizzes
  - Response: `Quiz[]`

### Questions
- `GET /api/questions?quiz_id={id}` - Get questions for a quiz
  - Alternative: `GET /api/quizzes/{id}?include_questions=true`
  - Response: `Question[]`

### Submit Quiz
- `POST /api/quizzes/{id}/submit` - Submit quiz answers
  - Alternative: `POST /api/questions/answers`
  - Request: `{ answers: Array<{ questionId: string, selectedOption: number }> }`
  - Response: `QuizResult`

## Features in Detail

### Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic token injection in API requests
- Protected routes for authenticated users only

### Quiz List
- Displays all available quizzes
- Shows quiz title, description, and question count
- Click to start any quiz

### Quiz Taking
- Question-by-question navigation
- Visual progress indicator
- Answer selection with instant feedback
- Review and change answers before submission
- Prevents submission if not all questions answered

### Results
- Overall score and percentage
- Detailed breakdown of each question
- Shows correct and incorrect answers
- Option to take another quiz

## Code Quality

### Linting
```bash
npm run lint
```

### TypeScript
The project uses strict TypeScript configuration for type safety.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
