const FEATURES = [
  { label: 'Real-Time Face Detection' },
  { label: 'Facial Landmark Analysis' },
  { label: 'Suspiciousness Engine' },
  { label: 'Kozhi Vibe Computation' },
  { label: 'Advanced Kozhitharam Algorithm™' },
]

export default function Landing({ onStart }) {
  return (
    <main className="landing">
      <div className="landing-hero fade-in">
        <div className="landing-chicken" role="img" aria-label="Chicken">🐔</div>

        <h1 className="landing-title">KOZHITHARAM DETECTOR™</h1>

        <p className="landing-subtitle">Advanced AI-Powered Kozhitharam Detection System</p>

        <p className="landing-tagline">
          "Because some things absolutely need to be measured."
        </p>

        <p className="landing-questionable">
          ⚗️ 100% scientifically questionable.
        </p>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-item" key={f.label}>
              <span className="check" aria-hidden="true">✓</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        <button
          className="btn-start"
          onClick={onStart}
          aria-label="Start Kozhitharam Analysis"
        >
          🔬 START ANALYSIS
        </button>

        <div className="landing-disclaimer" role="note">
          <strong>Disclaimer:</strong> Kozhitharam is a fictional entertainment metric and has no scientific validity.
          No images or facial data are uploaded or stored. All processing happens locally in your browser.
        </div>
      </div>
    </main>
  )
}
