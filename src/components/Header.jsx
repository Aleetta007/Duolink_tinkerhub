import { useState } from 'react'
import { setMuted, isMuted } from '../utils/audio'

export default function Header() {
  const [muted, setMutedState] = useState(isMuted())

  function toggleMute() {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-icon">🐔</span>
        <span>KOZHITHARAM DETECTOR™</span>
        <span className="header-badge">v2.6.0</span>
      </div>

      <div className="header-controls">
        <span className="privacy-badge" title="Camera data processed locally. Nothing uploaded.">
          🔒 Local Processing
        </span>
        <button
          className="mute-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
        </button>
      </div>
    </header>
  )
}
