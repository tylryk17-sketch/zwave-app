import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { EventCard, Btn } from '../components/UI'

const CATEGORIES = ['All','Concerts','Festivals','Nightlife','Day Parties','Arts & Culture','Sports','Business','Food & Drink']
const CITIES = [
  { name:'New York', count:'520', c1:'#0A1A2C', c2:'#050A10' },
  { name:'Miami', count:'340', c1:'#2C1208', c2:'#0A0300' },
  { name:'Los Angeles', count:'410', c1:'#2C1A00', c2:'#0F0700' },
  { name:'Atlanta', count:'210', c1:'#1A2C0A', c2:'#080F03' },
  { name:'Chicago', count:'185', c1:'#0A1A2C', c2:'#030810' },
  { name:'Houston', count:'150', c1:'#2C0A1A', c2:'#100308' },
]

export default function HomePage({ onNavigate }) {
  const { events } = useApp()
  const [activeCategory, setActiveCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [waitlistDone, setWaitlistDone] = useState(false)

  const filtered = activeCategory === 'All' ? events : events.filter(e => e.category === activeCategory)

  const handleWaitlist = (e) => {
    e.preventDefault()
    if (email) { setWaitlistDone(true) }
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight:'100svh', background:'var(--ink2)', position:'relative', overflow:'hidden', display:'grid', placeItems:'center' }}>
        {/* Aura */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 50% at 30% 40%, rgba(194,48,16,0.18), transparent 65%), radial-gradient(ellipse 50% 60% at 75% 60%, rgba(184,122,20,0.15), transparent 60%)', pointerEvents:'none' }}/>
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(200,134,26,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,134,26,0.04) 1px,transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', width:'100%', padding:'7rem 1.75rem 4rem', display:'grid', gridTemplateColumns:'1fr 400px', gap:'4rem', alignItems:'center' }}>
          {/* Left */}
          <div className="fade-up">
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', background:'rgba(253,250,245,0.07)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'100px', padding:'5px 14px', fontSize:'10.5px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(253,250,245,0.5)', marginBottom:'1.5rem' }}>
              <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#5DD07A', animation:'pip 2s infinite' }}/>
              Early access now open
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(56px,8vw,108px)', lineHeight:0.92, letterSpacing:'-0.025em', color:'var(--paper)', fontWeight:400, marginBottom:'1.5rem' }}>
              The event<br/>platform,<br/><em style={{ color:'var(--gold2)' }}>reimagined.</em>
            </h1>
            <p style={{ fontSize:'16px', color:'rgba(253,250,245,0.4)', lineHeight:1.7, fontWeight:300, maxWidth:'440px', marginBottom:'2.25rem' }}>
              From underground shows to sold-out stadiums — <strong style={{ color:'rgba(253,250,245,0.65)', fontWeight:400 }}>Zwave®</strong> is the smarter way to create, promote, discover, and sell out any event, anywhere.
            </p>
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
              <Btn variant="ember" size="lg" onClick={() => onNavigate(user ? 'dashboard' : 'signup')}>{user ? 'Go to dashboard' : 'Get started free'}</Btn>
              <Btn variant="outline" size="lg" onClick={() => onNavigate('discover')} style={{ borderColor:'rgba(253,250,245,0.15)', color:'rgba(253,250,245,0.6)' }}>Browse events</Btn>
            </div>
            {/* Social proof */}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ display:'flex' }}>
                {['#8B4513','#C0392B','#1A6B3C','#2C5F8A','#7B4A9E'].map((c,i) => (
                  <div key={i} style={{ width:'28px', height:'28px', borderRadius:'50%', background:c, border:'2px solid var(--ink2)', marginLeft: i===0?0:'-8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color:'#fff' }}>
                    {['J','A','M','T','S'][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'13px', color:'rgba(253,250,245,0.35)', lineHeight:1.4 }}>
                <strong style={{ color:'rgba(253,250,245,0.6)', fontWeight:500 }}>2,400+ organizers</strong> already<br/>on the waitlist
              </p>
            </div>
          </div>

          {/* Search card */}
          <div className="fade-up" style={{ background:'var(--paper)', borderRadius:'20px', padding:'1.5rem', boxShadow:'0 40px 80px rgba(0,0,0,0.4)' }}>
            <p style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)', marginBottom:'1rem' }}>Find your next event</p>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'10px', padding:'10px 13px', marginBottom:'0.75rem', fontSize:'13px', color:'var(--warm)', cursor:'text' }}>
              🔍 Search concerts, festivals, clubs…
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.75rem' }}>
              {[['📍 Any city',['New York','Miami','Los Angeles','Atlanta','Chicago']],['📅 Anytime',['Tonight','This Weekend','This Week','This Month']]].map(([def, opts], i) => (
                <select key={i} defaultValue="" style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'10px', padding:'10px 12px', fontSize:'12px', color:'var(--warm)', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
                  <option value="">{def}</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
            <button onClick={() => onNavigate('discover')} style={{ width:'100%', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'10px', padding:'13px', fontSize:'14px', fontWeight:500, cursor:'pointer', marginBottom:'1rem', fontFamily:'inherit' }}>
              Search events
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'11px', color:'var(--warm)', opacity:.6, marginBottom:'0.75rem' }}>
              <div style={{ flex:1, height:'0.5px', background:'var(--line)' }}/>trending now<div style={{ flex:1, height:'0.5px', background:'var(--line)' }}/>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {['🎤 Concerts','🎉 Festivals','🌙 Nightlife','🍹 Day Parties','🎭 Arts','🏃 Sports'].map(c => (
                <span key={c} onClick={() => onNavigate('discover')} style={{ background:'var(--paper3)', borderRadius:'100px', padding:'5px 11px', fontSize:'11px', fontWeight:500, color:'var(--warm)', cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.background='var(--ink)'; e.target.style.color='var(--paper)' }}
                  onMouseLeave={e => { e.target.style.background='var(--paper3)'; e.target.style.color='var(--warm)' }}
                >{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ overflow:'hidden', padding:'13px 0', background:'var(--paper2)', borderTop:'0.5px solid var(--line)', borderBottom:'0.5px solid var(--line)' }}>
        <div style={{ display:'flex', width:'max-content', animation:'marquee 28s linear infinite' }}>
          {['Concerts','Festivals','Nightlife','Live Music','Day Parties','Sports Events','Art Shows','Promoter Tools','AI Marketing','Referral Links','Live Analytics','Concerts','Festivals','Nightlife','Live Music','Day Parties','Sports Events','Art Shows','Promoter Tools','AI Marketing','Referral Links','Live Analytics'].map((item, i) => (
            <span key={i} style={{ fontSize:'11.5px', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--warm)', padding:'0 1.75rem', whiteSpace:'nowrap' }}>
              {i % 11 === 0 && i > 0 ? '' : ''}{item} {i % 1 === 0 ? <span style={{ color:'var(--gold)', padding:'0 0.25rem' }}>◆</span> : ''}
            </span>
          ))}
        </div>
      </div>

      {/* ── DISCOVER ── */}
      <section id="discover" style={{ padding:'5rem 1.75rem', background:'var(--paper)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.4rem' }}>Discover</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:400, lineHeight:1, letterSpacing:'-0.02em' }}>Find your <em style={{ color:'var(--gold)' }}>world.</em></h2>
            </div>
            <Btn variant="outline" onClick={() => onNavigate('discover')}>View all events →</Btn>
          </div>

          {/* Cities */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'0.7rem', marginBottom:'2.5rem' }}>
            {CITIES.map(city => (
              <div key={city.name} onClick={() => onNavigate('discover')} style={{ position:'relative', aspectRatio:'4/3', borderRadius:'13px', overflow:'hidden', background:`linear-gradient(160deg,${city.c1},${city.c2})`, cursor:'pointer', transition:'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform=''}
              >
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(12,7,2,0.65) 0%,transparent 60%)' }}/>
                <div style={{ position:'absolute', bottom:'0.7rem', left:'0.85rem', fontSize:'13px', fontWeight:500, color:'var(--paper)' }}>{city.name}</div>
                <div style={{ position:'absolute', top:'0.55rem', right:'0.55rem', background:'rgba(12,7,2,0.4)', backdropFilter:'blur(6px)', border:'0.5px solid rgba(253,250,245,0.1)', borderRadius:'100px', padding:'3px 8px', fontSize:'10px', color:'rgba(253,250,245,0.6)' }}>{city.count}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.25rem', scrollbarWidth:'none', marginBottom:'2rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flexShrink:0, padding:'8px 18px', borderRadius:'100px', fontSize:'13px', fontWeight:400, cursor:'pointer', border:'0.5px solid', transition:'all 0.15s', fontFamily:'inherit',
                background: activeCategory===cat ? 'var(--ink)' : 'var(--paper)',
                color: activeCategory===cat ? 'var(--paper)' : 'var(--warm)',
                borderColor: activeCategory===cat ? 'var(--ink)' : 'var(--line)'
              }}>{cat}</button>
            ))}
          </div>

          {/* Events grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
            {filtered.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
          </div>
        </div>
      </section>

      {/* ── UNIQUE FEATURES ── */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--ink2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ marginBottom:'3rem' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.5rem' }}>Only on Zwave</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(34px,4vw,56px)', fontWeight:400, lineHeight:1.02, letterSpacing:'-0.02em', color:'var(--paper)' }}>Features nobody<br/><em style={{ color:'var(--gold2)' }}>else has.</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1px', background:'rgba(253,250,245,0.06)', borderRadius:'18px', overflow:'hidden' }}>
            {[
              { icon:'🔗', tag:'Promoter Network', title:'Built-in referral & commission system', desc:'Every organizer can activate a promoter network in one click — unique links, live tracking, automatic payouts.' },
              { icon:'🤖', tag:'AI Marketing', title:'Generate flyers, captions, emails instantly', desc:'AI trained on event culture. Not generic templates — actual content your audience converts on.' },
              { icon:'✨', tag:'Vibe Score™', title:'AI energy rating for every event', desc:'We analyze lineup, venue, attendance, and reviews to score the energy — so fans know before they buy.' },
              { icon:'👥', tag:'Social Proof', title:'See which contacts are going before checkout', desc:'Connect once. Every event page shows exactly who from your circle is attending.' },
              { icon:'🏆', tag:'Leaderboards', title:'Live ranked promoter leaderboard per event', desc:"Organizers publish a live leaderboard of top promoters — creating competition and transparency." },
              { icon:'🌍', tag:'Open to All', title:'Every event. Every genre. Every city.', desc:'Concerts, festivals, conferences, pop-ups, sports, galas — no genre left behind, no community excluded.' },
            ].map((f, i) => (
              <div key={i} style={{ background:'var(--ink2)', padding:'2.25rem 1.75rem', transition:'background 0.25s', position:'relative', cursor:'default' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(253,250,245,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--ink2)'}
              >
                <span style={{ fontSize:'26px', marginBottom:'1rem', display:'block' }}>{f.icon}</span>
                <span style={{ display:'inline-block', fontSize:'9.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(184,122,20,0.15)', color:'var(--gold2)', padding:'3px 10px', borderRadius:'20px', marginBottom:'0.65rem' }}>{f.tag}</span>
                <h3 style={{ fontSize:'15px', fontWeight:500, color:'var(--paper)', marginBottom:'0.45rem', lineHeight:1.3 }}>{f.title}</h3>
                <p style={{ fontSize:'13px', color:'rgba(253,250,245,0.35)', lineHeight:1.6, fontWeight:300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMOTER SECTION ── */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--paper2)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>For Promoters</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(34px,4vw,54px)', fontWeight:400, lineHeight:1.02, letterSpacing:'-0.02em', marginBottom:'1rem' }}>Turn your network<br/>into <em style={{ color:'var(--gold)' }}>income.</em></h2>
            <p style={{ fontSize:'15px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, maxWidth:'420px', marginBottom:'1.75rem' }}>No spreadsheets. No chasing payments. Every click tracked, every dollar logged, paid automatically.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[['i.','Get your referral link','One-click generation for any event. Works on Instagram, WhatsApp, TikTok, everywhere.'],['ii.','Share, sell, track live','Your dashboard updates in real time. Clicks, conversions, revenue — no guessing.'],['iii.','Automatic payouts','Set your schedule. Zwave handles the math and the money.']].map(([n, title, desc]) => (
                <div key={n} style={{ display:'flex', gap:'1.25rem', alignItems:'flex-start', padding:'1.1rem 0', borderBottom:'0.5px solid var(--line)' }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'26px', color:'var(--gold)', lineHeight:1, flexShrink:0, width:'28px' }}>{n}</span>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', marginBottom:'3px' }}>{title}</div>
                    <div style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.55, fontWeight:300 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:'1.75rem' }}>
              <Btn variant="primary" onClick={() => onNavigate('signup', 'promoter')}>Become a promoter →</Btn>
            </div>
          </div>
          {/* Mock Dashboard */}
          <div style={{ background:'var(--ink)', borderRadius:'18px', overflow:'hidden' }}>
            <div style={{ padding:'1.25rem 1.5rem', borderBottom:'0.5px solid rgba(253,250,245,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'12px', fontWeight:500, color:'rgba(253,250,245,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Promoter Dashboard</span>
              <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'rgba(253,250,245,0.25)' }}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#5DD07A', animation:'pip 2s infinite' }}/>Live
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(253,250,245,0.05)' }}>
              {[['Tickets sold today','47','↑ 12 from yesterday','var(--paper)'],['Revenue driven','$2,350','This month','var(--gold2)'],['Commission earned','$235','Ready to pay out','#5DD07A'],['Link clicks','1,204','This week','var(--ember2)']].map(([label, val, sub, color]) => (
                <div key={label} style={{ background:'var(--ink)', padding:'1.15rem 1.4rem' }}>
                  <div style={{ fontSize:'10.5px', color:'rgba(253,250,245,0.25)', marginBottom:'5px', letterSpacing:'0.04em' }}>{label}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'30px', color, fontWeight:400, lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:'11px', color:'rgba(253,250,245,0.2)', marginTop:'3px' }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'1.25rem 1.5rem' }}>
              {[['Monthly goal','78%', '78%'],['Conversion rate','18.4%','18.4%']].map(([label, pct, width]) => (
                <div key={label} style={{ marginBottom:'0.7rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(253,250,245,0.25)', marginBottom:'5px' }}><span>{label}</span><span>{pct}</span></div>
                  <div style={{ height:'3px', background:'rgba(253,250,245,0.07)', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width, background:'linear-gradient(90deg,var(--ember),var(--gold2))', borderRadius:'2px' }}/>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:'1rem' }}>
                <div style={{ fontSize:'10.5px', color:'rgba(253,250,245,0.2)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:'0.7rem' }}>Top promoters — Neon Nights</div>
                {[['1','AJ','Anika J.','$840','#C0392B'],['2','MS','Marcus S.','$620','#8B4513'],['3','TR','Tara R.','$390','#1A6B3C']].map(([rank, init, name, val, bg]) => (
                  <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.55rem 0', borderBottom:'0.5px solid rgba(253,250,245,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'14px', color:'rgba(253,250,245,0.2)', width:'14px' }}>{rank}</span>
                      <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:600, color:'#fff' }}>{init}</div>
                      <span style={{ fontSize:'12px', color:'rgba(253,250,245,0.5)' }}>{name}</span>
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:600, color:'var(--gold2)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'5rem 1.75rem', background:'var(--paper)' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>Pricing</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(34px,4vw,56px)', fontWeight:400, letterSpacing:'-0.02em' }}>Grow at your <em style={{ color:'var(--gold)' }}>own pace.</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1px', background:'var(--line)', borderRadius:'18px', overflow:'hidden', border:'0.5px solid var(--line)' }}>
            {[
              { name:'Starter', price:'Free', per:'+ 3% per ticket sold', features:['Unlimited event creation','Referral & promoter links','Basic analytics','AI marketing (5/month)','Social discovery','Mobile scanning'], cta:'Get started free', featured:false },
              { name:'Pro Organizer', price:'$49', per:'per month + 2% per ticket', features:['Everything in Starter','Unlimited AI marketing','Custom promoter tiers','Promoter leaderboard','Advanced analytics','Featured placement','Priority support'], cta:'Start Pro free', featured:true },
              { name:'Enterprise', price:'Custom', per:'For large-scale events', features:['Everything in Pro','Dedicated account manager','White-label pages','API integrations','Negotiated fees','Multi-event management'], cta:'Talk to us', featured:false },
            ].map(plan => (
              <div key={plan.name} style={{ background: plan.featured ? 'var(--ink)' : 'var(--paper)', padding:'2.25rem 1.75rem' }}>
                {plan.featured && <div style={{ display:'inline-block', fontSize:'9.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(184,122,20,0.1)', color:'var(--gold)', padding:'3px 10px', borderRadius:'20px', marginBottom:'1rem' }}>Most popular</div>}
                <div style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.4)' : 'var(--warm)', marginBottom:'0.2rem' }}>{plan.name}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'48px', fontWeight:400, color: plan.featured ? 'var(--paper)' : 'var(--ink)', lineHeight:1 }}>{plan.price}</div>
                <div style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.3)' : 'var(--warm)', marginBottom:'1.75rem', fontWeight:300 }}>{plan.per}</div>
                <div style={{ height:'0.5px', background: plan.featured ? 'rgba(253,250,245,0.07)' : 'var(--line)', marginBottom:'1.25rem' }}/>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.55rem', marginBottom:'1.75rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.45)' : 'var(--warm)', fontWeight:300, display:'flex', alignItems:'flex-start', gap:'7px', lineHeight:1.4 }}>
                      <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--gold)', flexShrink:0, marginTop:'5px' }}/>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => onNavigate('signup')} style={{ display:'block', width:'100%', textAlign:'center', padding:'12px', borderRadius:'100px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s',
                  background: plan.featured ? 'var(--gold2)' : 'transparent',
                  color: plan.featured ? 'var(--ink)' : 'var(--ink)',
                  border: plan.featured ? 'none' : '0.5px solid var(--line2)'
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'7rem 1.75rem', background:'var(--ink)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(194,48,16,0.18),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'640px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(52px,8vw,92px)', fontWeight:400, lineHeight:0.93, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>
            See you<br/><em style={{ color:'var(--gold2)' }}>soon.</em>
          </h2>
          <p style={{ fontSize:'16px', color:'rgba(253,250,245,0.3)', lineHeight:1.7, fontWeight:300, marginBottom:'2.5rem' }}>
            Join 2,400+ organizers already on the waitlist.
          </p>
          {waitlistDone ? (
            <div style={{ background:'rgba(93,208,122,0.1)', border:'0.5px solid rgba(93,208,122,0.25)', borderRadius:'12px', padding:'1rem 1.5rem', fontSize:'15px', color:'#5DD07A' }}>
              🎉 You're on the list! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} style={{ display:'flex', maxWidth:'400px', margin:'0 auto', borderRadius:'100px', overflow:'hidden', border:'0.5px solid rgba(253,250,245,0.1)', background:'rgba(253,250,245,0.05)' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={{ flex:1, background:'transparent', border:'none', padding:'13px 20px', fontSize:'14px', color:'var(--paper)', fontFamily:'inherit', outline:'none' }}/>
              <button type="submit" style={{ background:'var(--paper)', color:'var(--ink)', border:'none', padding:'10px 20px', fontSize:'13px', fontWeight:600, cursor:'pointer', borderRadius:'100px', margin:'4px', fontFamily:'inherit', whiteSpace:'nowrap' }}>Get early access</button>
            </form>
          )}
          <div style={{ marginTop:'2rem', display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            {[['🍎','App Store'],['▶','Google Play']].map(([icon, name]) => (
              <div key={name} style={{ display:'inline-flex', alignItems:'center', gap:'9px', background:'rgba(253,250,245,0.06)', border:'0.5px solid rgba(253,250,245,0.09)', color:'rgba(253,250,245,0.5)', padding:'10px 18px', borderRadius:'10px', fontSize:'13px', cursor:'pointer' }}>
                <span style={{ fontSize:'18px' }}>{icon}</span>
                <span><span style={{ fontSize:'9.5px', opacity:.5, display:'block' }}>{name === 'App Store' ? 'Download on the' : 'Get it on'}</span><span style={{ fontSize:'13px', fontWeight:500 }}>{name}</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
