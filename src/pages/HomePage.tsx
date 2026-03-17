import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizzes } from '@/hooks/useApi'
import HeroSection from '@/components/organisms/HeroSection'
import RecentQuizzes from '@/components/organisms/RecentQuizzes'
import AllQuizzes from '@/components/organisms/AllQuizzes'

export default function HomePage() {
  const navigate = useNavigate()
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const { data: quizzes, isLoading, isError } = useQuizzes()

  const handleCreateQuiz = () => navigate('/create')
  const handleStartQuiz = (quizId: number | string) => navigate(`/quiz/${quizId}`)

  return (
    <div className="min-h-screen bg-muted/30">
      <HeroSection onCreateQuiz={handleCreateQuiz} />
      <RecentQuizzes quizzes={quizzes?.items} onStartQuiz={handleStartQuiz} />
      <AllQuizzes
        quizzes={quizzes?.items}
        isLoading={isLoading}
        isError={isError}
        onStartQuiz={handleStartQuiz}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
      />
    </div>
  )
}
