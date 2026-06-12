import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, EventCard } from '../components/UI'

export default function OrganizerPage({ organizerName, onNavigate }) {
  const { events, following, toggleFollow, user } = useApp()
  const [activeTab, setActiveTab] = useState('events')
  const isFollowing = following.includes(organizerName)
  const orgEvents = events.filter(e => e.organizer === organizerName)
  const organizer = {
    name: organizerName || 'LiveNation Presents',
    bio: 'Creating unforgettable event experiences across major US cities.',
    location: 'Los Angeles, CA',
    followers: 2847, totalEvents: 48, totalAttendees: 24300, avgRating: 4.8,
    verified: true,
    genres: ['Live Music', 'Nightlife', 'Concerts', 'Festivals'],
    reviews: [
      { name:'Jordan M.', rating:5, text:'Best organizer in the city. Every event is perfectly executed.', date:'Jun 2025' },
      { name:'Alicia K.', rating:5, text:'Amazing vibes, great crowd, always worth the ticket price.', date:'May 2025' },
      { name:'Marcus T.', rating:4, text:'Production quality is always top notch. Highly recommend.', date:'Apr 2025' },
    ]
  }
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      <div style={{ height:'220px', background:'linear-gradient(135deg,var(--ink2),#2C1508)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(194,48,16,0.25),transparent 60%)' }}/>
      </div>
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 1.75rem 3rem' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-55px', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.25rem' }}>
            <div style={{ width:'96px', height:'96px', borderRadius:'22px', background:'linear-gradient(135deg,var(--ember),var(--gold2))', border:'4px solid var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', flexShrink:0 }}>🎤</div>
            <div style={{ paddingBottom:'0.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', fontWeight:400 }}>{organizer.name}</h1>
                {organizer.verified && <span style={{ background:'rgba(45,158,95,0.1)', color:'var(--green)', fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'100px' }}>✓ Verified</span>}
              </div>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>📍 {organizer.location}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', paddingBottom:'0.25rem' }}>
            <Btn variant={isFollowing?'outline':'primary'} onClick={()=>toggleFollow(organizer.name)}>{isFollowing ? '✓ Following' : '+ Follow'}</Btn>
            <Btn variant="outline" onClick={()=>onNavigate('demo')}>💬 Book a meeting</Btn>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'2rem' }}>
          {[['👥',organizer.followers.toLocaleString(),'Followers'],['🎤',organizer.totalEvents,'Events'],['🎟',organizer.totalAttendees.toLocaleString(),'Attendees'],['⭐',organizer.avgRating,'Rating']].map(([icon,val,label]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, color:'var(--ink)', lineHeight:1, marginBottom:'3px' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--line)', marginBottom:'1.5rem' }}>
          {['events','reviews','about'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{ background:'none', border:'none', borderBottom:activeTab===tab?'2px solid var(--gold)':'2px solid transparent', padding:'0.75rem 1.25rem', fontSize:'13px', fontWeight:activeTab===tab?500:400, color:activeTab===tab?'var(--ink)':'var(--warm)', cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize' }}>
              {tab === 'events' ? `Events (${orgEvents.length || organizer.totalEvents})` : tab === 'reviews' ? `Reviews (${organizer.reviews.length})` : 'About'}
            </button>
          ))}
        </div>
        {activeTab === 'events' && (
          <div>
            {orgEvents.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
                {orgEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
              </div>
            ) : (
              <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'16px', padding:'4rem', textAlign:'center' }}>
                <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🎤</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.5rem' }}>No upcoming events</h3>
                <p style={{ fontSize:'14px', color:'var(--warm)' }}>Follow this organizer to get notified when they post new events.</p>
                {!isFollowing && <div style={{ marginTop:'1.5rem' }}><Btn variant="primary" onClick={()=>toggleFollow(organizer.name)}>+ Follow</Btn></div>}
              </div>
            )}
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {organizer.reviews.map((r,i) => (
              <div key={i} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,var(--ember),var(--gold2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:600, color:'#fff' }}>{r.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize:'13px', fontWeight:500 }}>{r.name}</div>
                      <div style={{ fontSize:'11px', color:'var(--warm)' }}>{r.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:'14px', color:'var(--gold)' }}>{"★".repeat(r.rating)}</div>
                </div>
                <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.6, fontWeight:300 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'about' && (
          <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem' }}>
            <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'0.75rem' }}>About</h3>
            <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, marginBottom:'1rem' }}>{organizer.bio}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {organizer.genres.map(g => <span key={g} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'4px 12px', fontSize:'12px', color:'var(--warm)' }}>{g}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
