import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const MOODS = ['💙 Missing them', '😢 Sad today', '🙏 Grateful', '😌 At peace', '😤 Angry']

export default function WriteLetter() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)

    await supabase.from('entries').insert({
      user_id: session.user.id,
      type: 'letter',
      content,
      mood,
      privacy,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/home'), 1500)
  }

  if (saved) {
    return (
      <div className="page-center">
        <div style={{ fontSize: 64, marginBottom: 20 }}>🌅</div>
        <h2 style={{ marginBottom: 12 }}>Letter Saved</h2>
        <p>Your words are safe here.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
          <span className="topbar-title">Write a Letter</span>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            style={{
              background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
              border: 'none', color: 'var(--navy)',
              fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              opacity: !content.trim() ? 0.5 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save ✓'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          <div style={{
            background: 'var(--navy2)',
            border: '1px solid rgba(255,140,66,0.15)',
            borderRadius: 14, padding: '14px 18px', marginBottom: 16
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 6 }}>
              Writing to
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, color: 'var(--white)', fontStyle: 'italic' }}>
              Dear someone I love,
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing... there are no wrong words here."
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', color: 'var(--text)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              lineHeight: 1.9, resize: 'none', minHeight: 200
            }}
          />

          <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginBottom: 16 }}>
            {content.trim() ? content.trim().split(/\s+/).length : 0} words
          </div>

          <div className="divider" />

          <div className="sec-label">How are you feeling?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {MOODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(mood === m ? '' : m)}
                style={{
                  padding: '7px 14px', borderRadius: 100,
                  border: mood === m ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                  background: mood === m ? 'rgba(255,140,66,0.15)' : 'rgba(255,255,255,0.04)',
                  color: mood === m ? 'var(--orange)' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="sec-label">Visibility</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['private', 'friends', 'community'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPrivacy(p)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, textAlign: 'center',
                  border: privacy === p ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.08)',
                  background: privacy === p ? 'rgba(255,140,66,0.15)' : 'rgba(255,255,255,0.04)',
                  color: privacy === p ? 'var(--orange)' : 'var(--muted)',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize'
                }}
              >
                {p === 'private' ? '🔒' : p === 'friends' ? '👥' : '🌍'}<br />{p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
                         }
