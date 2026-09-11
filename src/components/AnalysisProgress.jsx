const MESSAGES = [
  'Initializing vision system...',
  'Activating camera...',
  'Searching for subject...',
  'Face detected.',
  'Mapping facial landmarks...',
  'Analyzing suspicious facial activity...',
  'Measuring Kozhi Vibes™...',
  'Calculating suspiciousness...',
  'Consulting Kozhi Database™...',
  'Running Kozhitharam Algorithm™...',
  'Finalizing investigation...',
]

export default function AnalysisProgress({ currentStep, totalSteps }) {
  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0

  return (
    <div className="analysis-progress glass-card">
      <ul className="analysis-log" aria-label="Analysis progress">
        {MESSAGES.map((msg, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep
          return (
            <li
              key={i}
              className={isDone ? 'done' : isActive ? 'active' : ''}
            >
              <span className={`log-dot${isActive ? ' blink' : ''}`} aria-hidden="true" />
              {isDone ? '✓ ' : isActive ? '▶ ' : '  '}{msg}
            </li>
          )
        })}
      </ul>

      <div className="analysis-bar-wrap" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="analysis-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export { MESSAGES }
