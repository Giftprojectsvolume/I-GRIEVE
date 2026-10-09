import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const CATEGORIES = ['All', '🤱 Miscarriage', '🕊️ Parent Loss', '👶 Child Loss', '🐾 Pet Loss', '💔 Partner Loss', '🤝 Sibling Loss', '👫 Friend Loss', '💜 General Grief']

export default function SupportCommunities() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([])
  const [filter, setFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCommunities() }, [])

  async function loadCommunities() {
    const { data } = await supabase
      .from('support_communities')
      .select('*')
      .order('created_at', { ascending: false })
    setCommunities(data || [])
  }

  async function createCommunity(e) {
    e.preventDefault()
    if (!name.trim() || !category) return
    setSaving(true)

    const { data: comm, error } = await supabase
      .from('support_communities')
      .insert({ name, description, category, created_by: session.user.id })
      .select('id')
      .single()

    if (!error && comm) {
      await supabase.from('support_members').insert({
        community_id: comm.id,
        user_id: session.user.id,
        role: 'admin',
        status: 'approved'
      })
      setName('')
      setDescription('')
      setCategory('')
      setShowCreate(false)
      loadCommunities()
    }
    setSaving(false)
  }

  async function requestJoin(communityId) {
    const { error } = await supabase.from('support_members').insert({
      community_id: communityId,
      user_id: session.user.id,
      role: 'member',
      status: 'pending'
    })
    if (!error) alert('Request sent! The admin will approve you shortly.')
  }

  const filtered = filter === 'All' ? communities : communities.filter(c => c.category === filter)

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/community')}>← Back</button>
          <span className="topbar-title">Support Communities</span>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
          >
            + New
          </button>
        </div>

        <div style={{
          display: 'flex', gap: 8, padding: '12px 16px',
          background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0, overflowX: 'auto'
        }}>
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          {showCreate && (
            <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(139,92,246,0.25)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>Create a Support Community</div>
              <form onSubmit={createCommunity}>
                <div className="form-group">
                  <label className="form-label">Community Name</label>
                  <input className="form-input" placeholder="e.g. Miscarriage Support Circle" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <button
                        key={cat} type="button" onClick={() => setCategory(cat)}
                        style={{
                          padding: '7px 12px', borderRadius: 100,
                          border: category === cat ? '1px solid var(--purple)' : '1px solid rgba(255,255,255,0.1)',
                          background: category === cat ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                          color: category === cat ? '#C4B5FD' : 'var(--muted)',
                          fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}
                      >{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <input className="form-input" placeholder="What is this community for?" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <button className="btn-primary" type="submit" disabled={saving || !name || !category}>
                  {saving ? 'Creating...' : 'Create Community →'}
                </button>
              </form>
            </div>
          )}

          <div style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#C4B5FD', marginBottom: 4 }}>💜 Peer Support Only</div>
            <p style={{ fontSize: 12 }}>These communities are for peer support — not professional medical or psychological advice. If you are in crisis please visit Safety & Support.</p>
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: 16 }}>No communities yet in this category.</p>
              <button className="btn-primary" onClick={() => setShowCreate(true)}>Create One</button>
            </div>
          )}

          {filtered.map(comm => (
            <div key={comm.id} className="card" style={{ marginBottom: 12, border: '1px solid rgba(139,92,246,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg,var(--purple),#6D28D9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                }}>💜</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 2 }}>{comm.name}</div>
                  <div style={{ fontSize: 11, color: '#C4B5FD' }}>{comm.category}</div>
                  {comm.description && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{comm.description}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigate(`/support/${comm.id}`)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', color: '#C4B5FD', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                >
                  View
                </button>
                {comm.created_by !== session.user.id && (
                  <button
                    onClick={() => requestJoin(comm.id)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,var(--orange),var(--orange2))', border: 'none', color: 'var(--navy)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Request to Join
                  </button>
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
