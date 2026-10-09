import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="page-center" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #0A1520 100%)', minHeight: '100vh' }}>

      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg, #FF8C42, #E8621A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 20,
        boxShadow: '0 12px 40px rgba(255,140,66,0.3)'
      }}>
        🌅
      </div>

      <h1 style={{ marginBottom: 8 }}>I Grieve</h1>
      <div className="slogan" style={{ marginBottom: 28 }}>Grieve. Write. Heal. Emerge.</div>

      <p style={{ maxWidth: 280, marginBottom: 44 }}>
        A private, compassionate space for your grieving journey.
        Write. Record. Heal. On your terms. Always.
      </p>

      <Link to="/signup" style={{ width: '100%', textDecoration: 'none' }}>
        <button className="btn-primary">Begin Your Journey →</button>
      </Link>

      <Link to="/login" style={{ width: '100%', textDecoration: 'none' }}>
        <button className="btn-secondary">I already have an account</button>
      </Link>

      <p style={{ marginTop: 24, fontSize: 11, color: 'var(--muted)' }}>
        Free to join · Private by default · Your data is yours
      </p>
    </div>
  )
}
