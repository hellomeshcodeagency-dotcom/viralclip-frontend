import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../api.js'

const STYLES = [
  { id: 'promo', label: 'Promo Sale', desc: 'Bold & urgent', emoji: '🔥', color: '#FF4444' },
  { id: 'arrival', label: 'New Arrival', desc: 'Fresh & elegant', emoji: '✨', color: '#7B61FF' },
  { id: 'minimal', label: 'Minimalist', desc: 'Clean & simple', emoji: '◻️', color: '#FFFFFF' },
  { id: 'story', label: 'Brand Story', desc: 'Warm & personal', emoji: '🌟', color: '#F4A261' }
]

const CTAS = ['Shop Now', 'Buy Today', 'Limited Stock', 'Get Yours', 'Order Now', 'Discover More']

export default function Studio() {
  const { productId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [product, setProduct] = useState(state?.product || null)
  const [style, setStyle] = useState('promo')
  const [cta, setCta] = useState('Shop Now')
  const [headline, setHeadline] = useState('')
  const [subtext, setSubtext] = useState('')
  const [loadingCopy, setLoadingCopy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copyGenerated, setCopyGenerated] = useState(false)

  useEffect(() => {
    if (!product) {
      api.get(`/products/${productId}`).then(r => setProduct(r.data.product))
    }
  }, [productId])

  async function handleGenerateCopy() {
    setLoadingCopy(true)
    try {
      const { data } = await api.post('/generate/copy', { productId, style, cta })
      setHeadline(data.copy.headline)
      setSubtext(data.copy.subtext)
      setCopyGenerated(true)
    } catch (e) {
      alert('Failed to generate copy. Please try again.')
    } finally {
      setLoadingCopy(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      const { data } = await api.post('/generate/image', {
        productId, style, imageType: 'normal', headline, subtext, cta
      })
      navigate('/result', { state: { ...data } })
    } catch (e) {
      const msg = e.response?.data?.error || 'Generation failed'
      if (e.response?.data?.upgrade) {
        alert('Plan limit reached. Upgrade your plan.')
      } else {
        alert(msg)
      }
    } finally {
      setGenerating(false)
    }
  }

  if (!product) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 20px' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: 24, fontSize: 13 }}>
        ← Back
      </button>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 28 }}>
        {product.thumbnail && (
          <img src={product.thumbnail} alt={product.title}
            style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
        )}
        <div>
          <p style={{ fontWeight: 600, fontSize: 16 }}>{product.title}</p>
          <p style={{ color: 'var(--accent)', fontSize: 13 }}>${product.price}</p>
        </div>
      </div>

      {/* Coming soon cards */}
      <section style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 500, marginBottom: 12, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>More ad types — coming soon</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { emoji: '📱', label: 'UGC Style', desc: 'AI-generated creator photo' },
            { emoji: '🎬', label: 'Video Ad', desc: 'Motion graphics & music' }
          ].map(t => (
            <div key={t.label} style={{
              padding: '14px 16px', borderRadius: 'var(--radius)', opacity: 0.5,
              border: '1px dashed var(--border)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontWeight: 500, fontSize: 13 }}>{t.label}</p>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 20, background: 'rgba(123,97,255,0.2)', color: 'var(--accent)', fontWeight: 600 }}>Soon</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style picker */}
      <section style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 500, marginBottom: 12, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ad style</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {STYLES.map(s => (
            <div key={s.id} onClick={() => { setStyle(s.id); setCopyGenerated(false) }}
              style={{
                padding: '12px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
                border: `1px solid ${style === s.id ? s.color : 'var(--border)'}`,
                background: style === s.id ? `${s.color}15` : 'var(--surface)',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10
              }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <div>
                <p style={{ fontWeight: 500, fontSize: 13 }}>{s.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 500, marginBottom: 12, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Call to action</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {CTAS.map(c => (
            <button key={c} onClick={() => setCta(c)} className="tag"
              style={{
                cursor: 'pointer',
                background: cta === c ? 'var(--accent-light)' : 'var(--surface2)',
                borderColor: cta === c ? 'var(--accent)' : 'var(--border)',
                color: cta === c ? 'var(--accent)' : 'var(--text-muted)'
              }}>
              {c}
            </button>
          ))}
        </div>
        <input value={cta} onChange={e => setCta(e.target.value)} placeholder="Or type your own..." />
      </section>

      {/* AI Copy */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ad copy</p>
          <button className="btn btn-ghost" onClick={handleGenerateCopy} disabled={loadingCopy}
            style={{ fontSize: 12, padding: '6px 14px' }}>
            {loadingCopy ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Generating...</> : '✦ Generate with AI'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Headline (AI will generate if empty)" />
          <input value={subtext} onChange={e => setSubtext(e.target.value)} placeholder="Supporting text (AI will generate if empty)" />
        </div>
        {copyGenerated && <p style={{ color: 'var(--success)', fontSize: 12, marginTop: 8 }}>✓ AI copy generated — feel free to edit</p>}
      </section>

      <button className="btn btn-primary btn-lg" onClick={handleGenerate}
        disabled={generating} style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
        {generating ? <><span className="spinner" /> Generating your ad...</> : '✦ Generate Image Ad'}
      </button>
      {generating && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>
          This takes about 5–10 seconds...
        </p>
      )}
    </div>
  )
}

