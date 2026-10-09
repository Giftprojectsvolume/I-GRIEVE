import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/home', icon: '🏠', label: 'Home' },
  { path: '/journey', icon: '📅', label: 'Journey' },
  { path: '/community', icon: '🌍', label: 'Community' },
  { path: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      height: 72, background: 'rgba(13,27,42,0.97)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px 8px', zIndex: 100
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <Link
            key={tab.path}
            to={tab.path}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              padding: '8px 16px', borderRadius: 12,
              background: active ? 'rgba(255,140,66,0.08)' : 'transparent',
              cursor: 'pointer'
            }}>
              <span style={{
                fontSize: 22,
                filter: active ? 'none' : 'grayscale(1) opacity(0.4)'
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: active ? 'var(--orange)' : 'var(--muted)'
              }}>
                {tab.label}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
                  }
