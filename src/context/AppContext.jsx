import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const MOCK_EVENTS = [
  { id: '1', title: 'Neon Nights — Summer Concert Series', date: 'Fri, Aug 8 · 10PM', venue: 'Crypto.com Arena', city: 'Los Angeles, CA', category: 'Concerts', price: 45, capacity: 500, sold: 342, vibe: 9.2, status: 'on_sale', badge: '🔥 Selling Fast', color1: '#4A1500', color2: '#1A0500', organizer: 'LiveNation Presents', description: 'An unforgettable night of live music under the stars. Featuring top-tier artists, immersive light shows, and an atmosphere you\'ll never forget.', tags: ['Live Music', 'Concert', 'Nightlife'], tiers: [{ name: 'General Admission', price: 45, available: 100 }, { name: 'VIP', price: 120, available: 20 }, { name: 'Table Package', price: 500, available: 5 }] },
  { id: '2', title: 'Electric Underground', date: 'Sat, Aug 9 · 9PM', venue: 'Brooklyn Mirage', city: 'New York, NY', category: 'Nightlife', price: 75, capacity: 800, sold: 691, vibe: 9.7, status: 'on_sale', badge: '🎤 Headliner', color1: '#001A2C', color2: '#00080F', organizer: 'BK Events Co.', description: 'Brooklyn\'s most iconic outdoor venue transforms into the ultimate underground experience. World-class DJs, state-of-the-art sound, and skyline views.', tags: ['EDM', 'Nightlife', 'Outdoor'], tiers: [{ name: 'General', price: 75, available: 80 }, { name: 'VIP Lounge', price: 180, available: 15 }] },
  { id: '3', title: 'Rooftop Sessions — Season Finale', date: 'Sun, Aug 10 · 2PM', venue: '1 Hotel Rooftop', city: 'Miami Beach, FL', category: 'Day Parties', price: 35, capacity: 200, sold: 150, vibe: 8.8, status: 'on_sale', badge: '🌅 Day Party', color1: '#1A2C00', color2: '#080F00', organizer: 'Sunset Productions', description: 'End summer the right way — rooftop views, open bar packages, live DJ sets, and the best crowd in Miami. Limited capacity. Dress to impress.', tags: ['Day Party', 'Rooftop', 'DJ'], tiers: [{ name: 'Early Bird', price: 35, available: 30 }, { name: 'Standard', price: 55, available: 20 }] },
  { id: '4', title: 'Wavelength Music Festival', date: 'Mon, Aug 25 · All Day', venue: 'Grant Park', city: 'Chicago, IL', category: 'Festivals', price: 60, capacity: 5000, sold: 3200, vibe: 9.5, status: 'on_sale', badge: '🎉 Festival', color1: '#2C0A1A', color2: '#0F0308', organizer: 'Wavefront Events', description: 'A full-day music festival featuring 4 stages, 20+ artists, food vendors, art installations, and an energy unlike anything you\'ve felt before.', tags: ['Festival', 'Multi-Stage', 'All Day'], tiers: [{ name: 'Day Pass', price: 60, available: 800 }, { name: 'Weekend Pass', price: 120, available: 200 }, { name: 'Backstage VIP', price: 350, available: 25 }] },
  { id: '5', title: 'Art After Dark', date: 'Thu, Aug 14 · 7PM', venue: 'MoCA', city: 'Los Angeles, CA', category: 'Arts & Culture', price: 25, capacity: 300, sold: 180, vibe: 8.5, status: 'on_sale', badge: '🎨 Arts', color1: '#1A1A2C', color2: '#08080F', organizer: 'Arts Collective LA', description: 'Experience the museum after hours — wine, music, and exclusive access to new exhibitions. A cultural evening curated for the curious.', tags: ['Art', 'Culture', 'Evening'], tiers: [{ name: 'General', price: 25, available: 80 }, { name: 'Patron', price: 75, available: 20 }] },
  { id: '6', title: 'The Wellness Summit 2025', date: 'Sat, Sep 6 · 9AM', venue: 'Marriott Marquis', city: 'Atlanta, GA', category: 'Business', price: 150, capacity: 1000, sold: 420, vibe: 8.1, status: 'on_sale', badge: '💼 Summit', color1: '#0A2C1A', color2: '#030F08', organizer: 'WellCo Events', description: 'A full-day summit bringing together wellness entrepreneurs, health coaches, and thought leaders. Keynotes, panels, networking, and workshops.', tags: ['Wellness', 'Business', 'Networking'], tiers: [{ name: 'Standard', price: 150, available: 300 }, { name: 'VIP All-Access', price: 400, available: 50 }] },
]

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Jordan M.', avatar: '#8B4513', going: ['1','2','4'] },
  { id: 'f2', name: 'Alicia K.', avatar: '#C0392B', going: ['1','3','4'] },
  { id: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', going: ['2','4'] },
  { id: 'f4', name: 'Sasha B.', avatar: '#7B4A9E', going: ['1','2','3','4','5'] },
  { id: 'f5', name: 'Devon L.', avatar: '#1A6B3C', going: ['4','6'] },
  { id: 'f6', name: 'Maya W.', avatar: '#B87A14', going: ['1','5'] },
]

const MOCK_CHAT = {
  '1': [
    { id: 'c1', userId: 'f1', name: 'Jordan M.', avatar: '#8B4513', message: 'Who else is going to this?? 🔥', time: '2:34 PM', likes: 5 },
    { id: 'c2', userId: 'f4', name: 'Sasha B.', avatar: '#7B4A9E', message: 'Already got my VIP tickets! Can\'t wait 🎉', time: '2:41 PM', likes: 3 },
    { id: 'c3', userId: 'f2', name: 'Alicia K.', avatar: '#C0392B', message: 'Is there parking nearby or should we Uber?', time: '3:05 PM', likes: 1 },
    { id: 'c4', userId: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', message: 'Uber for sure, parking is a nightmare around there', time: '3:08 PM', likes: 4 },
    { id: 'c5', userId: 'f6', name: 'Maya W.', avatar: '#B87A14', message: 'Dress code anyone? Smart casual or full glam?', time: '3:22 PM', likes: 2 },
  ],
  '2': [
    { id: 'c1', userId: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', message: 'Brooklyn Mirage hits different in summer 🌙', time: '1:12 PM', likes: 8 },
    { id: 'c2', userId: 'f4', name: 'Sasha B.', avatar: '#7B4A9E', message: 'The lineup this year is insane though', time: '1:45 PM', likes: 6 },
  ],
  '3': [], '4': [], '5': [], '6': [],
}

const MOCK_REVIEWS = {
  '1': [
    { id: 'r1', userId: 'f1', name: 'Jordan M.', avatar: '#8B4513', rating: 5, text: 'Absolutely incredible night. Production was top tier, crowd energy was unreal. Already bought tickets for next year.', date: 'Aug 2024', helpful: 12 },
    { id: 'r2', userId: 'f2', name: 'Alicia K.', avatar: '#C0392B', rating: 4, text: 'Amazing show, VIP section was worth every penny. Only downside was the bar lines got long after midnight.', date: 'Aug 2024', helpful: 7 },
    { id: 'r3', userId: 'f5', name: 'Devon L.', avatar: '#1A6B3C', rating: 5, text: 'Best event I\'ve been to all year. The lighting rigs alone were worth the price of admission.', date: 'Jul 2024', helpful: 9 },
  ],
  '2': [
    { id: 'r1', userId: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', rating: 5, text: 'Brooklyn Mirage never misses. The outdoor setup with the Manhattan skyline backdrop is unmatched.', date: 'Jul 2024', helpful: 15 },
  ],
  '3': [], '4': [], '5': [], '6': [],
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('zwave_user')) } catch { return null }
  })
  const [events] = useState(MOCK_EVENTS)
  const [cart, setCart] = useState([])
  const [notifications, setNotifications] = useState([])
  const [following, setFollowing] = useState([])
  const [friends] = useState(MOCK_FRIENDS)
  const [chats, setChats] = useState(MOCK_CHAT)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [referralLinks, setReferralLinks] = useState({})
  const [notifPanel, setNotifPanel] = useState(false)
  const [notifList, setNotifList] = useState([
    { id: 'n1', type: 'friend', message: 'Jordan M. is going to Neon Nights', time: '2m ago', read: false, icon: '👥' },
    { id: 'n2', type: 'sale', message: 'Your referral link made a sale! +$12', time: '1h ago', read: false, icon: '💰' },
    { id: 'n3', type: 'event', message: 'Wavelength Festival is 80% sold out', time: '3h ago', read: true, icon: '🔥' },
    { id: 'n4', type: 'follow', message: 'BK Events Co. posted a new event', time: '5h ago', read: true, icon: '🎤' },
  ])

  useEffect(() => {
    if (user) localStorage.setItem('zwave_user', JSON.stringify(user))
    else localStorage.removeItem('zwave_user')
  }, [user])

  const login = (email, password, role = 'attendee') => {
    const newUser = {
      id: 'u1', email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'User',
      role, avatar: null, joinedAt: new Date().toISOString(),
      stats: role === 'organizer'
        ? { eventsCreated: 3, totalRevenue: 8395, ticketsSold: 312 }
        : role === 'promoter'
        ? { referrals: 47, earned: 235, clicks: 1204 }
        : { eventsAttended: 12, following: 5 }
    }
    setUser(newUser)
    return newUser
  }

  const signup = (data) => {
    const newUser = { id: 'u_' + Date.now(), ...data, joinedAt: new Date().toISOString(), stats: {} }
    setUser(newUser)
    return newUser
  }

  const logout = () => setUser(null)

  const addToCart = (event, tier) => {
    setCart(prev => {
      const existing = prev.find(i => i.eventId === event.id && i.tierName === tier.name)
      if (existing) return prev.map(i => i.eventId === event.id && i.tierName === tier.name ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { eventId: event.id, eventTitle: event.title, eventDate: event.date, tierName: tier.name, price: tier.price, qty: 1 }]
    })
    notify(`Added ${tier.name} ticket to cart`, 'success')
  }

  const removeFromCart = (eventId, tierName) => setCart(prev => prev.filter(i => !(i.eventId === eventId && i.tierName === tierName)))
  const clearCart = () => setCart([])
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const notify = (message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }

  const toggleFollow = (organizerId) => {
    setFollowing(prev => prev.includes(organizerId) ? prev.filter(id => id !== organizerId) : [...prev, organizerId])
  }

  const getFriendsGoing = (eventId) => friends.filter(f => f.going.includes(eventId))

  const sendChatMessage = (eventId, message) => {
    if (!user || !message.trim()) return
    const newMsg = {
      id: 'c_' + Date.now(), userId: user.id, name: user.name,
      avatar: '#C23010', message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      likes: 0
    }
    setChats(prev => ({ ...prev, [eventId]: [...(prev[eventId] || []), newMsg] }))
  }

  const likeMessage = (eventId, msgId) => {
    setChats(prev => ({
      ...prev,
      [eventId]: prev[eventId].map(m => m.id === msgId ? { ...m, likes: m.likes + 1 } : m)
    }))
  }

  const addReview = (eventId, rating, text) => {
    if (!user) return
    const newReview = {
      id: 'r_' + Date.now(), userId: user.id, name: user.name,
      avatar: '#C23010', rating, text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      helpful: 0
    }
    setReviews(prev => ({ ...prev, [eventId]: [newReview, ...(prev[eventId] || [])] }))
    notify('Review posted! Thanks for the feedback.', 'success')
  }

  const generateReferralLink = (eventId) => {
    if (!user) return null
    const code = `${user.id}_${eventId}_${Math.random().toString(36).slice(2, 7)}`
    const link = `zwave.app/e/${eventId}?ref=${code}`
    setReferralLinks(prev => ({ ...prev, [eventId]: link }))
    notify('Referral link generated! 🔗', 'success')
    return link
  }

  const markAllRead = () => setNotifList(prev => prev.map(n => ({ ...n, read: true })))
  const unreadCount = notifList.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      events, cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount,
      notifications, notify,
      following, toggleFollow,
      friends, getFriendsGoing,
      chats, sendChatMessage, likeMessage,
      reviews, addReview,
      referralLinks, generateReferralLink,
      notifPanel, setNotifPanel, notifList, markAllRead, unreadCount
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
