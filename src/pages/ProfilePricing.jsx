import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, Input, EventCard } from '../components/UI'

export function ProfilePage({ onNavigate }) {
  const { user, logout, events } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: '', location: '' })

  if (!user) { onNavigate('login'); return null }

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Cover */}
      <div style={{ height:'180px', background:'linear-gradient(135deg,var(--ink2),var(--ink))', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(194,48,16,0.2),transparent 60%)' }}/>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 1.75rem 3rem' }}>
        {/* Avatar + name */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-40px', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.25rem' }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,var(--ember),var(--gold2))', border:'3px solid var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', fontWeight:700, color:'#fff', flexShrink:0 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ paddingBottom:'0.25rem' }}>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', fontWeight:400, marginBottom:'2px' }}>{user.name}</h1>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>
                {user.role === 'organizer' ? '🎤 Event Organizer' : user.role === 'promoter' ? '🔗 Promoter' : '🎟 Fan / Attendee'}
                &nbsp;·&nbsp; Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month:'long', year:'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <Btn variant="outline" size="sm" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : '✏️ Edit profile'}</Btn>
            <Btn variant="ghost" size="sm" onClick={() => { logout(); onNavigate('home') }}>Log out</Btn>
          </div>
        </div>

        {editing ? (
          <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'16px', padding:'1.75rem', marginBottom:'2rem' }}>
            <h2 style={{ fontSize:'16px', fontWeight:500, marginBottom:'1.25rem' }}>Edit profile</h2>
            <div style={{ display:'grid', gap:'1rem' }}>
              <Input label="Display name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
              <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
              <Input label="Location" value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="City, State" />
              <div>
                <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', display:'block', marginBottom:'6px' }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form,bio:e.target.value})} placeholder="Tell the community about yourself..." rows={3}
                  style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', resize:'vertical', outline:'none' }} />
              </div>
              <Btn variant="primary" size="sm" onClick={() => setEditing(false)}>Save changes</Btn>
            </div>
          </div>
        ) : null}

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {user.role === 'organizer' ? [
            ['🎟','312','Tickets sold'],['💰','$8,395','Revenue'],['🎤','3','Events created'],['⭐','4.9','Avg rating']
          ] : user.role === 'promoter' ? [
            ['🔗','47','Sales made'],['💰','$235','Commission earned'],['📊','1,204','Link clicks'],['📈','18.4%','Conversion rate']
          ] : [
            ['🎉','12','Events attended'],['❤️','5','Organizers followed'],['🔗','3','Friends invited'],['⭐','—','Reviews left']
          ].map(([icon, val, label]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.1rem', textAlign:'center' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', fontWeight:400, color:'var(--ink)', marginBottom:'2px' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming events / recommendations */}
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1rem' }}>
          {user.role === 'attendee' ? 'Events you might like' : 'Your recent events'}
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
          {events.slice(0,3).map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
        </div>
      </div>
    </div>
  )
}

export function PricingPage({ onNavigate }) {
  const { user } = useApp()
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name:'Starter', price:'Free', per:'+ 3% per ticket sold',
      annualPrice:'Free', annualPer:'+ 3% per ticket sold',
      tag:null, featured:false,
      features:['Unlimited event creation','Up to 3 ticket tiers','Referral & promoter links','Basic sales dashboard','AI marketing (5/month)','Social discovery & follow','Mobile ticket scanning','Standard support'],
      cta:'Get started free'
    },
    {
      name:'Pro Organizer', price:'$49', per:'per month + 2% per ticket',
      annualPrice:'$39', annualPer:'per month (billed $468/yr)',
      tag:'Most popular', featured:true,
      features:['Everything in Starter','Unlimited ticket tiers','Unlimited AI marketing','Custom promoter tiers & rates','Live promoter leaderboard','Advanced analytics & exports','Featured event placement','Priority support (24h response)','Early access to new features'],
      cta:'Start Pro free — 14 days'
    },
    {
      name:'Enterprise', price:'Custom', per:'For large-scale events',
      annualPrice:'Custom', annualPer:'For large-scale events',
      tag:null, featured:false,
      features:['Everything in Pro','Dedicated account manager','White-label event pages','Full API access & webhooks','Custom integrations','Negotiated ticket fees','Multi-event management','SLA support','Custom contracts'],
      cta:'Talk to our team'
    }
  ]

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh' }}>
      {/* Header */}
      <div style={{ background:'var(--ink)', padding:'5rem 1.75rem 4rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(194,48,16,0.15),transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto' }}>
          <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.75rem' }}>Pricing</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(40px,6vw,72px)', fontWeight:400, lineHeight:1, letterSpacing:'-0.025em', color:'var(--paper)', marginBottom:'1.25rem' }}>
            Grow at your<br/><em style={{ color:'var(--gold2)' }}>own pace.</em>
          </h1>
          <p style={{ fontSize:'16px', color:'rgba(253,250,245,0.35)', lineHeight:1.7, fontWeight:300, marginBottom:'2rem' }}>
            Start free. No hidden fees. Upgrade when your events scale.
          </p>
          {/* Toggle */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', background:'rgba(253,250,245,0.07)', border:'0.5px solid rgba(253,250,245,0.1)', borderRadius:'100px', padding:'6px 8px 6px 16px' }}>
            <span style={{ fontSize:'13px', color: !annual ? 'var(--paper)' : 'rgba(253,250,245,0.35)' }}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} style={{ width:'40px', height:'22px', borderRadius:'100px', background: annual ? 'var(--gold)' : 'rgba(253,250,245,0.15)', position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:'3px', left: annual ? '21px' : '3px', width:'16px', height:'16px', borderRadius:'50%', background:'white', transition:'left 0.2s' }}/>
            </div>
            <span style={{ fontSize:'13px', color: annual ? 'var(--paper)' : 'rgba(253,250,245,0.35)' }}>Annual</span>
            <span style={{ fontSize:'11px', fontWeight:600, background:'rgba(45,158,95,0.2)', color:'#5DD07A', padding:'3px 10px', borderRadius:'100px' }}>Save 20%</span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div style={{ maxWidth:'1000px', margin:'-2rem auto 0', padding:'0 1.75rem 5rem', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1px', background:'var(--line)', borderRadius:'20px', overflow:'hidden', border:'0.5px solid var(--line)', boxShadow:'0 20px 60px rgba(12,7,2,0.1)' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: plan.featured ? 'var(--ink)' : 'var(--paper)', padding:'2.5rem 2rem' }}>
              {plan.tag && <div style={{ display:'inline-block', fontSize:'9.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(184,122,20,0.12)', color:'var(--gold)', padding:'3px 10px', borderRadius:'20px', marginBottom:'1rem' }}>{plan.tag}</div>}
              {!plan.tag && <div style={{ height:'24px', marginBottom:'1rem' }}/>}
              <div style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.4)' : 'var(--warm)', marginBottom:'0.25rem' }}>{plan.name}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'52px', fontWeight:400, color: plan.featured ? 'var(--paper)' : 'var(--ink)', lineHeight:1 }}>{annual ? plan.annualPrice : plan.price}</div>
              <div style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.3)' : 'var(--warm)', marginBottom:'2rem', fontWeight:300 }}>{annual ? plan.annualPer : plan.per}</div>
              <div style={{ height:'0.5px', background: plan.featured ? 'rgba(253,250,245,0.07)' : 'var(--line)', marginBottom:'1.5rem' }}/>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'2rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize:'13px', color: plan.featured ? 'rgba(253,250,245,0.5)' : 'var(--warm)', fontWeight:300, display:'flex', alignItems:'flex-start', gap:'8px', lineHeight:1.45 }}>
                    <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--gold)', flexShrink:0, marginTop:'6px' }}/>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => {
                if (plan.id === 'pro') {
                  window.open('https://buy.stripe.com/test_placeholder', '_blank')
                } else {
                  onNavigate(user ? 'dashboard' : 'signup')
                }
              }} style={{ display:'block', width:'100%', textAlign:'center', padding:'13px', borderRadius:'100px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s',
                background: plan.featured ? 'var(--gold2)' : 'transparent',
                color: plan.featured ? 'var(--ink)' : 'var(--ink)',
                border: plan.featured ? 'none' : '0.5px solid var(--line2)'
              }}
                onMouseEnter={e => { if(!plan.featured) { e.currentTarget.style.background='var(--ink)'; e.currentTarget.style.color='var(--paper)' } }}
                onMouseLeave={e => { if(!plan.featured) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--ink)' } }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop:'4rem' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, textAlign:'center', marginBottom:'2rem' }}>Common questions</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              ['How does the ticket fee work?','Zwave charges a small % per ticket sold — 3% on Starter, 2% on Pro. There are no monthly platform fees on Starter.'],
              ['Can I switch plans anytime?','Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle.'],
              ['How do promoter commissions work?','You set the rate. Zwave automatically tracks every sale through a promoter\'s link and calculates their cut from your revenue.'],
              ['Is there a free trial for Pro?','Yes — Pro comes with a 14-day free trial. No credit card required to start.'],
              ['What payment methods are accepted?','Stripe processes all ticket payments, supporting cards, Apple Pay, and Google Pay.'],
              ['Can I issue refunds?','Yes. You control your refund policy. Zwave handles the mechanics when you approve a refund.'],
            ].map(([q,a]) => (
              <div key={q} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                <div style={{ fontSize:'14px', fontWeight:500, color:'var(--ink)', marginBottom:'0.5rem' }}>{q}</div>
                <div style={{ fontSize:'13px', color:'var(--warm)', lineHeight:1.6, fontWeight:300 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
