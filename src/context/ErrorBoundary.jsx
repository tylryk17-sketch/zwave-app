import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Zwave Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100svh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '3rem', textAlign: 'center',
          background: 'var(--paper)', fontFamily: "'DM Sans', sans-serif"
        }}>
          <div style={{ fontSize: '64px', marginBottom: '1.5rem' }}>⚡</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px', fontWeight: 400, marginBottom: '0.75rem',
            color: 'var(--ink)'
          }}>
            Something went <em style={{ color: 'var(--ember)' }}>wrong.</em>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--warm)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '440px' }}>
            An unexpected error occurred. Don't worry — your data is safe. Try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              background: 'var(--paper2)', border: '0.5px solid var(--line)',
              borderRadius: '10px', padding: '1rem', fontSize: '12px',
              color: 'var(--ember)', textAlign: 'left', maxWidth: '600px',
              overflow: 'auto', marginBottom: '2rem', width: '100%'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--ink)', color: 'var(--paper)', border: 'none',
                borderRadius: '100px', padding: '12px 28px', fontSize: '14px',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Refresh page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                background: 'transparent', color: 'var(--warm)',
                border: '0.5px solid var(--line)', borderRadius: '100px',
                padding: '12px 28px', fontSize: '14px', cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Page-level error boundary — lighter version for individual pages
export class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Page Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '4rem 2rem', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
        }}>
          <div style={{ fontSize: '40px' }}>😕</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 400 }}>
            This page couldn't load
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--warm)' }}>Try going back or refreshing.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: 'var(--ink)', color: 'var(--paper)', border: 'none',
              borderRadius: '100px', padding: '10px 24px', fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
