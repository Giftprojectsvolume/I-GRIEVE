import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const { session } = useAuth()
  const [memorial, setMemorial] = useState(null)
  const [entries, setEntries] = useState([])
  const [dayCount, setDayCount] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: mem } = await supabase
        .from('memorials')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (mem) {
        setMemorial(mem)
        const start = new Date(mem.started_at)
        const today = new Date()
        const days = Math.floor((today - start) / (1000 * 60 * 60 * 24))
        setDayCount(days)
      }

      const { data: recent } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (recent) setEntries(recent)
    }
    load()
  }, [session])

  const displayName = session?.user?.user_metadata?.display_name || 'Friend'

  const actions = [
    { path: '/letter', icon: '✍️', label: 'Write a Letter', sub: 'To someone you miss', bg: 'rgba(255,140,66,0.15)' },
    { path: '/audio', icon: '🎙️', label: 'Record Audio', sub: 'Speak what you feel', bg: 'rgba(139,92,246,0.15)' },
    { path: '/journal', icon: '📔', label: 'Journal Entry', sub: 'Write about today', bg: 'rgba(34,197,94,0.12)' },
    { path: '/memory', icon: '🖼️', label: 'Save a Memory', sub: 'A moment to keep', bg: 'rgba(59,130,246,0.12)' },
  ]

  function typeColor(type) {
    if (type === 'letter') return 'var(--orange)'
    if (type === 'journal') return 'var(--success)'
    if (type === 'audio') return '#C4B5FD'
    return 'var(--blue)'
  }

  function typeIcon(type) {
    if (type === 'letter') return '✍️'
    if (type === 'journal') return '📔'
    if (type === 'audio') return '🎙️'
    return '🖼️'
  }

  return (
    <>
      <div className="page">

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 600, marginBottom: 4 }}>
            🌅 Good morning
          </div>
          <h1>Welcome back, {displayName}</h1>
        </div>

        {memorial && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(255,140,66,0.12),rgba(255,140,66,0.04))',
            border: '1px solid rgba(255,140,66,0.2)',
            borderRadius: 18, padding: 20,
            display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 24
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0
            }}>🕊️</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>
                {memorial.person_name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                {memorial.relationship} · In your heart always
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 900, color: 'var(--orange)' }}>
                {dayCount}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>days on<br />your journey</div>
            </div>
          </div>
        )}

        <div className="sec-label">What do you need today?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {actions.map(a => (
            <Link key={a.path} to={a.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--navy2)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '18px 16px', cursor: 'pointer'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: a.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, marginBottom: 8
                }}>{a.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sec-label">Recent Entries</div>
        {entries.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>No entries yet. Start writing your first letter.</p>
          </div>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: typeColor(entry.type), textTransform: 'uppercase' }}>
                {typeIcon(entry.type)} {entry.type}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {new Date(entry.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
              {entry.content?.slice(0, 100)}...
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>🔒 Private</div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  )
    }
