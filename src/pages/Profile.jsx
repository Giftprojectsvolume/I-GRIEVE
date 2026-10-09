import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [memorial, setMemorial] = useState(null)
  const [entryCount, setEntryCount] = useState(0)
  const [dayCount, setDayCount] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: mem } = await supabase
        .from('memorials')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (mem) {
        setMemorial(mem)
        const days = Math.floor((new Date() - new Date(mem.started_at)) / (1000 * 60 * 60 * 24))
        setDayCount(days)
      }

      const { count } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

      setEntryCount(count || 0)
    }
    load()
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const displayName = session?.user?.user_metadata?.display_name || 'Friend'

  return (
    <>
      <div className="page">

        <div style={{
          textAlign: 'center', marginBottom: 24,
          paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 12px'
          }}>🌅</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{session?.user?.email}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)',
            borderRadius: 100, padding: '6px 14px', marginTop: 12
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)' }}>FREE PLAN</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>·</span>
            <Link to="/premium" style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>
              Upgrade →
            </Link>
          </div>
        </div>

        {memorial && (
          <>
            <div className="sec-label">My Memorial Space</div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--orange),var(--orange2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0
                }}>🕊️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700, color: 'var(--white)' }}>
                    {memorial.person_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {memorial.relationship} · Day {dayCount}
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginTop: 8 }}>
                    <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg,var(--orange),var(--gold))', borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="sec-label">Journey Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: 'var(--orange)' }}>{dayCount}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Days on journey</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: 'var(--white)' }}>{entryCount}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Total entries</div>
          </div>
        </div>

        <div className="sec-label">Account</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { label: 'Privacy Settings', icon: '🔒', path: '/settings' },
            { label: 'Safety & Support', icon: '🛡️', path: '/safety' },
            { label: 'Upgrade to Premium', icon: '⭐', path: '/premium' },
          ].map(item => (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '15px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div style={{ flex: 1, fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>{item.label}</div>
                <span style={{ fontSize: 16, color: 'var(--muted)' }}>›</span>
              </div>
            </Link>
          ))}
          <div
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '15px 16px', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <div style={{ flex: 1, fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>Log Out</div>
            <span style={{ fontSize: 16, color: 'var(--muted)' }}>›</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', marginTop: 8 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: 'var(--orange)', marginBottom: 4 }}>I Grieve</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)' }}>
            Grieve. Write. Heal. Emerge.
          </div>
          <div style={{ fontSize: 10, color: 'rgba(138,155,176,0.4)', marginTop: 8 }}>
            Founded by Gift Ntombi Greeff
          </div>
        </div>

      </div>
      <BottomNav />
    </>
  )
      }
