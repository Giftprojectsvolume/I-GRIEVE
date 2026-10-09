import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import BottomNav from '../components/BottomNav'

const CATEGORIES = ['All Stories', '🕊️ Parent', '💔 Partner', '🤱 Miscarriage', '👶 Child', '🐾 Pet', '🤝 Sibling', '👫 Friend']

export default function Community() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [filter, setFilter] = useState('All Stories')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (data) setStories(data)
    }
    load()
  }, [])

  const filtered = filter === 'All Stories'
    ? stories
    : stories.filter(s => s.loss_type === filter)

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>Community</span>
          <span />
          <button onClick={() => navigate('/story/new')} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            + Share
          </button>
        </div>

        <!-- THREE SPACES -->
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '16px 16px 0', flexShrink: 0 }}>
          <div
            onClick={() => navigate('/community')}
            style={{ background: 'linear-gradient(135deg,rgba(255,140,66,0.15),rgba(255,140,66,0.05))', border: '1px solid rgba(255,140,66,0.25)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>🌍</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', lineHeight: 1.3 }}>Grief Stories</div>
          </div>
          <div
            onClick={() => navigate('/family')}
            style={{ background: 'linear-gradient(135deg,rgba(255,140,66,0.08),rgba(255,140,66,0.02))', border: '1px solid rgba(255,140,66,0.15)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', lineHeight: 1.3 }}>Family Groups</div>
          </div>
          <div
            onClick={() => navigate('/support')}
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(139,92,246,0.03))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>💜</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#C4B5FD', lineHeight: 1.3 }}>Support Groups</div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(139,92,246,0.03))', borderBottom: '1px solid rgba(139,92,246,0.15)', padding: '14px 20px', flexShrink: 0, marginTop: 12 }}>
          <div style={{ fontSize: 13, color: '#C4B5FD', fontWeight: 600, marginBottom: 3 }}>🌍 Shared Grief Stories</div>
          <p style={{ fontSize: 11 }}>Real stories from real people who understand. Be kind. Be gentle. You are not alone here.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '7px 14px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0,
                border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: filter === cat ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                color: filter === cat ? 'var(--navy)' : 'var(--muted)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>No stories yet in this category. Be the first to share.</p>
            </div>
          )}
          {filtered.map(story => (
            <div key={story.id} onClick={() => navigate(`/story/${story.id}`)} className="card" style={{ cursor: 'pointer', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ background: 'rgba(255,140,66,0.15)', border: '1px solid rgba(255,140,66,0.25)', borderRadius: 100, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: 'var(--orange)' }}>
                  {story.loss_type}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {new Date(story.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 6, lineHeight: 1.3 }}>{story.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.65, marginBottom: 12 }}>{story.content?.slice(0, 120)}...</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{story.is_anonymous ? 'Anonymous' : story.author_name}</span>
                <span style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600 }}>Read →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
          }
