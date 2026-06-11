import { supabase } from './supabase'

// ── EVENTS ──────────────────────────────────────────────────
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error) { console.error('getEvents error:', error); return [] }
  return data || []
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*, tiers(*)')
    .eq('id', id)
    .single()
  if (error) { console.error('getEventById error:', error); return null }
  return data
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single()
  if (error) { console.error('createEvent error:', error); return null }
  return data
}

// ── AUTH ─────────────────────────────────────────────────────
export async function signUp({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, role } }
  })
  if (error) throw error
  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert([{
      id: data.user.id,
      email, name, role,
      created_at: new Date().toISOString()
    }])
  }
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

// ── ORDERS / TICKETS ─────────────────────────────────────────
export async function createOrder({ userId, eventId, items, total, customerName, customerEmail }) {
  const confirmationCode = `ZW${Math.random().toString(36).slice(2,8).toUpperCase()}`
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      event_id: eventId,
      total,
      status: 'confirmed',
      confirmation_code: confirmationCode,
      customer_name: customerName,
      customer_email: customerEmail,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()
  if (orderError) { console.error('createOrder error:', orderError); return null }

  // Create individual tickets
  const tickets = []
  for (const item of items) {
    for (let i = 0; i < item.qty; i++) {
      tickets.push({
        order_id: order.id,
        event_id: eventId,
        user_id: userId,
        tier_name: item.tierName,
        price: item.price,
        holder_name: customerName,
        confirmation_code: `ZW${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        status: 'valid',
        created_at: new Date().toISOString()
      })
    }
  }
  const { error: ticketError } = await supabase.from('tickets').insert(tickets)
  if (ticketError) console.error('createTickets error:', ticketError)

  return order
}

export async function getUserTickets(userId) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, events(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) { console.error('getUserTickets error:', error); return [] }
  return data || []
}

// ── LEADS / NOTIFY ME ────────────────────────────────────────
export async function saveLead({ eventId, name, contact, type, source, tags }) {
  const { error } = await supabase.from('leads').insert([{
    event_id: eventId,
    name, contact, type, source,
    tags: tags || [],
    created_at: new Date().toISOString()
  }])
  if (error) { console.error('saveLead error:', error) }
}

export async function getLeadsForOrganizer(organizerId) {
  const { data, error } = await supabase
    .from('leads')
    .select('*, events(*)')
    .eq('events.organizer_id', organizerId)
    .order('created_at', { ascending: false })
  if (error) { console.error('getLeads error:', error); return [] }
  return data || []
}

// ── PROMOTER REFERRALS ───────────────────────────────────────
export async function createReferralLink({ userId, eventId }) {
  const code = `${userId}_${eventId}_${Math.random().toString(36).slice(2,7)}`
  const { data, error } = await supabase
    .from('referrals')
    .insert([{
      user_id: userId,
      event_id: eventId,
      code,
      clicks: 0,
      sales: 0,
      commission_earned: 0,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()
  if (error) { console.error('createReferralLink error:', error); return null }
  return data
}

export async function trackReferralClick(code) {
  await supabase.rpc('increment_referral_clicks', { ref_code: code })
}

export async function getPromoterStats(userId) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, events(*)')
    .eq('user_id', userId)
  if (error) { console.error('getPromoterStats error:', error); return [] }
  return data || []
}

// ── FOLLOWS ──────────────────────────────────────────────────
export async function followOrganizer(userId, organizerId) {
  await supabase.from('follows').insert([{
    follower_id: userId,
    organizer_id: organizerId,
    created_at: new Date().toISOString()
  }])
}

export async function unfollowOrganizer(userId, organizerId) {
  await supabase.from('follows')
    .delete()
    .eq('follower_id', userId)
    .eq('organizer_id', organizerId)
}

export async function getFollowing(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('organizer_id')
    .eq('follower_id', userId)
  if (error) return []
  return data.map(f => f.organizer_id)
}

// ── REVIEWS ──────────────────────────────────────────────────
export async function addReview({ eventId, userId, userName, rating, text }) {
  const { error } = await supabase.from('reviews').insert([{
    event_id: eventId,
    user_id: userId,
    user_name: userName,
    rating, text,
    created_at: new Date().toISOString()
  }])
  if (error) console.error('addReview error:', error)
}

export async function getReviews(eventId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

// ── CHAT ─────────────────────────────────────────────────────
export async function sendChatMessage({ eventId, userId, userName, message }) {
  const { error } = await supabase.from('chat_messages').insert([{
    event_id: eventId,
    user_id: userId,
    user_name: userName,
    message,
    likes: 0,
    created_at: new Date().toISOString()
  }])
  if (error) console.error('sendChat error:', error)
}

export async function getChatMessages(eventId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })
    .limit(100)
  if (error) return []
  return data || []
}

export function subscribeToChatMessages(eventId, callback) {
  return supabase
    .channel(`chat:${eventId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `event_id=eq.${eventId}`
    }, payload => callback(payload.new))
    .subscribe()
}
