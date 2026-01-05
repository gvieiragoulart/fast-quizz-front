import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Rocket as RocketIcon } from '@mui/icons-material';

interface HeroSectionProps {
  onCreateQuiz: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCreateQuiz }) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        py: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
            }}
          >
            Crie e Compartilhe Quizzes Incríveis!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Teste seus conhecimentos ou desafie seus amigos com quizzes
            personalizados
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<RocketIcon />}
            onClick={onCreateQuiz}
            sx={{
              bgcolor: '#10b981',
              color: 'white',
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                bgcolor: '#059669',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Criar Meu Quiz Agora
          </Button>

          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  500+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Quizzes Criados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  10k+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Respostas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  1k+
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Usuários Ativos
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default HeroSection;
