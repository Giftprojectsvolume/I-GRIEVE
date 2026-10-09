import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const FILTERS = ['All', 'letter', 'journal', 'audio', 'memory']

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

export default function Journey() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState('All')
  const [memorial, setMemorial] = useState(null)
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
        const days = Math.floor((new Date() - new Date(mem.started_at)) / (1000 * 60 * 60 * 24))
        setDayCount(days)
      }

      const { data } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setEntries(data)
    }
    load()
  }, [session])

  const filtered = filter === 'All' ? entries : entries.filter(e => e.type === filter)

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
          <span className="topbar-title">My Journey</span>
          <span />
        </div>

        {memorial && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(255,140,66,0.1),rgba(255,140,66,0.03))',
            borderBottom: '1px solid rgba(255,140,66,0.1)',
            padding: '16px 20px', flexShrink: 0
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>🕊️</div>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>
                    {memorial.person_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{memorial.relationship}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, color: 'var(--orange)' }}>{dayCount}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>days on your journey</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['letter','journal','audio','memory'].map(type => ({
                type,
                count: entries.filter(e => e.type === type).length
              })).map(({ type, count }) => (
                <div key={type} style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10, padding: 10, textAlign: 'center'
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>{count}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'capitalize' }}>{type}s</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex', gap: 6, padding: '12px 16px',
          background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0, overflowX: 'auto'
        }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0,
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: filter === f ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                color: filter === f ? 'var(--navy)' : 'var(--muted)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize'
              }}
            >
              {f === 'All' ? 'All' : `${typeIcon(f)} ${f}`}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>No entries yet. Start writing today.</p>
            </div>
          )}
          {filtered.map(entry => (
            <div key={entry.id} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `${typeColor(entry.type)}20`,
                  border: `2px solid ${typeColor(entry.type)}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                }}>
                  {typeIcon(entry.type)}
                </div>
                <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.06)', marginTop: 6, minHeight: 40 }} />
              </div>
              <div className="card" style={{ flex: 1, marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: typeColor(entry.type), textTransform: 'uppercase' }}>
                    {entry.type}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {new Date(entry.created_at).toLocaleDateString('en-ZA')}
                  </span>
                </div>
                {entry.title && (
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>
                    {entry.title}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
                  {entry.content?.slice(0, 100)}{entry.content?.length > 100 ? '...' : ''}
                </div>
                {entry.mood && (
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>{entry.mood}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
  }
