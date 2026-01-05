import React, { useState } from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/HeroSection';
import RecentQuizzes from '../components/RecentQuizzes';
import AllQuizzes from '../components/AllQuizzes';
import { useNavigate } from 'react-router-dom'
import { useQuizzes } from '../hooks/useApi'

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const { data: quizzes, isLoading, isError } = useQuizzes();


  const handleCreateQuiz = () => {
    navigate('/create');
  };

  const handleStartQuiz = (quizId: number | string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
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
    </Box>
  );
};

export default HomePage;
