import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [usage, setUsage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for upgrade success
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true') {
      const plan = params.get('plan')
      alert(`🎉 Successfully upgraded to ${plan} plan!`)
    }

    Promise.all([
      api.get('/products'),
      api.get('/generate/usage')
    ]).then(([pRes, uRes]) => {
      setProducts(pRes.data.products || [])
      setUsage(uRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const usagePercent = usage ? Math.min(100, (usage.used / usage.limit) * 100) : 0
  const isNearLimit = usage && usage.remaining <= 2

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="MeshClip" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'contain' }} />
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px' }}>MeshClip</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {usage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: isNearLimit ? 'var(--warn)' : 'var(--text-muted)' }}>
                {usage.used}/{usage.limit === 99999 ? '∞' : usage.limit} ads
              </span>
              {usage.limit !== 99999 && (
                <div style={{ width: 72, height: 4, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${usagePercent}%`, height: '100%', borderRadius: 4,
                    background: usagePercent >= 80 ? 'var(--danger)' : 'var(--accent)'
                  }} />
                </div>
              )}
            </div>
          )}

          <button className="btn btn-ghost" onClick={() => navigate('/history')} style={{ fontSize: 12, padding: '7px 14px' }}>
            📂 History
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/pricing')} style={{ fontSize: 12, padding: '7px 16px' }}>
            ⚡ Upgrade
          </button>
        </div>
      </div>

      {/* Near limit warning */}
      {isNearLimit && (
        <div style={{
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 13, color: 'var(--warn)' }}>
            ⚠️ You have {usage.remaining} ad{usage.remaining !== 1 ? 's' : ''} left this month
          </span>
          <button className="btn btn-primary" onClick={() => navigate('/pricing')}
            style={{ fontSize: 12, padding: '6px 14px' }}>
            Upgrade now
          </button>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Pick a product</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select the product you want to create an image ad for.</p>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          <p>Loading your products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📦</p>
          <p>No products found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {filtered.map(product => (
            <div
              key={product.id}
              className="card"
              onClick={() => navigate(`/studio/${product.id}`, { state: { product } })}
              style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', transition: 'border-color 0.15s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ height: 180, background: 'var(--surface2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.thumbnail
                  ? <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 40, opacity: 0.3 }}>🖼</span>}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontWeight: 500, marginBottom: 4, fontSize: 13, lineHeight: 1.4 }}>{product.title}</p>
                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>${product.price}</p>
                {product.images?.length > 1 && (
                  <p style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4 }}>{product.images.length} images</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
