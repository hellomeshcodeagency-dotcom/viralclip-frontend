import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Pricing() {
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/billing/plans')
      .then(r => {
        setPlans(r.data.plans)
        setCurrentPlan(r.data.currentPlan)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleUpgrade(planId) {
    if (planId === 'free') return
    setUpgrading(planId)
    try {
      const { data } = await api.post(`/billing/subscribe/${planId}`)
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl
      }
    } catch (e) {
      alert('Failed to start upgrade. Please try again.')
    } finally {
      setUpgrading(null)
    }
  }

  const planColors = {
    free: { color: '#8A8A9E', bg: 'var(--surface)' },
    starter: { color: '#7B61FF', bg: 'rgba(123,97,255,0.08)' },
    pro: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
    unlimited: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' }
  }

  const planEmoji = { free: '🆓', starter: '⚡', pro: '🚀', unlimited: '♾️' }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: 32, fontSize: 13 }}>
        ← Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Simple, transparent pricing</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>All plans include a 7-day free trial. No credit card required to start.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
        {plans.map(plan => {
          const cfg = planColors[plan.id]
          const isCurrent = plan.id === currentPlan
          const isPopular = plan.id === 'pro'

          return (
            <div key={plan.id} style={{
              background: isCurrent ? cfg.bg : 'var(--surface)',
              border: `2px solid ${isCurrent ? cfg.color : isPopular ? cfg.color : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              position: 'relative',
              transition: 'all 0.15s'
            }}>
              {isPopular && !isCurrent && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: cfg.color, color: 'white', fontSize: 12, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 20
                }}>MOST POPULAR</div>
              )}

              {isCurrent && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: cfg.color, color: 'white', fontSize: 12, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 20
                }}>CURRENT PLAN</div>
              )}

              <div style={{ fontSize: 32, marginBottom: 12 }}>{planEmoji[plan.id]}</div>
              <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{plan.name}</p>

              <div style={{ marginBottom: 16 }}>
                {plan.price === 0 ? (
                  <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)' }}>Free</span>
                ) : (
                  <div>
                    <span style={{ fontSize: 36, fontWeight: 800, color: cfg.color }}>${plan.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/month</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: cfg.color }}>✓</span>
                  <span style={{ fontSize: 14 }}>
                    <strong>{plan.images === 'Unlimited' ? 'Unlimited' : plan.images}</strong> image ads/month
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: cfg.color }}>✓</span>
                  <span style={{ fontSize: 14 }}>AI copy generation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: cfg.color }}>✓</span>
                  <span style={{ fontSize: 14 }}>Background removal</span>
                </div>
                {plan.id !== 'free' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: cfg.color }}>✓</span>
                    <span style={{ fontSize: 14 }}>{plan.trialDays}-day free trial</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-dim)' }}>🔒</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Video ads <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, background: 'rgba(123,97,255,0.15)', color: 'var(--accent)' }}>Soon</span></span>
                </div>
              </div>

              <button
                className={`btn ${isCurrent || plan.id === 'free' ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || plan.id === 'free' || upgrading === plan.id}
                style={{ width: '100%', justifyContent: 'center', background: isCurrent ? 'transparent' : plan.id !== 'free' ? cfg.color : 'transparent' }}
              >
                {upgrading === plan.id
                  ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Processing...</>
                  : isCurrent ? 'Current plan'
                  : plan.id === 'free' ? 'Free forever'
                  : `Upgrade to ${plan.name}`}
              </button>
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, marginTop: 32 }}>
        All payments processed securely by Shopify. Cancel anytime from your Shopify admin.
      </p>
    </div>
  )
}
