import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function FamilyGroupDetail() {
  const { id } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [posts, setPosts] = useState([])
  const [members, setMembers] = useState([])
  const [pending, setPending] = useState([])
  const [content, setContent] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [tab, setTab] = useState('memories')
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [id, session])

  async function loadAll() {
    const { data: g } = await supabase.from('family_groups').select('*').eq('id', id).single()
    setGroup(g)
    setIsAdmin(g?.created_by === session.user.id)

    const { data: p } = await supabase.from('family_posts').select('*').eq('group_id', id).order('created_at', { ascending: false })
    setPosts(p || [])

    const { data: m } = await supabase.from('family_members').select('*').eq('group_id', id).eq('status', 'approved')
    setMembers(m || [])

    const { data: pend } = await supabase.from('family_members').select('*').eq('group_id', id).eq('status', 'pending')
    setPending(pend || [])
  }

  async function postMemory(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await supabase.from('family_posts').insert({ group_id: id, user_id: session.user.id, content })
    setContent('')
    setSaving(false)
    loadAll()
  }

  async function inviteMember(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    const { data: user } = await supabase.from('profiles').select('id').eq('email', inviteEmail).single()
    if (!user) { alert('User not found. They must have an I Grieve account.'); return }
    await supabase.from('family_members').insert({ group_id: id, user_id: user.id, role: 'member', status: 'pending' })
    setInviteEmail('')
    alert('Invitation sent!')
  }

  async function approveMember(memberId) {
    await supabase.from('family_members').update({ status: 'approved' }).eq('id', memberId)
    loadAll()
  }

  async function removeMember(memberId) {
    await supabase.from('family_members').delete().eq('id', memberId)
    loadAll()
  }

  async function deletePost(postId) {
    await supabase.from('family_posts').delete().eq('id', postId).eq('user_id', session.user.id)
    loadAll()
  }

  if (!group) return <div className="page-center"><p>Loading...</p></div>

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/family')}>← Back</button>
          <span className="topbar-title">{group.name}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>🔒 Private</span>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {['memories', 'invite', 'members'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '12px 8px', border: 'none',
                borderBottom: tab === t ? '2px solid var(--orange)' : '2px solid transparent',
                background: 'transparent',
                color: tab === t ? 'var(--orange)' : 'var(--muted)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize'
              }}
            >
              {t === 'invite' ? (isAdmin ? 'Invite' : 'Request') : t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          {tab === 'memories' && (
            <>
              <form onSubmit={postMemory} style={{ marginBottom: 20 }}>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share a memory, photo description or message..."
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
                  {saving ? 'Sharing...' : 'Share Memory →'}
                </button>
              </form>

              {posts.length === 0 && (
                <div className="card" style={{ textAlign: 'center' }}>
                  <p>No memories shared yet. Be the first to add one.</p>
                </div>
              )}

              {posts.map(post => (
                <div key={post.id} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, marginBottom: 10 }}>{post.content}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {new Date(post.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
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

          {tab === 'invite' && (
            <>
              {isAdmin && pending.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="sec-label">Pending Requests</div>
                  {pending.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>New member request</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => approveMember(p.id)}
                          style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--success)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => removeMember(p.id)}
                          style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAdmin && (
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 12 }}>Invite a Family Member</div>
                  <p style={{ fontSize: 12, marginBottom: 16 }}>They must already have an I Grieve account. Enter their email address.</p>
                  <form onSubmit={inviteMember}>
                    <div className="form-group">
                      <label className="form-label">Their Email</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="family@email.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button className="btn-primary" type="submit">Send Invite →</button>
                  </form>
                </div>
              )}

              {!isAdmin && (
                <div className="card" style={{ textAlign: 'center' }}>
                  <p>Only the group admin can invite new members.</p>
                </div>
              )}
            </>
          )}

          {tab === 'members' && (
            <>
              <div className="sec-label">Approved Members ({members.length})</div>
              {members.map(m => (
                <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>
                      {m.user_id === session.user.id ? 'You' : 'Family Member'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, textTransform: 'capitalize' }}>{m.role}</div>
                  </div>
                  {isAdmin && m.user_id !== session.user.id && (
                    <button
                      onClick={() => removeMember(m.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
        }
