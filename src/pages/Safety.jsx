import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function Safety() {
  const navigate = useNavigate()
  const [crisisOpen, setCrisisOpen] = useState(false)

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/profile')}>← Back</button>
          <span className="topbar-title">Safety & Support</span>
          <span />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

          <div style={{
            background: 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))',
            borderBottom: '1px solid rgba(239,68,68,0.2)',
            padding: '16px 20px'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--danger)', marginBottom: 8 }}>
              🚨 Are you in crisis right now?
            </div>
            <p style={{ marginBottom: 14 }}>
              If you are having thoughts of harming yourself — you are not alone and help is available right now.
            </p>
            <button
              onClick={() => setCrisisOpen(!crisisOpen)}
              style={{
                width: '100%', padding: 14, borderRadius: 12,
                background: 'linear-gradient(135deg,#EF4444,#DC2626)',
                border: 'none', color: 'white',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}
            >
              I need help right now →
            </button>
          </div>

          {crisisOpen && (
            <div style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '16px 20px' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 14 }}>Please reach out right now:</p>
              {[
                { country: '🇿🇦 SADAG — South Africa', number: '0800 456 789', note: 'Free · 24 hours · 7 days' },
                { country: '🇿🇦 Lifeline South Africa', number: '0861 322 322', note: 'Free · Available 24/7' },
                { country: '🌍 Crisis Text Line', number: 'Text HOME to 741741', note: 'USA, UK, Canada, Ireland' },
              ].map(c => (
                <div key={c.number} style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 12, padding: '14px 16px', marginBottom: 10
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 2 }}>{c.country}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--white)', marginBottom: 2 }}>{c.number}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.note}</div>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 12 }}>
                  If in immediate danger call <strong style={{ color: 'var(--white)' }}>10111</strong> in South Africa or <strong style={{ color: 'var(--white)' }}>112</strong> internationally.
                </p>
              </div>
            </div>
          )}

          <div style={{ padding: '20px 20px 0' }}>
            <div style={{
              background: 'rgba(255,179,71,0.07)', border: '1px solid rgba(255,179,71,0.18)',
              borderRadius: 14, padding: 16, marginBottom: 20
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>📋 Important</div>
              <p style={{ fontSize: 12 }}>
                I Grieve is a peer support and storytelling platform — not a medical or therapy service.
                If you are in crisis please contact a qualified professional or the crisis lines above.
              </p>
            </div>

            <div className="sec-label">Platform Safety</div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
              {[
                { icon: '🚩', label: 'Report a User', sub: 'Report harmful behaviour' },
                { icon: '🚫', label: 'Block a User', sub: 'Prevent someone from seeing your content' },
                { icon: '⚠️', label: 'Report Content', sub: 'Flag a post that breaks guidelines' },
                { icon: '📜', label: 'Community Guidelines', sub: 'Read our rules for a safe community' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '15px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 16, color: 'var(--muted)' }}>›</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontSize: 12 }}>Need to reach our team? <strong style={{ color: 'var(--orange)' }}>safety@igrieve.app</strong></p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
                  }
