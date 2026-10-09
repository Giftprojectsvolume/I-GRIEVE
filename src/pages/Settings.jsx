import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/profile')}>← Back</button>
          <span className="topbar-title">Settings</span>
          <span />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>

          <div className="sec-label">Account</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Email Address</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{session?.user?.email}</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Display Name</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>
                {session?.user?.user_metadata?.display_name || 'Not set'}
              </div>
            </div>
          </div>

          <div className="sec-label">Privacy</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Profile Visibility', value: 'Private', note: 'Only connections can see your profile' },
              { label: 'Default Entry Privacy', value: 'Private', note: 'New entries are private by default' },
              { label: 'Show Location on Stories', value: 'Off', note: 'Your city will not show on shared stories' },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                padding: '15px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.note}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700 }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sec-label">Notifications</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Daily Reflection Reminder', on: true },
              { label: 'Connection Requests', on: true },
              { label: 'Journey Milestones', on: true },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '15px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>{item.label}</div>
                <div style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: item.on ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', cursor: 'pointer'
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 2, right: item.on ? 2 : 'auto', left: item.on ? 'auto' : 2
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div className="sec-label">App Info</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Version', value: '1.0.0' },
              { label: 'Privacy Policy', value: '›' },
              { label: 'Terms of Service', value: '›' },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <span style={{ fontSize: 14, color: 'var(--white)' }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: 14, padding: '14px 16px', cursor: 'pointer'
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Delete My Account</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Permanently removes all your data</div>
          </div>

        </div>
      </div>
      <BottomNav />
    </>
  )
               }
