import { Navigate, Route, Routes } from 'react-router-dom'
import DrivePage from './pages/DrivePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DrivePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
