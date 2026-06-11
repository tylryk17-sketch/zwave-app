const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY
const TM_BASE = 'https://app.ticketmaster.com/discovery/v2'

export async function searchEvents({ city = '', keyword = '', category = '', size = 20, page = 0 } = {}) {
  try {
    const params = new URLSearchParams({
      apikey: TM_API_KEY,
      size,
      page,
      sort: 'date,asc',
      ...(city && { city }),
      ...(keyword && { keyword }),
      ...(category && { classificationName: category }),
    })

    const res = await fetch(`${TM_BASE}/events.json?${params}`)
    if (!res.ok) throw new Error('Ticketmaster API error')
    const data = await res.json()

    const events = data._embedded?.events || []
    return events.map(formatEvent)
  } catch (err) {
    console.error('Ticketmaster search error:', err)
    return []
  }
}

export async function getEventById(id) {
  try {
    const res = await fetch(`${TM_BASE}/events/${id}.json?apikey=${TM_API_KEY}`)
    if (!res.ok) throw new Error('Event not found')
    const data = await res.json()
    return formatEvent(data)
  } catch (err) {
    console.error('Ticketmaster getEvent error:', err)
    return null
  }
}

export async function getEventsByCity(city, size = 12) {
  return searchEvents({ city, size })
}

export async function getTrendingEvents(size = 8) {
  try {
    const params = new URLSearchParams({
      apikey: TM_API_KEY,
      size,
      sort: 'relevance,desc',
      countryCode: 'US',
    })
    const res = await fetch(`${TM_BASE}/events.json?${params}`)
    if (!res.ok) throw new Error('Ticketmaster API error')
    const data = await res.json()
    const events = data._embedded?.events || []
    return events.map(formatEvent)
  } catch (err) {
    console.error('Ticketmaster trending error:', err)
    return []
  }
}

function formatEvent(event) {
  const venue = event._embedded?.venues?.[0]
  const priceRange = event.priceRanges?.[0]
  const image = event.images?.find(i => i.ratio === '16_9' && i.width > 500) || event.images?.[0]
  const classification = event.classifications?.[0]

  return {
    id: `tm_${event.id}`,
    tmId: event.id,
    title: event.name,
    date: formatDate(event.dates?.start),
    venue: venue?.name || 'TBD',
    city: venue ? `${venue.city?.name || ''}, ${venue.state?.stateCode || ''}`.trim().replace(/^,\s*/, '') : 'TBD',
    address: venue?.address?.line1 || '',
    category: classification?.segment?.name || 'Events',
    subCategory: classification?.genre?.name || '',
    price: priceRange?.min ? Math.round(priceRange.min) : null,
    priceMax: priceRange?.max ? Math.round(priceRange.max) : null,
    image: image?.url || null,
    url: event.url, // Ticketmaster buy URL
    status: event.dates?.status?.code || 'onsale',
    vibe: parseFloat((7.5 + Math.random() * 2.5).toFixed(1)), // Generated vibe score
    sold: Math.floor(Math.random() * 500) + 50,
    capacity: 1000,
    badge: getBadge(event),
    color1: getColor(classification?.segment?.name, 0),
    color2: getColor(classification?.segment?.name, 1),
    tags: [
      classification?.segment?.name,
      classification?.genre?.name,
      venue?.city?.name,
    ].filter(Boolean),
    organizer: event.promoter?.name || 'Live Events',
    description: event.info || event.pleaseNote || `${event.name} — Live at ${venue?.name || 'TBD'}. Don't miss this incredible event.`,
    tiers: priceRange ? [
      { name: 'General Admission', price: Math.round(priceRange.min || 0), available: 100 },
      ...(priceRange.max && priceRange.max > priceRange.min ? [{ name: 'VIP', price: Math.round(priceRange.max), available: 20 }] : [])
    ] : [{ name: 'General Admission', price: 0, available: 100 }],
    isExternal: true, // Flag to show "Buy on Ticketmaster" instead of Zwave checkout
    externalUrl: event.url,
  }
}

function formatDate(dateObj) {
  if (!dateObj?.dateTime) {
    if (dateObj?.localDate) {
      const d = new Date(dateObj.localDate)
      return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
    }
    return 'TBD'
  }
  const d = new Date(dateObj.dateTime)
  return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' })
}

function getBadge(event) {
  const status = event.dates?.status?.code
  if (status === 'offsale') return '🔴 Off Sale'
  if (status === 'cancelled') return '❌ Cancelled'
  const sales = event.sales?.public
  if (sales?.startDateTime && new Date(sales.startDateTime) > new Date()) return '📅 Presale'
  return '🎟 On Sale'
}

function getColor(segment, idx) {
  const colors = {
    'Music':       ['#2C1508', '#0C0500'],
    'Sports':      ['#082C1A', '#030F08'],
    'Arts & Theatre': ['#1A082C', '#08030F'],
    'Film':        ['#2C2008', '#0F0A03'],
    'Family':      ['#082020', '#030A0A'],
  }
  return colors[segment]?.[idx] ?? (idx === 0 ? '#1A0A00' : '#0A0500')
}
