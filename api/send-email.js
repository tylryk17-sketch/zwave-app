const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, to, data } = req.body

  try {
    let email

    if (type === 'ticket_confirmation') {
      email = {
        from: 'Zwave <tickets@zwave.fun>',
        to,
        subject: `Your tickets for ${data.eventTitle} are confirmed! 🎟`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FDFAF5;padding:2rem;border-radius:12px">
            <h1 style="font-family:Georgia,serif;font-size:32px;color:#0C0702;margin-bottom:0.5rem">You're in! 🎉</h1>
            <p style="color:#8A6840;font-size:16px;margin-bottom:2rem">Your tickets are confirmed.</p>
            <div style="background:#0C0702;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
              <h2 style="font-family:Georgia,serif;color:#FDFAF5;font-size:22px;margin-bottom:0.5rem">${data.eventTitle}</h2>
              <p style="color:rgba(253,250,245,0.6);margin:0">${data.eventDate}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem">
              ${data.tickets.map(t => `
                <tr style="border-bottom:1px solid #EFE5D4">
                  <td style="padding:0.75rem 0;color:#0C0702;font-weight:500">${t.tierName}</td>
                  <td style="padding:0.75rem 0;color:#0C0702;text-align:right;font-family:monospace">${t.confirmationCode}</td>
                </tr>
              `).join('')}
            </table>
            <p style="color:#8A6840;font-size:14px">Show your QR code at the door. Each code is unique and can only be scanned once.</p>
            <a href="https://zwave.fun/dashboard" style="display:inline-block;background:#C23010;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:500;margin-top:1rem">View my tickets</a>
            <p style="color:#8A6840;font-size:12px;margin-top:2rem">Zwave · zwave.fun</p>
          </div>
        `
      }
    } else if (type === 'welcome') {
      email = {
        from: 'Zwave <hello@zwave.fun>',
        to,
        subject: `Welcome to Zwave, ${data.name}! 🌊`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FDFAF5;padding:2rem;border-radius:12px">
            <h1 style="font-family:Georgia,serif;font-size:32px;color:#0C0702">Welcome, ${data.name}! 🎉</h1>
            <p style="color:#8A6840;font-size:16px">You're now on Zwave — the event platform, reimagined.</p>
            <a href="https://zwave.fun/discover" style="display:inline-block;background:#C23010;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:500;margin-top:1rem">Discover events</a>
            <p style="color:#8A6840;font-size:12px;margin-top:2rem">Zwave · zwave.fun</p>
          </div>
        `
      }
    } else if (type === 'notify_me') {
      email = {
        from: 'Zwave <notifications@zwave.fun>',
        to: data.organizerEmail,
        subject: `New lead for ${data.eventTitle}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FDFAF5;padding:2rem;border-radius:12px">
            <h1 style="font-family:Georgia,serif;font-size:24px;color:#0C0702">New lead 🔔</h1>
            <p style="color:#8A6840"><strong>${data.leadName}</strong> wants to be notified about <strong>${data.eventTitle}</strong></p>
            <p style="color:#8A6840">Contact: ${data.contact}</p>
            <a href="https://zwave.fun/dashboard" style="display:inline-block;background:#0C0702;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:500;margin-top:1rem">View leads dashboard</a>
          </div>
        `
      }
    }

    if (!email) return res.status(400).json({ error: 'Invalid email type' })

    const result = await resend.emails.send(email)
    res.status(200).json({ success: true, id: result.id })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: error.message })
  }
}
