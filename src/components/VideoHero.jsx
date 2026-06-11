import React, { useRef, useEffect } from 'react'

export default function VideoHero({ children }) {
  const videoRef = useRef(null)
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = 0.75 }, [])
  return (
    <div style={{ position:'relative', minHeight:'100svh', overflow:'hidden', display:'grid', placeItems:'center', background:'var(--ink)' }}>
      <video ref={videoRef} autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.35, zIndex:0 }}>
        <source src="https://cdn.coverr.co/videos/coverr-people-dancing-at-a-concert-1764/1080p.mp4" type="video/mp4" />
      </video>
      <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(180deg, rgba(12,7,2,0.4) 0%, rgba(12,7,2,0.2) 40%, rgba(12,7,2,0.85) 100%)' }}/>
      <div style={{ position:'relative', zIndex:2, width:'100%' }}>{children}</div>
    </div>
  )
}
