import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { EventCard } from '../components/UI'
import { searchEvents, getTrendingEvents } from '../lib/ticketmaster'

const CATEGORIES = ['All','Music','Sports','Arts & Theatre','Family','Film','Concerts','Festivals','Nightlife','Day Parties','Business']
const CITIES = [
  'All Cities',
  'New York, NY','Newark, NJ','Jersey City, NJ','Atlantic City, NJ',
  'Los Angeles, CA','San Diego, CA','San Francisco, CA','Oakland, CA','Sacramento, CA',
  'Miami, FL','Orlando, FL','Tampa, FL','Jacksonville, FL','Fort Lauderdale, FL',
  'Chicago, IL','Atlanta, GA','Houston, TX','Dallas, TX','Austin, TX','San Antonio, TX',
  'Philadelphia, PA','Phoenix, AZ','Las Vegas, NV','Seattle, WA','Portland, OR',
  'Boston, MA','Denver, CO','Nashville, TN','Charlotte, NC','Detroit, MI',
  'Minneapolis, MN','St. Louis, MO','Baltimore, MD','Washington, DC','New Orleans, LA',
  'Louisville, KY','Memphis, TN','Kansas City, MO','Indianapolis, IN','Columbus, OH',
  'Cleveland, OH','Cincinnati, OH','Pittsburgh, PA','Richmond, VA','Norfolk, VA',
  'Raleigh, NC','Greensboro, NC','Birmingham, AL','Jacksonville, FL','Tulsa, OK',
  'Oklahoma City, OK','Albuquerque, NM','Tucson, AZ','Sacramento, CA','Fresno, CA',
  'Toronto, Canada','Vancouver, Canada','London, UK','Manchester, UK',
]
const SORT_OPTIONS = [
  { value:'default', label:'Recommended' },
  { value:'date', label:'Soonest first' },
  { value:'price_asc', label:'Price: Low to High' },
  { value:'price_desc', label:'Price: High to Low' },
  { value:'vibe', label:'Highest Vibe Score' },
  { value:'popular', label:'Most Popular' },
]

// Event card that handles both Zwave and Ticketmaster events
function UniversalEventCard({ event, onNavigate }) {
  const pct = Math.round((event.sold / event.capacity) * 100)

  const handleClick = () => {
    if (event.isExternal) {
      window.open(event.externalUrl, '_blank', 'noopener,noreferrer')
    } else {
      onNavigate('event', event.id)
    }
  }

  return (
    <div onClick={handleClick} style={{ borderRadius:'16px', overflow:'hidden', background:'var(--paper)', border:'0.5px solid var(--line)', transition:'all 0.2s', cursor:'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(12,7,2,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
    >
      {/* Image */}
      <div style={{ aspectRatio:'16/9', position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${event.color1},${event.color2})` }}>
        {event.image && <img src={event.image} alt={event.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e => e.target.style.display='none'} />}
        <div style={{ position:'absolute', top:'0.75rem', left:'0.75rem', background:'rgba(12,7,2,0.55)', backdropFilter:'blur(8px)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'100px', padding:'4px 10px', fontSize:'10px', fontWeight:500, color:'rgba(253,250,245,0.85)' }}>{event.badge}</div>
        <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'var(--paper)', borderRadius:'100px', padding:'3px 9px', fontSize:'11px', fontWeight:600, color:'var(--ink)', display:'flex', alignItems:'center', gap:'3px' }}>✨ {event.vibe}</div>
        {event.isExternal && (
          <div style={{ position:'absolute', bottom:'0.75rem', right:'0.75rem', background:'rgba(12,7,2,0.7)', backdropFilter:'blur(8px)', borderRadius:'100px', padding:'3px 9px', fontSize:'10px', fontWeight:500, color:'rgba(253,250,245,0.7)' }}>🎟 Ticketmaster</div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding:'1rem' }}>
        <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>{event.date}</div>
        <div style={{ fontSize:'15px', fontWeight:500, color:'var(--ink)', marginBottom:'4px', lineHeight:1.3 }}>{event.title}</div>
        <div style={{ fontSize:'12px', color:'var(--warm)', marginBottom:'0.75rem' }}>📍 {event.venue}, {event.city}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)' }}>
            {event.price ? `From $${event.price}` : 'See prices'}
          </div>
          {event.isExternal ? (
            <div style={{ fontSize:'11px', color:'var(--ember)', fontWeight:500 }}>Buy on Ticketmaster →</div>
          ) : (
            <div style={{ fontSize:'11px', color:'var(--warm)' }}>{pct}% sold</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DiscoverPage({ onNavigate }) {
  const { events: zwaveEvents } = useApp()
  const [tmEvents, setTmEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [city, setCity] = useState('All Cities')
  const [sort, setSort] = useState('default')
  const [maxPrice, setMaxPrice] = useState(500)
  const [showFilters, setShowFilters] = useState(false)
  const [source, setSource] = useState('all') // 'all' | 'zwave' | 'ticketmaster'
  const searchTimeout = useRef(null)

  // Load Ticketmaster events
  useEffect(() => {
    loadTMEvents()
  }, [city, category])

  const loadTMEvents = async () => {
    setLoading(true)
    try {
      const cityName = city === 'All Cities' ? '' : city.split(',')[0]
      const cat = ['All','Concerts','Festivals','Nightlife','Day Parties','Business'].includes(category) ? '' : category
      const events = await searchEvents({ city: cityName, category: cat, size: 20 })
      setTmEvents(events)
    } catch (err) {
      console.error('TM load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle search with debounce
  const handleSearchInput = (val) => {
    setSearchInput(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setSearch(val)
      if (val.trim()) {
        setLoading(true)
        try {
          const cityName = city === 'All Cities' ? '' : city.split(',')[0]
          const events = await searchEvents({ keyword: val, city: cityName, size: 20 })
          setTmEvents(events)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
      } else {
        loadTMEvents()
      }
    }, 500)
  }

  // Combine and filter events
  const allEvents = useMemo(() => {
    let zwave = zwaveEvents.filter(e => e.status === 'published' || e.status === 'on_sale')
    let tm = tmEvents

    if (source === 'zwave') return zwave
    if (source === 'ticketmaster') return tm

    // Filter Zwave events
    if (search) zwave = zwave.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'All') zwave = zwave.filter(e => e.category === category)
    if (city !== 'All Cities') zwave = zwave.filter(e => e.city.includes(city.split(',')[0]))
    zwave = zwave.filter(e => !e.price || e.price <= maxPrice)

    // Combine — Zwave events first, then Ticketmaster
    const combined = [...zwave, ...tm.filter(e => !e.price || e.price <= maxPrice)]

    // Sort
    if (sort === 'price_asc') return combined.sort((a,b) => (a.price||0) - (b.price||0))
    if (sort === 'price_desc') return combined.sort((a,b) => (b.price||0) - (a.price||0))
    if (sort === 'vibe') return combined.sort((a,b) => b.vibe - a.vibe)
    if (sort === 'popular') return combined.sort((a,b) => b.sold - a.sold)

    return combined
  }, [zwaveEvents, tmEvents, search, category, city, sort, maxPrice, source])

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Search header */}
      <div style={{ background:'var(--ink)', padding:'2.5rem 1.75rem' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.5rem' }}>Discover</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:400, color:'var(--paper)', lineHeight:1, marginBottom:'1.5rem' }}>
            Find your next <em style={{ color:'var(--gold2)' }}>wave.</em>
          </h1>

          {/* Search bar */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1rem' }}>
            <div style={{ flex:1, minWidth:'200px', display:'flex', alignItems:'center', gap:'10px', background:'rgba(253,250,245,0.08)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'12px', padding:'12px 16px' }}>
              <span style={{ fontSize:'16px', opacity:0.6 }}>🔍</span>
              <input value={searchInput} onChange={e => handleSearchInput(e.target.value)} placeholder="Search events, artists, venues..."
                style={{ background:'none', border:'none', outline:'none', fontSize:'14px', color:'var(--paper)', fontFamily:'inherit', flex:1 }} />
              {loading && <div style={{ width:'16px', height:'16px', border:'2px solid rgba(253,250,245,0.2)', borderTop:'2px solid var(--gold2)', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 }}/>}
            </div>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ background:'rgba(253,250,245,0.08)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'var(--paper)', fontFamily:'inherit', cursor:'pointer', outline:'none', minWidth:'160px' }}>
              {CITIES.map(c => <option key={c} value={c} style={{ background:'var(--ink)', color:'var(--paper)' }}>{c}</option>)}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'rgba(184,122,20,0.2)' : 'rgba(253,250,245,0.08)', border:`0.5px solid ${showFilters ? 'rgba(184,122,20,0.4)' : 'rgba(253,250,245,0.12)'}`, borderRadius:'12px', padding:'12px 20px', fontSize:'14px', color: showFilters ? 'var(--gold2)' : 'rgba(253,250,245,0.7)', cursor:'pointer', fontFamily:'inherit' }}>
              ⚙️ Filters {showFilters ? '▲' : '▼'}
            </button>
          </div>

          {/* Source toggle */}
          <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem' }}>
            {[['all','🌐 All Events'],['zwave','⚡ Zwave Events'],['ticketmaster','🎟 Ticketmaster']].map(([val, label]) => (
              <button key={val} onClick={() => setSource(val)} style={{ padding:'6px 14px', borderRadius:'100px', fontSize:'12px', fontWeight:500, cursor:'pointer', border:'0.5px solid', fontFamily:'inherit', transition:'all 0.15s',
                background: source===val ? 'var(--paper)' : 'rgba(253,250,245,0.07)',
                color: source===val ? 'var(--ink)' : 'rgba(253,250,245,0.55)',
                borderColor: source===val ? 'var(--paper)' : 'rgba(253,250,245,0.1)'
              }}>{label}</button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div style={{ background:'rgba(253,250,245,0.05)', border:'0.5px solid rgba(253,250,245,0.08)', borderRadius:'14px', padding:'1.25rem', animation:'fadeUp 0.2s ease' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1.25rem', alignItems:'start' }}>
                <div>
                  <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(253,250,245,0.35)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Sort by</div>
                  <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:'rgba(253,250,245,0.08)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', color:'var(--paper)', fontFamily:'inherit', cursor:'pointer', outline:'none', width:'100%' }}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background:'var(--ink)' }}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(253,250,245,0.35)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Max price: <span style={{ color:'var(--gold2)' }}>{maxPrice === 500 ? 'Any' : `$${maxPrice}`}</span></div>
                  <input type="range" min="0" max="500" step="5" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width:'100%', accentColor:'var(--gold2)', cursor:'pointer' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'rgba(253,250,245,0.25)', marginTop:'3px' }}><span>Free</span><span>$500+</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end' }}>
                  <button onClick={() => { setSearch(''); setSearchInput(''); setCategory('All'); setCity('All Cities'); setSort('default'); setMaxPrice(500); setSource('all') }}
                    style={{ background:'none', border:'0.5px solid rgba(253,250,245,0.15)', borderRadius:'8px', padding:'9px 16px', fontSize:'13px', color:'rgba(253,250,245,0.5)', cursor:'pointer', fontFamily:'inherit' }}>
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category pills */}
          <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.25rem', scrollbarWidth:'none', marginTop:'0.75rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ flexShrink:0, padding:'7px 16px', borderRadius:'100px', fontSize:'13px', cursor:'pointer', border:'0.5px solid', transition:'all 0.15s', fontFamily:'inherit', whiteSpace:'nowrap',
                background: category===cat ? 'var(--paper)' : 'rgba(253,250,245,0.07)',
                color: category===cat ? 'var(--ink)' : 'rgba(253,250,245,0.55)',
                borderColor: category===cat ? 'var(--paper)' : 'rgba(253,250,245,0.1)'
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'2rem 1.75rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.5rem' }}>
          <div style={{ fontSize:'14px', color:'var(--warm)' }}>
            {loading ? 'Loading events…' : <><strong style={{ color:'var(--ink)' }}>{allEvents.length}</strong> event{allEvents.length !== 1 ? 's' : ''} found{search && ` for "${search}"`}</>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', color:'var(--warm)', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius:'16px', overflow:'hidden', background:'var(--paper)', border:'0.5px solid var(--line)' }}>
                <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,var(--paper2),var(--paper3))', animation:'pulse 1.5s ease infinite' }}/>
                <div style={{ padding:'1rem' }}>
                  <div style={{ height:'12px', background:'var(--paper2)', borderRadius:'6px', marginBottom:'8px', width:'60%' }}/>
                  <div style={{ height:'16px', background:'var(--paper2)', borderRadius:'6px', marginBottom:'8px' }}/>
                  <div style={{ height:'12px', background:'var(--paper2)', borderRadius:'6px', width:'80%' }}/>
                </div>
              </div>
            ))}
          </div>
        ) : allEvents.length === 0 ? (
          <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
            <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🔍</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', fontWeight:400, marginBottom:'0.75rem' }}>No events found</h2>
            <p style={{ fontSize:'14px', color:'var(--warm)' }}>Try a different city, category, or search term.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
            {allEvents.map(event => (
              <UniversalEventCard key={event.id} event={event} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
