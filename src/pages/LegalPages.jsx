import React from 'react'

const LAST_UPDATED = 'June 11, 2025'
const COMPANY = 'Zwave'
const DOMAIN = 'zwave.fun'
const EMAIL = 'legal@zwave.fun'

function PolicyLayout({ title, children }) {
  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper)' }}>
      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'4rem 1.75rem' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>Legal</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:400, letterSpacing:'-0.02em', marginBottom:'0.75rem' }}>{title}</h1>
          <p style={{ fontSize:'14px', color:'var(--warm)' }}>Last updated: {LAST_UPDATED}</p>
        </div>
        <div style={{ fontSize:'15px', color:'var(--ink)', lineHeight:1.8, fontWeight:300 }}>{children}</div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:'2.5rem' }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'1rem' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children }) {
  return <p style={{ marginBottom:'1rem', color:'var(--warm)', lineHeight:1.8 }}>{children}</p>
}

function Li({ children }) {
  return <li style={{ marginBottom:'0.5rem', color:'var(--warm)', paddingLeft:'1rem', position:'relative', listStyle:'none' }}><span style={{ position:'absolute', left:0, color:'var(--gold)' }}>•</span>{children}</li>
}

export function PrivacyPage({ onNavigate }) {
  return (
    <PolicyLayout title="Privacy Policy">
      <P>At {COMPANY}, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our platform at {DOMAIN}.</P>
      <Section title="1. Information We Collect">
        <ul style={{ marginBottom:'1rem' }}>
          <Li><strong>Account information</strong> — name, email, and password</Li>
          <Li><strong>Contact information</strong> — email or phone via Notify Me or RSVP features</Li>
          <Li><strong>Payment information</strong> — processed securely by Stripe. We never store card details</Li>
          <Li><strong>Event data</strong> — events created, tickets purchased, events attended</Li>
          <Li><strong>Usage data</strong> — pages visited and platform interactions</Li>
        </ul>
      </Section>
      <Section title="2. How We Use Your Information">
        <ul style={{ marginBottom:'1rem' }}>
          <Li>Create and manage your account</Li>
          <Li>Process ticket purchases and send confirmations</Li>
          <Li>Connect you with events and organizers</Li>
          <Li>Send notifications about events you expressed interest in</Li>
          <Li>Calculate and process promoter commissions</Li>
          <Li>Prevent fraud and ensure platform security</Li>
        </ul>
      </Section>
      <Section title="3. How We Share Your Information">
        <P>We do not sell your personal information. We may share with:</P>
        <ul style={{ marginBottom:'1rem' }}>
          <Li><strong>Event organizers</strong> — your name and contact when you purchase a ticket or submit a lead</Li>
          <Li><strong>Stripe</strong> — to handle payments securely</Li>
          <Li><strong>Supabase</strong> — to store your data securely</Li>
          <Li><strong>Law enforcement</strong> — when required by law</Li>
        </ul>
      </Section>
      <Section title="4. Data Security">
        <P>We use HTTPS, encrypted database storage, and role-based access controls. Payment data is handled exclusively by Stripe and never stored on our servers.</P>
      </Section>
      <Section title="5. Your Rights">
        <ul style={{ marginBottom:'1rem' }}>
          <Li>Access, correct, or delete your personal data</Li>
          <Li>Opt out of marketing communications</Li>
          <Li>Request data portability</Li>
        </ul>
        <P>Contact us at {EMAIL} to exercise these rights.</P>
      </Section>
      <Section title="6. Contact Us">
        <P>Questions? Email us at {EMAIL} or visit {DOMAIN}.</P>
      </Section>
    </PolicyLayout>
  )
}

export function TermsPage({ onNavigate }) {
  return (
    <PolicyLayout title="Terms of Service">
      <P>By using {COMPANY} at {DOMAIN}, you agree to these Terms of Service. Please read them carefully.</P>
      <Section title="1. Use of the Platform">
        <P>You may not use {COMPANY} for fraudulent purposes, create fake events, spam users, or violate any applicable laws.</P>
      </Section>
      <Section title="2. Ticket Purchases">
        <P>When you purchase a ticket, you enter a contract with the event organizer. {COMPANY} facilitates the transaction. All sales are final unless the organizer's refund policy states otherwise.</P>
      </Section>
      <Section title="3. Organizer Responsibilities">
        <ul style={{ marginBottom:'1rem' }}>
          <Li>Provide accurate event information</Li>
          <Li>Honor all tickets sold through {COMPANY}</Li>
          <Li>Communicate your refund policy clearly</Li>
          <Li>Comply with all applicable laws</Li>
        </ul>
      </Section>
      <Section title="4. Promoter Program">
        <P>Promoters earn commissions set by organizers. {COMPANY} processes commissions automatically. We reserve the right to withhold commissions in cases of fraud.</P>
      </Section>
      <Section title="5. Fees">
        <P>{COMPANY} charges 3% per ticket on Starter, 2% on Pro. All fees are non-refundable. Stripe processing fees (~2.9% + $0.30) are separate.</P>
      </Section>
      <Section title="6. Refunds & Cancellations">
        <P>Refund policies are set by organizers. If an event is cancelled, {COMPANY} will work with the organizer to facilitate refunds. Platform fees are non-refundable.</P>
      </Section>
      <Section title="7. Limitation of Liability">
        <P>To the maximum extent permitted by law, {COMPANY} is not liable for indirect or consequential damages. Our total liability shall not exceed what you paid us in the past 12 months.</P>
      </Section>
      <Section title="8. Governing Law">
        <P>These Terms are governed by the laws of the United States.</P>
      </Section>
      <Section title="9. Contact">
        <P>Questions? Email {EMAIL} or visit {DOMAIN}.</P>
      </Section>
    </PolicyLayout>
  )
}
