import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const RELATIONSHIPS = ['Parent', 'Spouse / Partner', 'Child', 'Sibling', 'Family member', 'Friend', 'Miscarriage', 'Pet', 'Other']

export default function Onboarding() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [personName, setPersonName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!relationship) {
      setError('Please select your relationship.')
      return
    }
    setLoading(true)

    const { error } = await supabase.from('memorials').insert({
      user_id: session.user.id,
      person_name: personName,
      relationship,
      started_at: new Date().toISOString()
    })

    if (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '60px 24px 32px' }}>

      <div style={{ marginBottom: 28 }}>
        <div className="slogan" style={{ marginBottom: 10 }}>Step 2 of 3</div>
        <h1 style={{ marginBottom: 8 }}>Who are you<br />remembering?</h1>
        <p>This creates your personal memorial space. You can add more people later.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Their Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Mum, Dad, My Angel..."
            value={personName}
            onChange={e => setPersonName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Relationship</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {RELATIONSHIPS.map(rel => (
              <button
                key={rel}
                type="button"
                onClick={() => setRelationship(rel)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 100,
                  border: relationship === rel ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                  background: relationship === rel ? 'rgba(255,140,66,0.15)' : 'rgba(255,255,255,0.04)',
                  color: relationship === rel ? 'var(--orange)' : 'var(--muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 24 }}>
          {loading ? 'Creating your space...' : 'Enter My Space →'}
        </button>
      </form>
    </div>
  )
                    }
