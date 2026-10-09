import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const DAYS = ['😔 Hard', '😢 Sad', '😐 Okay', '🙂 Better', '😊 Good']
const TAGS = ['🌿 Healing', '💭 Memory', '😔 Hard day', '🙏 Grateful', '🌅 Progress']

export default function Journal() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dayRating, setDayRating] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [privacy, setPrivacy] = useState('private')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)

    await supabase.from('entries').insert({
      user_id: session.user.id,
      type: 'journal',
      title,
      content,
      mood: dayRating,
      tags: selectedTags,
      privacy,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/home'), 1500)
  }

  if (saved) {
    return (
      <div className="page-center">
        <div style={{ fontSize: 64, marginBottom: 20 }}>📔</div>
        <h2 style={{ marginBottom: 12 }}>Entry Saved</h2>
        <p>Your words matter. Every entry is a step forward.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
          <span className="topbar-title">Journal Entry</span>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            style={{
              background: 'linear-gradient(135deg,#4ADE80,#16A34A)',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              📅 {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--success)' }}>✓ Auto-saved</div>
          </div>

          <input
            type="text"
            placeholder="Give this entry a title... (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)',
              outline: 'none', color: 'var(--white)',
              fontFamily: 'Playfair Display, serif',
              fontSize: 20, fontWeight: 700,
              padding: '8px 0 12px', marginBottom: 16
            }}
          />

          <div style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.12)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            display: 'flex', gap: 10
          }}>
            <span style={{ fontSize: 16 }}>📔</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 2 }}>
                This is your space to talk to yourself.
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
                No right or wrong. Just how you feel today.
              </div>
            </div>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Today I am feeling..."
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', color: 'var(--text)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              lineHeight: 1.9, resize: 'none', minHeight: 180
            }}
          />

          <div className="divider" />

          <div className="sec-label">How was today?</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {DAYS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDayRating(dayRating === d ? '' : d)}
                style={{
                  flex: 1, padding: '10px 4px', borderRadius: 10, textAlign: 'center',
                  border: dayRating === d ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: dayRating === d ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}
              >
                <div style={{ fontSize: 20 }}>{d.split(' ')[0]}</div>
                <div style={{ fontSize: 10, color: dayRating === d ? 'var(--success)' : 'var(--muted)', fontWeight: 600, marginTop: 4 }}>
                  {d.split(' ')[1]}
                </div>
              </button>
            ))}
          </div>

          <div className="sec-label">Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '6px 12px', borderRadius: 100,
                  border: selectedTags.includes(tag) ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  background: selectedTags.includes(tag) ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  color: selectedTags.includes(tag) ? 'var(--success)' : 'var(--muted)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {tag}
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
                  border: privacy === p ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: privacy === p ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  color: privacy === p ? 'var(--success)' : 'var(--muted)',
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
