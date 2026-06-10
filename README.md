# Zwave® — Full MVP

The event platform, reimagined. Built with React + Vite.

---

## What's built

### Pages & Features
- **Landing page** — Hero, discover, features, promoter section, pricing, waitlist CTA
- **Discover / Search** — Full search, city filter, category filter, price filter, sort
- **Event detail** — Ticket tiers, vibe score, friends attending, organizer follow, promoter link
- **Auth** — Login, Signup (3 roles: Organizer, Promoter, Fan)
- **Organizer dashboard** — Overview, Events, Promoter network, Analytics, AI Marketing tools
- **Promoter dashboard** — Stats, referral links, leaderboard, events to promote
- **Fan dashboard** — Personalized event recommendations
- **Create Event** — 5-step wizard (info, date/venue, tickets, promoter settings, review)
- **Cart & Checkout** — Add tickets, order summary, Stripe-ready checkout
- **Profile** — Role-based stats, edit profile, event history
- **Pricing** — Monthly/annual toggle, FAQ

---

## Run locally

```bash
cd zwave-app
npm install
npm run dev
```

Open http://localhost:5173

---

## Deploy to Vercel (free, live in 2 minutes)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Zwave MVP"
gh repo create zwave-app --public --push
```

2. Go to https://vercel.com → "Add New Project" → Import your GitHub repo → Deploy

Done. Your site is live.

---

## Connect real payments (Stripe)

1. Create account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Install: `npm install @stripe/stripe-js @stripe/react-stripe-js`
4. Replace the mock checkout in `CartCheckout.jsx` with Stripe Elements
5. Set up a backend endpoint (Vercel serverless function or Node.js) to create PaymentIntents

Stripe charges ~2.9% + 30¢ per transaction (on top of Zwave's fee).

---

## Connect real database (Supabase — free tier)

1. Create project at https://supabase.com
2. Create tables: `users`, `events`, `tickets`, `orders`, `promoters`, `referrals`
3. Install: `npm install @supabase/supabase-js`
4. Replace mock data in `AppContext.jsx` with real Supabase queries

---

## Connect AI marketing (Anthropic API)

Already scaffolded in the AI Tools tab of the organizer dashboard.

1. Get API key from https://console.anthropic.com
2. Create a Vercel serverless function `/api/generate.js`:
```js
import Anthropic from '@anthropic-ai/sdk'
export default async function handler(req, res) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const { type, prompt } = req.body
  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: `Generate a ${type} for this event: ${prompt}` }]
  })
  res.json({ result: message.content[0].text })
}
```
3. Add `ANTHROPIC_API_KEY` to Vercel environment variables

---

## Domain setup

1. Buy domain at https://namecheap.com or https://cloudflare.com
   - Recommended: `zwave.app`, `zwaveevents.com`, `zwaveapp.com`
2. In Vercel → Project Settings → Domains → Add your domain
3. Update DNS records as shown by Vercel
4. SSL is automatic

---

## What to build next (Phase 2)

- [ ] Email notifications (Resend.com — free tier)
- [ ] Real-time event chat (Supabase Realtime)
- [ ] QR code ticket generation
- [ ] Mobile app (React Native / Expo)
- [ ] Promoter payout automation (Stripe Connect)
- [ ] Push notifications
- [ ] Social graph (who's following who)
- [ ] Event reviews & ratings

---

## Tech stack

| Layer | Tech | Cost |
|-------|------|------|
| Frontend | React + Vite | Free |
| Hosting | Vercel | Free |
| Database | Supabase | Free up to 500MB |
| Payments | Stripe | 2.9% + 30¢/transaction |
| Auth | Supabase Auth | Free |
| AI | Anthropic API | ~$0.01/generation |
| Email | Resend | Free up to 3k/month |
| Domain | Namecheap/Cloudflare | ~$12/year |

**Total monthly cost to run Zwave at launch: ~$12/year (just the domain)**

---

Built with ❤️ · Zwave® 2025
