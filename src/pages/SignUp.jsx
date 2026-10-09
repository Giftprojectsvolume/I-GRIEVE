import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/onboarding')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '60px 24px 32px' }}>

      <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
        <button className="back-btn">← Back</button>
      </Link>

      <div style={{ marginBottom: 8 }}>
        <div className="slogan" style={{ marginBottom: 10 }}>Step 1 of 3</div>
        <h1 style={{ marginBottom: 8 }}>Create your<br />safe space</h1>
        <p style={{ marginBottom: 28 }}>Your account is private by default. You choose what you share.</p>
      </div>

      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label className="form-label">Your Name or Nickname</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Gift or just Healing Soul"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Choose a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 24 }}>
          {loading ? 'Creating account...' : 'Continue →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>
          Log in
        </Link>
      </p>
    </div>
  )
        }
