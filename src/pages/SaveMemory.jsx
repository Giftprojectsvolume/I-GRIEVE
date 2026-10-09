import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const FEELS = ['💙 Warm and loved', '😢 Bittersweet', '😂 Happy and funny', '😌 Peaceful', '💔 Miss them deeply']

export default function SaveMemory() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [feel, setFeel] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)

    await supabase.from('entries').insert({
      user_id: session.user.id,
      type: 'memory',
      title,
      content,
      mood: feel,
      privacy,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/home'), 1500)
  }

  if (saved) {
    return (
      <div className="page-center">
        <div style={{ fontSize: 64, marginBottom: 20 }}>🖼️</div>
        <h2 style={{ marginBottom: 12 }}>Memory Saved</h2>
        <p>This memory is safe and preserved.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
          <span className="topbar-title">Save a Memory</span>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            style={{
              background: 'linear-gradient(135deg,var(--blue),#0284C7)',
              border: 'none', color: 'var(--navy)',
              fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              opacity: !title.trim() ? 0.5 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save ✓'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          <div className="form-group">
            <label className="form-label">Memory Title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Sunday morning tea with Mum"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Describe this memory</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Describe the memory in as much or as little detail as you want..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 16px',
                color: 'var(--text)', fontFamily: 'DM Sans, sans-serif',
                fontSize: 14, lineHeight: 1.8, resize: 'none',
                minHeight: 120, outline: 'none'
              }}
            />
          </div>

          <div className="divider" />

          <div className="sec-label">How does this memory make you feel?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {FEELS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFeel(feel === f ? '' : f)}
                style={{
                  padding: '8px 14px', borderRadius: 100,
                  border: feel === f ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: feel === f ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                  color: feel === f ? 'var(--blue)' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {f}
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
                  border: privacy === p ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  background: privacy === p ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  color: privacy === p ? 'var(--blue)' : 'var(--muted)',
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
