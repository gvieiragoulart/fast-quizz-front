import { Outlet, useNavigate } from 'react-router-dom'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'

export default function MainLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    flexGrow: 0,
                    fontWeight: 'bold',
                    color: '#2563eb',
                    mr: 4,
                }}
            >
            <Button onClick={() => navigate('/')}>Fast Quiz</Button>
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                <Button color="inherit">Explorar</Button>
                <Button color="inherit">Meus Quizzes</Button>
            </Box>
          <Box>
            {isAuthenticated ? (
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} color="inherit">Login</Button>
                <Button onClick={() => navigate('/register')} variant="contained" color="primary" sx={{ ml: 1 }}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  )
}
