import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { LibraryBooks as LibraryIcon } from '@mui/icons-material';
import QuizCard from './QuizCard';
import type { Quiz } from '../types';

interface AllQuizzesProps {
  quizzes: Quiz[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onStartQuiz: (id: number | string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterDifficulty: string;
  setFilterDifficulty: (difficulty: string) => void;
}

const AllQuizzes: React.FC<AllQuizzesProps> = ({
  quizzes,
  isLoading,
  isError,
  onStartQuiz,
  filterCategory,
  setFilterCategory,
  filterDifficulty,
  setFilterDifficulty,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loading quizzes...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="error">Failed to load quizzes. Please try again.</Typography>
      </Box>
    );
  }

  if (!quizzes) {
    return null;
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    return true;
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setFilterDifficulty(event.target.value);
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LibraryIcon sx={{ color: '#2563eb', fontSize: 32 }} />
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            Todos os Quizzes
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filterCategory}
                  label="Categoria"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="programming">Programação</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="business">Negócios</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Dificuldade</InputLabel>
                <Select
                  value={filterDifficulty}
                  label="Dificuldade"
                  onChange={handleDifficultyChange}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="easy">Fácil</MenuItem>
                  <MenuItem value="medium">Médio</MenuItem>
                  <MenuItem value="hard">Difícil</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select defaultValue="recent" label="Ordenar por">
                  <MenuItem value="recent">Mais Recentes</MenuItem>
                  <MenuItem value="popular">Mais Populares</MenuItem>
                  <MenuItem value="difficulty">Dificuldade</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                {filteredQuizzes.length} quizzes encontrados
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {filteredQuizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <QuizCard quiz={quiz} onStartQuiz={onStartQuiz} />
            </Grid>
          ))}
        </Grid>

        {filteredQuizzes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum quiz encontrado com os filtros selecionados
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AllQuizzes;
