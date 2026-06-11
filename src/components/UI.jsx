import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useNav } from '../hooks/useNav'

// ── NAV ──────────────────────────────────────────────────────
// onNavigate / currentPage are accepted for backwards-compat with the custom router.
// When React Router is fully wired up these can be dropped.
export function Nav({ onNavigate, currentPage }) {
  const { user, logout, cartCount, notifications, notifPanel, setNotifPanel, notifList, markAllRead, unreadCount } = useApp()
  const _rr = (() => { try { return useNavigate() } catch { return null } })()
  const _loc = (() => { try { return useLocation() } catch { return null } })()
  const navigate = onNavigate
    ? (page, param) => onNavigate(page, param)
    : (page) => _rr && _rr('/' + (page === 'home' ? '' : page))
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => {
    if (currentPage) {
      const key = path.replace('/', '') || 'home'
      return currentPage === key
    }
    return _loc ? (_loc.pathname === path || _loc.pathname.startsWith(path + '/')) : false
  }

  return (
    <>
      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: '70px', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            background: n.type === 'success' ? '#1A3D2A' : n.type === 'error' ? '#3D1A1A' : '#1A1A3D',
            color: n.type === 'success' ? '#5DD07A' : n.type === 'error' ? '#E84820' : '#8AB4E0',
            border: `0.5px solid ${n.type === 'success' ? 'rgba(93,208,122,0.2)' : 'rgba(255,255,255,0.1)'}`,
            padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', animation: 'fadeUp 0.3s ease'
          }}>{n.message}</div>
        ))}
      </div>

      <nav className="nav">
        <button onClick={() => navigate('home')} className="nav-logo">
          Zwave<sup style={{ fontSize: '9px', color: 'var(--gold)', fontFamily: 'DM Sans', verticalAlign: 'super' }}>®</sup>
        </button>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[['Discover', 'discover', '/discover'], ['Create Event', 'create-event', '/create-event'], ['Promoters', 'promoters', '/promoters'], ['Pricing', 'pricing', '/pricing']].map(([label, page, path]) => (
            <button key={label} onClick={() => navigate(page)}
              className={`nav-link${isActive(path) ? ' active' : ''}`}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Cart */}
          <button onClick={() => navigate('cart')} className="nav-pill">
            🎟 Cart
            {cartCount > 0 && <span style={{ background: 'var(--ember)', color: '#fff', borderRadius: '100px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>{cartCount}</span>}
          </button>

          {/* Notifications bell */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setNotifPanel(!notifPanel); if (!notifPanel) markAllRead() }}
                className="nav-pill" style={{ position: 'relative', fontSize: '16px' }}>
                🔔
                {unreadCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: 'var(--ember)', color: '#fff', borderRadius: '50%', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              </button>
              {notifPanel && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: 'var(--paper)', border: '0.5px solid var(--line)', borderRadius: '16px', boxShadow: '0 16px 48px rgba(12,7,2,0.12)', zIndex: 500, overflow: 'hidden', animation: 'fadeUp 0.2s ease' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Notifications</span>
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--gold)', cursor: 'pointer', fontFamily: 'inherit' }}>Mark all read</button>
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifList.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '13px', color: 'var(--warm)' }}>No notifications yet</div>
                    ) : notifList.map(n => (
                      <div key={n.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem 1.25rem', borderBottom: '0.5px solid var(--line)', background: n.read ? 'transparent' : 'rgba(184,122,20,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--paper2)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(184,122,20,0.04)'}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--paper2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.4, marginBottom: '2px' }}>{n.message}</div>
                          <div style={{ fontSize: '11px', color: 'var(--warm)' }}>{n.time}</div>
                        </div>
                        {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: '4px' }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => navigate('dashboard')} className="nav-pill" style={{ color: 'var(--ink)', fontWeight: 500 }}>
                {user.role === 'organizer' ? '📊' : user.role === 'promoter' ? '🔗' : '👤'} {user.name.split(' ')[0]}
              </button>
              <button onClick={logout} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--warm)', cursor: 'pointer', fontFamily: 'inherit' }}>Log out</button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--warm)', cursor: 'pointer', padding: '7px 10px', fontFamily: 'inherit' }}>Log in</button>
              <button onClick={() => navigate('signup')} style={{ background: 'var(--ink)', color: 'var(--paper)', fontSize: '13px', fontWeight: 500, padding: '8px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Get started</button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

// ── FOOTER ───────────────────────────────────────────────────
export function Footer({ onNavigate }) {
  const _rr = (() => { try { return useNavigate() } catch { return null } })()
  const navigate = onNavigate ?? ((page) => _rr && _rr('/' + page))
  return (
    <footer style={{ background: 'var(--ink)', borderTop: '0.5px solid rgba(253,250,245,0.05)', padding: '2.5rem 1.75rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '17px', fontWeight: 700, color: 'rgba(253,250,245,0.25)' }}>
          Zwave<sup style={{ fontSize: '8px', color: 'rgba(184,122,20,0.4)', fontFamily: 'DM Sans' }}>®</sup>
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {['About', 'Pricing', 'Promoters', 'Privacy', 'Terms', 'Support'].map(l => (
            <button key={l} onClick={() => navigate('/' + l.toLowerCase())}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: 'rgba(253,250,245,0.18)', cursor: 'pointer', transition: 'color 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => e.target.style.color = 'rgba(253,250,245,0.45)'}
              onMouseLeave={e => e.target.style.color = 'rgba(253,250,245,0.18)'}
            >{l}</button>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(253,250,245,0.12)' }}>© 2025 Zwave. All rights reserved.</span>
      </div>
    </footer>
  )
}

// ── BUTTON ───────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', onClick, style = {}, disabled = false, size = 'md', type = 'button' }) {
  const sizes = { sm: { padding: '7px 16px', fontSize: '13px' }, md: { padding: '11px 24px', fontSize: '14px' }, lg: { padding: '14px 32px', fontSize: '15px' } }
  const variants = {
    primary: { background: 'var(--ink)', color: 'var(--paper)', border: 'none' },
    ember:   { background: 'var(--ember)', color: '#fff', border: 'none' },
    gold:    { background: 'var(--gold2)', color: 'var(--ink)', border: 'none' },
    outline: { background: 'transparent', color: 'var(--ink)', border: '0.5px solid var(--line2)' },
    ghost:   { background: 'transparent', color: 'var(--warm)', border: 'none' },
    white:   { background: 'var(--paper)', color: 'var(--ink)', border: 'none' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...variants[variant], ...sizes[size],
      borderRadius: '100px', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.2s', fontFamily: 'inherit', ...style
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >{children}</button>
  )
}

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'ember', 'gold', 'outline', 'ghost', 'white']),
  onClick: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
}

// ── INPUT ────────────────────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, required, style = {} }) {
  return (
    <div className="field" style={style}>
      {label && <label className="field-label">{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="field-input"
        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
        onBlur={e => e.target.style.borderColor = 'var(--line2)'}
      />
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  style: PropTypes.object,
}

// ── SELECT ───────────────────────────────────────────────────
export function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div className="field" style={style}>
      {label && <label className="field-label">{label}</label>}
      <select value={value} onChange={onChange} style={{ background: 'var(--paper2)', border: '0.5px solid var(--line2)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  )
}

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })])).isRequired,
  style: PropTypes.object,
}

// ── CARD ─────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} className={`card${onClick ? ' card-clickable' : ''}`} style={style}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(12,7,2,0.1)' } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' } }}
    >{children}</div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
}

// ── EVENT CARD ───────────────────────────────────────────────
export function EventCard({ event, onNavigate }) {
  const _rr = (() => { try { return useNavigate() } catch { return null } })()
  const goToEvent = onNavigate
    ? () => onNavigate('event', event.id)
    : () => _rr && _rr(`/event/${event.id}`)
  const pct = Math.round((event.sold / event.capacity) * 100)
  return (
    <Card onClick={goToEvent} style={{ position: 'relative' }}>
      <div style={{ aspectRatio: '16/9', position: 'relative', background: `linear-gradient(135deg,${event.color1},${event.color2})` }}>
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(12,7,2,0.5)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,250,245,0.12)', borderRadius: '100px', padding: '4px 10px', fontSize: '10px', fontWeight: 500, color: 'rgba(253,250,245,0.85)' }}>{event.badge}</div>
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--paper)', borderRadius: '100px', padding: '3px 9px', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '3px' }}>✨ {event.vibe}</div>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>{event.date}</div>
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.3 }}>{event.title}</div>
        <div style={{ fontSize: '12px', color: 'var(--warm)', marginBottom: '0.75rem' }}>📍 {event.venue}, {event.city}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>From ${event.price}</div>
          <div style={{ fontSize: '11px', color: 'var(--warm)' }}>{pct}% sold · {event.sold} going</div>
        </div>
        <div style={{ marginTop: '0.6rem', height: '3px', background: 'var(--paper3)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--ember),var(--gold2))', borderRadius: '2px' }} />
        </div>
      </div>
    </Card>
  )
}

EventCard.propTypes = {
  onNavigate: PropTypes.func,
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
    vibe: PropTypes.number.isRequired,
    badge: PropTypes.string,
    color1: PropTypes.string.isRequired,
    color2: PropTypes.string.isRequired,
  }).isRequired,
}

// ── SECTION HEADER ───────────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle, center = false, light = false }) {
  return (
    <div style={{ marginBottom: '2.5rem', textAlign: center ? 'center' : 'left' }}>
      {eyebrow && <div className="eyebrow" style={{ color: light ? 'var(--gold2)' : 'var(--gold)', marginBottom: '0.5rem' }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(34px,4vw,56px)', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.02em', color: light ? 'var(--paper)' : 'var(--ink)' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && <p style={{ fontSize: '15px', color: light ? 'rgba(253,250,245,0.4)' : 'var(--warm)', lineHeight: 1.7, fontWeight: 300, maxWidth: center ? '500px' : '480px', marginTop: '0.75rem', margin: center ? '0.75rem auto 0' : '0.75rem 0 0' }}>{subtitle}</p>}
    </div>
  )
}

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  center: PropTypes.bool,
  light: PropTypes.bool,
}

// ── STAT CARD ────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'var(--paper)', bg = 'rgba(253,250,245,0.04)' }) {
  return (
    <div style={{ background: bg, borderRadius: '10px', padding: '1.1rem 1.25rem' }}>
      <div style={{ fontSize: '10.5px', color: 'rgba(253,250,245,0.3)', marginBottom: '5px', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '30px', color, fontWeight: 400, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(253,250,245,0.2)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

// ── LOADER ───────────────────────────────────────────────────
export function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div style={{ width: '28px', height: '28px', border: '2px solid var(--paper3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}
