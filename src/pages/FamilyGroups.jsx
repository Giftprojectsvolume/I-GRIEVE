import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function FamilyGroups() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadGroups() }, [session])

  async function loadGroups() {
    const { data: owned } = await supabase
      .from('family_groups')
      .select('*')
      .eq('created_by', session.user.id)

    const { data: memberships } = await supabase
      .from('family_members')
      .select('group_id')
      .eq('user_id', session.user.id)
      .eq('status', 'approved')

    const memberGroupIds = (memberships || []).map(m => m.group_id)

    let memberGroups = []
    if (memberGroupIds.length > 0) {
      const { data } = await supabase
        .from('family_groups')
        .select('*')
        .in('id', memberGroupIds)
      memberGroups = data || []
    }

    const allGroups = [...(owned || []), ...memberGroups]
    const unique = allGroups.filter((g, i, a) => a.findIndex(x => x.id === g.id) === i)
    setGroups(unique)
  }

  async function createGroup(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)

    const { data: group, error } = await supabase
      .from('family_groups')
      .insert({ name, description, created_by: session.user.id })
      .select('id')
      .single()

    if (!error && group) {
      await supabase.from('family_members').insert({
        group_id: group.id,
        user_id: session.user.id,
        role: 'admin',
        status: 'approved'
      })
      setName('')
      setDescription('')
      setShowCreate(false)
      loadGroups()
    }
    setSaving(false)
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/community')}>← Back</button>
          <span className="topbar-title">Family Groups</span>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
          >
            + New
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          {showCreate && (
            <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(255,140,66,0.2)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 16 }}>Create a Family Group</div>
              <form onSubmit={createGroup}>
                <div className="form-group">
                  <label className="form-label">Group Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mlangeni Family"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Remembering Mama and Daddy together"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Group →'}
                </button>
              </form>
            </div>
          )}

          <div style={{ background: 'rgba(255,140,66,0.07)', border: '1px solid rgba(255,140,66,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', marginBottom: 4 }}>🏠 Private Family Space</div>
            <p style={{ fontSize: 12 }}>Create a private group for your family. Invite brothers, sisters, aunties, uncles, cousins — anyone you choose. Share memories of your loved ones together.</p>
          </div>

          {groups.length === 0 && !showCreate && (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
              <p style={{ marginBottom: 16 }}>No family groups yet. Create one and invite your family.</p>
              <button className="btn-primary" onClick={() => setShowCreate(true)}>Create Family Group</button>
            </div>
          )}

          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => navigate(`/family/${group.id}`)}
              className="card"
              style={{ cursor: 'pointer', marginBottom: 12, border: '1px solid rgba(255,140,66,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0
                }}>🏠</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{group.name}</div>
                  {group.description && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{group.description}</div>
                  )}
                </div>
                <span style={{ fontSize: 18, color: 'var(--muted)' }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
        }
