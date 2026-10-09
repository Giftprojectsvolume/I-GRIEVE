import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
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
import FamilyGroups from './pages/FamilyGroups'
import FamilyGroupDetail from './pages/FamilyGroupDetail'
import SupportCommunities from './pages/SupportCommunities'
import SupportCommunityDetail from './pages/SupportCommunityDetail'

function ProtectedRoute({ children }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/" replace />
  return children
}

function PremiumRoute({ children }) {
  const { session } = useAuth()
  const [isPremium, setIsPremium] = useState(null)

  useEffect(() => {
    async function check() {
      if (!session) return
      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .single()
      setIsPremium(data?.is_premium || false)
    }
    check()
  }, [session])

  if (!session) return <Navigate to="/" replace />
  if (isPremium === null) return null
  if (!isPremium) return <Navigate to="/premium" replace />
  return children
}

function AppRoutes() {
  const { session } = useAuth()

  useEffect(() => {
    async function createProfile() {
      if (!session) return
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()
      if (!data) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          is_premium: false
        })
      }
    }
    createProfile()
  }, [session])

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={session ? <Navigate to="/home" replace /> : <Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/letter" element={<ProtectedRoute><WriteLetter /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioRecord /></ProtectedRoute>} />
        <Route path="/memory" element={<ProtectedRoute><SaveMemory /></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="/story/:id" element={<ProtectedRoute><Story /></ProtectedRoute>} />
        <Route path="/community" element={<PremiumRoute><Community /></PremiumRoute>} />
        <Route path="/family" element={<PremiumRoute><FamilyGroups /></PremiumRoute>} />
        <Route path="/family/:id" element={<PremiumRoute><FamilyGroupDetail /></PremiumRoute>} />
        <Route path="/support" element={<PremiumRoute><SupportCommunities /></PremiumRoute>} />
        <Route path="/support/:id" element={<PremiumRoute><SupportCommunityDetail /></PremiumRoute>} />
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
