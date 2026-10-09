import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '60px 24px 32px' }}>

      <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
        <button className="back-btn">← Back</button>
      </Link>

      <div style={{ marginBottom: 28 }}>
        <div className="slogan" style={{ marginBottom: 10 }}>Welcome back</div>
        <h1 style={{ marginBottom: 8 }}>Log in to<br />I Grieve</h1>
      </div>

      <form onSubmit={handleLogin}>
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
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 24 }}>
          {loading ? 'Logging in...' : 'Log In →'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
          <Link to="/forgot-password" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            Forgot your password?
          </Link>
        </p>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>
          Sign up free
        </Link>
      </p>
    </div>
  )
      }
