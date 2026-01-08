import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Grid,
  MobileStepper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import type{ Question } from '../types';
import { useCreateQuiz } from '../hooks/useApi';

const CreateQuizPage: React.FC = () => {
   const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    {
      text: '',
      options: [
        { id: '1', text: '', order: 0, is_correct: true },
        { id: '2', text: '', order: 1, is_correct: false },
        { id: '3', text: '', order: 2, is_correct: false },
        { id: '4', text: '', order: 3, is_correct: false },
      ],
    },
  ]);
  const { mutate: createQuiz, isError } = useCreateQuiz();
  

  // Estados para o Carrossel
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = questions.length;

  // Estados para Importação JSON
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handlers do Carrossel
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handlers de Pergunta
  const addQuestion = () => {
    const newQuestion: Partial<Question> = {
      text: '',
      options: [
        { id: Math.random().toString(), text: '', order: 0, is_correct: true },
        { id: Math.random().toString(), text: '', order: 1, is_correct: false },
        { id: Math.random().toString(), text: '', order: 2, is_correct: false },
        { id: Math.random().toString(), text: '', order: 3, is_correct: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setActiveStep(questions.length);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (activeStep >= newQuestions.length) {
      setActiveStep(newQuestions.length - 1);
    }
  };

  const updateQuestionText = (text: string) => {
    const newQuestions = [...questions];
    newQuestions[activeStep].text = text;
    setQuestions(newQuestions);
  };

  const updateOptionText = (optionIndex: number, text: string) => {
    const newQuestions = [...questions];
    if (newQuestions[activeStep].options) {
      newQuestions[activeStep].options![optionIndex].text = text;
    }
    setQuestions(newQuestions);
  };

  const setCorrectOption = (optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[activeStep].options) {
      newQuestions[activeStep].options!.forEach((opt, i) => {
        opt.is_correct = i === optionIndex;
      });
    }

    if (newQuestions[activeStep].options) {
      const correctOption = newQuestions[activeStep].options!.find(opt => opt.is_correct);
      newQuestions[activeStep].correct_answer = correctOption ? correctOption.text : '';
    }
    setQuestions(newQuestions);
  };

  // Handler de Importação JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('O JSON deve ser um array de perguntas.');
      }

      const importedQuestions: Partial<Question>[] = parsed.map((q: any) => {
        // Lógica para identificar a resposta correta se vier como string separada
        const options = q.options.map((opt: any, index: number) => {
          let isCorrect = opt.is_correct ?? false;
          
          // Se o JSON tiver "correct_answer" e bater com o texto da opção
          if (q.correct_answer && opt.text === q.correct_answer) {
            isCorrect = true;
          }
          
          return {
            id: Math.random().toString(),
            text: opt.text || '',
            order: opt.order ?? index,
            is_correct: isCorrect,
          };
        });

        // Garantir que pelo menos uma opção seja correta se nenhuma foi marcada
        if (!options.some((opt: any) => opt.is_correct) && options.length > 0) {
          options[0].is_correct = true;
        }

        return {
          text: q.text || '',
          options: options,
        };
      });

      setQuestions(importedQuestions);
      setActiveStep(0);
      setIsImportDialogOpen(false);
      setJsonInput('');
      setSuccessMessage('Perguntas importadas com sucesso!');
    } catch (err: any) {
      setError('Erro ao processar JSON: ' + err.message);
    }
  };

  const handleSaveQuiz = () => {
    if (!quizTitle) {
      setError('Por favor, insira um título para o quiz.');
      return;
    }
    // Aqui você faria a chamada para sua API
    console.log('Salvando Quiz:', {
      title: quizTitle,
      description: quizDescription,
      questions: questions,
    });
    createQuiz({
      title: quizTitle,
      description: quizDescription,
      questions: questions as Array<{
        text: string;
        correct_answer: string;
        options: Array<{ text: string; is_correct?: boolean }>;
      }>,
    });

    if (isError) {
      setError('Erro ao salvar o quiz. Tente novamente.');
      console.log("Erro ao salvar o quiz");
      return;
    }

    // Resetar o formulário após salvar
    setQuizTitle('');
    setQuizDescription('');
    setSuccessMessage('Quiz salvo com sucesso!');
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
            Criar Novo Quiz
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setIsImportDialogOpen(true)}
            >
              Importar JSON
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveQuiz}
              sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
            >
              Salvar Quiz
            </Button>
          </Box>
        </Box>

        {/* Informações Básicas */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Informações Básicas
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Quiz"
                variant="outlined"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Ex: React Fundamentals"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                variant="outlined"
                multiline
                rows={2}
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Uma breve descrição sobre o que trata este quiz..."
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Carrossel de Perguntas */}
        <Paper sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Pergunta {activeStep + 1} de {maxSteps}
            </Typography>
            <Box>
              <Tooltip title="Remover Pergunta">
                <IconButton 
                  color="error" 
                  onClick={() => removeQuestion(activeStep)}
                  disabled={questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Adicionar Nova Pergunta">
                <IconButton color="primary" onClick={addQuestion}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Conteúdo da Pergunta Ativa */}
          <Box sx={{ minHeight: 300 }}>
            <TextField
              fullWidth
              label="Texto da Pergunta"
              variant="filled"
              multiline
              rows={2}
              value={questions[activeStep]?.text || ''}
              onChange={(e) => updateQuestionText(e.target.value)}
              sx={{ mb: 4 }}
            />

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              Opções de Resposta
              <Tooltip title="Selecione a opção correta usando o botão de rádio">
                <HelpIcon fontSize="small" color="action" />
              </Tooltip>
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={questions[activeStep]?.options?.findIndex(opt => opt.is_correct).toString()}
                onChange={(e) => setCorrectOption(parseInt(e.target.value))}
              >
                <Grid container spacing={2}>
                  {questions[activeStep]?.options?.map((option, index) => (
                    <Grid item xs={12} key={option.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          value={index.toString()}
                          control={<Radio color="success" />}
                          label=""
                          sx={{ mr: 0 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label={`Opção ${index + 1}`}
                          value={option.text}
                          onChange={(e) => updateOptionText(index, e.target.value)}
                          error={option.is_correct}
                          color={option.is_correct ? "success" : "primary"}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Navegação do Carrossel */}
          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ mt: 4, bgcolor: 'transparent' }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Próxima
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Anterior
              </Button>
            }
          />
        </Paper>
      </Container>

      {/* Diálogo de Importação JSON */}
      <Dialog 
        open={isImportDialogOpen} 
        onClose={() => setIsImportDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Importar Perguntas via JSON</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Cole abaixo o array de perguntas no formato JSON. Cada objeto deve conter 'text' e um array de 'options'.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder='[ { "text": "Pergunta?", "options": [ { "text": "Opção 1", "is_correct": true }, ... ] } ]'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            sx={{ fontFamily: 'monospace' }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsImportDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleImportJson}
            disabled={!jsonInput}
          >
            Importar Agora
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificações */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateQuizPage;
