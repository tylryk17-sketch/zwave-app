import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { EventCard } from '../components/UI'

const CATEGORIES = ['All','Concerts','Festivals','Nightlife','Day Parties','Arts & Culture','Sports','Business','Food & Drink','Education']
const CITIES = [
  'All Cities',
  // Northeast
  'New York, NY','Newark, NJ','Jersey City, NJ','Trenton, NJ','Atlantic City, NJ',
  'Philadelphia, PA','Pittsburgh, PA','Allentown, PA',
  'Boston, MA','Worcester, MA','Springfield, MA',
  'Hartford, CT','New Haven, CT','Bridgeport, CT',
  'Providence, RI',
  'Manchester, NH','Concord, NH',
  'Portland, ME','Bangor, ME',
  'Burlington, VT','Montpelier, VT',
  'Albany, NY','Buffalo, NY','Rochester, NY','Syracuse, NY','Yonkers, NY',
  'Wilmington, DE','Dover, DE',
  'Baltimore, MD','Annapolis, MD','Rockville, MD',
  'Washington, DC',
  // Southeast
  'Atlanta, GA','Augusta, GA','Savannah, GA','Columbus, GA','Macon, GA',
  'Miami, FL','Orlando, FL','Tampa, FL','Jacksonville, FL','Fort Lauderdale, FL','St. Petersburg, FL','Tallahassee, FL','Gainesville, FL','Pensacola, FL',
  'Charlotte, NC','Raleigh, NC','Greensboro, NC','Durham, NC','Winston-Salem, NC','Fayetteville, NC',
  'Columbia, SC','Charleston, SC','Greenville, SC','Myrtle Beach, SC',
  'Nashville, TN','Memphis, TN','Knoxville, TN','Chattanooga, TN','Clarksville, TN',
  'Birmingham, AL','Montgomery, AL','Huntsville, AL','Mobile, AL',
  'Jackson, MS','Gulfport, MS','Biloxi, MS',
  'Louisville, KY','Lexington, KY','Bowling Green, KY',
  'Richmond, VA','Virginia Beach, VA','Norfolk, VA','Chesapeake, VA','Newport News, VA',
  'Charleston, WV','Huntington, WV','Morgantown, WV',
  'New Orleans, LA','Baton Rouge, LA','Shreveport, LA','Lafayette, LA',
  'Little Rock, AR','Fort Smith, AR','Fayetteville, AR',
  // Midwest
  'Chicago, IL','Aurora, IL','Naperville, IL','Joliet, IL','Rockford, IL',
  'Columbus, OH','Cleveland, OH','Cincinnati, OH','Toledo, OH','Akron, OH','Dayton, OH',
  'Detroit, MI','Grand Rapids, MI','Warren, MI','Sterling Heights, MI','Ann Arbor, MI','Lansing, MI',
  'Indianapolis, IN','Fort Wayne, IN','Evansville, IN','South Bend, IN',
  'Milwaukee, WI','Madison, WI','Green Bay, WI','Kenosha, WI',
  'Minneapolis, MN','Saint Paul, MN','Rochester, MN','Duluth, MN',
  'Kansas City, MO','St. Louis, MO','Springfield, MO','Columbia, MO',
  'Omaha, NE','Lincoln, NE','Bellevue, NE',
  'Des Moines, IA','Cedar Rapids, IA','Davenport, IA',
  'Sioux Falls, SD','Rapid City, SD',
  'Fargo, ND','Bismarck, ND',
  'Wichita, KS','Overland Park, KS','Topeka, KS',
  // Southwest
  'Houston, TX','San Antonio, TX','Dallas, TX','Austin, TX','Fort Worth, TX','El Paso, TX','Arlington, TX','Corpus Christi, TX','Plano, TX','Lubbock, TX','Irving, TX',
  'Phoenix, AZ','Tucson, AZ','Mesa, AZ','Chandler, AZ','Scottsdale, AZ','Tempe, AZ',
  'Albuquerque, NM','Santa Fe, NM','Las Cruces, NM',
  'Oklahoma City, OK','Tulsa, OK','Norman, OK',
  'Denver, CO','Colorado Springs, CO','Aurora, CO','Boulder, CO','Fort Collins, CO',
  'Salt Lake City, UT','Provo, UT','West Valley City, UT',
  'Las Vegas, NV','Henderson, NV','Reno, NV',
  // West
  'Los Angeles, CA','San Diego, CA','San Jose, CA','San Francisco, CA','Fresno, CA','Sacramento, CA','Long Beach, CA','Oakland, CA','Bakersfield, CA','Anaheim, CA','Santa Ana, CA','Riverside, CA','Stockton, CA','Irvine, CA','Compton, CA',
  'Portland, OR','Eugene, OR','Salem, OR','Gresham, OR',
  'Seattle, WA','Spokane, WA','Tacoma, WA','Vancouver, WA','Bellevue, WA',
  'Boise, ID','Nampa, ID','Meridian, ID',
  'Billings, MT','Missoula, MT','Great Falls, MT',
  'Cheyenne, WY','Casper, WY',
  'Anchorage, AK','Fairbanks, AK','Juneau, AK',
  'Honolulu, HI','Hilo, HI','Kailua, HI',
  // International
  'Toronto, Canada','Vancouver, Canada','Montreal, Canada',
  'London, UK','Manchester, UK','Birmingham, UK',
]
const SORT_OPTIONS = [{ value:'default', label:'Recommended' },{ value:'date', label:'Soonest first' },{ value:'price_asc', label:'Price: Low to High' },{ value:'price_desc', label:'Price: High to Low' },{ value:'vibe', label:'Highest Vibe Score' },{ value:'popular', label:'Most Popular' }]

export default function DiscoverPage({ onNavigate }) {
  const { events } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [city, setCity] = useState('All Cities')
  const [sort, setSort] = useState('default')
  const [maxPrice, setMaxPrice] = useState(500)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...events]
    if (search) result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'All') result = result.filter(e => e.category === category)
    if (city !== 'All Cities') result = result.filter(e => e.city.includes(city))
    result = result.filter(e => e.price <= maxPrice)
    if (sort === 'price_asc') result.sort((a,b) => a.price - b.price)
    else if (sort === 'price_desc') result.sort((a,b) => b.price - a.price)
    else if (sort === 'vibe') result.sort((a,b) => b.vibe - a.vibe)
    else if (sort === 'popular') result.sort((a,b) => b.sold - a.sold)
    return result
  }, [events, search, category, city, sort, maxPrice])

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Search header */}
      <div style={{ background:'var(--ink)', padding:'2.5rem 1.75rem' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold2)', marginBottom:'0.5rem' }}>Discover</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:400, color:'var(--paper)', lineHeight:1, marginBottom:'1.5rem' }}>
            Find your next <em style={{ color:'var(--gold2)' }}>wave.</em>
          </h1>
          {/* Main search bar */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            <div style={{ flex:1, minWidth:'200px', display:'flex', alignItems:'center', gap:'10px', background:'rgba(253,250,245,0.08)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'12px', padding:'12px 16px' }}>
              <span style={{ fontSize:'16px', opacity:0.6 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, venues, artists..."
                style={{ background:'none', border:'none', outline:'none', fontSize:'14px', color:'var(--paper)', fontFamily:'inherit', flex:1, '::placeholder': { color:'rgba(253,250,245,0.3)' } }} />
            </div>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ background:'rgba(253,250,245,0.08)', border:'0.5px solid rgba(253,250,245,0.12)', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'var(--paper)', fontFamily:'inherit', cursor:'pointer', outline:'none', minWidth:'160px' }}>
              {CITIES.map(c => <option key={c} value={c} style={{ background:'var(--ink)', color:'var(--paper)' }}>{c}</option>)}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'rgba(184,122,20,0.2)' : 'rgba(253,250,245,0.08)', border:`0.5px solid ${showFilters ? 'rgba(184,122,20,0.4)' : 'rgba(253,250,245,0.12)'}`, borderRadius:'12px', padding:'12px 20px', fontSize:'14px', color: showFilters ? 'var(--gold2)' : 'rgba(253,250,245,0.7)', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'8px' }}>
              ⚙️ Filters {showFilters ? '▲' : '▼'}
            </button>
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
                  <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(253,250,245,0.35)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Max price: <span style={{ color:'var(--gold2)' }}>${maxPrice === 500 ? 'Any' : maxPrice}</span></div>
                  <input type="range" min="0" max="500" step="5" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width:'100%', accentColor:'var(--gold2)', cursor:'pointer' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'rgba(253,250,245,0.25)', marginTop:'3px' }}><span>Free</span><span>$500+</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end' }}>
                  <button onClick={() => { setSearch(''); setCategory('All'); setCity('All Cities'); setSort('default'); setMaxPrice(500) }}
                    style={{ background:'none', border:'0.5px solid rgba(253,250,245,0.15)', borderRadius:'8px', padding:'9px 16px', fontSize:'13px', color:'rgba(253,250,245,0.5)', cursor:'pointer', fontFamily:'inherit' }}>
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category pills */}
          <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.25rem', scrollbarWidth:'none', marginTop:'1rem' }}>
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
            <strong style={{ color:'var(--ink)' }}>{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''} found
            {search && <span> for "<strong style={{ color:'var(--ink)' }}>{search}</strong>"</span>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', color:'var(--warm)', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
            <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🔍</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', fontWeight:400, marginBottom:'0.75rem' }}>No events found</h2>
            <p style={{ fontSize:'14px', color:'var(--warm)' }}>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
            {filtered.map(event => <EventCard key={event.id} event={event} onNavigate={onNavigate} />)}
          </div>
        )}
      </div>
    </div>
  )
}
