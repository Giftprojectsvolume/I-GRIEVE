import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import WriteLetter from './pages/WriteLetter'
import Journal from './pages/Journal'
import AudioRecord from './pages/AudioRecord'
import SaveMemory from './pages/SaveMemory'
import Journey from './pages/Journey'
import Profile from './pages/Profile'
import Safety from './pages/Safety'
import Community from './pages/Community'
import Story from './pages/Story'
import Settings from './pages/Settings'
import Premium from './pages/Premium'

function ProtectedRoute({ children }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { session } = useAuth()

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={session ? <Navigate to="/home" replace /> : <Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/letter" element={<ProtectedRoute><WriteLetter /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioRecord /></ProtectedRoute>} />
        <Route path="/memory" element={<ProtectedRoute><SaveMemory /></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/story/:id" element={<ProtectedRoute><Story /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
