import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function History() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/generate/history')
      .then(r => setVideos(r.data.videos || []))
      .finally(() => setLoading(false))
  }, [])

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const styleEmoji = { promo: '🔥', arrival: '✨', minimal: '◻️', story: '🌟' }
  const platformEmoji = { tiktok: '📱', instagram: '📷', facebook: '🖥' }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: 24, fontSize: 13 }}>
        ← Back
      </button>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Video history</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🎬</p>
          <p>No videos generated yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
            Create your first video
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {videos.map(v => (
            <div key={v.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, background: 'var(--surface2)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0
              }}>
                {styleEmoji[v.style] || '🎬'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {v.product_title}
                </p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="tag" style={{ fontSize: 11 }}>{v.style}</span>
                  <span style={{ fontSize: 11 }}>{platformEmoji[v.platform]} {v.platform}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>{formatDate(v.created_at)}</span>
                </div>
              </div>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                background: v.status === 'done' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                color: v.status === 'done' ? 'var(--success)' : 'var(--warn)'
              }}>
                {v.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
