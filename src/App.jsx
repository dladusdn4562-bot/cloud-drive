import { Navigate, Route, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import DrivePage from './pages/DrivePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import useAuth from './hooks/useAuth.js'

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress aria-label="불러오는 중" />
      </Box>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <DrivePage user={user} onSignOut={signOut} /> : <AuthPage onSignIn={signIn} onSignUp={signUp} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
