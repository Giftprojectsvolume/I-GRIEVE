import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const FEATURES = [
  { icon: '💾', title: '5GB Storage', desc: 'Years of letters, journals, audio recordings and memories safely stored.' },
  { icon: '🎙️', title: 'Unlimited Audio', desc: 'Record as long as you need. No time limits on voice letters or reflections.' },
  { icon: '🌍', title: 'Join the Community', desc: 'Connect with others who understand your loss. Read their journeys. Share yours.' },
  { icon: '👥', title: 'Add Grieving Friends', desc: 'Connect privately with someone who has walked a similar path.' },
  { icon: '📖', title: 'Journey Book Builder', desc: 'Turn your private journal into a grief memoir. Export as PDF to keep forever.' },
  { icon: '✨', title: 'AI Writing Assistance', desc: 'Gentle AI prompts to help you find words when grief leaves you speechless.' },
]

export default function Premium() {
  const navigate = useNavigate()

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/profile')}>← Back</button>
          <span className="topbar-title">Upgrade to Premium</span>
          <span />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

          <div style={{
            background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(139,92,246,0.05))',
            borderBottom: '1px solid rgba(139,92,246,0.2)',
            padding: '28px 20px', textAlign: 'center'
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: 20,
              background: 'linear-gradient(135deg,var(--purple),#6D28D9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 14px',
              boxShadow: '0 8px 28px rgba(139,92,246,0.4)'
            }}>⭐</div>
            <h1 style={{ marginBottom: 6, fontSize: 24 }}>I Grieve Premium</h1>
            <p style={{ maxWidth: 260, margin: '0 auto 16px' }}>
              Unlock your full healing journey — more space, more connection, more tools.
            </p>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 38, fontWeight: 900, color: '#C4B5FD' }}>
              $4.99<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/month</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Cancel anytime · No hidden fees</div>
          </div>

          <div style={{ padding: '20px 20px 0' }}>
            <div className="sec-label">Everything in Premium</div>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(139,92,246,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}

            <div style={{
              background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 14, padding: 18, margin: '20px 0'
            }}>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.75, marginBottom: 14 }}>
                "Premium gave me the community I never knew I needed. Reading someone else's story of losing their mum at the exact moment I needed it — that is worth everything."
              </p>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>Thandiwe M.</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Premium member · Johannesburg</div>
            </div>

            <button
              style={{
                width: '100%', padding: 18, borderRadius: 14,
                background: 'linear-gradient(135deg,var(--purple),#6D28D9)',
                border: 'none', color: 'white',
                fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 8px 28px rgba(139,92,246,0.4)',
                marginBottom: 12
              }}
            >
              Start Premium — $4.99/month →
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
              Cancel anytime from your profile settings. No contracts. No hidden fees.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
                }
