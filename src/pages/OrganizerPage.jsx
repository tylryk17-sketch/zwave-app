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
    bio: 'Creating unforgettable event experiences. We specialize in live music, nightlife, and cultural events across major US cities.',
    location: 'Los Angeles, CA',
    website: 'zwave.fun',
    followers: 2847,
    totalEvents: 48,
    totalAttendees: 24300,
    avgRating: 4.8,
    totalRevenue: '$284,000',
    verified: true,
    genres: ['Live Music', 'Nightlife', 'Concerts', 'Festivals'],
    socialLinks: { instagram: '#', twitter: '#', tiktok: '#' },
    reviews: [
      { name:'Jordan M.', rating:5, text:'Best organizer in the city. Every event is perfectly executed.', date:'Jun 2025' },
      { name:'Alicia K.', rating:5, text:'Amazing vibes, great crowd, always worth the ticket price.', date:'May 2025' },
      { name:'Marcus T.', rating:4, text:'Production quality is always top notch. Highly recommend.', date:'Apr 2025' },
    ]
  }

  const TABS = ['events', 'reviews', 'about']

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Cover */}
      <div style={{ height:'240px', background:'linear-gradient(135deg,var(--ink2),#2C1508)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 30% 50%,rgba(194,48,16,0.25),transparent 60%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(200,134,26,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,134,26,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }}/>
      </div>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 1.75rem 3rem' }}>
        {/* Profile header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:'-55px', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.25rem' }}>
            <div style={{ width:'96px', height:'96px', borderRadius:'22px', background:'linear-gradient(135deg,var(--ember),var(--gold2))', border:'4px solid var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', flexShrink:0 }}>🎤</div>
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
            <Btn variant="outline" onClick={()=>onNavigate('demo')}>💬 Book a meeting</Btn>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.75rem', marginBottom:'2rem' }}>
          {[
            ['👥', organizer.followers.toLocaleString(), 'Followers'],
            ['🎤', organizer.totalEvents, 'Events'],
            ['🎟', organizer.totalAttendees.toLocaleString(), 'Attendees'],
            ['⭐', organizer.avgRating, 'Avg rating'],
            ['💰', organizer.totalRevenue, 'Revenue earned'],
          ].map(([icon,val,label]) => (
            <div key={label} style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, color:'var(--ink)', lineHeight:1, marginBottom:'3px' }}>{val}</div>
              <div style={{ fontSize:'11px', color:'var(--warm)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--line)', marginBottom:'1.5rem' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              background:'none', border:'none', borderBottom:activeTab===tab?'2px solid var(--gold)':'2px solid transparent',
              padding:'0.75rem 1.25rem', fontSize:'13px', fontWeight:activeTab===tab?500:400,
              color:activeTab===tab?'var(--ink)':'var(--warm)', cursor:'pointer', fontFamily:'inherit',
              textTransform:'capitalize', transition:'all 0.15s'
            }}>{tab === 'events' ? `Events (${orgEvents.length || organizer.totalEvents})` : tab === 'reviews' ? `Reviews (${organizer.reviews.length})` : 'About'}</button>
          ))}
        </div>

        {/* EVENTS TAB */}
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
                {!
