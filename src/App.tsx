import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import QuizzesPage from './pages/QuizzesPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import MainLayout from './components/MainLayout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/quiz/:quizId/results" element={<ResultsPage />} />
              <Route path="/" element={<Navigate to="/quizzes" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
