import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as db from '../lib/db'

const AppContext = createContext()

// Fallback mock events in case DB is empty
const MOCK_EVENTS = [
  { id: '1', title: 'Neon Nights — Summer Concert Series', date: 'Fri, Aug 8 · 10PM', venue: 'Crypto.com Arena', city: 'Los Angeles, CA', category: 'Concerts', price: 45, capacity: 500, sold: 342, vibe: 9.2, status: 'published', badge: '🔥 Selling Fast', color1: '#4A1500', color2: '#1A0500', organizer: 'LiveNation Presents', description: 'An unforgettable night of live music under the stars.', tags: ['Live Music', 'Concert', 'Nightlife'], tiers: [{ name: 'General Admission', price: 45, available: 100 }, { name: 'VIP', price: 120, available: 20 }, { name: 'Table Package', price: 500, available: 5 }] },
  { id: '2', title: 'Electric Underground', date: 'Sat, Aug 9 · 9PM', venue: 'Brooklyn Mirage', city: 'New York, NY', category: 'Nightlife', price: 75, capacity: 800, sold: 691, vibe: 9.7, status: 'published', badge: '🎤 Headliner', color1: '#001A2C', color2: '#00080F', organizer: 'BK Events Co.', description: 'Brooklyn\'s most iconic outdoor venue transforms into the ultimate underground experience.', tags: ['EDM', 'Nightlife', 'Outdoor'], tiers: [{ name: 'General', price: 75, available: 80 }, { name: 'VIP Lounge', price: 180, available: 15 }] },
  { id: '3', title: 'Rooftop Sessions — Season Finale', date: 'Sun, Aug 10 · 2PM', venue: '1 Hotel Rooftop', city: 'Miami Beach, FL', category: 'Day Parties', price: 35, capacity: 200, sold: 150, vibe: 8.8, status: 'published', badge: '🌅 Day Party', color1: '#1A2C00', color2: '#080F00', organizer: 'Sunset Productions', description: 'End summer the right way.', tags: ['Day Party', 'Rooftop', 'DJ'], tiers: [{ name: 'Early Bird', price: 35, available: 30 }, { name: 'Standard', price: 55, available: 20 }] },
  { id: '4', title: 'Wavelength Music Festival', date: 'Mon, Aug 25 · All Day', venue: 'Grant Park', city: 'Chicago, IL', category: 'Festivals', price: 60, capacity: 5000, sold: 3200, vibe: 9.5, status: 'published', badge: '🎉 Festival', color1: '#2C0A1A', color2: '#0F0308', organizer: 'Wavefront Events', description: 'A full-day music festival featuring 4 stages, 20+ artists.', tags: ['Festival', 'Multi-Stage', 'All Day'], tiers: [{ name: 'Day Pass', price: 60, available: 800 }, { name: 'Weekend Pass', price: 120, available: 200 }, { name: 'Backstage VIP', price: 350, available: 25 }] },
  { id: '5', title: 'Art After Dark', date: 'Thu, Aug 14 · 7PM', venue: 'MoCA', city: 'Los Angeles, CA', category: 'Arts & Culture', price: 25, capacity: 300, sold: 180, vibe: 8.5, status: 'published', badge: '🎨 Arts', color1: '#1A1A2C', color2: '#08080F', organizer: 'Arts Collective LA', description: 'Experience the museum after hours.', tags: ['Art', 'Culture', 'Evening'], tiers: [{ name: 'General', price: 25, available: 80 }, { name: 'Patron', price: 75, available: 20 }] },
  { id: '6', title: 'The Wellness Summit 2025', date: 'Sat, Sep 6 · 9AM', venue: 'Marriott Marquis', city: 'Atlanta, GA', category: 'Business', price: 150, capacity: 1000, sold: 420, vibe: 8.1, status: 'published', badge: '💼 Summit', color1: '#0A2C1A', color2: '#030F08', organizer: 'WellCo Events', description: 'A full-day summit for wellness entrepreneurs.', tags: ['Wellness', 'Business', 'Networking'], tiers: [{ name: 'Standard', price: 150, available: 300 }, { name: 'VIP All-Access', price: 400, available: 50 }] },
]

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Jordan M.', avatar: '#8B4513', going: ['1','2','4'] },
  { id: 'f2', name: 'Alicia K.', avatar: '#C0392B', going: ['1','3','4'] },
  { id: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', going: ['2','4'] },
  { id: 'f4', name: 'Sasha B.', avatar: '#7B4A9E', going: ['1','2','3','4','5'] },
  { id: 'f5', name: 'Devon L.', avatar: '#1A6B3C', going: ['4','6'] },
]

const MOCK_CHAT = {
  '1': [
    { id: 'c1', userId: 'f1', name: 'Jordan M.', avatar: '#8B4513', message: 'Who else is going to this?? 🔥', time: '2:34 PM', likes: 5 },
    { id: 'c2', userId: 'f4', name: 'Sasha B.', avatar: '#7B4A9E', message: 'Already got my VIP tickets! Can\'t wait 🎉', time: '2:41 PM', likes: 3 },
  ],
  '2': [{ id: 'c1', userId: 'f3', name: 'Tomas R.', avatar: '#2C5F8A', message: 'Brooklyn Mirage hits different in summer 🌙', time: '1:12 PM', likes: 8 }],
  '3': [], '4': [], '5': [], '6': [],
}

const MOCK_REVIEWS = {
  '1': [
    { id: 'r1', userId: 'f1', name: 'Jordan M.', avatar: '#8B4513', rating: 5, text: 'Absolutely incredible night. Production was top tier.', date: 'Aug 2024', helpful: 12 },
    { id: 'r2', userId: 'f2', name: 'Alicia K.', avatar: '#C0392B', rating: 4, text: 'Amazing show, VIP section was worth every penny.', date: 'Aug 2024', helpful: 7 },
  ],
  '2': [], '3': [], '4': [], '5': [], '6': [],
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [cart, setCart] = useState([])
  const [notifications, setNotifications] = useState([])
  const [following, setFollowing] = useState([])
  const [friends] = useState(MOCK_FRIENDS)
  const [chats, setChats] = useState(MOCK_CHAT)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [referralLinks, setReferralLinks] = useState({})
  const [notifPanel, setNotifPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifList, setNotifList] = useState([
    { id: 'n1', type: 'friend', message: 'Jordan M. is going to Neon Nights', time: '2m ago', read: false, icon: '👥' },
    { id: 'n2', type: 'sale', message: 'Your referral link made a sale! +$12', time: '1h ago', read: false, icon: '💰' },
    { id: 'n3', type: 'event', message: 'Wavelength Festival is 80% sold out', time: '3h ago', read: true, icon: '🔥' },
    { id: 'n4', type: 'follow', message: 'BK Events Co. posted a new event', time: '5h ago', read: true, icon: '🎤' },
  ])

  // ── AUTH LISTENER ──────────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setFollowing([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── LOAD REAL EVENTS ───────────────────────────────────
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const realEvents = await db.getEvents()
      if (realEvents && realEvents.length > 0) {
        // Merge real events with mock structure
        const formatted = realEvents.map(e => ({
          ...e,
          tiers: e.tiers || [{ name: 'General Admission', price: e.price || 0, available: e.capacity || 100 }],
          color1: e.color1 || '#1A0A00',
          color2: e.color2 || '#0A0500',
          tags: e.tags || [],
          vibe: e.vibe || 8.5,
        }))
        setEvents([...formatted, ...MOCK_EVENTS])
      }
    } catch (err) {
      console.log('Using mock events')
    }
  }

  const loadUserProfile = async (authUser) => {
    try {
      const profile = await db.getProfile(authUser.id)
      if (profile) {
        setUser({ ...profile, id: authUser.id, email: authUser.email })
        const userFollowing = await db.getFollowing(authUser.id)
        setFollowing(userFollowing)
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          role: authUser.user_metadata?.role || 'attendee',
        })
      }
    } catch (err) {
      console.error('loadUserProfile error:', err)
    }
  }

  // ── AUTH ───────────────────────────────────────────────
  const DEMO_ACCOUNTS = {
    'organizer@demo.com': { role: 'organizer', name: 'Demo Organizer' },
    'promoter@demo.com': { role: 'promoter', name: 'Demo Promoter' },
    'fan@demo.com': { role: 'attendee', name: 'Demo Fan' },
  }

  const login = async (email, password) => {
    // Demo accounts only — explicit, not a catch-all
    if (DEMO_ACCOUNTS[email] && password === 'demo') {
      const demo = DEMO_ACCOUNTS[email]
      const demoUser = {
        id: 'demo_' + email.replace('@','_').replace('.','_'),
        email,
        role: demo.role,
        name: demo.name,
        isDemo: true,
      }
      setUser(demoUser)
      notify('Welcome back! 🎉', 'success')
      return demoUser
    }
    // Real Supabase auth — errors propagate to UI
    const data = await db.signIn({ email, password })
    notify('Welcome back! 🎉', 'success')
    return data.user
  }

  const signup = async (data) => {
    // Real Supabase signup — errors propagate to UI
    await db.signUp(data)
    notify('Account created! Welcome to Zwave 🎉', 'success')
  }

  const logout = async () => {
    try { await db.signOut() } catch (err) {}
    setUser(null)
    setFollowing([])
    notify('Logged out successfully', 'info')
  }

  // ── CART ───────────────────────────────────────────────
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

  // ── NOTIFICATIONS ──────────────────────────────────────
  const notify = (message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }

  const markAllRead = () => setNotifList(prev => prev.map(n => ({ ...n, read: true })))
  const unreadCount = notifList.filter(n => !n.read).length

  // ── FOLLOW ─────────────────────────────────────────────
  const toggleFollow = async (organizerId) => {
    const isFollowing = following.includes(organizerId)
    if (user?.id && !user.id.startsWith('demo_')) {
      if (isFollowing) {
        await db.unfollowOrganizer(user.id, organizerId)
      } else {
        await db.followOrganizer(user.id, organizerId)
      }
    }
    setFollowing(prev => isFollowing ? prev.filter(id => id !== organizerId) : [...prev, organizerId])
  }

  // ── FRIENDS ────────────────────────────────────────────
  const getFriendsGoing = (eventId) => friends.filter(f => f.going.includes(eventId))

  // ── CHAT ───────────────────────────────────────────────
  const sendChatMessage = async (eventId, message) => {
    if (!user || !message.trim()) return
    const newMsg = {
      id: 'c_' + Date.now(),
      userId: user.id,
      name: user.name,
      avatar: '#C23010',
      message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      likes: 0
    }
    setChats(prev => ({ ...prev, [eventId]: [...(prev[eventId] || []), newMsg] }))

    // Save to DB if real user
    if (!user.id.startsWith('demo_')) {
      await db.sendChatMessage({ eventId, userId: user.id, userName: user.name, message: message.trim() })
    }
  }

  const likeMessage = (eventId, msgId) => {
    setChats(prev => ({
      ...prev,
      [eventId]: prev[eventId].map(m => m.id === msgId ? { ...m, likes: m.likes + 1 } : m)
    }))
  }

  // ── REVIEWS ────────────────────────────────────────────
  const addReview = async (eventId, rating, text) => {
    if (!user) return
    const newReview = {
      id: 'r_' + Date.now(),
      userId: user.id,
      name: user.name,
      avatar: '#C23010',
      rating, text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      helpful: 0
    }
    setReviews(prev => ({ ...prev, [eventId]: [newReview, ...(prev[eventId] || [])] }))

    if (!user.id.startsWith('demo_')) {
      await db.addReview({ eventId, userId: user.id, userName: user.name, rating, text })
    }
    notify('Review posted! Thanks for the feedback.', 'success')
  }

  // ── REFERRAL LINKS ─────────────────────────────────────
  const generateReferralLink = async (eventId) => {
    if (!user) return null
    const code = `${user.id}_${eventId}_${Math.random().toString(36).slice(2, 7)}`
    const link = `zwave-app.vercel.app/e/${eventId}?ref=${code}`
    setReferralLinks(prev => ({ ...prev, [eventId]: link }))

    if (!user.id.startsWith('demo_')) {
      await db.createReferralLink({ userId: user.id, eventId })
    }
    notify('Referral link generated! 🔗', 'success')
    return link
  }

  return (
    <AppContext.Provider value={{
      user, login, signup, logout, loading,
      events, loadEvents,
      cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount,
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
