import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, EventCard } from '../components/UI'

export default function OrganizerPage({ organizerName, onNavigate }) {
  const { events, following, toggleFollow, user } = useApp()
  const isFollowing = following.includes(organizerName)
  const orgEvents = events.filter(e => e.organizer === organizerName)
  const [activeTab, setActiveTab] = useState('events')

  const organizer = {
    name: organizerName || 'LiveNation Presents',
    bio: 'Creating unforgettable event experiences. We specialize in live music, nightlife, and cultural events across major US cities.',
    location: 'Los Angeles, CA',
    followers: 2847,
    totalEvents: 48,
    totalAttendees: 24300,
    avgRating: 4.8,
    verified: true,
    genres: ['Live Music', 'Nightlife', 'Concerts', 'Festivals'],
    founded: '2018',
    website: 'zwave.fun',
  }

  const reviews = [
    { name:'Jordan M.', rating:5, text:'Every event is perfectly organized. Never had a bad experience.', date:'May 2025' },
    { name:'Alicia K.', rating:5, text:'The production quality is unmatched. Worth every penny.', date:'Apr 2025' },
    { name:'Devon R.', rating:4, text:'Great events, sometimes the lineup changes but always a good time.', date:'Mar 2025' },
  ]

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Cover */}
      <div style={{ height:'240px', background:'linear-gradient(135deg,var(--ink2),#2C1508)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(194,48,16,0.25),transparent 60%)' }}/>
        <div style={{ position:'absolute', bottom:'1.5rem', left:'1.75rem', right:'1.75rem', zIndex:1, display:'flex', justifyContent:'flex-end', gap:'0.75rem' }}>
          <button onClick={() => onNavigate('demo')} style={{ background:'rgba(253,250,245,0.1)', border:'0.5px solid rgba(253,250,245,0.2)', borderRadius:'100px', padding:'8px 18px', fontSize:'13px', color:'rgba(253,250,245,0.7)', cursor:'pointer', fontFamily:'inherit' }}>💬 Contact</button>
          <button style={{ background:'rgba(253,250,245,0.1)', border:'0.5px solid rgba(253,250,245,0.2)', borderRadius:'100px', padding:'8px 18px', fontSize:'13px', color:'rgba(253,250,245,0.7)', cursor:'pointer', fontFamily:'inherit' }}>📤 Share</button>
        </div>
      </div>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 1.75rem 3rem' }}>
        {/* Profile header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-50px', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.25rem' }}>
            <div style={{ width:'90px', height:'90px', borderRadius:'20px', background:'linear-gradient(135deg,var(--ember),var(--gold2))', border:'3px solid var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', flexShrink:0 }}>🎤</div>
            <div style={{ paddingBottom:'0.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', fontWeight:400 }}>{organizer.name}</h1>
                {organizer.verified && <span style={{ background:'rgba(45,158,95,0.1)', color:'var(--green)', fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'100px', border:'0.5px solid rgba(45,158,95,0.2)' }}>✓ Verified</span>}
              </div>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>📍 {organizer.location} · Since {organizer.founded}</div>
            </div>
          </div>
          <Btn variant={isFollowing?'outline':'primary'} onClick={() => toggleFollow(organizer.name)}>
            {isFollowing ? '✓ Following' : '+ Follow'}
          </Btn>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[['👥',organizer.followers.toLocaleString(),'Followers'],['🎤',organizer.totalEvents,'Events'],['🎟',organizer.totalAttendees.toLocaleString(),'Attendees'],['⭐',organizer.avgRating,'Avg rating']].map(([icon,val,label]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, color:'var(--ink)', lineHeight:1, marginBottom:'3px' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--line)', marginBottom:'1.5rem', background:'var(--paper)', borderRadius:'12px 12px 0 0', padding:'0 1rem' }}>
          {[['events','🎤 Events'],['about','📄 About'],['reviews','⭐ Reviews']].map(([tab,label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background:'none', border:'none', borderBottom: activeTab===tab?'2px solid var(--gold)':'2px solid transparent', padding:'1rem 1.25rem', fontSize:'13px', fontWeight:activeTab===tab?500:400, color:activeTab===tab?'var(--ink)':'var(--warm)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>{label}</button>
          ))}
        </div>

        {/* Events tab */}
        {activeTab === 'events' && (
          <div>
            {orgEvents.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
                {orgEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
              </div>
            ) : (
              <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'4rem', textAlign:'center' }}>
                <div style={{ fontSize:'40px', marginBottom:'1rem' }}>🎤</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.5rem' }}>No upcoming events</h3>
                <p style={{ fontSize:'14px', color:'var(--warm)' }}>Follow this organizer to get notified when they post new events.</p>
                <div style={{ marginTop:'1.25rem' }}>
                  <Btn variant="primary" onClick={() => toggleFollow(organizer.name)}>{isFollowing?'✓ Following':'+ Follow for updates'}</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About tab */}
        {activeTab === 'about' && (
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }}>
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
              <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'0.75rem' }}>About</h3>
              <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, marginBottom:'1.25rem' }}>{organizer.bio}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {organizer.genres.map(g => <span key={g} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'4px 12px', fontSize:'12px', color:'var(--warm)' }}>{g}</span>)}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {!isFollowing && (
                <div style={{ background:'linear-gradient(135deg,var(--ink2),#1A0F04)', border:'0.5px solid rgba(253,250,245,0.08)', borderRadius:'14px', padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:'28px', marginBottom:'0.75rem' }}>🔔</div>
                  <div style={{ fontSize:'14px', fontWeight:500, color:'var(--paper)', marginBottom:'0.4rem' }}>Follow {organizer.name.split(' ')[0]}</div>
                  <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.4)', marginBottom:'1rem', lineHeight:1.5 }}>Get notified when they drop new events</div>
                  <button onClick={() => toggleFollow(organizer.name)} style={{ width:'100%', background:'var(--paper)', color:'var(--ink)', border:'none', borderRadius:'100px', padding:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>+ Follow</button>
                </div>
              )}
              <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem' }}>
                <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'0.75rem' }}>Share profile</div>
                <div style={{ fontSize:'12px', color:'var(--warm)', fontFamily:'monospace', background:'var(--paper2)', borderRadius:'8px', padding:'8px 10px', marginBottom:'0.75rem', overflowX:'auto', whiteSpace:'nowrap' }}>zwave.fun/org/{organizer.name.toLowerCase().replace(/\s+/g,'-')}</div>
                <button onClick={() => navigator.clipboard?.writeText(`https://zwave.fun/org/${organizer.name}`).catch(()=>{})} style={{ width:'100%', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'9px', fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>📋 Copy link</button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'1.25rem', background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', marginBottom:'1.25rem' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'52px', fontWeight:400, color:'var(--ink)', lineHeight:1 }}>{organizer.avgRating}</div>
                <div style={{ fontSize:'20px', letterSpacing:'2px', color:'var(--gold)', marginTop:'4px' }}>★★★★★</div>
                <div style={{ fontSize:'11px', color:'var(--warm)', marginTop:'4px' }}>{reviews.length} reviews</div>
              </div>
              <div style={{ flex:1 }}>
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  return (
                    <div key={star} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                      <span style={{ fontSize:'11px', color:'var(--warm)', width:'8px' }}>{star}</span>
                      <div style={{ flex:1, height:'4px', background:'var(--paper3)', borderRadius:'2px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${reviews.length?Math.round(count/reviews.length*100):0}%`, background:'var(--gold)', borderRadius:'2px' }}/>
                      </div>
                      <span style={{ fontSize:'11px', color:'var(--warm)', width:'16px' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {reviews.map((r,i) => (
                <div key={i} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,var(--ember),var(--gold2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:600, color:'#fff' }}>{r.name.charAt(0)}</div>
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
      </div>
    </div>
  )
}
