import React from 'react'
import { useApp } from '../context/AppContext'
import { Btn } from '../components/UI'

export default function PromotersPage({ onNavigate }) {
  const { user } = useApp()

  return (
    <div style={{ paddingTop:'58px' }}>
      {/* Hero */}
      <section style={{ background:'var(--ink)', padding:'6rem 1.75rem 5rem', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 40%,rgba(194,48,16,0.2),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'680px', margin:'0 auto' }}>
          <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.75rem' }}>For Promoters</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(44px,7vw,88px)', fontWeight:400, lineHeight:0.95, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>
            Turn your<br/>network into<br/><em style={{ color:'var(--gold2)' }}>income.</em>
          </h1>
          <p style={{ fontSize:'16px', color:'rgba(253,250,245,0.4)', lineHeight:1.7, fontWeight:300, marginBottom:'2.5rem' }}>
            Get paid for every ticket you sell. No spreadsheets, no chasing organizers. Just share your link and watch the money come in.
          </p>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Btn variant="ember" size="lg" onClick={() => onNavigate('signup', 'promoter')}>Become a promoter — it's free</Btn>
            <Btn variant="outline" size="lg" onClick={() => onNavigate('login')} style={{ borderColor:'rgba(253,250,245,0.2)', color:'rgba(253,250,245,0.6)' }}>Log in</Btn>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--paper)' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>How it works</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:400, letterSpacing:'-0.02em' }}>Three steps to <em style={{ color:'var(--gold)' }}>getting paid.</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'var(--line)', borderRadius:'18px', overflow:'hidden', border:'0.5px solid var(--line)' }}>
            {[
              { step:'01', icon:'🔗', title:'Get your referral link', desc:'Pick any event on Zwave and generate your unique referral link in one click. Share it anywhere — Instagram, WhatsApp, TikTok, text, anywhere.' },
              { step:'02', icon:'📊', title:'Track every sale live', desc:'Your dashboard updates in real time. See clicks, conversions, revenue, and commission as they happen — no waiting, no guessing.' },
              { step:'03', icon:'💰', title:'Get paid automatically', desc:'Commissions are calculated and paid out on your schedule. No invoices, no spreadsheets, no chasing organizers. Just money.' },
            ].map(item => (
              <div key={item.step} style={{ background:'var(--paper)', padding:'2.5rem 2rem' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'44px', color:'rgba(12,7,2,0.06)', lineHeight:1, marginBottom:'1rem' }}>{item.step}</div>
                <div style={{ fontSize:'28px', marginBottom:'1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize:'16px', fontWeight:500, color:'var(--ink)', marginBottom:'0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.65, fontWeight:300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--ink)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(253,250,245,0.07)', borderRadius:'18px', overflow:'hidden' }}>
            {[['10%','Average commission rate'],['$235','Avg monthly earnings'],['Real-time','Dashboard updates'],['Auto','Payout processing']].map(([val, label]) => (
              <div key={label} style={{ background:'rgba(253,250,245,0.03)', padding:'2rem 1.5rem', textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'36px', fontWeight:400, color:'var(--gold2)', lineHeight:1, marginBottom:'0.5rem' }}>{val}</div>
                <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.35)', lineHeight:1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--paper2)' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>Features</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:400, letterSpacing:'-0.02em' }}>Everything you <em style={{ color:'var(--gold)' }}>need.</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
            {[
              { icon:'🔗', title:'Unique referral links', desc:'One link per event, all tracked separately. Share across multiple platforms at once.' },
              { icon:'📊', title:'Live analytics', desc:'Clicks, conversions, revenue, and commission updated in real time on your dashboard.' },
              { icon:'🏆', title:'Promoter leaderboard', desc:'See where you rank against other promoters for every event. Compete and win.' },
              { icon:'💳', title:'Automatic payouts', desc:'Set your payout schedule and Zwave handles the rest. No invoices needed.' },
              { icon:'📱', title:'Mobile friendly', desc:'Manage your links and track sales from your phone anywhere, anytime.' },
              { icon:'🎟', title:'Promote any event', desc:'Browse all events on Zwave and become a promoter for any of them instantly.' },
            ].map(f => (
              <div key={f.title} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.75rem 1.5rem', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(12,7,2,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
              >
                <div style={{ fontSize:'26px', marginBottom:'0.85rem' }}>{f.icon}</div>
                <div style={{ fontSize:'15px', fontWeight:500, color:'var(--ink)', marginBottom:'0.4rem' }}>{f.title}</div>
                <div style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.6, fontWeight:300 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section style={{ padding:'5rem 1.75rem', background:'var(--paper)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>Your dashboard</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(30px,4vw,48px)', fontWeight:400, letterSpacing:'-0.02em', marginBottom:'1rem' }}>See everything in <em style={{ color:'var(--gold)' }}>real time.</em></h2>
            <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, marginBottom:'2rem' }}>Your personal promoter dashboard shows every click, every sale, every dollar — updated live. Know exactly where you stand at all times.</p>
            <Btn variant="primary" onClick={() => onNavigate('signup', 'promoter')}>Get started free →</Btn>
          </div>
          {/* Mock dashboard */}
          <div style={{ background:'var(--ink)', borderRadius:'18px', overflow:'hidden' }}>
            <div style={{ padding:'1.1rem 1.4rem', borderBottom:'0.5px solid rgba(253,250,245,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(253,250,245,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Promoter Dashboard</span>
              <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'rgba(253,250,245,0.25)' }}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#5DD07A', display:'inline-block' }}/>Live
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(253,250,245,0.05)' }}>
              {[['Tickets sold','47','var(--paper)'],['Revenue','$2,350','var(--gold2)'],['Commission','$235','#5DD07A'],['Clicks','1,204','var(--ember2)']].map(([label,val,color]) => (
                <div key={label} style={{ background:'var(--ink)', padding:'1rem 1.25rem' }}>
                  <div style={{ fontSize:'10px', color:'rgba(253,250,245,0.25)', marginBottom:'5px', letterSpacing:'0.04em' }}>{label}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', color, fontWeight:400, lineHeight:1 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'1.1rem 1.4rem' }}>
              <div style={{ fontSize:'10px', color:'rgba(253,250,245,0.2)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Your rank — Neon Nights</div>
              {[['1','Anika J.','$840'],['2','You 👈','$235'],['3','Tara R.','$180']].map(([rank,name,val]) => (
                <div key={rank} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.45rem 0', borderBottom:'0.5px solid rgba(253,250,245,0.05)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'13px', color:'rgba(253,250,245,0.2)', width:'12px' }}>{rank}</span>
                    <span style={{ fontSize:'12px', color: name.includes('You') ? 'var(--gold2)' : 'rgba(253,250,245,0.45)', fontWeight: name.includes('You') ? 600 : 400 }}>{name}</span>
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:600, color:'var(--gold2)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'6rem 1.75rem', background:'var(--ink)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 60% at 50% 50%,rgba(194,48,16,0.18),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'540px', margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(40px,6vw,72px)', fontWeight:400, lineHeight:0.95, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>
            Ready to<br/><em style={{ color:'var(--gold2)' }}>start earning?</em>
          </h2>
          <p style={{ fontSize:'15px', color:'rgba(253,250,245,0.35)', marginBottom:'2rem', fontWeight:300 }}>Free to join. No upfront costs. Get paid for every ticket you sell.</p>
          <Btn variant="ember" size="lg" onClick={() => onNavigate('signup', 'promoter')}>Create your promoter account</Btn>
        </div>
      </section>
    </div>
  )
}
