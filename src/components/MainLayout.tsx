import { Outlet, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useAuth } from '../hooks/useAuth'

export default function MainLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/quizzes')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Fast Quiz</Typography>
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
