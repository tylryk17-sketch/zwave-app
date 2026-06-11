import { useNavigate } from 'react-router-dom'

// Maps the old-style navigate(page, param) calls to real URL paths.
// This keeps all the call-sites inside pages identical while giving us
// real browser URLs, back/forward support, and deep linking.
const ROUTES = {
  home:           '/',
  discover:       '/discover',
  login:          '/login',
  signup:         '/signup',
  dashboard:      '/dashboard',
  'create-event': '/create-event',
  cart:           '/cart',
  checkout:       '/checkout',
  profile:        '/profile',
  pricing:        '/pricing',
  promoters:      '/promoters',
}

export function useNav() {
  const navigate = useNavigate()
  return (page, param) => {
    if (page === 'event')      return navigate(`/event/${encodeURIComponent(param)}`)
    if (page === 'organizer')  return navigate(`/organizer/${encodeURIComponent(param)}`)
    if (page === 'signup' && param) return navigate(`/signup?role=${encodeURIComponent(param)}`)
    navigate(ROUTES[page] ?? '/')
  }
}
