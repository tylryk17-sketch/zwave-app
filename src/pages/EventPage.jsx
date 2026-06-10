import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Btn } from '../components/UI'

// ── COUNTDOWN HOOK ──────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(t)
  }, [targetDate])
  return time
}

export default function EventPage({ eventId, onNavigate }) {
  const { events, addToCart, user, following, toggleFollow, getFriendsGoing, chats, sendChatMessage, likeMessage, reviews, addReview, referralLinks, generateReferralLink, notify } = useApp()
  const event = events.find(e => e.id === eventId) || events[0]
  const [selectedTier, setSelectedTier] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('about')
  const [chatMsg, setChatMsg] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating:5, text:'' })
  const [copiedLink, setCopiedLink] = useState(false)
  const [notifyForm, setNotifyForm] = useState({ name:'', contact:'', type:'email' })
  const [notifyDone, setNotifyDone] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)
  const [waitlistDone, setWaitlistDone] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [giftMode, setGiftMode] = useState(false)
  const [giftForm, setGiftForm] = useState({ recipientName:'', recipientEmail:'', message:'' })
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Countdown — set event date ~2 months from now for demo
  const eventTarget = new Date()
  eventTarget.setDate(eventTarget.getDate() + 58)
  const countdown = useCountdown(eventTarget.toISOString())

  if (!event) return <div style={{ padding:'8rem 2rem', textAlign:'center' }}>Event not found.</div>

  const pct = Math.round((event.sold / event.capacity) * 100)
  const isSoldOut = pct >= 100
  const isFollowing = following.includes(event.organizer)
  const friendsGoing = getFriendsGoing(event.id)
  const eventChats = chats[event.id] || []
  const eventReviews = reviews[event.id] || []
  const avgRating = eventReviews.length ? (eventReviews.reduce((s,r) => s+r.rating,0)/eventReviews.length).toFixed(1) : null
  const myReferral = referralLinks[event.id]
  const eventUrl = `https://zwave.app/e/${event.id}`
  const vibeColor = event.vibe >= 9.5 ? '#E84820' : event.vibe >= 9 ? 'var(--gold2)' : '#5DD07A'

  const handleSendChat = (e) => { e.preventDefault(); if(!chatMsg.trim()) return; sendChatMessage(event.id, chatMsg); setChatMsg('') }
  const handleNotifyMe = (e) => { e.preventDefault(); if(!notifyForm.contact.trim()||!notifyForm.name.trim()) return; setNotifyDone(true); notify(`You're on the list! 🎉`, 'success') }
  const handleRSVP = () => { setRsvpDone(true); notify(`RSVP confirmed! 🎉`, 'success') }
  const handleWaitlist = (e) => { e.preventDefault(); if(!waitlistEmail) return; setWaitlistDone(true); notify(`You're on the waitlist! We'll notify you if spots open up.`, 'success') }
  const handleCopyLink = () => { navigator.clipboard?.writeText(eventUrl).catch(()=>{}); setCopiedLink(true); setTimeout(()=>setCopiedLink(false),2000) }
  const handleCopyShareLink = () => { navigator.clipboard?.writeText(eventUrl).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  const handleGiftAdd = () => {
    if(!giftForm.recipientName||!giftForm.recipientEmail) return
    addToCart(event, {...event.tiers[selectedTier], name:`${event.tiers[selectedTier].name} (Gift → ${giftForm.recipientName})`})
    notify(`Gift ticket added to cart for ${giftForm.recipientName}! 🎁`, 'success')
    onNavigate('cart')
  }

  const SHARE_OPTIONS = [
    { label:'Copy link', icon:'🔗', action: handleCopyShareLink },
    { label:'WhatsApp', icon:'💬', action: () => window.open(`https://wa.me/?text=Check out this event: ${event.title} ${eventUrl}`) },
    { label:'Twitter / X', icon:'🐦', action: () => window.open(`https://twitter.com/intent/tweet?text=Check out ${event.title} on Zwave&url=${eventUrl}`) },
    { label:'Instagram', icon:'📸', action: () => { handleCopyShareLink(); notify('Link copied! Paste it in your Instagram bio or story.', 'success') } },
    { label:'Email', icon:'📧', action: () => window.open(`mailto:?subject=Check out this event&body=I thought you'd like this: ${event.title} - ${eventUrl}`) },
  ]

  const TABS = ['about', 'notify me', 'chat', 'reviews', 'promoter']

  return (
    <div style={{ paddingTop:'58px' }}>
      {/* Hero */}
      <div style={{ height:'400px', background:`linear-gradient(160deg,${event.color1},${event.color2})`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(12,7,2,0.9) 0%,rgba(12,7,2,0.15) 60%)' }}/>
        <div style={{ position:'absolute', bottom:'2.5rem', left:'2rem', right:'2rem', zIndex:1 }}>
          <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem', flexWrap:'wrap' }}>
            {event.tags.map(t => <span key={t} style={{ background:'rgba(253,250,245,0.1)', border:'0.5px solid rgba(253,250,245,0.15)', borderRadius:'100px', padding:'4px 12px', fontSize:'11px', color:'rgba(253,250,245,0.7)' }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,5vw,52px)', fontWeight:400, color:'var(--paper)', lineHeight:1.1, marginBottom:'0.5rem' }}>{event.title}</h1>
          <div style={{ fontSize:'14px', color:'rgba(253,250,245,0.55)', display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
            <span>📅 {event.date}</span>
            <span>·</span>
            <span>📍 {event.venue}, {event.city}</span>
            {/* Share button */}
            <button onClick={() => setShareOpen(!shareOpen)} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px', background:'rgba(253,250,245,0.1)', border:'0.5px solid rgba(253,250,245,0.2)', borderRadius:'100px', padding:'6px 14px', fontSize:'12px', color:'rgba(253,250,245,0.7)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(253,250,245,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(253,250,245,0.1)'}
            >
              📤 Share event
            </button>
          </div>
        </div>

        {/* Share dropdown */}
        {shareOpen && (
          <div style={{ position:'absolute', bottom:'5rem', right:'2rem', background:'var(--paper)', borderRadius:'14px', boxShadow:'0 16px 48px rgba(12,7,2,0.25)', overflow:'hidden', zIndex:10, minWidth:'200px', animation:'fadeUp 0.2s ease' }}>
            {SHARE_OPTIONS.map(opt => (
              <button key={opt.label} onClick={() => { opt.action(); setShareOpen(false) }} style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', background:'none', border:'none', borderBottom:'0.5px solid var(--line)', padding:'11px 16px', fontSize:'13px', color:'var(--ink)', cursor:'pointer', fontFamily:'inherit', transition:'background 0.15s', textAlign:'left' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--paper2)'}
                onMouseLeave={e => e.currentTarget.style.background='none'}
              >
                <span style={{ fontSize:'16px' }}>{opt.icon}</span>
                {opt.label === 'Copy link' && copied ? '✓ Copied!' : opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Vibe score */}
        <div style={{ position:'absolute', top:'1.5rem', right:'2rem', background:'rgba(12,7,2,0.7)', backdropFilter:'blur(12px)', border:`1px solid ${vibeColor}`, borderRadius:'12px', padding:'0.6rem 1rem', textAlign:'center' }}>
          <div style={{ fontSize:'9px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(253,250,245,0.4)', marginBottom:'2px' }}>Vibe Score™</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, color:vibeColor, lineHeight:1 }}>{event.vibe}</div>
          <div style={{ fontSize:'9px', color:'rgba(253,250,245,0.3)', marginTop:'2px' }}>out of 10</div>
        </div>

        {/* Friends going */}
        {friendsGoing.length > 0 && (
          <div style={{ position:'absolute', top:'1.5rem', left:'2rem', display:'flex', alignItems:'center', gap:'8px', background:'rgba(12,7,2,0.5)', backdropFilter:'blur(8px)', border:'0.5px solid rgba(253,250,245,0.1)', borderRadius:'100px', padding:'6px 14px' }}>
            <div style={{ display:'flex' }}>
              {friendsGoing.slice(0,3).map((f,i) => (
                <div key={f.id} style={{ width:'22px', height:'22px', borderRadius:'50%', background:f.avatar, border:'2px solid rgba(12,7,2,0.8)', marginLeft:i===0?0:'-6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:600, color:'#fff' }}>{f.name.charAt(0)}</div>
              ))}
            </div>
            <span style={{ fontSize:'12px', color:'rgba(253,250,245,0.7)' }}>{friendsGoing.length === 1 ? friendsGoing[0].name.split(' ')[0] : `${friendsGoing[0].name.split(' ')[0]} +${friendsGoing.length-1}`} going</span>
          </div>
        )}
      </div>

      {/* COUNTDOWN BANNER */}
      <div style={{ background:'var(--ink)', padding:'1rem 1.75rem', borderBottom:'0.5px solid rgba(253,250,245,0.07)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.4)', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>Event starts in</div>
          <div style={{ display:'flex', gap:'1rem' }}>
            {[['Days', countdown.days],['Hours', countdown.hours],['Mins', countdown.minutes],['Secs', countdown.seconds]].map(([label, val]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, color:'var(--gold2)', lineHeight:1, minWidth:'48px' }}>{String(val).padStart(2,'0')}</div>
                <div style={{ fontSize:'10px', color:'rgba(253,250,245,0.3)', marginTop:'2px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.4)' }}>{event.sold} people going · {event.capacity - event.sold} spots left</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.75rem', display:'grid', gridTemplateColumns:'1fr 360px', gap:'3rem', alignItems:'start' }}>
        {/* Left */}
        <div>
          {/* Organizer */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.1rem 1.25rem', background:'var(--paper2)', borderRadius:'12px', marginBottom:'1.5rem', border:'0.5px solid var(--line)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', cursor:'pointer' }} onClick={() => onNavigate('organizer', event.organizer)}>
              <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'linear-gradient(135deg,var(--ember),var(--gold2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>🎤</div>
              <div>
                <div style={{ fontSize:'10px', color:'var(--warm)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500, marginBottom:'1px' }}>Organized by</div>
                <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)' }}>{event.organizer}</div>
              </div>
            </div>
            <Btn variant={isFollowing ? 'outline' : 'primary'} size="sm" onClick={() => toggleFollow(event.organizer)}>
              {isFollowing ? '✓ Following' : '+ Follow'}
            </Btn>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--line)', marginBottom:'1.5rem', overflowX:'auto', scrollbarWidth:'none' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background:'none', border:'none', borderBottom: activeTab===tab ? '2px solid var(--gold)' : '2px solid transparent',
                padding:'0.75rem 1rem', fontSize:'13px', fontWeight: activeTab===tab ? 500 : 400,
                color: activeTab===tab ? 'var(--ink)' : 'var(--warm)', cursor:'pointer', fontFamily:'inherit',
                transition:'all 0.15s', whiteSpace:'nowrap'
              }}>
                {tab==='chat' ? `💬 Chat${eventChats.length>0?` (${eventChats.length})`:''}`
                : tab==='reviews' ? `⭐ Reviews${eventReviews.length>0?` (${eventReviews.length})`:''}`
                : tab==='promoter' ? '🔗 Promote'
                : tab==='notify me' ? '🔔 Notify Me'
                : '📄 About'}
              </button>
            ))}
          </div>

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div>
              <p style={{ fontSize:'15px', color:'var(--warm)', lineHeight:1.75, fontWeight:300, marginBottom:'1.5rem' }}>{event.description}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
                {[['🎟',`${event.sold.toLocaleString()}`,'tickets sold'],['📊',`${pct}%`,'capacity'],['✨',`${event.vibe}/10`,'vibe score']].map(([icon,val,label]) => (
                  <div key={label} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
                    <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
                    <div style={{ fontSize:'18px', fontWeight:600, color:'var(--ink)', marginBottom:'2px' }}>{val}</div>
                    <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem', marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'0.75rem' }}>
                  <span style={{ fontWeight:500 }}>Ticket availability</span>
                  <span style={{ color: pct>85 ? 'var(--ember)' : pct>60 ? 'var(--gold)' : 'var(--green)' }}>{pct>85 ? '🔥 Selling fast' : pct>60 ? '⚡ Moving quick' : '✅ Available'}</span>
                </div>
                <div style={{ height:'6px', background:'var(--paper3)', borderRadius:'3px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--ember),var(--gold2))', borderRadius:'3px' }}/>
                </div>
                <div style={{ fontSize:'12px', color:'var(--warm)', marginTop:'6px' }}>{event.sold.toLocaleString()} of {event.capacity.toLocaleString()} tickets sold</div>
              </div>
              {friendsGoing.length > 0 && (
                <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                  <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', marginBottom:'1rem' }}>👥 Friends attending</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
                    {friendsGoing.map(f => (
                      <div key={f.id} style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'5px 12px 5px 5px' }}>
                        <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:f.avatar, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color:'#fff' }}>{f.name.charAt(0)}</div>
                        <span style={{ fontSize:'13px', color:'var(--ink)' }}>{f.name}</span>
                      </div>
                    ))}
                    <div style={{ display:'flex', alignItems:'center', fontSize:'13px', color:'var(--warm)' }}>+{event.sold-friendsGoing.length} others</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NOTIFY ME TAB */}
          {activeTab === 'notify me' && (
            <div>
              <div style={{ background:'linear-gradient(135deg,var(--ink2),#1A0F04)', border:'0.5px solid rgba(253,250,245,0.08)', borderRadius:'16px', padding:'1.75rem', marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.4rem' }}>Free Admission</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, color:'var(--paper)', marginBottom:'0.4rem' }}>RSVP — I'm going for free</h3>
                    <p style={{ fontSize:'13px', color:'rgba(253,250,245,0.4)', lineHeight:1.55, fontWeight:300 }}>Let the organizer know you're coming. They'll be able to reach you about future events.</p>
                  </div>
                  {rsvpDone ? (
                    <div style={{ background:'rgba(93,208,122,0.12)', border:'0.5px solid rgba(93,208,122,0.25)', borderRadius:'100px', padding:'8px 18px', fontSize:'13px', fontWeight:500, color:'#5DD07A', whiteSpace:'nowrap' }}>✓ RSVP confirmed</div>
                  ) : (
                    <button onClick={handleRSVP} style={{ background:'var(--paper)', color:'var(--ink)', border:'none', borderRadius:'100px', padding:'10px 22px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>RSVP — it's free</button>
                  )}
                </div>
              </div>
              <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ padding:'1.5rem', borderBottom:'0.5px solid var(--line)', background:'var(--paper2)' }}>
                  <h3 style={{ fontSize:'16px', fontWeight:500, marginBottom:'4px' }}>🔔 Stay in the loop</h3>
                  <p style={{ fontSize:'13px', color:'var(--warm)', fontWeight:300, lineHeight:1.55 }}>Not buying a ticket right now? Drop your info and <strong style={{ color:'var(--ink)', fontWeight:500 }}>{event.organizer}</strong> will notify you about ticket drops and future events.</p>
                </div>
                {notifyDone ? (
                  <div style={{ padding:'2.5rem', textAlign:'center' }}>
                    <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🎉</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.5rem' }}>You're on the list!</h3>
                    <p style={{ fontSize:'14px', color:'var(--warm)', fontWeight:300 }}>{event.organizer} will reach out when tickets drop or details update.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNotifyMe} style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                      {[['email','📧 Email'],['phone','📱 Phone / SMS']].map(([type,label]) => (
                        <button key={type} type="button" onClick={() => setNotifyForm(f=>({...f,type,contact:''}))} style={{ padding:'10px', borderRadius:'10px', border:`0.5px solid ${notifyForm.type===type?'var(--gold)':'var(--line)'}`, background:notifyForm.type===type?'rgba(184,122,20,0.06)':'var(--paper2)', fontSize:'13px', fontWeight:notifyForm.type===type?500:400, color:notifyForm.type===type?'var(--gold)':'var(--warm)', cursor:'pointer', fontFamily:'inherit' }}>{label}</button>
                      ))}
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px' }}>Your name</label>
                      <input value={notifyForm.name} onChange={e=>setNotifyForm(f=>({...f,name:e.target.value}))} placeholder="First name" required style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                    </div>
                    <div>
                      <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px' }}>{notifyForm.type==='email'?'Email address':'Phone number'}</label>
                      <input type={notifyForm.type==='email'?'email':'tel'} value={notifyForm.contact} onChange={e=>setNotifyForm(f=>({...f,contact:e.target.value}))} placeholder={notifyForm.type==='email'?'your@email.com':'+1 (555) 000-0000'} required style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                    </div>
                    <p style={{ fontSize:'11px', color:'var(--warm)', lineHeight:1.5 }}>🔒 Your info is only shared with <strong style={{ color:'var(--ink)' }}>{event.organizer}</strong>. Unsubscribe anytime.</p>
                    <button type="submit" style={{ width:'100%', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'13px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>{notifyForm.type==='email'?'📧 Notify me by email':'📱 Notify me by SMS'}</button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div>
              <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'14px', overflow:'hidden' }}>
                <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem', maxHeight:'400px', overflowY:'auto' }}>
                  {eventChats.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'2rem', color:'var(--warm)', fontSize:'14px' }}><div style={{ fontSize:'32px', marginBottom:'0.5rem' }}>💬</div>Be the first to say something!</div>
                  ) : eventChats.map(msg => (
                    <div key={msg.id} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:msg.avatar, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:600, color:'#fff', flexShrink:0 }}>{msg.name.charAt(0)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'baseline', gap:'0.5rem', marginBottom:'4px' }}>
                          <span style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)' }}>{msg.name}</span>
                          <span style={{ fontSize:'11px', color:'var(--warm)' }}>{msg.time}</span>
                        </div>
                        <div style={{ fontSize:'14px', color:'var(--ink)', lineHeight:1.5, background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'0 10px 10px 10px', padding:'8px 12px', display:'inline-block' }}>{msg.message}</div>
                        <button onClick={() => likeMessage(event.id, msg.id)} style={{ background:'none', border:'none', fontSize:'11px', color:'var(--warm)', cursor:'pointer', marginTop:'4px' }}>❤️ {msg.likes>0?msg.likes:'Like'}</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'0.5px solid var(--line)', padding:'1rem' }}>
                  {user ? (
                    <form onSubmit={handleSendChat} style={{ display:'flex', gap:'0.75rem' }}>
                      <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} placeholder="Say something about this event..." style={{ flex:1, background:'var(--paper)', border:'0.5px solid var(--line2)', borderRadius:'100px', padding:'10px 16px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                      <Btn variant="primary" size="sm" style={{ borderRadius:'100px', flexShrink:0 }}>Send</Btn>
                    </form>
                  ) : (
                    <div style={{ textAlign:'center' }}><button onClick={()=>onNavigate('login')} style={{ background:'none', border:'none', fontSize:'13px', color:'var(--gold)', cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>Sign in to join the chat →</button></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              {eventReviews.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'1.25rem', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', marginBottom:'1.25rem' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'48px', fontWeight:400, color:'var(--ink)', lineHeight:1 }}>{avgRating}</div>
                    <div style={{ fontSize:'20px', letterSpacing:'2px', color:'var(--gold)', marginTop:'4px' }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</div>
                    <div style={{ fontSize:'11px', color:'var(--warm)', marginTop:'4px' }}>{eventReviews.length} review{eventReviews.length!==1?'s':''}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    {[5,4,3,2,1].map(star => {
                      const count = eventReviews.filter(r=>r.rating===star).length
                      return (
                        <div key={star} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                          <span style={{ fontSize:'11px', color:'var(--warm)', width:'8px' }}>{star}</span>
                          <div style={{ flex:1, height:'4px', background:'var(--paper3)', borderRadius:'2px', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${eventReviews.length?Math.round(count/eventReviews.length*100):0}%`, background:'var(--gold)', borderRadius:'2px' }}/>
                          </div>
                          <span style={{ fontSize:'11px', color:'var(--warm)', width:'16px' }}>{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {user && (
                <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem', marginBottom:'1.25rem' }}>
                  <div style={{ fontSize:'14px', fontWeight:500, marginBottom:'0.75rem' }}>Write a review</div>
                  <div style={{ display:'flex', gap:'4px', marginBottom:'0.75rem' }}>
                    {[1,2,3,4,5].map(star => <button key={star} onClick={()=>setReviewForm(f=>({...f,rating:star}))} style={{ background:'none', border:'none', fontSize:'24px', cursor:'pointer', color:star<=reviewForm.rating?'var(--gold)':'var(--paper3)' }}>★</button>)}
                  </div>
                  <textarea value={reviewForm.text} onChange={e=>setReviewForm(f=>({...f,text:e.target.value}))} placeholder="Share your experience..." rows={3} style={{ width:'100%', background:'var(--paper)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'10px 13px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', resize:'vertical', outline:'none', marginBottom:'0.75rem' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                  <Btn variant="primary" size="sm" onClick={()=>{ if(reviewForm.text){addReview(event.id,reviewForm.rating,reviewForm.text);setReviewForm({rating:5,text:''})} }}>Post review</Btn>
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {eventReviews.length===0 ? (
                  <div style={{ textAlign:'center', padding:'2rem', color:'var(--warm)', fontSize:'14px' }}><div style={{ fontSize:'32px', marginBottom:'0.5rem' }}>⭐</div>No reviews yet — be the first!</div>
                ) : eventReviews.map(r => (
                  <div key={r.id} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:r.avatar, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:600, color:'#fff' }}>{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontSize:'13px', fontWeight:500 }}>{r.name}</div>
                          <div style={{ fontSize:'11px', color:'var(--warm)' }}>{r.date}</div>
                        </div>
                      </div>
                      <div style={{ fontSize:'14px', letterSpacing:'1px', color:'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                    </div>
                    <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.6, fontWeight:300 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROMOTER TAB */}
          {activeTab === 'promoter' && (
            <div>
              <div style={{ background:'var(--ink)', borderRadius:'16px', padding:'2rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.5rem' }}>Promoter Program</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', fontWeight:400, color:'var(--paper)', marginBottom:'0.5rem' }}>Earn by sharing this event</h3>
                <p style={{ fontSize:'14px', color:'rgba(253,250,245,0.4)', lineHeight:1.6, fontWeight:300, marginBottom:'1.5rem' }}>Get your unique referral link. Every ticket sold through your link earns you a commission — automatically.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(253,250,245,0.07)', borderRadius:'12px', overflow:'hidden', marginBottom:'1.5rem' }}>
                  {[['💰','10%','Commission'],['🎟',`$${(event.price*0.1).toFixed(0)}`,'Per ticket'],['📊','Live','Tracking']].map(([icon,val,label]) => (
                    <div key={label} style={{ background:'rgba(253,250,245,0.03)', padding:'1rem', textAlign:'center' }}>
                      <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', color:'var(--gold2)', fontWeight:400 }}>{val}</div>
                      <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.3)', marginTop:'2px' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {user ? (
                  myReferral ? (
                    <div>
                      <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.4)', marginBottom:'6px', fontWeight:500 }}>Your referral link</div>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <div style={{ flex:1, background:'rgba(253,250,245,0.07)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'rgba(253,250,245,0.6)', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>https://{myReferral}</div>
                        <button onClick={handleCopyLink} style={{ background:copiedLink?'var(--green)':'var(--gold2)', border:'none', borderRadius:'8px', padding:'10px 16px', fontSize:'13px', fontWeight:600, color:copiedLink?'#fff':'var(--ink)', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>{copiedLink?'✓ Copied!':'📋 Copy'}</button>
                      </div>
                    </div>
                  ) : (
                    <Btn variant="gold" size="lg" style={{ width:'100%', borderRadius:'12px' }} onClick={()=>generateReferralLink(event.id)}>🔗 Generate my referral link</Btn>
                  )
                ) : (
                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontSize:'14px', color:'rgba(253,250,245,0.35)', marginBottom:'1rem' }}>Sign in to get your referral link</p>
                    <Btn variant="white" onClick={()=>onNavigate('signup','promoter')}>Create promoter account</Btn>
                  </div>
                )}
              </div>
              <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem' }}>
                <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'1rem' }}>🏆 Top promoters</div>
                {[['1','Anika J.','#C0392B',47,'$840'],['2','Marcus S.','#8B4513',31,'$620'],['3','Tara R.','#1A6B3C',22,'$390']].map(([rank,name,bg,sales,earned]) => (
                  <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'0.5px solid var(--line)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'16px', color:'rgba(12,7,2,0.2)', width:'16px' }}>{rank}</span>
                      <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color:'#fff' }}>{name.charAt(0)}</div>
                      <span style={{ fontSize:'13px', color:'var(--ink)' }}>{name}</span>
                    </div>
                    <div style={{ display:'flex', gap:'1rem', fontSize:'12px' }}>
                      <span style={{ color:'var(--warm)' }}>{sales} tickets</span>
                      <span style={{ fontWeight:600, color:'var(--gold)' }}>{earned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ticket sidebar */}
        <div style={{ position:'sticky', top:'78px' }}>
          <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'18px', overflow:'hidden', boxShadow:'0 8px 40px rgba(12,7,2,0.08)' }}>
            <div style={{ padding:'1.5rem', borderBottom:'0.5px solid var(--line)' }}>
              <div style={{ fontSize:'11px', color:'var(--warm)', marginBottom:'3px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500 }}>Tickets from</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'34px', fontWeight:400, color:'var(--ink)' }}>${event.price}</div>
            </div>

            {isSoldOut ? (
              /* SOLD OUT — show waitlist */
              <div style={{ padding:'1.5rem' }}>
                <div style={{ background:'rgba(194,48,16,0.06)', border:'0.5px solid rgba(194,48,16,0.2)', borderRadius:'12px', padding:'1rem', textAlign:'center', marginBottom:'1.25rem' }}>
                  <div style={{ fontSize:'24px', marginBottom:'4px' }}>😔</div>
                  <div style={{ fontSize:'15px', fontWeight:600, color:'var(--ember)', marginBottom:'4px' }}>Sold Out</div>
                  <div style={{ fontSize:'12px', color:'var(--warm)' }}>All tickets have been claimed</div>
                </div>
                {waitlistDone ? (
                  <div style={{ textAlign:'center', padding:'1rem' }}>
                    <div style={{ fontSize:'32px', marginBottom:'0.5rem' }}>✅</div>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'var(--green)', marginBottom:'4px' }}>You're on the waitlist!</div>
                    <div style={{ fontSize:'12px', color:'var(--warm)' }}>We'll notify you if spots open up.</div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist}>
                    <div style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)', marginBottom:'0.75rem' }}>🔔 Join the waitlist</div>
                    <input type="email" value={waitlistEmail} onChange={e=>setWaitlistEmail(e.target.value)} placeholder="your@email.com" required style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', outline:'none', marginBottom:'0.75rem' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                    <button type="submit" style={{ width:'100%', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'12px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Join waitlist</button>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ padding:'1.5rem' }}>
                {/* Tier selection */}
                <div style={{ marginBottom:'1.25rem' }}>
                  <div style={{ fontSize:'12px', color:'var(--warm)', marginBottom:'0.5rem', fontWeight:500 }}>Select tier</div>
                  {event.tiers.map((tier,i) => (
                    <div key={i} onClick={()=>setSelectedTier(i)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.85rem 1rem', borderRadius:'10px', marginBottom:'0.5rem', border:`0.5px solid ${selectedTier===i?'var(--gold)':'var(--line)'}`, background:selectedTier===i?'rgba(184,122,20,0.06)':'var(--paper2)', cursor:'pointer', transition:'all 0.15s' }}>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:500 }}>{tier.name}</div>
                        <div style={{ fontSize:'11px', color:'var(--warm)' }}>{tier.available} left</div>
                      </div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', color:selectedTier===i?'var(--gold)':'var(--ink)' }}>${tier.price}</div>
                    </div>
                  ))}
                </div>

                {/* Qty */}
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                  <span style={{ fontSize:'13px', color:'var(--warm)', fontWeight:500 }}>Qty</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'4px 8px' }}>
                    <button onClick={()=>setQty(Math.max(1,qty-1))} style={{ width:'28px', height:'28px', borderRadius:'50%', border:'none', background:qty>1?'var(--ink)':'var(--paper3)', color:qty>1?'var(--paper)':'var(--warm)', cursor:'pointer', fontSize:'16px' }}>−</button>
                    <span style={{ fontSize:'15px', fontWeight:500, minWidth:'20px', textAlign:'center' }}>{qty}</span>
                    <button onClick={()=>setQty(Math.min(10,qty+1))} style={{ width:'28px', height:'28px', borderRadius:'50%', border:'none', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'16px' }}>+</button>
                  </div>
                  <span style={{ fontSize:'13px', color:'var(--warm)', marginLeft:'auto' }}>= <strong style={{ color:'var(--ink)' }}>${event.tiers[selectedTier].price*qty}</strong></span>
                </div>

                {/* Gift toggle */}
                <div style={{ marginBottom:'1rem' }}>
                  <button onClick={()=>setGiftMode(!giftMode)} style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'7px 14px', fontSize:'13px', color: giftMode?'var(--gold)':'var(--warm)', cursor:'pointer', fontFamily:'inherit', width:'100%', justifyContent:'center', transition:'all 0.15s',
                    borderColor: giftMode?'var(--gold)':'var(--line)',
                    background: giftMode?'rgba(184,122,20,0.05)':'transparent'
                  }}>
                    🎁 {giftMode ? 'Gifting to someone' : 'Buy as a gift'}
                  </button>
                </div>

                {/* Gift form */}
                {giftMode && (
                  <div style={{ background:'rgba(184,122,20,0.05)', border:'0.5px solid rgba(184,122,20,0.2)', borderRadius:'12px', padding:'1rem', marginBottom:'1rem' }}>
                    <div style={{ fontSize:'12px', fontWeight:500, color:'var(--gold)', marginBottom:'0.75rem' }}>🎁 Gift recipient</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                      <input value={giftForm.recipientName} onChange={e=>setGiftForm(f=>({...f,recipientName:e.target.value}))} placeholder="Recipient's name" style={{ background:'var(--paper)', border:'0.5px solid var(--line2)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                      <input type="email" value={giftForm.recipientEmail} onChange={e=>setGiftForm(f=>({...f,recipientEmail:e.target.value}))} placeholder="Recipient's email" style={{ background:'var(--paper)', border:'0.5px solid var(--line2)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', outline:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                      <textarea value={giftForm.message} onChange={e=>setGiftForm(f=>({...f,message:e.target.value}))} placeholder="Personal message (optional)" rows={2} style={{ background:'var(--paper)', border:'0.5px solid var(--line2)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', outline:'none', resize:'none' }} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--line2)'} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                {giftMode ? (
                  <Btn variant="ember" size="lg" style={{ width:'100%', borderRadius:'12px', marginBottom:'0.75rem' }} onClick={handleGiftAdd}>
                    🎁 Gift this ticket
                  </Btn>
                ) : (
                  <Btn variant="ember" size="lg" style={{ width:'100%', borderRadius:'12px', marginBottom:'0.75rem' }} onClick={()=>{
                    if(!user){onNavigate('login');return}
                    addToCart(event,event.tiers[selectedTier])
                    onNavigate('cart')
                  }}>
                    {user?'🎟 Add to Cart':'Sign in to Buy'}
                  </Btn>
                )}

                <p style={{ fontSize:'11px', color:'var(--warm)', textAlign:'center' }}>🔒 Secure checkout · No hidden fees</p>

                {/* Friends going mini */}
                {friendsGoing.length > 0 && (
                  <div style={{ marginTop:'1rem', padding:'0.75rem', background:'var(--paper2)', borderRadius:'10px', display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ display:'flex' }}>
                      {friendsGoing.slice(0,3).map((f,i) => <div key={f.id} style={{ width:'22px', height:'22px', borderRadius:'50%', background:f.avatar, border:'2px solid var(--paper2)', marginLeft:i===0?0:'-6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:600, color:'#fff' }}>{f.name.charAt(0)}</div>)}
                    </div>
                    <span style={{ fontSize:'12px', color:'var(--warm)' }}>{friendsGoing.length===1?`${friendsGoing[0].name.split(' ')[0]} is going`:`${friendsGoing[0].name.split(' ')[0]} & ${friendsGoing.length-1} friend${friendsGoing.length>2?'s':''} going`}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
