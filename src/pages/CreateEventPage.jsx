import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Input, Select, Btn } from '../components/UI'

const STEPS = ['Basic Info', 'Date & Venue', 'Tickets', 'Promote', 'Review']

export default function CreateEventPage({ onNavigate }) {
  const { user, notify } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '', category: '', description: '', tags: '',
    date: '', time: '', endTime: '', venue: '', city: '', address: '',
    capacity: '', ageRestriction: 'All ages', dressCode: '',
    tiers: [{ name: 'General Admission', price: '', available: '' }],
    enablePromoters: true, commissionRate: 10,
    featuredImage: null,
  })

  if (!user || user.role !== 'organizer') {
    return (
      <div style={{ paddingTop:'58px', minHeight:'60svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', textAlign:'center' }}>
        <div style={{ fontSize:'40px', marginBottom:'1rem' }}>🎤</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, marginBottom:'0.75rem' }}>Organizer account required</h2>
        <p style={{ fontSize:'14px', color:'var(--warm)', marginBottom:'1.5rem' }}>Sign up as an organizer to create and sell events.</p>
        <Btn variant="ember" onClick={() => onNavigate('signup', 'organizer')}>Create organizer account</Btn>
      </div>
    )
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const updateTier = (i, field) => (e) => {
    const tiers = [...form.tiers]
    tiers[i] = { ...tiers[i], [field]: e.target.value }
    setForm({ ...form, tiers })
  }
  const addTier = () => setForm({ ...form, tiers: [...form.tiers, { name: '', price: '', available: '' }] })
  const removeTier = (i) => setForm({ ...form, tiers: form.tiers.filter((_, idx) => idx !== i) })

  const handleSubmit = () => {
    notify('Event created successfully! 🎉', 'success')
    onNavigate('dashboard')
  }

  const canNext = () => {
    if (step === 0) return form.title && form.category && form.description
    if (step === 1) return form.date && form.time && form.venue && form.city
    if (step === 2) return form.tiers.every(t => t.name && t.price && t.available)
    return true
  }

  return (
    <div style={{ paddingTop:'58px', minHeight:'100svh', background:'var(--paper2)' }}>
      {/* Header */}
      <div style={{ background:'var(--paper)', borderBottom:'0.5px solid var(--line)', padding:'1.5rem 1.75rem' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:400, marginBottom:'1.25rem' }}>
            Create an event
          </h1>
          {/* Step indicators */}
          <div style={{ display:'flex', gap:0 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', flex:1 }}>
                  <div style={{
                    width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'12px', fontWeight:600, transition:'all 0.2s',
                    background: i < step ? 'var(--green)' : i === step ? 'var(--ink)' : 'var(--paper3)',
                    color: i <= step ? '#fff' : 'var(--warm)',
                  }}>{i < step ? '✓' : i + 1}</div>
                  <span style={{ fontSize:'11px', color: i === step ? 'var(--ink)' : 'var(--warm)', fontWeight: i === step ? 500 : 400, whiteSpace:'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ height:'1px', flex:1, background: i < step ? 'var(--green)' : 'var(--line)', marginBottom:'16px' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'2.5rem 1.75rem' }}>
        <div style={{ background:'var(--paper)', border:'0.5px solid var(--line)', borderRadius:'18px', padding:'2.5rem', marginBottom:'1.5rem' }}>

          {/* STEP 0 — Basic Info */}
          {step === 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>Step 1</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'1.5rem' }}>Basic information</h2>
              </div>
              <Input label="Event title *" value={form.title} onChange={update('title')} placeholder="e.g. Neon Nights Summer Concert" />
              <Select label="Category *" value={form.category} onChange={update('category')} options={[
                { value:'', label:'Select a category' },
                'Concerts','Festivals','Nightlife','Day Parties','Arts & Culture','Sports','Business','Food & Drink','Education','Other'
              ]} />
              <div>
                <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', letterSpacing:'0.04em', display:'block', marginBottom:'6px' }}>Description *</label>
                <textarea value={form.description} onChange={update('description')} placeholder="Tell people what makes this event special. Include lineup, vibe, what to expect..." rows={5}
                  style={{ width:'100%', background:'var(--paper2)', border:'0.5px solid var(--line2)', borderRadius:'10px', padding:'11px 14px', fontSize:'14px', color:'var(--ink)', fontFamily:'inherit', resize:'vertical', outline:'none', lineHeight:1.65 }}
                  onFocus={e => e.target.style.borderColor='var(--gold)'}
                  onBlur={e => e.target.style.borderColor='var(--line2)'}
                />
              </div>
              <Input label="Tags (comma separated)" value={form.tags} onChange={update('tags')} placeholder="e.g. Live Music, 21+, Outdoor" />
              {/* Image upload — real working */}
              <div>
                <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', letterSpacing:'0.04em', display:'block', marginBottom:'6px' }}>Event image</label>
                <input
                  type="file"
                  accept="image/*"
                  id="event-image-upload"
                  style={{ display:'none' }}
                  onChange={e => {
                    const file = e.target.files[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => setForm(f => ({ ...f, featuredImage: ev.target.result, imageName: file.name }))
                    reader.readAsDataURL(file)
                  }}
                />
                <div
                  onClick={() => document.getElementById('event-image-upload').click()}
                  style={{ border:`1px dashed ${form.featuredImage ? 'var(--gold)' : 'var(--line2)'}`, borderRadius:'12px', overflow:'hidden', background:'var(--paper2)', cursor:'pointer', transition:'border-color 0.2s', position:'relative' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = form.featuredImage ? 'var(--gold)' : 'var(--line2)'}
                >
                  {form.featuredImage ? (
                    <div style={{ position:'relative' }}>
                      <img src={form.featuredImage} alt="Event preview" style={{ width:'100%', height:'220px', objectFit:'cover', display:'block' }} />
                      <div style={{ position:'absolute', inset:0, background:'rgba(12,7,2,0.4)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity='1'}
                        onMouseLeave={e => e.currentTarget.style.opacity='0'}
                      >
                        <span style={{ background:'var(--paper)', color:'var(--ink)', borderRadius:'100px', padding:'8px 18px', fontSize:'13px', fontWeight:500 }}>🔄 Change image</span>
                      </div>
                      <div style={{ padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:'12px', color:'var(--green)', fontWeight:500 }}>✓ Image added — {form.imageName}</span>
                        <button type="button" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, featuredImage:null, imageName:'' })) }} style={{ background:'none', border:'none', fontSize:'12px', color:'var(--warm)', cursor:'pointer', fontFamily:'inherit' }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding:'2.5rem', textAlign:'center' }}>
                      <div style={{ fontSize:'32px', marginBottom:'0.75rem' }}>🖼</div>
                      <div style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)', marginBottom:'4px' }}>Click to upload your event image</div>
                      <div style={{ fontSize:'12px', color:'var(--warm)', marginBottom:'0.75rem' }}>PNG, JPG, WEBP up to 10MB · Recommended 1920×1080</div>
                      <span style={{ display:'inline-block', background:'var(--ink)', color:'var(--paper)', borderRadius:'100px', padding:'8px 20px', fontSize:'13px', fontWeight:500 }}>Choose file</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Date & Venue */}
          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>Step 2</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'1.5rem' }}>Date & venue</h2>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Input label="Event date *" type="date" value={form.date} onChange={update('date')} />
                <Input label="Start time *" type="time" value={form.time} onChange={update('time')} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Input label="End time" type="time" value={form.endTime} onChange={update('endTime')} />
                <Select label="Age restriction" value={form.ageRestriction} onChange={update('ageRestriction')} options={['All ages','18+','21+']} />
              </div>
              <Input label="Venue name *" value={form.venue} onChange={update('venue')} placeholder="e.g. Madison Square Garden" />
              <Input label="Street address" value={form.address} onChange={update('address')} placeholder="123 Main St" />
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1rem' }}>
                <Input label="City *" value={form.city} onChange={update('city')} placeholder="e.g. New York, NY" />
                <Input label="Capacity" type="number" value={form.capacity} onChange={update('capacity')} placeholder="500" />
              </div>
              <Input label="Dress code (optional)" value={form.dressCode} onChange={update('dressCode')} placeholder="e.g. Smart casual, No sneakers" />
            </div>
          )}

          {/* STEP 2 — Tickets */}
          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>Step 3</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.5rem' }}>Ticket tiers</h2>
                <p style={{ fontSize:'13px', color:'var(--warm)', marginBottom:'1.25rem', fontWeight:300 }}>Create one or more ticket types — GA, VIP, Table packages, etc.</p>
              </div>
              {form.tiers.map((tier, i) => (
                <div key={i} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem', position:'relative' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                    <span style={{ fontSize:'13px', fontWeight:500, color:'var(--ink)' }}>Tier {i + 1}</span>
                    {form.tiers.length > 1 && <button onClick={() => removeTier(i)} style={{ background:'none', border:'none', fontSize:'16px', cursor:'pointer', color:'var(--warm)', opacity:0.6 }}>✕</button>}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'0.75rem' }}>
                    <Input label="Tier name *" value={tier.name} onChange={updateTier(i, 'name')} placeholder="e.g. VIP" />
                    <Input label="Price ($) *" type="number" value={tier.price} onChange={updateTier(i, 'price')} placeholder="75" />
                    <Input label="Available *" type="number" value={tier.available} onChange={updateTier(i, 'available')} placeholder="100" />
                  </div>
                </div>
              ))}
              <button onClick={addTier} style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'1px dashed var(--line2)', borderRadius:'10px', padding:'12px 16px', fontSize:'13px', fontWeight:500, color:'var(--gold)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', justifyContent:'center' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--line2)'}
              >+ Add another tier</button>
            </div>
          )}

          {/* STEP 3 — Promote */}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>Step 4</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'0.5rem' }}>Promoter settings</h2>
                <p style={{ fontSize:'13px', color:'var(--warm)', marginBottom:'1.25rem', fontWeight:300 }}>Enable a promoter network to let others sell tickets on commission.</p>
              </div>
              <div style={{ padding:'1.25rem', background: form.enablePromoters ? 'rgba(184,122,20,0.05)' : 'var(--paper2)', border:`0.5px solid ${form.enablePromoters ? 'var(--gold)' : 'var(--line)'}`, borderRadius:'12px', cursor:'pointer', transition:'all 0.2s' }}
                onClick={() => setForm({ ...form, enablePromoters: !form.enablePromoters })}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:500, color:'var(--ink)', marginBottom:'3px' }}>Enable promoter network</div>
                    <div style={{ fontSize:'13px', color:'var(--warm)', fontWeight:300 }}>Let promoters earn commissions by sharing referral links</div>
                  </div>
                  <div style={{ width:'44px', height:'24px', borderRadius:'100px', background: form.enablePromoters ? 'var(--gold)' : 'var(--paper3)', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:'3px', left: form.enablePromoters ? 'calc(100% - 21px)' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                  </div>
                </div>
              </div>
              {form.enablePromoters && (
                <>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:500, color:'var(--warm)', letterSpacing:'0.04em', display:'block', marginBottom:'8px' }}>Commission rate: <strong style={{ color:'var(--ink)' }}>{form.commissionRate}%</strong></label>
                    <input type="range" min="5" max="30" step="1" value={form.commissionRate} onChange={update('commissionRate')}
                      style={{ width:'100%', accentColor:'var(--gold)', cursor:'pointer' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--warm)', marginTop:'4px' }}>
                      <span>5% (min)</span><span>30% (max)</span>
                    </div>
                  </div>
                  <div style={{ padding:'1rem', background:'rgba(45,158,95,0.06)', border:'0.5px solid rgba(45,158,95,0.2)', borderRadius:'10px' }}>
                    <div style={{ fontSize:'13px', color:'var(--green)', fontWeight:500, marginBottom:'4px' }}>💡 At {form.commissionRate}% commission:</div>
                    <div style={{ fontSize:'13px', color:'var(--warm)', fontWeight:300 }}>A $75 ticket earns your promoters ${(75 * form.commissionRate / 100).toFixed(2)} per sale — a strong incentive to hustle.</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <div>
                <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'4px' }}>Step 5</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', fontWeight:400, marginBottom:'1.5rem' }}>Review & publish</h2>
              </div>
              {[
                ['Event', [['Title', form.title || '—'],['Category', form.category || '—'],['Description', form.description ? form.description.slice(0,80)+'…' : '—']]],
                ['Date & Venue', [['Date', form.date || '—'],['Time', form.time || '—'],['Venue', form.venue || '—'],['City', form.city || '—']]],
                ['Tickets', form.tiers.map(t => [t.name || 'Unnamed', t.price ? `$${t.price} · ${t.available} available` : '—'])],
                ['Promoters', [['Status', form.enablePromoters ? `Enabled at ${form.commissionRate}%` : 'Disabled']]],
              ].map(([section, rows]) => (
                <div key={section} style={{ background:'var(--paper2)', border:'0.5px solid var(--line)', borderRadius:'12px', padding:'1.25rem' }}>
                  <div style={{ fontSize:'12px', fontWeight:600, color:'var(--warm)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem' }}>{section}</div>
                  {rows.map(([label, val]) => (
                    <div key={label} style={{ display:'flex', gap:'1rem', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'13px' }}>
                      <span style={{ color:'var(--warm)' }}>{label}</span>
                      <span style={{ fontWeight:500, color:'var(--ink)', textAlign:'right', maxWidth:'60%' }}>{val}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ padding:'1rem', background:'rgba(194,48,16,0.05)', border:'0.5px solid rgba(194,48,16,0.15)', borderRadius:'10px', fontSize:'13px', color:'var(--warm)', lineHeight:1.55 }}>
                🎟 Zwave charges <strong style={{ color:'var(--ink)' }}>3% per ticket sold</strong> (or 2% on Pro). No upfront costs, no monthly fees unless you're on Pro.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Btn variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : onNavigate('dashboard')} style={{ color:'var(--warm)' }}>
            ← {step === 0 ? 'Cancel' : 'Back'}
          </Btn>
          {step < STEPS.length - 1
            ? <Btn variant="primary" onClick={() => setStep(step + 1)} disabled={!canNext()}>Continue →</Btn>
            : <Btn variant="ember" size="lg" onClick={handleSubmit}>🚀 Publish Event</Btn>
          }
        </div>
      </div>
    </div>
  )
}
