import { useState } from 'react'
import Header from './components/Header'
import Landing from './components/Landing'
import CameraScanner from './components/CameraScanner'
import ResultScreen from './components/ResultScreen'

// App state machine
// phases: 'landing' | 'scanning' | 'result'

export default function App() {
  const [phase, setPhase] = useState('landing')
  const [result, setResult] = useState(null)

  function handleStart() {
    setPhase('scanning')
  }

  function handleResult(resultData) {
    setResult(resultData)
    setPhase('result')
  }

  function handleScanAgain() {
    setResult(null)
    setPhase('scanning')
  }

  function handleBackToLanding() {
    setResult(null)
    setPhase('landing')
  }

  return (
    <div className="app">
      <Header />

      {phase === 'landing' && (
        <Landing onStart={handleStart} />
      )}

      {phase === 'scanning' && (
        <CameraScanner
          onResult={handleResult}
          onCancel={handleBackToLanding}
        />
      )}

      {phase === 'result' && result && (
        <ResultScreen
          result={result}
          onScanAgain={handleScanAgain}
        />
      )}
    </div>
  )
}
