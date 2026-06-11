const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email, name } = req.body

    // Create a Stripe Connect Express account for the organizer
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name,
        product_description: 'Event tickets and experiences',
        mcc: '7922', // Theatrical producers, ticket agencies
      },
    })

    // Create onboarding link
    const accountLink = await stripe.accountLinks.crea
cat > api/create-payout.js << 'EOF'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { amount, stripeAccountId } = req.body

    // Transfer funds to organizer's connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination: stripeAccountId,
    })

    // Instant payout to their bank
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      method: 'instant',
    }, {
      stripeAccount: stripeAccountId,
    })

    res.status(200).json({ success: true, transferId: transfer.id, payoutId: payout.id })
  } catch (error) {
    console.error('Payout error:', error)
    res.status(500).json({ error: error.message })
  }
}
