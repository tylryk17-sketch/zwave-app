import React, { useState } from "react"
import { useApp } from "../context/AppContext"

export function LoginPage({ onNavigate }) {
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try { await login(email, password); onNavigate("home") }
    catch (err) { setError(err.message || "Invalid email or password.") }
    finally { setLoading(false) }
  }
  return (
    <div style={{ minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--paper)", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:"400px" }}>
        <button onClick={() => onNavigate("home")} style={{ fontFamily:"Playfair Display,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", background:"none", border:"none", cursor:"pointer", marginBottom:"2rem", display:"block" }}>Zwave</button>
        <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"32px", fontWeight:400, marginBottom:"0.5rem" }}>Log in</h1>
        <p style={{ fontSize:"14px", color:"var(--warm)", marginBottom:"2rem" }}>No account? <button onClick={() => onNavigate("signup")} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontFamily:"inherit", fontSize:"14px", fontWeight:500 }}>Sign up</button></p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ fontSize:"12px", fontWeight:500, color:"var(--warm)", display:"block", marginBottom:"6px" }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required style={{ width:"100%", background:"var(--paper2)", border:"0.5px solid var(--line2)", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", color:"var(--ink)", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ fontSize:"12px", fontWeight:500, color:"var(--warm)", display:"block", marginBottom:"6px" }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="8+ characters" required style={{ width:"100%", background:"var(--paper2)", border:"0.5px solid var(--line2)", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", color:"var(--ink)", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
          </div>
          {error && <div style={{ background:"rgba(194,48,16,0.08)", border:"0.5px solid rgba(194,48,16,0.25)", borderRadius:"8px", padding:"10px 14px", fontSize:"13px", color:"var(--ember)", marginBottom:"1rem" }}>⚠️ {error}</div>}
          <button type="submit" disabled={loading} style={{ width:"100%", background:"var(--ink)", color:"var(--paper)", border:"none", borderRadius:"100px", padding:"14px", fontSize:"14px", fontWeight:600, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?0.7:1 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

export function SignupPage({ onNavigate, defaultRole }) {
  const { signup } = useApp()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(defaultRole || "")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const roles = [
    { id:"organizer", icon:"🎤", title:"Event Organizer", desc:"Create events and sell tickets." },
    { id:"promoter", icon:"🔗", title:"Promoter", desc:"Share events and earn commissions." },
    { id:"attendee", icon:"🎟", title:"Fan", desc:"Discover events and buy tickets." },
  ]
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    setError("")
    setLoading(true)
    try { await signup({ name, email, password, role }); onNavigate("dashboard") }
    catch (err) { setError(err.message || "Could not create account. Please try again.") }
    finally { setLoading(false) }
  }
  return (
    <div style={{ minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--paper)", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:"460px" }}>
        <button onClick={() => onNavigate("home")} style={{ fontFamily:"Playfair Display,serif", fontSize:"22px", fontWeight:700, color:"var(--ink)", background:"none", border:"none", cursor:"pointer", marginBottom:"2rem", display:"block" }}>Zwave</button>
        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"2rem" }}>
          {[1,2].map(s => <div key={s} style={{ flex:1, height:"3px", borderRadius:"2px", background:s<=step?"var(--gold)":"var(--paper3)" }}/>)}
        </div>
        {step === 1 ? (
          <div>
            <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"32px", fontWeight:400, marginBottom:"0.5rem" }}>Join Zwave</h1>
            <p style={{ fontSize:"14px", color:"var(--warm)", marginBottom:"1.5rem" }}>How do you want to use Zwave?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"1.5rem" }}>
              {roles.map(r => (
                <div key={r.id} onClick={() => setRole(r.id)} style={{ display:"flex", gap:"1rem", alignItems:"center", padding:"1rem 1.25rem", borderRadius:"12px", cursor:"pointer", border:role===r.id?"1px solid var(--gold)":"1px solid var(--line)", background:role===r.id?"rgba(184,122,20,0.05)":"var(--paper2)" }}>
                  <span style={{ fontSize:"22px" }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize:"14px", fontWeight:500, color:"var(--ink)" }}>{r.title}</div>
                    <div style={{ fontSize:"12px", color:"var(--warm)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { if(role) setStep(2) }} style={{ width:"100%", background:"var(--ink)", color:"var(--paper)", border:"none", borderRadius:"100px", padding:"14px", fontSize:"14px", fontWeight:600, cursor:role?"pointer":"not-allowed", fontFamily:"inherit", opacity:role?1:0.5 }}>Continue</button>
            <p style={{ fontSize:"13px", color:"var(--warm)", textAlign:"center", marginTop:"1rem" }}>Already have an account? <button onClick={() => onNavigate("login")} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontFamily:"inherit", fontSize:"13px", fontWeight:500 }}>Log in</button></p>
          </div>
        ) : (
          <div>
            <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"32px", fontWeight:400, marginBottom:"0.5rem" }}>Create account</h1>
            <p style={{ fontSize:"14px", color:"var(--warm)", marginBottom:"1.5rem" }}>Signing up as <strong style={{ color:"var(--gold)" }}>{roles.find(r=>r.id===role)?.title}</strong></p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:"12px", fontWeight:500, color:"var(--warm)", display:"block", marginBottom:"6px" }}>Full name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required style={{ width:"100%", background:"var(--paper2)", border:"0.5px solid var(--line2)", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", color:"var(--ink)", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:"12px", fontWeight:500, color:"var(--warm)", display:"block", marginBottom:"6px" }}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required style={{ width:"100%", background:"var(--paper2)", border:"0.5px solid var(--line2)", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", color:"var(--ink)", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:"12px", fontWeight:500, color:"var(--warm)", display:"block", marginBottom:"6px" }}>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" required style={{ width:"100%", background:"var(--paper2)", border:"0.5px solid var(--line2)", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", color:"var(--ink)", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
              </div>
              {error && <div style={{ background:"rgba(194,48,16,0.08)", border:"0.5px solid rgba(194,48,16,0.25)", borderRadius:"8px", padding:"10px 14px", fontSize:"13px", color:"var(--ember)", marginBottom:"1rem" }}>⚠️ {error}</div>}
              <button type="submit" disabled={loading} style={{ width:"100%", background:"var(--ember)", color:"#fff", border:"none", borderRadius:"100px", padding:"14px", fontSize:"14px", fontWeight:600, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?0.7:1, marginBottom:"0.75rem" }}>
                {loading ? "Creating account..." : "Create my account"}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ width:"100%", background:"none", border:"none", fontSize:"13px", color:"var(--warm)", cursor:"pointer", fontFamily:"inherit" }}>Back</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}