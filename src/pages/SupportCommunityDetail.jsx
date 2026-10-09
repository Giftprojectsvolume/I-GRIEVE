import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function SupportCommunityDetail() {
  const { id } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [pending, setPending] = useState([])
  const [content, setContent] = useState('')
  const [tab, setTab] = useState('posts')
  const [isMember, setIsMember] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [id, session])

  async function loadAll() {
    const { data: c } = await supabase.from('support_communities').select('*').eq('id', id).single()
    setCommunity(c)
    setIsAdmin(c?.created_by === session.user.id)

    const { data: membership } = await supabase
      .from('support_members')
      .select('*')
      .eq('community_id', id)
      .eq('user_id', session.user.id)
      .single()

    setIsMember(membership?.status === 'approved')

    const { data: p } = await supabase.from('support_posts').select('*').eq('community_id', id).order('created_at', { ascending: false })
    setPosts(p || [])

    if (c?.created_by === session.user.id) {
      const { data: pend } = await supabase.from('support_members').select('*').eq('community_id', id).eq('status', 'pending')
      setPending(pend || [])
    }
  }

  async function postMessage(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    const displayName = session?.user?.user_metadata?.display_name || 'Anonymous'
    await supabase.from('support_posts').insert({
      community_id: id,
      user_id: session.user.id,
      content,
      author_name: displayName
    })
    setContent('')
    setSaving(false)
    loadAll()
  }

  async function approveMember(memberId) {
    await supabase.from('support_members').update({ status: 'approved' }).eq('id', memberId)
    loadAll()
  }

  async function removeMember(memberId) {
    await supabase.from('support_members').delete().eq('id', memberId)
    loadAll()
  }

  async function deletePost(postId) {
    await supabase.from('support_posts').delete().eq('id', postId).eq('user_id', session.user.id)
    loadAll()
  }

  if (!community) return <div className="page-center"><p>Loading...</p></div>

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/support')}>← Back</button>
          <span className="topbar-title" style={{ fontSize: 13 }}>{community.name}</span>
          <span style={{ fontSize: 11, color: '#C4B5FD' }}>{community.category}</span>
        </div>

        {(isAdmin || isMember) && (
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {['posts', isAdmin ? 'members' : null].filter(Boolean).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '12px 8px', border: 'none',
                  borderBottom: tab === t ? '2px solid var(--purple)' : '2px solid transparent',
                  background: 'transparent',
                  color: tab === t ? '#C4B5FD' : 'var(--muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize'
                }}
              >{t}</button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          {!isMember && !isAdmin && (
            <div className="card" style={{ textAlign: 'center', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💜</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>{community.name}</div>
              <p style={{ marginBottom: 16 }}>You have requested to join this community. The admin will approve you shortly.</p>
            </div>
          )}

          {(isMember || isAdmin) && tab === 'posts' && (
            <>
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 12 }}>💜 This is a safe peer support space. Be kind and respectful. What is shared here stays here.</p>
              </div>

              <form onSubmit={postMessage} style={{ marginBottom: 20 }}>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share how you are feeling, ask for support, or offer encouragement..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                    padding: '14px 16px', color: 'var(--text)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                    lineHeight: 1.8, resize: 'none', minHeight: 100, outline: 'none',
                    marginBottom: 10
                  }}
                />
                <button className="btn-primary" type="submit" disabled={saving || !content.trim()}>
                  {saving ? 'Posting...' : 'Post →'}
                </button>
              </form>

              {posts.length === 0 && (
                <div className="card" style={{ textAlign: 'center' }}>
                  <p>No posts yet. Be the first to share.</p>
                </div>
              )}

              {posts.map(post => (
                <div key={post.id} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#C4B5FD' }}>{post.author_name}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {new Date(post.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, marginBottom: 10 }}>{post.content}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      🚩 Report
                    </button>
                    {post.user_id === session.user.id && (
                      <button
                        onClick={() => deletePost(post.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {isAdmin && tab === 'members' && (
            <>
              {pending.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="sec-label">Pending Requests ({pending.length})</div>
                  {pending.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>New member request</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => approveMember(p.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--success)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Approve</button>
                        <button onClick={() => removeMember(p.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pending.length === 0 && <div className="card" style={{ textAlign: 'center' }}><p>No pending requests.</p></div>}
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
        }
