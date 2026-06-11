import React from 'react'

// Full-page error boundary — wraps the entire app
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', textAlign: 'center', background: 'var(--paper)',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '1.25rem' }}>🌊</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '32px', fontWeight: 400, marginBottom: '0.75rem' }}>
          Something went <em style={{ color: 'var(--ember)' }}>wrong.</em>
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--warm)', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
          An unexpected error occurred. Try refreshing — if it keeps happening, let us know.
        </p>
        <button
          onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
          style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none', padding: '13px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Back to home
        </button>
        {import.meta.env.DEV && this.state.error && (
          <pre style={{ marginTop: '2rem', fontSize: '11px', color: 'var(--ember)', textAlign: 'left', background: 'var(--paper2)', padding: '1rem', borderRadius: '8px', maxWidth: '600px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    )
  }
}

// Inline error boundary — shows a contained error card instead of a blank page
// Use this to wrap individual page renders so one broken page doesn't kill the nav
export class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[PageErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{ paddingTop: '58px', minHeight: '60svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 400, marginBottom: '0.5rem' }}>
          This page hit an <em style={{ color: 'var(--ember)' }}>error.</em>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--warm)', marginBottom: '1.75rem', maxWidth: '360px', lineHeight: 1.6 }}>
          Something went wrong rendering this page. Try going back or refreshing.
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none', padding: '11px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Try again
        </button>
        {import.meta.env.DEV && this.state.error && (
          <pre style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--ember)', textAlign: 'left', background: 'var(--paper2)', padding: '1rem', borderRadius: '8px', maxWidth: '600px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    )
  }
}

export default ErrorBoundary
