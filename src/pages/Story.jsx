import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import BottomNav from '../components/BottomNav'

export default function Story() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single()
      if (data) setStory(data)
    }
    if (id !== 'new') load()
  }, [id])

  if (id === 'new') {
    return <ShareStory />
  }

  if (!story) {
    return (
      <div className="page-center">
        <p>Loading story...</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/community')}>← Back</button>
          <span className="topbar-title">Story</span>
          <span />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 120px' }}>
          <span style={{
            background: 'rgba(255,140,66,0.15)', border: '1px solid rgba(255,140,66,0.25)',
            borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: 'var(--orange)'
          }}>
            {story.loss_type}
          </span>

          <h1 style={{ margin: '14px 0 8px', fontSize: 22 }}>{story.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'var(--navy)', flexShrink: 0
            }}>
              {story.is_anonymous ? '?' : story.author_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>
                {story.is_anonymous ? 'Anonymous' : story.author_name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {new Date(story.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
            {story.content}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 72, left: 0, right: 0,
          background: 'rgba(13,27,42,0.97)', backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 20px'
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setSupported(!supported)}
              style={{
                flex: 1, padding: 12, borderRadius: 12,
                background: supported ? 'rgba(239,68,68,0.15)' : 'rgba(255,140,66,0.1)',
                border: supported ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,140,66,0.2)',
                color: supported ? 'var(--danger)' : 'var(--orange)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}
            >
              {supported ? '❤️ Support Sent' : '🤍 Send Support'}
            </button>
            <button
              onClick={() => navigate('/community')}
              style={{
                flex: 1, padding: 12, borderRadius: 12,
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                color: '#C4B5FD', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}
            >
              👥 Connect
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

function ShareStory() {
  const navigate = useNavigate()
  const { session } = require('../context/AuthContext').useAuth ? require('../context/AuthContext').useAuth() : {}
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [lossType, setLossType] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [saving, setSaving] = useState(false)

  const TYPES = ['🕊️ Parent', '💔 Partner', '👶 Child', '🤱 Miscarriage', '🐾 Pet', '🤝 Sibling', '👫 Friend', '💜 Other']

  async function handlePublish() {
    if (!title.trim() || !content.trim() || !lossType) return
    setSaving(true)
    await supabase.from('stories').insert({
      title, content, loss_type: lossType, is_anonymous: isAnonymous, is_published: true
    })
    setSaving(false)
    navigate('/community')
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/community')}>← Back</button>
          <span className="topbar-title">Share Your Story</span>
          <button
            onClick={handlePublish}
            disabled={saving || !title.trim() || !content.trim() || !lossType}
            style={{
              background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
              border: 'none', color: 'var(--navy)', fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', opacity: (!title || !content || !lossType) ? 0.5 : 1
            }}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          <div className="form-group">
            <label className="form-label">Story Title</label>
            <input className="form-input" placeholder="Give your story a title..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Loss Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => setLossType(t)} style={{
                  padding: '8px 14px', borderRadius: 100,
                  border: lossType === t ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                  background: lossType === t ? 'rgba(255,140,66,0.15)' : 'rgba(255,255,255,0.04)',
                  color: lossType === t ? 'var(--orange)' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Your Story</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write what you want the world to know about your journey..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                padding: '14px 16px', color: 'var(--text)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.85,
                resize: 'none', minHeight: 200, outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="card">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>Post Anonymously</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Your name will not show</div>
            </div>
            <div
              onClick={() => setIsAnonymous(!isAnonymous)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: isAnonymous ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2,
                right: isAnonymous ? 2 : 'auto', left: isAnonymous ? 'auto' : 2,
                transition: 'all 0.2s'
              }} />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
