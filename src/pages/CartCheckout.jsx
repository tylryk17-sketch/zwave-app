import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, Input } from '../components/UI'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ── QR CODE GENERATOR ──────────────────────────────────────
function QRCode({ data, size = 120 }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cells = 21
    const cell = size / cells
    let hash = 0
    for (let i = 0; i < data.length; i++) { hash = ((hash << 5) - hash) + data.charCodeAt(i); hash |= 0 }
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#0C0702'
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const inTopLeft = row < 9 && col < 9
        const inTopRight = row < 9 && col >= cells - 9
        const inBottomLeft = row >= cells - 9 && col < 9
        if (inTopLeft || inTopRight || inBottomLeft) {
          const isFinderBorder = (row === 0 || row === 6 || row === 7 || row === 8 || col === 0 || col === 6 || col === 7 || col === 8 || row === cells-1 || row === cells-7 || row === cells-8 || row === cells-9 || col === cells-1 || col === cells-7 || col === cells-8 || col === cells-9)
          const isFinderInner = (row >= 2 && row <= 4 && col >= 2 && col <= 4) || (row >= 2 && row <= 4 && col >= cells-5 && col <= cells-3) || (row >= cells-5 && row <= cells-3 && col >= 2 && col <= 4)
          if (isFinderBorder || isFinderInner) ctx.fillRect(col * cell, row * cell, cell - 0.5, cell - 0.5)
          continue
        }
        const seed = (hash * (row * cells + col + 1)) ^ (hash >> (col % 16))
        if (((seed ^ (row * 37)) ^ (col * 53)) % 3 !== 0) ctx.fillRect(col * cell, row * cell, cell - 0.5, cell - 0.5)
      }
    }
  }, [data, size])
  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius:'4px', display:'block' }} />
}

// ── TICKET CARD ──────────────────────────────────────────────
function TicketCard({ ticket }) {
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 1000)
    alert(`Ticket: ${ticket.eventTitle}\nTier: ${ticket.tierName}\nHolder: ${ticket.holderName}\nConfirmation: ${ticket.confirmationCode}\n\nIn production this downloads a PDF ticket.`)
  }
  const handleCopy = () => {
    navigator.clipboard?.writeText(ticket.confirmationCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 8px 32px rgba(12,7,2,0.08)' }}>
      <div style={{ background:'linear-gradient(135deg,#2C1508,#0C0702)', padding:'1.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(194,48,16,0.2),transparent 60%)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'6px' }}>Zwave® Ticket</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, color:'var(--paper)', lineHeight:1.2, marginBottom:'4px' }}>{ticket.eventTitle}</h3>
          <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.5)' }}>{ticket.eventDate}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', margin:'0 1.5rem', position:'relative' }}>
        <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'var(--paper2)', position:'absolute', left:'-30px', border:'0.5px solid var(--line)' }}/>
        <div style={{ flex:1, borderTop:'1.5px dashed var(--line)', margin:'0' }}/>
        <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'var(--paper2)', position:'absolute', right:'-30px', border:'0.5px solid var(--line)' }}/>
      </div>
      <div style={{ padding:'1.25rem 1.5rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'1rem', alignItems:'center' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {[['Ticket type',ticket.tierName],['Holder',ticket.holderName],['Venue',ticket.venue],['Confirmation',ticket.confirmationCode]].map(([label,val]) => (
            <div key={label}>
              <div style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--warm)', marginBottom:'1px' }}>{label}</div>
              <div style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)', fontFamily:label==='Confirmation'?'monospace':'inherit' }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
          <div style={{ padding:'8px', background:'#fff', borderRadius:'10px', border:'0.5px solid var(--line)' }}>
            <QRCode data={`${ticket.confirmationCode}-${ticket.eventTitle}-${ticket.tierName}`} size={100} />
          </div>
          <div style={{ fontSize:'9px', color:'var(--warm)', letterSpacing:'0.06em', textAlign:'center' }}>Scan at entry</div>
        </div>
      </div>
      <div style={{ padding:'0 1.5rem 1.25rem', display:'flex', gap:'0.5rem' }}>
        <button onClick={handleDownload} style={{ flex:1, background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'10px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'opacity 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.opacity='0.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >{downloading?'⬇️ Downloading…':'⬇️ Download ticket'}</button>
        <button onClick={handleCopy} style={{ background: copied?'rgba(45,158,95,0.1)':'var(--paper2)', color: copied?'var(--green)':'var(--ink)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'10px 14px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
          {copied?'✓':'📋'}
        </button>
      </div>
    </div>
  )
}

// ── CART PAGE ────────────────────────────────────────────────
export function CartPage({ onNavigate }) {
  const { cart, removeFromCart, cartTotal, user } = useApp()
  if (cart.length === 0) return (
    <div style={{ paddingTop:'58px', minHeight:'60svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', padding:'8rem 2rem' }}>
      <div style={{ fontSize:'48px' }}>🎟</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400 }}>Your cart is empty</h2>
      <p style={{ fontSize:'14px', color:'var(--warm)' }}>Find an event you love and grab your tickets.</p>
      <Btn variant="primary" onClick={() => onNavigate('discover')}>Browse events</Btn>
    </div>
  )
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)', padding:'3rem 1.75rem' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'2rem' }}>Your cart</h1>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {cart.map((item,i) => (
              <div key={i} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem', display:'flex', gap:'1rem', alignItems:'center' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'10px', background:'linear-gradient(135deg,var(--ink),var(--ink2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🎟</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'15px', fontWeight:500, color:'var(--ink)' }}>{item.eventTitle}</div>
                  <div style={{ fontSize:'12px', color:'var(--warm)', marginTop:'2px' }}>{item.tierName} · {item.eventDate}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'16px', fontWeight:600, color:'var(--ink)' }}>${item.price*item.qty}</div>
                  <div style={{ fontSize:'12px', color:'var(--warm)' }}>×{item.qty}</div>
                </div>
                <button onClick={() => removeFromCart(item.eventId,item.tierName)} style={{ background:'none', border:'none', fontSize:'18px', cursor:'pointer', color:'var(--warm)', padding:'4px', opacity:0.5 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem', position:'sticky', top:'78px' }}>
            <h3 style={{ fontSize:'16px', fontWeight:500, marginBottom:'1.25rem' }}>Order summary</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1rem' }}>
              {cart.map((item,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px' }}>
                  <span style={{ color:'var(--warm)' }}>{item.tierName} ×{item.qty}</span>
                  <span style={{ fontWeight:500 }}>${item.price*item.qty}</span>
                </div>
              ))}
            </div>
            <div style={{ height:'0.5px', background:'var(--line)', marginBottom:'0.75rem' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'16px', fontWeight:600, marginBottom:'1.5rem' }}>
              <span>Total</span><span>${cartTotal}</span>
            </div>
            <Btn variant="ember" size="lg" style={{ width:'100%', borderRadius:'12px' }} onClick={() => { if(!user){onNavigate('login');return} onNavigate('checkout') }}>
              {user?'Proceed to Checkout':'Sign in to Checkout'}
            </Btn>
            <p style={{ fontSize:'11px', color:'var(--warm)', textAlign:'center', marginTop:'0.75rem' }}>🔒 Powered by Stripe · 100% secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CHECKOUT PAGE ────────────────────────────────────────────
export function CheckoutPage({ onNavigate }) {
  const { cart, cartTotal, clearCart, user, notify } = useApp()
  const [form, setForm] = useState({ email:user?.email||'', name:user?.name||'' })
  const [processing, setProcessing] = useState(false)
  const [tickets, setTickets] = useState([])
  const [step, setStep] = useState(1)
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const confirmRef = useRef(`ZW${Math.random().toString(36).slice(2,8).toUpperCase()}`)

  const update = (field) => (e) => setForm({...form,[field]:e.target.value})

  // Format card number
  const formatCard = (val) => val.replace(/\s/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)
  const formatExpiry = (val) => { const v = val.replace(/\D/g,''); return v.length>=2?v.slice(0,2)+'/'+v.slice(2,4):v }

  const handlePay = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !cardNum || !expiry || !cvv) { notify('Please fill in all fields', 'error'); return }
    setProcessing(true)

    // In production: create PaymentIntent on server, confirm with Stripe.js
    // For now simulate a successful payment
    setTimeout(() => {
      const generated = []
      cart.forEach(item => {
        for (let i = 0; i < item.qty; i++) {
          generated.push({
            id: `${confirmRef.current}-${item.eventId}-${i}`,
            eventTitle: item.eventTitle,
            eventDate: item.eventDate,
            tierName: item.tierName,
            holderName: form.name,
            venue: 'See event details',
            confirmationCode: `ZW${Math.random().toString(36).slice(2,8).toUpperCase()}`,
            price: item.price,
          })
        }
      })
      setTickets(generated)
      clearCart()
      setProcessing(false)
      setStep(3)
      notify('Payment successful! 🎉', 'success')
    }, 2000)
  }

  // ── SUCCESS + QR TICKETS ──
  if (step === 3) return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)', padding:'3rem 1.75rem' }}>
      <div style={{ maxWidth:'760px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:'64px', marginBottom:'1rem' }}>🎉</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,5vw,56px)', fontWeight:400, marginBottom:'0.75rem' }}>
            You're <em style={{ color:'var(--gold)' }}>in!</em>
          </h1>
          <p style={{ fontSize:'15px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, marginBottom:'0.5rem' }}>
            Tickets confirmed and sent to <strong style={{ color:'var(--ink)' }}>{form.email}</strong>
          </p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(45,158,95,0.08)', border:'0.5px solid rgba(45,158,95,0.2)', borderRadius:'100px', padding:'6px 16px', fontSize:'12px', fontWeight:500, color:'var(--green)' }}>
            ✓ Order #{confirmRef.current} · ${tickets.reduce((s,t)=>s+t.price,0)}
          </div>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'1.25rem' }}>
          Your ticket{tickets.length>1?'s':''} — {tickets.length} issued
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem', marginBottom:'2rem' }}>
          {tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
        </div>
        <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem', marginBottom:'2rem' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'0.75rem' }}>📱 How to use your ticket</div>
          {['Your QR code is your entry pass — screenshot it or download the ticket','Show the QR code at the door to be scanned by the organizer','Each QR code is unique and can only be scanned once','Your tickets are also saved in your Zwave dashboard'].map((tip,i) => (
            <div key={i} style={{ display:'flex', gap:'8px', fontSize:'13px', color:'var(--warm)', lineHeight:1.5, marginBottom:'0.4rem' }}>
              <span style={{ color:'var(--gold)', fontWeight:700, flexShrink:0 }}>{i+1}.</span>{tip}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Btn variant="primary" onClick={() => onNavigate('home')}>Browse more events</Btn>
          <Btn variant="outline" onClick={() => onNavigate('dashboard')}>View my tickets</Btn>
        </div>
      </div>
    </div>
  )

  // ── CHECKOUT FORM ──
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)', padding:'3rem 1.75rem' }}>
      <div style={{ maxWidth:'800px', margin:'0 auto' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'0.5rem' }}>Checkout</h1>
        <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'2rem' }}>Complete your order below.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2rem', alignItems:'start' }}>
          <form onSubmit={handlePay} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {/* Contact */}
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
              <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'1rem' }}>Contact information</h3>
              <div style={{ display:'grid', gap:'0.75rem' }}>
                <Input label="Full name" value={form.name} onChange={update('name')} placeholder="Your full name" required />
                <Input label="Email" type="email" value={form.email} onChange={update('email')} placeholder="your@email.com" required />
              </div>
            </div>

            {/* Payment */}
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <h3 style={{ fontSize:'15px', fontWeight:500 }}>Payment details</h3>
                <div style={{ display:'flex', gap:'4px' }}>
                  {['VISA','MC','AMEX'].map(c => <span key={c} style={{ fontSize:'10px', fontWeight:700, background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'4px', padding:'2px 6px', color:'var(--warm)' }}>{c}</span>)}
                </div>
              </div>
              <div style={{ display:'grid', gap:'0.75rem' }}>
                <div>
                  <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px', letterSpacing:'0.04em' }}>Card number</label>
                  <input value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} required
                    style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'monospace', outline:'none' }}
                    onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px', letterSpacing:'0.04em' }}>Expiry</label>
                    <input value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} required
                      style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'monospace', outline:'none' }}
                      onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px', letterSpacing:'0.04em' }}>CVV</label>
                    <input value={cvv} onChange={e=>setCvv(e.target.value.slice(0,4))} placeholder="123" maxLength={4} required
                      style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'monospace', outline:'none' }}
                      onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop:'1rem', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--warm)' }}>
                🔒 Secured by <strong>Stripe</strong> — your card details are encrypted and never stored on our servers
              </div>
            </div>

            <button type="submit" disabled={processing} style={{
              background: processing?'var(--warm)':'var(--ember)', color:'#fff', border:'none',
              borderRadius:'100px', padding:'15px', fontSize:'15px', fontWeight:600,
              cursor: processing?'not-allowed':'pointer', fontFamily:'inherit', transition:'all 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
            }}>
              {processing ? (
                <><div style={{ width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/> Processing…</>
              ) : `Pay $${cartTotal} securely`}
            </button>
          </form>

          {/* Summary */}
          <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem', position:'sticky', top:'78px' }}>
            <h3 style={{ fontSize:'14px', fontWeight:500, marginBottom:'1rem' }}>Order summary</h3>
            {cart.map((item,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'0.5rem' }}>
                <span style={{ color:'var(--warm)' }}>{item.tierName} ×{item.qty}</span>
                <span style={{ fontWeight:500 }}>${item.price*item.qty}</span>
              </div>
            ))}
            <div style={{ height:'0.5px', background:'var(--line)', margin:'0.75rem 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'16px', fontWeight:600, marginBottom:'1rem' }}>
              <span>Total</span><span>${cartTotal}</span>
            </div>
            <div style={{ padding:'0.75rem', background:'rgba(184,122,20,0.06)', border:'0.5px solid rgba(184,122,20,0.15)', borderRadius:'8px', fontSize:'12px', color:'var(--warm)', lineHeight:1.5 }}>
              🎟 After payment you'll receive <strong style={{ color:'var(--ink)' }}>QR code tickets</strong> instantly — one per ticket purchased.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
