import { useEffect, useRef } from 'react'

// Hue for each breakdown metric
const BAR_COLORS = [
  '#f97316',  // Suspicious Smile — orange
  '#22c55e',  // Eye Activity — green
  '#3b82f6',  // Head Movement — blue
  '#fbbf24',  // Eyebrow Activity — yellow
  '#ef4444',  // Suspiciousness — red
  '#a855f7',  // Kozhi Vibes™ — purple
]

export default function ScoreBreakdown({ breakdown }) {
  const entries = Object.entries(breakdown)

  return (
    <div className="breakdown-panel glass-card fade-in">
      <h3>📊 DETAILED ANALYSIS BREAKDOWN</h3>
      {entries.map(([label, value], i) => (
        <BreakdownBar
          key={label}
          label={label}
          value={value}
          color={BAR_COLORS[i % BAR_COLORS.length]}
        />
      ))}
    </div>
  )
}

function BreakdownBar({ label, value, color }) {
  const fillRef = useRef(null)

  useEffect(() => {
    // Animate width after mount
    const el = fillRef.current
    if (!el) return
    el.style.width = '0%'
    const t = setTimeout(() => {
      el.style.width = `${value}%`
      el.style.background = color
      el.style.boxShadow = `0 0 8px ${color}60`
    }, 100)
    return () => clearTimeout(t)
  }, [value, color])

  return (
    <div className="breakdown-item">
      <span className="breakdown-label">{label}</span>
      <div className="breakdown-bar-track">
        <div
          ref={fillRef}
          className="breakdown-bar-fill"
        />
      </div>
      <span className="breakdown-pct" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}
