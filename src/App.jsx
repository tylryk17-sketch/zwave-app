import React, { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Nav, Footer } from './components/UI'
import { ErrorBoundary, PageErrorBoundary } from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import EventPage from './pages/EventPage'
import { LoginPage, SignupPage } from './pages/AuthPages'
import DashboardPage from './pages/DashboardPage'
import CreateEventPage from './pages/CreateEventPage'
import { CartPage, CheckoutPage } from './pages/CartCheckout'
import { ProfilePage, PricingPage } from './pages/ProfilePricing'
import PromotersPage from './pages/PromotersPage'
import OrganizerPage from './pages/OrganizerPage'

const BARE_PAGES = ['login', 'signup']
const AUTH_REQUIRED = ['dashboard', 'create-event', 'checkout', 'profile']
const ROLE_REQUIRED = { 'create-event': 'organizer' }

function AuthGuard({ page, user, loading, onNavigate, children }) {
  useEffect(() => {
    if (loading) return
    if (AUTH_REQUIRED.includes(page) && !user) { onNavigate('login'); return }
    if (ROLE_REQUIRED[page] && user && user.role !== ROLE_REQUIRED[page] && !user.isDemo) { onNavigate('dashboard'); return }
  }, [page, user, loading])
  if (loading) return (
    <div style={{ minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'32px', height:'32px', border:'2px solid var(--paper3)', borderTop:'2px solid var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
        <div style={{ fontSize:'14px', color:'var(--warm)' }}>Loading…</div>
      </div>
    </div>
  )
  if (AUTH_REQUIRED.includes(page) && !user) return null
  return children
}

function AppInner() {
  const { user, loading } = useApp()
  const [page, setPage] = useState('home')
  const [pageParams, setPageParams] = useState({})
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])
  const navigate = (dest, param) => { setPage(dest); setPageParams(param ? { param } : {}) }
  const bare = BARE_PAGES.includes(page)
  const renderPage = () => {
    switch (page) {
      case 'home':         return <HomePage onNavigate={navigate} />
      case 'discover':     return <DiscoverPage onNavigate={navigate} />
      case 'event':        return <EventPage eventId={pageParams.param} onNavigate={navigate} />
      case 'login':        return <LoginPage onNavigate={navigate} />
      case 'signup':       return <SignupPage onNavigate={navigate} defaultRole={pageParams.param} />
      case 'dashboard':    return <DashboardPage onNavigate={navigate} />
      case 'create-event': return <CreateEventPage onNavigate={navigate} />
      case 'cart':         return <CartPage onNavigate={navigate} />
      case 'checkout':     return <CheckoutPage onNavigate={navigate} />
      case 'profile':      return <ProfilePage onNavigate={navigate} />
      case 'pricing':      return <PricingPage onNavigate={navigate} />
      case 'promoters':    return <PromotersPage onNavigate={navigate} />
      case 'organizer':    return <OrganizerPage organizerName={pageParams.param} onNavigate={navigate} />
      default:             return <NotFound onNavigate={navigate} />
    }
  }
  return (
    <div style={{ minHeight:'100svh', display:'flex', flexDirection:'column' }}>
      {!bare && <Nav onNavigate={navigate} currentPage={page} />}
      <main style={{ flex:1 }}>
        <AuthGuard page={page} user={user} loading={loading} onNavigate={navigate}>
          <PageErrorBoundary>{renderPage()}</PageErrorBoundary>
        </AuthGuard>
      </main>
      {!bare && <Footer onNavigate={navigate} />}
    </div>
  )
}

function NotFound({ onNavigate }) {
  return (
    <div style={{ paddingTop:'58px', minHeight:'80svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'3rem' }}>
      <div style={{ fontSize:'64px', marginBottom:'1.25rem' }}>🌊</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'40px', fontWeight:400, marginBottom:'0.75rem' }}>Page not <em style={{ color:'var(--gold)' }}>found.</em></h1>
      <p style={{ fontSize:'15px', color:'var(--warm)', marginBottom:'2rem' }}>That wave doesn't exist — let's get you back on track.</p>
      <button onClick={() => onNavigate('home')} style={{ background:'var(--ink)', color:'var(--paper)', border:'none', padding:'13px 28px', borderRadius:'100px', fontSize:'14px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Back to home</button>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  )
}
