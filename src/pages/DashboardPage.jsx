import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, Card, EventCard } from '../components/UI'

export default function DashboardPage({ onNavigate }) {
  const { user, events } = useApp()
  if (!user) { onNavigate('login'); return null }
  if (user.role === 'organizer') return <OrganizerDash onNavigate={onNavigate} />
  if (user.role === 'promoter') return <PromoterDash onNavigate={onNavigate} />
  return <FanDash onNavigate={onNavigate} />
}

// ── ORGANIZER DASHBOARD ──────────────────────────────────────
function OrganizerDash({ onNavigate }) {
  const { user, events } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const myEvents = events.slice(0, 3)

  const tabs = ['overview','events','promoters','analytics','leads','ai-tools']

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Header */}
      <div style={{ background:'var(--ink)', padding:'2rem 1.75rem', borderBottom:'0.5px solid rgba(253,250,245,0.07)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
            <div>
              <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px' }}>Organizer Dashboard</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, color:'var(--paper)' }}>
                Welcome back, <em style={{ color:'var(--gold2)' }}>{user.name}</em>
              </h1>
            </div>
            <Btn variant="ember" onClick={() => onNavigate('create-event')}>+ Create New Event</Btn>
          </div>
          {/* Metrics */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(253,250,245,0.06)', borderRadius:'14px', overflow:'hidden' }}>
            {[['Total Revenue','$8,395','This month','var(--gold2)'],['Tickets Sold','312','Across 3 events','#5DD07A'],['Avg Capacity','78%','Per event','var(--ember2)'],['Active Promoters','12','Earning commissions','var(--paper)']].map(([label, val, sub, color]) => (
              <div key={label} style={{ background:'rgba(253,250,245,0.03)', padding:'1.25rem 1.5rem' }}>
                <div style={{ fontSize:'10.5px', color:'rgba(253,250,245,0.25)', marginBottom:'5px', letterSpacing:'0.04em' }}>{label}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'30px', color, fontWeight:400, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.2)', marginTop:'3px' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'var(--paper)', borderBottom:'0.5px solid var(--line)', padding:'0 1.75rem' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', gap:0 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background:'none', border:'none', borderBottom: activeTab===tab ? '2px solid var(--gold)' : '2px solid transparent',
              padding:'1rem 1.25rem', fontSize:'13px', fontWeight: activeTab===tab ? 500 : 400,
              color: activeTab===tab ? 'var(--ink)' : 'var(--warm)', cursor:'pointer', fontFamily:'inherit',
              textTransform:'capitalize', transition:'all 0.15s', whiteSpace:'nowrap'
            }}>{tab.replace('-',' ')}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'2rem 1.75rem' }}>
        {activeTab === 'overview' && <OrgOverview onNavigate={onNavigate} events={myEvents} />}
        {activeTab === 'events' && <OrgEvents onNavigate={onNavigate} events={myEvents} />}
        {activeTab === 'promoters' && <OrgPromoters />}
        {activeTab === 'analytics' && <OrgAnalytics />}
        {activeTab === 'leads' && <LeadCapture />}
        {activeTab === 'ai-tools' && <AITools />}
      </div>
    </div>
  )
}

function OrgOverview({ onNavigate, events }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', alignItems:'start' }}>
      <div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1rem' }}>Your events</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {events.map(event => (
            <div key={event.id} onClick={() => onNavigate('event', event.id)} style={{ display:'flex', gap:'1rem', alignItems:'center', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem 1.25rem', cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}
            >
              <div style={{ width:'48px', height:'48px', borderRadius:'10px', background:`linear-gradient(135deg,${event.color1},${event.color2})`, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{event.title}</div>
                <div style={{ fontSize:'12px', color:'var(--warm)' }}>{event.date} · {event.city}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)' }}>{event.sold} sold</div>
                <div style={{ fontSize:'11px', color:'var(--warm)' }}>{Math.round(event.sold/event.capacity*100)}% cap</div>
              </div>
              <div style={{ width:'56px', flexShrink:0 }}>
                <div style={{ height:'4px', background:'var(--paper3)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.round(event.sold/event.capacity*100)}%`, background:'linear-gradient(90deg,var(--ember),var(--gold2))' }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Btn variant="outline" style={{ marginTop:'1rem' }} onClick={() => onNavigate('create-event')}>+ Create new event</Btn>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
          <h3 style={{ fontSize:'14px', fontWeight:500, marginBottom:'1rem' }}>Quick actions</h3>
          {[['🤖 Generate AI flyer','ai-tools'],['🔗 Create promoter link','promoters'],['📊 View analytics','analytics'],['📧 Send email campaign','ai-tools']].map(([label, tab]) => (
            <button key={label} onClick={() => {}} style={{ display:'block', width:'100%', textAlign:'left', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--ink)', cursor:'pointer', fontFamily:'inherit', marginBottom:'0.5rem', transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}
            >{label}</button>
          ))}
        </div>
        <div style={{ background:'linear-gradient(135deg,var(--ember),var(--gold2))', borderRadius:'12px', padding:'1.25rem', color:'#fff' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'4px' }}>🚀 Upgrade to Pro</div>
          <div style={{ fontSize:'12px', opacity:0.85, lineHeight:1.5, marginBottom:'0.75rem' }}>Unlimited AI marketing + custom promoter tiers</div>
          <Btn variant="white" size="sm" onClick={() => {}}>Upgrade now</Btn>
        </div>
      </div>
    </div>
  )
}

function OrgEvents({ onNavigate, events }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400 }}>All Events</h2>
        <Btn variant="ember" size="sm" onClick={() => onNavigate('create-event')}>+ New Event</Btn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
        {events.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
      </div>
    </div>
  )
}

function OrgPromoters() {
  const promoters = [
    { name:'Anika Johnson', email:'anika@example.com', sales:47, revenue:2350, commission:235, rate:10 },
    { name:'Marcus Smith', email:'marcus@example.com', sales:31, revenue:1550, commission:155, rate:10 },
    { name:'Tara Rivera', email:'tara@example.com', sales:22, revenue:1100, commission:110, rate:10 },
    { name:'Devon Lee', email:'devon@example.com', sales:18, revenue:900, commission:90, rate:10 },
  ]
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400 }}>Promoter Network</h2>
        <Btn variant="ember" size="sm">+ Invite Promoter</Btn>
      </div>
      <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', overflow:'hidden', marginBottom:'1.5rem' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--paper2)', borderBottom:'0.5px solid var(--line)' }}>
              {['Promoter','Tickets Sold','Revenue Driven','Commission','Rate','Status'].map(h => (
                <th key={h} style={{ padding:'0.85rem 1.25rem', fontSize:'11px', fontWeight:600, color:'var(--warm)', textAlign:'left', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promoters.map((p, i) => (
              <tr key={i} style={{ borderBottom:'0.5px solid var(--line)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--paper2)'}
                onMouseLeave={e => e.currentTarget.style.background=''}
              >
                <td style={{ padding:'1rem 1.25rem' }}>
                  <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)' }}>{p.name}</div>
                  <div style={{ fontSize:'11px', color:'var(--warm)' }}>{p.email}</div>
                </td>
                <td style={{ padding:'1rem 1.25rem', fontSize:'14px', fontWeight:500, color:'var(--ink)' }}>{p.sales}</td>
                <td style={{ padding:'1rem 1.25rem', fontSize:'14px', fontWeight:500, color:'var(--ink)' }}>${p.revenue.toLocaleString()}</td>
                <td style={{ padding:'1rem 1.25rem', fontSize:'14px', fontWeight:600, color:'var(--green)' }}>${p.commission}</td>
                <td style={{ padding:'1rem 1.25rem', fontSize:'13px', color:'var(--warm)' }}>{p.rate}%</td>
                <td style={{ padding:'1rem 1.25rem' }}><span style={{ fontSize:'11px', fontWeight:600, background:'rgba(45,158,95,0.1)', color:'var(--green)', padding:'3px 10px', borderRadius:'100px' }}>Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrgAnalytics() {
  const bars = [20, 35, 28, 55, 42, 80, 100, 65, 72, 58, 90, 45]
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return (
    <div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1.5rem' }}>Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
          <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'1.25rem' }}>Ticket sales — 2025</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'120px', marginBottom:'0.75rem' }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', height:'100%', justifyContent:'flex-end' }}>
                <div style={{ width:'100%', background:`linear-gradient(0deg,var(--ember),var(--gold2))`, borderRadius:'3px 3px 0 0', height:`${h}%`, transition:'height 0.3s', minHeight:'4px' }}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            {months.map(m => <div key={m} style={{ flex:1, fontSize:'9px', color:'var(--warm)', textAlign:'center' }}>{m}</div>)}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[['Top event','Neon Nights','312 tickets'],['Best city','Los Angeles','41% of sales'],['Peak day','Saturday','28% of sales'],['Avg ticket','$72','This month']].map(([label, val, sub]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem 1.25rem' }}>
              <div style={{ fontSize:'11px', color:'var(--warm)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500 }}>{label}</div>
              <div style={{ fontSize:'16px', fontWeight:500, color:'var(--ink)', marginBottom:'2px' }}>{val}</div>
              <div style={{ fontSize:'12px', color:'var(--warm)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AITools() {
  const [activeAI, setActiveAI] = useState('flyer')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = () => {
    if (!prompt) return
    setLoading(true)
    setTimeout(() => {
      const results = {
        flyer: '✅ Flyer generated! Your event flyer with bold typography, atmospheric backgrounds, and QR code is ready to download.',
        caption: `🎉 Check out what's coming... ✨\n\nNeon Nights is back and BIGGER than ever. 🖤\nYour summer just got an upgrade.\n\n📅 ${prompt || 'Aug 8'} · 📍 LA\n🎟 Link in bio\n\n#NeonNights #LosAngeles #LiveMusic #Zwave`,
        email: `Subject: You're invited — Neon Nights is BACK 🌙\n\nHey [First Name],\n\nSummer isn't over. Neon Nights returns for one final night you won't forget.\n\nThis is your personal invite. Tickets are moving fast — don't wait.\n\n[GET YOUR TICKETS →]\n\nSee you there,\nThe Team`,
        sms: `Neon Nights is BACK 🔥 Aug 8 · LA. Grab your tickets before they're gone 👉 zwave.app/neon-nights Reply STOP to opt out.`
      }
      setResult(results[activeAI])
      setLoading(false)
    }, 1200)
  }

  return (
    <div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'0.5rem' }}>AI Marketing Tools</h2>
      <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'1.5rem', fontWeight:300 }}>Generate marketing content for your events in seconds.</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1.25rem' }}>
            {[['flyer','🎨 AI Flyer'],['caption','📸 Instagram Caption'],['email','📧 Email Campaign'],['sms','💬 SMS Campaign']].map(([id, label]) => (
              <button key={id} onClick={() => { setActiveAI(id); setResult('') }} style={{
                padding:'0.85rem', borderRadius:'10px', border:`0.5px solid ${activeAI===id ? 'var(--gold)' : 'var(--line)'}`,
                background: activeAI===id ? 'rgba(184,122,20,0.06)' : 'var(--paper2)',
                fontSize:'13px', fontWeight: activeAI===id ? 500 : 400,
                color: activeAI===id ? 'var(--gold)' : 'var(--warm)',
                cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s'
              }}>{label}</button>
            ))}
          </div>
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={`Describe your event for AI ${activeAI} generation...\n\ne.g. "Neon Nights concert Aug 8 at Crypto.com Arena, LA. EDM and hip-hop, 21+, gates at 9PM"`}
            style={{ width:'100%', height:'140px', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'12px 14px', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', resize:'vertical', outline:'none', lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor='var(--gold)'}
            onBlur={e => e.target.style.borderColor='var(--line2)'}
          />
          <Btn variant="ember" style={{ marginTop:'0.75rem', width:'100%', borderRadius:'10px' }} onClick={generate} disabled={loading || !prompt}>
            {loading ? '⚡ Generating…' : `Generate ${activeAI}`}
          </Btn>
        </div>
        <div style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem', minHeight:'200px' }}>
          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'160px', flexDirection:'column', gap:'1rem' }}>
              <div style={{ width:'28px', height:'28px', border:'2px solid var(--paper3)', borderTop:'2px solid var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>Generating with AI…</div>
            </div>
          ) : result ? (
            <div>
              <div style={{ fontSize:'11px', fontWeight:600, color:'var(--gold)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Generated</div>
              <pre style={{ fontSize:'13px', color:'var(--ink)', lineHeight:1.65, whiteSpace:'pre-wrap', fontFamily:'inherit' }}>{result}</pre>
              <div style={{ display:'flex', gap:'0.5rem', marginTop:'1rem' }}>
                <Btn variant="outline" size="sm">📋 Copy</Btn>
                <Btn variant="primary" size="sm">✅ Use this</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'160px', flexDirection:'column', gap:'0.5rem', opacity:0.4 }}>
              <div style={{ fontSize:'32px' }}>🤖</div>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>Your generated content will appear here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── PROMOTER DASHBOARD ───────────────────────────────────────
function PromoterDash({ onNavigate }) {
  const { user, events } = useApp()
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      <div style={{ background:'var(--ink)', padding:'2rem 1.75rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px' }}>Promoter Dashboard</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, color:'var(--paper)', marginBottom:'1.5rem' }}>
            Hey <em style={{ color:'var(--gold2)' }}>{user.name}</em> — let's get selling.
          </h1>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(253,250,245,0.06)', borderRadius:'14px', overflow:'hidden' }}>
            {[['Tickets sold today','47','var(--paper)'],['Revenue driven','$2,350','var(--gold2)'],['Your commission','$235','#5DD07A'],['Link clicks','1,204','var(--ember2)']].map(([label, val, color]) => (
              <div key={label} style={{ background:'rgba(253,250,245,0.03)', padding:'1.25rem 1.5rem' }}>
                <div style={{ fontSize:'10.5px', color:'rgba(253,250,245,0.25)', marginBottom:'5px', letterSpacing:'0.04em' }}>{label}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'30px', color, fontWeight:400, lineHeight:1 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.75rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1rem' }}>Events you can promote</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {events.map(event => (
                <div key={event.id} style={{ display:'flex', gap:'1rem', alignItems:'center', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem 1.25rem' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:`linear-gradient(135deg,${event.color1},${event.color2})`, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{event.title}</div>
                    <div style={{ fontSize:'12px', color:'var(--warm)' }}>{event.date}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0, marginRight:'1rem' }}>
                    <div style={{ fontSize:'12px', color:'var(--green)', fontWeight:600 }}>10% commission</div>
                    <div style={{ fontSize:'11px', color:'var(--warm)' }}>From ${event.price}</div>
                  </div>
                  <Btn variant="outline" size="sm" onClick={() => {}}>Get link</Btn>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem' }}>
              <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'1rem' }}>Monthly goal</div>
              {[['Goal progress','78%','78%'],['Conversion rate','18.4%','18.4%']].map(([label, pct, w]) => (
                <div key={label} style={{ marginBottom:'0.75rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--warm)', marginBottom:'4px' }}><span>{label}</span><span style={{ fontWeight:500, color:'var(--ink)' }}>{pct}</span></div>
                  <div style={{ height:'4px', background:'var(--paper3)', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:w, background:'linear-gradient(90deg,var(--ember),var(--gold2))', borderRadius:'2px' }}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--ink)', border:'0.5px solid rgba(253,250,245,0.08)', borderRadius:'14px', padding:'1.25rem' }}>
              <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.75rem' }}>Leaderboard rank</div>
              {[['1','AJ','$840'],['2','You','$235'],['3','TR','$180']].map(([rank, name, val]) => (
                <div key={rank} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'0.5px solid rgba(253,250,245,0.05)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'13px', color:'rgba(253,250,245,0.2)', width:'14px' }}>{rank}</span>
                    <span style={{ fontSize:'13px', color: name==='You' ? 'var(--gold2)' : 'rgba(253,250,245,0.5)', fontWeight: name==='You' ? 600 : 400 }}>{name}</span>
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:600, color:'var(--gold2)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── FAN DASHBOARD ────────────────────────────────────────────
function FanDash({ onNavigate }) {
  const { user, events } = useApp()
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 1.75rem' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', fontWeight:400, marginBottom:'0.5rem' }}>
          Hey <em style={{ color:'var(--gold)' }}>{user.name}</em>
        </h1>
        <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'2rem' }}>Here's what's happening near you.</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1rem' }}>Recommended for you</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
          {events.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
        </div>
      </div>
    </div>
  )
}

// ── LEAD CAPTURE DASHBOARD ───────────────────────────────────
function LeadCapture() {
  const [activeEvent, setActiveEvent] = useState('All Events')
  const [search, setSearch] = useState('')

  const LEADS = [
    { name:'Marcus Johnson', contact:'marcus@gmail.com', type:'email', source:'Notify Me', event:'Neon Nights — Summer Concert Series', date:'Jun 8', tags:['Ticket drops','Future events'] },
    { name:'Alicia Torres', contact:'+1 (305) 555-0192', type:'phone', source:'RSVP', event:'Neon Nights — Summer Concert Series', date:'Jun 7', tags:['Event updates'] },
    { name:'Devon Williams', contact:'devon.w@outlook.com', type:'email', source:'Notify Me', event:'Neon Nights — Summer Concert Series', date:'Jun 7', tags:['Early bird deals','Ticket drops'] },
    { name:'Keisha Brown', contact:'+1 (404) 555-0847', type:'phone', source:'Notify Me', event:'Neon Nights — Summer Concert Series', date:'Jun 6', tags:['Future events'] },
    { name:'Jordan Lee', contact:'jlee@icloud.com', type:'email', source:'RSVP', event:'Rooftop Sessions — Season Finale', date:'Jun 5', tags:['Ticket drops','Price changes'] },
    { name:'Tanya Morris', contact:'+1 (212) 555-0341', type:'phone', source:'Notify Me', event:'Rooftop Sessions — Season Finale', date:'Jun 4', tags:['Future events','Event updates'] },
    { name:'Chris Parker', contact:'cparker@gmail.com', type:'email', source:'Notify Me', event:'Wavelength Music Festival', date:'Jun 3', tags:['Early bird deals'] },
    { name:'Simone Diaz', contact:'+1 (786) 555-0293', type:'phone', source:'RSVP', event:'Wavelength Music Festival', date:'Jun 2', tags:['Ticket drops','Future events'] },
  ]

  const filtered = LEADS.filter(l =>
    (activeEvent === 'All Events' || l.event === activeEvent) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase()))
  )

  const emailCount = filtered.filter(l => l.type === 'email').length
  const phoneCount = filtered.filter(l => l.type === 'phone').length
  const rsvpCount = filtered.filter(l => l.source === 'RSVP').length

  const exportCSV = () => {
    const csv = ['Name,Contact,Type,Source,Event,Date,Tags',
      ...filtered.map(l => `${l.name},${l.contact},${l.type},${l.source},"${l.event}",${l.date},"${l.tags.join('; ')}"`)
    ].join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'zwave-leads.csv'; a.click()
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'4px' }}>Lead Capture</h2>
          <p style={{ fontSize:'13px', color:'var(--warm)', fontWeight:300 }}>People who expressed interest without buying a ticket — your future audience.</p>
        </div>
        <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'10px 20px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
          ⬇️ Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[['Total leads', filtered.length, '📋'],['Emails', emailCount, '📧'],['Phone / SMS', phoneCount, '📱'],['RSVPs', rsvpCount, '✅']].map(([label, val, icon]) => (
          <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.1rem 1.25rem' }}>
            <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, color:'var(--ink)', lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:'12px', color:'var(--warm)', marginTop:'3px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'10px', padding:'9px 14px', flex:1, minWidth:'200px' }}>
          <span style={{ opacity:0.5 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or contact..."
            style={{ background:'none', border:'none', outline:'none', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', flex:1 }} />
        </div>
        <select value={activeEvent} onChange={e => setActiveEvent(e.target.value)} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'10px', padding:'9px 14px', fontSize:'13px', color:'var(--warm)', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
          <option>All Events</option>
          <option>Neon Nights — Summer Concert Series</option>
          <option>Rooftop Sessions — Season Finale</option>
          <option>Wavelength Music Festival</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', overflow:'hidden', marginBottom:'1.5rem' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--paper2)', borderBottom:'0.5px solid var(--line)' }}>
              {['Name','Contact','Source','Event','Date','Interests'].map(h => (
                <th key={h} style={{ padding:'0.85rem 1.1rem', fontSize:'11px', fontWeight:600, color:'var(--warm)', textAlign:'left', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:'var(--warm)', fontSize:'14px' }}>No leads yet — they'll appear when people use "Notify Me" on your event pages.</td></tr>
            ) : filtered.map((lead, i) => (
              <tr key={i} style={{ borderBottom:'0.5px solid var(--line)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--paper2)'}
                onMouseLeave={e => e.currentTarget.style.background=''}
              >
                <td style={{ padding:'0.85rem 1.1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'linear-gradient(135deg,var(--ember),var(--gold2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:600, color:'#fff', flexShrink:0 }}>{lead.name.charAt(0)}</div>
                    <span style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)' }}>{lead.name}</span>
                  </div>
                </td>
                <td style={{ padding:'0.85rem 1.1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span>{lead.type === 'email' ? '📧' : '📱'}</span>
                    <span style={{ fontSize:'13px', color:'var(--warm)' }}>{lead.contact}</span>
                  </div>
                </td>
                <td style={{ padding:'0.85rem 1.1rem' }}>
                  <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'100px',
                    background: lead.source === 'RSVP' ? 'rgba(45,158,95,0.1)' : 'rgba(184,122,20,0.1)',
                    color: lead.source === 'RSVP' ? 'var(--green)' : 'var(--gold)'
                  }}>{lead.source}</span>
                </td>
                <td style={{ padding:'0.85rem 1.1rem', fontSize:'12px', color:'var(--warm)', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.event}</td>
                <td style={{ padding:'0.85rem 1.1rem', fontSize:'12px', color:'var(--warm)', whiteSpace:'nowrap' }}>{lead.date}</td>
                <td style={{ padding:'0.85rem 1.1rem' }}>
                  <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                    {lead.tags.map(tag => (
                      <span key={tag} style={{ fontSize:'10px', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'2px 8px', color:'var(--warm)', whiteSpace:'nowrap' }}>{tag}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Broadcast */}
      <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
        <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'4px' }}>📣 Broadcast to your leads</h3>
        <p style={{ fontSize:'13px', color:'var(--warm)', fontWeight:300, marginBottom:'1rem' }}>Send a message to all {filtered.length} people who expressed interest.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.75rem', alignItems:'flex-end' }}>
          <textarea placeholder="Hey! Tickets are now live. Grab yours before they sell out → zwave.app/..." rows={3}
            style={{ background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'13px', color:'var(--ink)', fontFamily:'inherit', resize:'vertical', outline:'none' }}
            onFocus={e => e.target.style.borderColor='var(--gold)'}
            onBlur={e => e.target.style.borderColor='var(--line2)'}
          />
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            <button style={{ background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'10px 18px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>📧 Send email</button>
            <button style={{ background:'var(--paper2)', color:'var(--ink)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'10px 18px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>📱 Send SMS</button>
          </div>
        </div>
      </div>
    </div>
  )
}
