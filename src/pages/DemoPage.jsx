import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn } from '../components/UI'

const FEATURES = [
  { icon:'🎟', title:'Sell out faster', desc:'Built-in promoter network drives ticket sales automatically' },
  { icon:'🤖', title:'AI marketing', desc:'Generate flyers, captions, emails and SMS in seconds' },
  { icon:'💰', title:'Instant payouts', desc:'Get your money in seconds after every ticket sale' },
  { icon:'📊', title:'Deep analytics', desc:'Real-time insights on every aspect of your event' },
  { icon:'🔗', title:'Referral system', desc:'Turn your audience into a sales force with unique links' },
  { icon:'📱', title:'Mobile scanning', desc:'Scan tickets at the door from your phone' },
]

export default function DemoPage({ onNavigate }) {
  const { notify } = useApp()
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', events:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const update = f => e => setForm({ ...form, [f]: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setLoading(true)
    setTimeout(() => { setSubmitted(true); setLoading(false); notify("Demo request received! We'll be in touch within 24 hours. 🎉", 'success') }, 1000)
  }
  return (
    <div style={{ paddingTop:'58px' }}>
      <section style={{ background:'var(--ink)', padding:'5rem 1.75rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 40% 50%,rgba(194,48,16,0.2),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.75rem' }}>Book a Demo</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,5vw,64px)', fontWeight:400, lineHeight:1, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>See Zwave<br/><em style={{ color:'var(--gold2)' }}>in action.</em></h1>
            <p style={{ fontSize:'16px', color:'rgba(253,250,245,0.4)', lineHeight:1.7, fontWeight:300, marginBottom:'2rem' }}>Get a personalized walkthrough. We will show you how to create events, activate your promoter network, and start earning in under 30 minutes.</p>
            {['Free 30-minute walkthrough','Personalized to your event type','No commitment required','Get your questions answered live'].map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'rgba(253,250,245,0.6)', marginBottom:'0.6rem' }}>
                <span style={{ color:'var(--gold2)', fontWeight:700 }}>✓</span>{item}
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1px', background:'rgba(253,250,245,0.07)', borderRadius:'14px', overflow:'hidden', marginTop:'2rem' }}>
              {[['2,400+','Organizers'],['$2M+','Ticket sales'],['4.9★','Avg rating']].map(([val, label]) => (
                <div key={label} style={{ background:'rgba(253,250,245,0.03)', padding:'1.1rem', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', color:'var(--gold2)', fontWeight:400 }}>{val}</div>
                  <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.3)', marginTop:'2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'var(--paper)', borderRadius:'20px', padding:'2rem', boxShadow:'0 40px 80px rgba(0,0,0,0.3)' }}>
            {submitted ? (
              <div style={{ textAlign:'center', padding:'2rem 0' }}>
                <div style={{ fontSize:'56px', marginBottom:'1rem' }}>🎉</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, marginBottom:'0.75rem' }}>Request <em style={{ color:'var(--gold)' }}>received!</em></h2>
                <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.7, marginBottom:'1.5rem' }}>We will reach out to <strong>{form.email}</strong> within 24 hours.</p>
                <Btn variant="primary" onClick={() => onNavigate('home')}>Back to home</Btn>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.25rem' }}>Book your demo</h2>
                <p style={{ fontSize:'13px', color:'var(--warm)', marginBottom:'1.5rem', fontWeight:300 }}>Takes 2 minutes. No commitment.</p>
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                    <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" required style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                    <input type="email" value={form.email} onChange={update('email')} placeholder="Email address" required style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  </div>
                  <input type="tel" value={form.phone} onChange={update('phone')} placeholder="Phone number (optional)" style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  <input type="text" value={form.company} onChange={update('company')} placeholder="Organization / company name" style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  <select value={form.events} onChange={update('events')} style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:form.events?'var(--ink)':'var(--warm)', fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
                    <option value="">How many events per year?</option>
                    <option>1-5 events</option><option>6-20 events</option><option>21-50 events</option><option>50+ events</option><option>Just starting out</option>
                  </select>
                  <textarea value={form.message} onChange={update('message')} placeholder="Tell us about your events (optional)" rows={3} style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none', resize:'vertical' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  <button type="submit" disabled={loading} style={{ width:'100%', background:'var(--ember)', color:'#fff', border:'none', borderRadius:'100px', padding:'14px', fontSize:'14px', fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', opacity:loading?0.7:1 }}>
                    {loading ? 'Submitting...' : 'Book my free demo →'}
                  </button>
                  <p style={{ fontSize:'11px', color:'var(--warm)', textAlign:'center' }}>No spam. No commitment. Just a conversation.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <section style={{ padding:'5rem 1.75rem', background:'var(--paper2)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>What you will see</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:400, letterSpacing:'-0.02em' }}>Everything you need to <em style={{ color:'var(--gold)' }}>scale.</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.75rem', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(12,7,2,0.08)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}
              >
                <div style={{ fontSize:'28px', marginBottom:'0.85rem' }}>{f.icon}</div>
                <div style={{ fontSize:'15px', fontWeight:500, color:'var(--ink)', marginBottom:'0.4rem' }}>{f.title}</div>
                <div style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.6, fontWeight:300 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding:'5rem 1.75rem', background:'var(--ink)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 60% at 50% 50%,rgba(194,48,16,0.18),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'540px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,5vw,64px)', fontWeight:400, lineHeight:0.95, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>Ready to <em style={{ color:'var(--gold2)' }}>scale?</em></h2>
          <p style={{ fontSize:'15px', color:'rgba(253,250,245,0.35)', marginBottom:'2rem', fontWeight:300 }}>Book your free demo today. No commitment, no credit card.</p>
          <Btn variant="ember" size="lg" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>Book my free demo →</Btn>
        </div>
      </section>
    </div>
  )
}
