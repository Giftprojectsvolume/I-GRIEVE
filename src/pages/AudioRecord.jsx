import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const TYPES = ['✉️ Voice Letter', '💭 Memory', '🌿 Reflection', '📅 Journey note']

export default function AudioRecord() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [audioType, setAudioType] = useState('✉️ Voice Letter')
  const [title, setTitle] = useState('')
  const [stage, setStage] = useState('ready')
  const [seconds, setSeconds] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = e => chunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      setAudioUrl(URL.createObjectURL(blob))
      setStage('preview')
    }

    recorder.start()
    setStage('recording')
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    mediaRef.current?.stop()
    mediaRef.current?.stream.getTracks().forEach(t => t.stop())
  }

  function reRecord() {
    setStage('ready')
    setSeconds(0)
    setAudioBlob(null)
    setAudioUrl(null)
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  async function handleSave() {
    if (!audioBlob) return
    setSaving(true)

    const fileName = `${session.user.id}/${Date.now()}.webm`
    await supabase.storage.from('audio').upload(fileName, audioBlob)

    const { data: urlData } = supabase.storage.from('audio').getPublicUrl(fileName)

    await supabase.from('entries').insert({
      user_id: session.user.id,
      type: 'audio',
      title: title || audioType,
      content: urlData.publicUrl,
      privacy: 'private',
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/home'), 1500)
  }

  if (saved) {
    return (
      <div className="page-center">
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎙️</div>
        <h2 style={{ marginBottom: 12 }}>Audio Saved</h2>
        <p>Your voice is preserved here safely.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--navy)' }}>
        <div className="topbar">
          <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
          <span className="topbar-title">Record Audio</span>
          <button
            onClick={handleSave}
            disabled={!audioBlob || saving}
            style={{
              background: audioBlob ? 'linear-gradient(135deg,var(--orange),var(--orange2))' : 'rgba(255,255,255,0.08)',
              border: 'none', color: audioBlob ? 'var(--navy)' : 'var(--muted)',
              fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: 8,
              cursor: audioBlob ? 'pointer' : 'not-allowed',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          <div className="sec-label">What are you recording?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setAudioType(t)}
                style={{
                  padding: '8px 14px', borderRadius: 100,
                  border: audioType === t ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: audioType === t ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                  color: audioType === t ? '#C4B5FD' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Give this recording a title... (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-input"
            style={{ marginBottom: 24 }}
          />

          {stage === 'ready' && (
            <div style={{
              background: 'var(--navy2)', border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 20, padding: '32px 20px', textAlign: 'center'
            }}>
              <p style={{ marginBottom: 24 }}>Speak freely. Say what you feel.<br />There are no wrong words here.</p>
              <div
                onClick={startRecording}
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--purple),#6D28D9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', cursor: 'pointer', fontSize: 38,
                  boxShadow: '0 8px 32px rgba(139,92,246,0.4)'
                }}
              >
                🎙️
              </div>
              <p>Tap the mic to begin</p>
            </div>
          )}

          {stage === 'recording' && (
            <div style={{
              background: 'var(--navy2)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 20, padding: '28px 20px', textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', letterSpacing: 1, textTransform: 'uppercase' }}>Recording</span>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 900, color: 'var(--white)', marginBottom: 24 }}>
                {formatTime(seconds)}
              </div>
              <div
                onClick={stopRecording}
                style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#F87171,#DC2626)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(239,68,68,0.4)'
                }}
              >
                <div style={{ width: 22, height: 22, background: 'white', borderRadius: 4 }} />
              </div>
            </div>
          )}

          {stage === 'preview' && (
            <div style={{
              background: 'var(--navy2)', border: '1px solid rgba(255,140,66,0.2)',
              borderRadius: 20, padding: '28px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 14 }}>✓ Recording complete</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Duration: {formatTime(seconds)}</div>
              {audioUrl && (
                <audio controls src={audioUrl} style={{ width: '100%', marginBottom: 16 }} />
              )}
              <button
                onClick={reRecord}
                style={{
                  padding: '10px 20px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}
              >
                ↺ Re-record
              </button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
        }
