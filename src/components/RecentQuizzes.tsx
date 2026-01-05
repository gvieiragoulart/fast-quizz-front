import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import {
  Whatshot as FireIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import QuizCard from './QuizCard';
import type { Quiz } from '../types';

interface RecentQuizzesProps {
  quizzes: Quiz[] | undefined;
  onStartQuiz: (id: number | string) => void;
}

const RecentQuizzes: React.FC<RecentQuizzesProps> = ({ quizzes, onStartQuiz }) => {
  if (!quizzes || quizzes.length === 0) {
    return null;
  }
  return (
    <Box sx={{ py: 6, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FireIcon sx={{ color: '#f97316', fontSize: 32 }} />
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              Últimos Quizzes
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowIcon />}
            sx={{ color: '#2563eb', fontWeight: 'bold' }}
          >
            Ver Todos
          </Button>
        </Box>

        <Grid container spacing={3}>
          {quizzes.slice(0, 4).map((quiz) => (
            <Grid item xs={12} sm={6} md={3} key={quiz.id}>
              <QuizCard quiz={quiz} onStartQuiz={onStartQuiz} showNewBadge />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentQuizzes;
