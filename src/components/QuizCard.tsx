import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import type { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (id: number | string) => void;
  showNewBadge?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz, showNewBadge = false }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      {showNewBadge && (
        <Chip
          label="NOVO"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: '#f97316',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        />
      )}

      <CardMedia
        component="img"
        height="160"
        alt={quiz.title}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {quiz.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 40 }}
        >
          {quiz.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <QuizIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {quiz.questions} questões
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              2 min
            </Typography>
          </Box>
        </Box>

        <Chip
          size="small"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
          }}
        />
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onStartQuiz(quiz.id)}
          sx={{
            bgcolor: '#2563eb',
            '&:hover': {
              bgcolor: '#1d4ed8',
            },
          }}
        >
          Start Quiz
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
