import { useState, useEffect, useRef } from 'react'
import { getCategoryForScore } from '../data/scoreCategories'
import { playSound } from '../utils/audio'
import VerdictCard from './VerdictCard'
import ScoreBreakdown from './ScoreBreakdown'
import CertificateForm from './CertificateForm'

export default function ResultScreen({ result, onScanAgain }) {
  const { total, breakdown } = result
  const [displayScore, setDisplayScore] = useState(0)
  const [revealed, setRevealed]         = useState(false)
  const animRef = useRef(null)

  const category = getCategoryForScore(total)

  // ── Animate score from 0 → total ────────────────────────────────────────
  useEffect(() => {
    const duration = 2000
    const start    = performance.now()

    function step(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * total * 10) / 10
      setDisplayScore(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        setDisplayScore(total)
        setRevealed(true)
        // Play result audio
        playSound(category.audioKey)
      }
    }

    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [total, category.audioKey])

  return (
    <div className="result-page">
      {/* Header */}
      <div className="result-header fade-in">
        <h2>🔬 KOZHITHARAM ANALYSIS COMPLETE</h2>
        <h1>YOUR KOZHITHARAM SCORE™</h1>
      </div>

      {/* Score number */}
      <div className="score-reveal fade-in">
        <div
          className="score-number"
          aria-label={`Kozhitharam score: ${total} percent`}
          style={{
            filter: revealed
              ? `drop-shadow(0 0 30px ${category.glowColor})`
              : 'none',
            transition: 'filter 0.5s',
          }}
        >
          {displayScore.toFixed(1)}%
        </div>
        <div className="score-label">KOZHITHARAM SCORE</div>
      </div>

      {/* Verdict */}
      {revealed && <VerdictCard category={category} />}

      {/* Breakdown */}
      {revealed && <ScoreBreakdown breakdown={breakdown} />}

      {/* Certificate */}
      {revealed && (
        <CertificateForm score={total} category={category} />
      )}

      {/* Actions */}
      <div className="result-actions fade-in">
        <button
          className="btn-scan-again"
          onClick={onScanAgain}
          aria-label="Scan another person"
        >
          🔄 SCAN AGAIN
        </button>
      </div>

      {/* Footer note */}
      <p
        style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: 480,
        }}
        role="note"
      >
        🔒 Your camera feed was processed locally. No data was uploaded or stored.
        The Kozhitharam Score is fictional and intended purely for entertainment.
      </p>
    </div>
  )
}
