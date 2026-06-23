import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onComplete, 600)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: hiding ? 0 : 1,
      transition: 'opacity 0.6s ease',
      overflow: 'hidden'
    }}>
      {/* Purple glow behind image */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -60%)',
        pointerEvents: 'none'
      }} />

      {/* The splash image you provided */}
      <img
        src="/splash.jpeg"
        alt="MeshClip"
        style={{
          width: 280,
          objectFit: 'contain',
          animation: 'mcLogoIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
          filter: 'drop-shadow(0 12px 40px rgba(123,97,255,0.35))'
        }}
      />

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: 6, marginTop: 48,
        animation: 'mcFadeUp 0.4s ease 1.2s both'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(123,97,255,0.5)',
            animation: `mcDot 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      {/* Developed by MeshCode typewriter */}
      <div style={{
        position: 'absolute', bottom: 40,
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: 14, color: 'rgba(0,0,0,0.35)', letterSpacing: 0.5,
        overflow: 'hidden', whiteSpace: 'nowrap',
        borderRight: '2px solid rgba(123,97,255,0.6)',
        animation: 'mcType 1.8s steps(20,end) 1.6s both, mcBlink 0.75s step-end 3.4s 4'
      }}>
        Developed by MeshCode
      </div>

      <style>{`
        @keyframes mcLogoIn {
          from { opacity: 0; transform: scale(0.82); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mcFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mcDot {
          0%,100% { opacity:0.3; transform:scale(0.8); background:rgba(123,97,255,0.5); }
          50% { opacity:1; transform:scale(1); background:#7B61FF; }
        }
        @keyframes mcType { from{width:0} to{width:172px} }
        @keyframes mcBlink {
          from,to{border-color:transparent}
          50%{border-color:rgba(123,97,255,0.6)}
        }
      `}</style>
    </div>
  )
}
