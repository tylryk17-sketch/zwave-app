import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Btn, EventCard } from '../components/UI'

export default function OrganizerPage({ organizerName, onNavigate }) {
  const { events, following, toggleFollow, user } = useApp()
  const isFollowing = following.includes(organizerName)
  const orgEvents = events.filter(e => e.organizer === organizerName)

  // Mock organizer data
  const organizer = {
    name: organizerName || 'LiveNation Presents',
    bio: 'Creating unforgettable event experiences since 2018. We specialize in live music, nightlife, and cultural events across major US cities.',
    location: 'Los Angeles, CA',
    website: 'zwave.app',
    followers: 2847,
    totalEvents: 48,
    totalAttendees: 24300,
    avgRating: 4.8,
    verified: true,
    genres: ['Live Music', 'Nightlife', 'Concerts', 'Festivals'],
    socialLinks: { instagram: '#', twitter: '#', tiktok: '#' },
  }

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Cover */}
      <div style={{ height:'200px', background:`linear-gradient(135deg, var(--ink2), #2C1508)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(194,48,16,0.25), transparent 60%)' }}/>
      </div>

      {/* Profile header */}
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 1.75rem' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-50px', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.25rem' }}>
            <div style={{ width:'90px', height:'90px', borderRadius:'20px', background:'linear-gradient(135deg,var(--ember),var(--gold2))', border:'3px solid var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', flexShrink:0 }}>🎤</div>
            <div style={{ paddingBottom:'0.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', fontWeight:400 }}>{organizer.name}</h1>
                {organizer.verified && <span style={{ background:'rgba(45,158,95,0.1)', color:'var(--green)', fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'100px', border:'0.5px solid rgba(45,158,95,0.2)' }}>✓ Verified</span>}
              </div>
              <div style={{ fontSize:'13px', color:'var(--warm)' }}>📍 {organizer.location}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', paddingBottom:'0.25rem', flexWrap:'wrap' }}>
            <Btn variant={isFollowing?'outline':'primary'} onClick={()=>toggleFollow(organizer.name)}>
              {isFollowing ? '✓ Following' : '+ Follow'}
            </Btn>
            <Btn variant="outline" onClick={()=>{}}>💬 Contact</Btn>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
          {[['👥', organizer.followers.toLocaleString(), 'Followers'],['🎤', organizer.totalEvents, 'Events'],['🎟', organizer.totalAttendees.toLocaleString(), 'Attendees'],['⭐', organizer.avgRating, 'Avg rating']].map(([icon,val,label]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, color:'var(--ink)', lineHeight:1, marginBottom:'3px' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem', alignItems:'start' }}>
          {/* Left */}
          <div>
            {/* Bio */}
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.5rem', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'15px', fontWeight:500, marginBottom:'0.75rem' }}>About</h2>
              <p style={{ fontSize:'14px', color:'var(--warm)', lineHeight:1.7, fontWeight:300, marginBottom:'1rem' }}>{organizer.bio}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {organizer.genres.map(g => <span key={g} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'100px', padding:'4px 12px', fontSize:'12px', color:'var(--warm)' }}>{g}</span>)}
              </div>
            </div>

            {/* Events */}
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, marginBottom:'1rem' }}>
              {orgEvents.length > 0 ? 'Upcoming events' : 'No upcoming events'}
            </h2>
            {orgEvents.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
                {orgEvents.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
              </div>
            ) : (
              <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'3rem', textAlign:'center' }}>
                <div style={{ fontSize:'36px', marginBottom:'1rem' }}>🎤</div>
                <p style={{ fontSize:'14px', color:'var(--warm)' }}>No upcoming events from this organizer right now.</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {/* Follow CTA */}
            {!isFollowing && (
              <div style={{ background:'linear-gradient(135deg,var(--ink2),#1A0F04)', border:'0.5px solid rgba(253,250,245,0.08)', borderRadius:'14px', padding:'1.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'28px', marginBottom:'0.75rem' }}>🔔</div>
                <div style={{ fontSize:'15px', fontWeight:500, color:'var(--paper)', marginBottom:'0.4rem' }}>Follow {organizer.name.split(' ')[0]}</div>
                <div style={{ fontSize:'12px', color:'rgba(253,250,245,0.4)', fontWeight:300, marginBottom:'1rem', lineHeight:1.5 }}>Get notified when they drop new events</div>
                <button onClick={()=>toggleFollow(organizer.name)} style={{ width:'100%', background:'var(--paper)', color:'var(--ink)', border:'none', borderRadius:'100px', padding:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>+ Follow</button>
              </div>
            )}

            {/* Social links */}
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem' }}>
              <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'0.75rem' }}>Connect</div>
              {[['📸 Instagram','@zwaveevents'],['🐦 Twitter / X','@zwaveevents'],['🎵 TikTok','@zwaveevents']].map(([label, handle]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0', borderBottom:'0.5px solid var(--line)', fontSize:'13px' }}>
                  <span style={{ color:'var(--warm)' }}>{label}</span>
                  <span style={{ color:'var(--gold)', fontWeight:500 }}>{handle}</span>
                </div>
              ))}
            </div>

            {/* Share profile */}
            <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'14px', padding:'1.25rem' }}>
              <div style={{ fontSize:'13px', fontWeight:500, marginBottom:'0.5rem' }}>Share this organizer</div>
              <div style={{ fontSize:'12px', color:'var(--warm)', fontFamily:'monospace', background:'var(--paper2)', borderRadius:'8px', padding:'8px 10px', marginBottom:'0.75rem', overflowX:'auto', whiteSpace:'nowrap' }}>zwave.app/org/{organizer.name.toLowerCase().replace(/\s+/g,'-')}</div>
              <button onClick={()=>{ navigator.clipboard?.writeText(`https://zwave.app/org/${organizer.name}`).catch(()=>{}); }} style={{ width:'100%', background:'var(--ink)', color:'var(--paper)', border:'none', borderRadius:'100px', padding:'9px', fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>📋 Copy link</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height:'3rem' }}/>
    </div>
  )
}
