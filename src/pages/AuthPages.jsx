import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Input, Btn } from '../components/UI'

export function LoginPage({ onNavigate }) {
  const { login, notify } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onNavigate('home')
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100svh', display:'grid', gridTemplateColumns:'1fr 1fr', paddingTop:'58px' }}>
      {/* Left visual */}
      <div style={{ background:'var(--ink2)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 40% 50%,rgba(194,48,16,0.2),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'52px', fontWeight:400, color:'var(--paper)', lineHeight:1, marginBottom:'1rem' }}>
            Welcome<br/><em style={{ color:'var(--gold2)' }}>back.</em>
          </div>
          <p style={{ fontSize:'15px', color:'rgba(253,250,245,0.35)', lineHeight:1.7, fontWeight:300 }}>Your events, your promoters,<br/>your community — all here.</p>
        </div>
      </div>

      {/* Right form */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div style={{ width:'100%', maxWidth:'380px' }}>
          <button onClick={() => onNavigate('home')} style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:700, color:'var(--ink)', background:'none', border:'none', cursor:'pointer', marginBottom:'2.5rem', display:'block' }}>
            Zwave<sup style={{ fontSize:'9px', color:'var(--gold)', fontFamily:'DM Sans', verticalAlign:'super' }}>®</sup>
          </button>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'0.5rem' }}>Log in</h1>
          <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'2rem', fontWeight:300 }}>
            Don't have an account? <button onClick={() => onNavigate('signup')} style={{ background:'none', border:'none', color:'var(--gold)', cursor:'pointer', fontFamily:'inherit', fontSize:'14px', fontWeight:500 }}>Sign up</button>
          </p>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required />
            <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
            {error && (
              <div style={{ background:'rgba(194,48,16,0.08)', border:'0.5px solid rgba(194,48,16,0.25)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'var(--ember)' }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ textAlign:'right' }}>
              <button type="button" style={{ background:'none', border:'none', fontSize:'13px', color:'var(--gold)', cursor:'pointer', fontFamily:'inherit' }}>Forgot password?</button>
            </div>
            <Btn variant="primary" size="lg" style={{ width:'100%', borderRadius:'12px', marginTop:'0.5rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Btn>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop:'1.75rem', padding:'1rem', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--warm)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Try a demo account</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {[['organizer@demo.com','Organizer view','📊'],['promoter@demo.com','Promoter view','🔗'],['fan@demo.com','Fan / attendee view','🎟']].map(([email, label, icon]) => (
                <button key={email} onClick={() => login(email, 'demo').then(() => onNavigate('dashboard'))}
                  style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'8px', padding:'9px 12px', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}
                >
                  <span style={{ fontSize:'18px' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:500, color:'var(--ink)' }}>{label}</div>
                    <div style={{ fontSize:'11px', color:'var(--warm)' }}>{email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SignupPage({ onNavigate, defaultRole }) {
  const { signup, notify } = useApp()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(defaultRole || '')
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !role) return
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    try {
      await signup({ ...form, role })
      onNavigate('dashboard')
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { id:'organizer', icon:'🎤', title:'Event Organizer', desc:'Create and manage events, sell tickets, build your audience.' },
    { id:'promoter', icon:'🔗', title:'Promoter', desc:'Share events, earn commissions on every ticket you sell.' },
    { id:'attendee', icon:'🎟', title:'Fan / Attendee', desc:'Discover events, buy tickets, see what friends are doing.' },
  ]

  return (
    <div style={{ minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'58px', padding:'4rem 1.5rem' }}>
      <div style={{ width:'100%', maxWidth:'480px' }}>
        <button onClick={() => onNavigate('home')} style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:700, color:'var(--ink)', background:'none', border:'none', cursor:'pointer', marginBottom:'2rem', display:'block' }}>
          Zwave<sup style={{ fontSize:'9px', color:'var(--gold)', fontFamily:'DM Sans', verticalAlign:'super' }}>®</sup>
        </button>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem' }}>
          {[1,2].map(s => (
            <div key={s} style={{ flex:1, height:'3px', borderRadius:'2px', background: s <= step ? 'var(--gold)' : 'var(--paper3)', transition:'background 0.3s' }}/>
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'0.5rem' }}>Join Zwave</h1>
            <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'2rem', fontWeight:300 }}>How do you want to use Zwave?</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'2rem' }}>
              {roles.map(r => (
                <div key={r.id} onClick={() => setRole(r.id)} style={{
                  display:'flex', gap:'1rem', alignItems:'flex-start',
                  padding:'1.1rem 1.25rem', borderRadius:'12px', cursor:'pointer',
                  border: `0.5px solid ${role===r.id ? 'var(--gold)' : 'var(--line)'}`,
                  background: role===r.id ? 'rgba(184,122,20,0.05)' : 'var(--paper2)',
                  transition:'all 0.15s'
                }}>
                  <span style={{ fontSize:'24px', marginTop:'2px' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', marginBottom:'3px' }}>{r.title}</div>
                    <div style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.45, fontWeight:300 }}>{r.desc}</div>
                  </div>
                  <div style={{ marginLeft:'auto', width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${role===r.id ? 'var(--gold)' : 'var(--line)'}`, background: role===r.id ? 'var(--gold)' : 'transparent', flexShrink:0, marginTop:'2px' }}/>
                </div>
              ))}
            </div>
            <Btn variant="primary" size="lg" style={{ width:'100%', borderRadius:'12px' }} disabled={!role} onClick={() => setStep(2)}>Continue →</Btn>
            <p style={{ fontSize:'13px', color:'var(--warm)', textAlign:'center', marginTop:'1.25rem' }}>
              Already have an account? <button onClick={() => onNavigate('login')} style={{ background:'none', border:'none', color:'var(--gold)', cursor:'pointer', fontFamily:'inherit', fontSize:'13px', fontWeight:500 }}>Log in</button>
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'0.5rem' }}>Create account</h1>
            <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'2rem', fontWeight:300 }}>Signing up as <strong style={{ color:'var(--gold)' }}>{roles.find(r=>r.id===role)?.title}</strong></p>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Input label="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required />
              <Input label="Email address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required />
              <Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min. 8 characters" required />
              {error && (
                <div style={{ background:'rgba(194,48,16,0.08)', border:'0.5px solid rgba(194,48,16,0.25)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'var(--ember)' }}>
                  ⚠️ {error}
                </div>
              )}
              <p style={{ fontSize:'11px', color:'var(--warm)', lineHeight:1.5 }}>By creating an account you agree to our <span style={{ color:'var(--gold)' }}>Terms of Service</span> and <span style={{ color:'var(--gold)' }}>Privacy Policy</span>.</p>
              <Btn variant="ember" size="lg" style={{ width:'100%', borderRadius:'12px', marginTop:'0.5rem' }} disabled={loading}>
                {loading ? 'Creating account…' : 'Create my account'}
              </Btn>
            </form>
            <button onClick={() => setStep(1)} style={{ background:'none', border:'none', fontSize:'13px', color:'var(--warm)', cursor:'pointer', fontFamily:'inherit', marginTop:'1rem', display:'block', textAlign:'center', width:'100%' }}>← Back</button>
          </>
        )}
      </div>
    </div>
  )
}
