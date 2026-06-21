import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!state?.downloadUrl) {
    navigate('/')
    return null
  }

  const { downloadUrl, product, caption } = state

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await api.get(downloadUrl, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `viralclip-${product?.title?.slice(0, 20) || 'ad'}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  function handleCopyCaption() {
    if (!caption) return
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
      {/* Success */}
      <div style={{
        width: 64, height: 64, background: 'rgba(34,197,94,0.15)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 28
      }}>✅</div>

      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Your ad is ready!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
        {product?.title ? `Ad for "${product.title}"` : 'Your image ad is ready to download.'}
      </p>

      {/* Download image */}
      <button className="btn btn-primary btn-lg" onClick={handleDownload}
        disabled={downloading} style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
        {downloading ? <><span className="spinner" /> Downloading...</> : '⬇ Download Image Ad'}
      </button>

      {/* Caption */}
      {caption && (
        <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ready-to-post caption</p>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>{caption}</p>
            </div>
            <button className="btn btn-ghost" onClick={handleCopyCaption}
              style={{ fontSize: 12, padding: '6px 14px', flexShrink: 0 }}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Video coming soon card */}
      <div className="card" style={{ marginBottom: 20, textAlign: 'left', opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, background: 'rgba(123,97,255,0.15)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
          }}>🎬</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Video Ad</p>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                background: 'rgba(123,97,255,0.2)', color: 'var(--accent)', fontWeight: 600
              }}>Coming Soon</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              HD video ads with motion graphics & music are coming. You'll be notified when it launches.
            </p>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 13, opacity: 0.5, cursor: 'not-allowed' }}>
          🔒 Video Ad — Coming Soon
        </button>
      </div>

      {/* Share links */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'TikTok', url: 'https://www.tiktok.com/', emoji: '🎵' },
          { label: 'Instagram', url: 'https://www.instagram.com/', emoji: '📷' },
          { label: 'Facebook', url: 'https://www.facebook.com/', emoji: '👥' }
        ].map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: 13 }}>
            {s.emoji} {s.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={() => navigate('/')}
          style={{ flex: 1, justifyContent: 'center' }}>
          ← Make another
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/history')}
          style={{ flex: 1, justifyContent: 'center' }}>
          📂 History
        </button>
      </div>
    </div>
  )
}
