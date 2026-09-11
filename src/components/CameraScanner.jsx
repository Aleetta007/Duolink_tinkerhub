import { useEffect, useRef, useState, useCallback } from 'react'
import { initFaceLandmarker, detectFaces, extractFrameMetrics } from '../utils/faceAnalysis'
import { extractMetrics, computeKozhitharamScore } from '../utils/kozhiScore'
import { playSound } from '../utils/audio'
import ScanOverlay from './ScanOverlay'
import AnalysisProgress, { MESSAGES } from './AnalysisProgress'

const COLLECTION_DURATION_MS = 4000   // Collect frames for 4s
const ANALYSIS_STEP_INTERVAL = 600    // ms between log steps
const LANDMARK_COLOR = 'rgba(0, 245, 255, 0.6)'
const FACE_BOX_COLOR = 'rgba(34, 197, 94, 0.8)'

export default function CameraScanner({ onResult, onCancel }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const rafRef     = useRef(null)
  const streamRef  = useRef(null)

  const [cameraState, setCameraState]   = useState('init')  // init | loading | active | denied | error
  const [faceCount, setFaceCount]       = useState(0)
  const [logStep, setLogStep]           = useState(0)
  const [isAnalyzing, setIsAnalyzing]   = useState(false)
  const [statusMsg, setStatusMsg]       = useState('Initializing vision system...')

  const frameHistoryRef  = useRef([])
  const collectionRef    = useRef(null)
  const analysisDoneRef  = useRef(false)

  // ── Start camera & MediaPipe ─────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraState('loading')
    setLogStep(0)

    try {
      playSound('scan-start')

      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraState('active')
      setLogStep(2) // "Searching for subject"
      setStatusMsg('Searching for subject...')

      // Init MediaPipe
      await initFaceLandmarker()

      // Begin detection loop
      detectLoop()

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraState('denied')
      } else {
        console.error('Camera error:', err)
        setCameraState('error')
      }
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      stopEverything()
    }
  }, [])

  function stopEverything() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (collectionRef.current) clearTimeout(collectionRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }

  // ── Detection loop ────────────────────────────────────────────────────────
  function detectLoop() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || analysisDoneRef.current) return

    const result = detectFaces(video)

    if (result) {
      const count = result.faceLandmarks?.length || 0
      setFaceCount(count)

      if (count === 1 && !analysisDoneRef.current) {
        const faceLandmarks = result.faceLandmarks?.[0]
        if (Array.isArray(faceLandmarks) && faceLandmarks.length > 0) {
          // Draw landmarks
          drawLandmarks(canvas, video, result)

          // Collect frame metrics
          const metrics = extractFrameMetrics(faceLandmarks, result.faceBlendshapes)
          if (metrics) {
            frameHistoryRef.current.push(metrics)
          }
        } else {
          clearCanvas(canvas)
        }

        // If we haven't started collection timer, start it
        if (!collectionRef.current) {
          setLogStep(3) // "Face detected"
          setStatusMsg('Face detected.')
          playSound('face-detected')

          // Start progressive log steps
          let step = 4
          const stepTimer = setInterval(() => {
            setLogStep((s) => {
              const next = Math.min(s + 1, MESSAGES.length - 1)
              setStatusMsg(MESSAGES[next] || '')
              return next
            })
            step++
            if (step >= MESSAGES.length) clearInterval(stepTimer)
          }, ANALYSIS_STEP_INTERVAL)

          // After collection period, compute score
          collectionRef.current = setTimeout(() => {
            clearInterval(stepTimer)
            analysisDoneRef.current = true
            runAnalysis()
          }, COLLECTION_DURATION_MS)
        }
      } else if (count === 0) {
        // Reset collection if face lost
        if (collectionRef.current) {
          clearTimeout(collectionRef.current)
          collectionRef.current = null
          frameHistoryRef.current = []
          setLogStep(2)
          setStatusMsg('Searching for subject...')
        }
        clearCanvas(canvas)
      } else if (count > 1) {
        clearCanvas(canvas)
      }
    }

    if (!analysisDoneRef.current) {
      rafRef.current = requestAnimationFrame(detectLoop)
    }
  }

  function runAnalysis() {
    setIsAnalyzing(true)
    setLogStep(MESSAGES.length - 1)
    setStatusMsg('Finalizing investigation...')
    playSound('analysis')

    setTimeout(() => {
      const rawMetrics = extractMetrics(frameHistoryRef.current)
      const score = computeKozhitharamScore(rawMetrics)
      stopEverything()
      onResult(score)
    }, 1200)
  }

  // ── Drawing helpers ───────────────────────────────────────────────────────
  function drawLandmarks(canvas, video, result) {
    const ctx = canvas.getContext('2d')
    canvas.width  = video.videoWidth  || canvas.offsetWidth
    canvas.height = video.videoHeight || canvas.offsetHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const lms = result.faceLandmarks?.[0]
    if (!lms) return

    const W = canvas.width
    const H = canvas.height

    // Draw landmark dots
    ctx.fillStyle = LANDMARK_COLOR
    for (let i = 0; i < lms.length; i += 3) {  // Every 3rd point for perf
      const lm = lms[i]
      ctx.beginPath()
      ctx.arc(lm.x * W, lm.y * H, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw rough face bounding box from extreme points
    let minX = 1, maxX = 0, minY = 1, maxY = 0
    for (const lm of lms) {
      if (lm.x < minX) minX = lm.x
      if (lm.x > maxX) maxX = lm.x
      if (lm.y < minY) minY = lm.y
      if (lm.y > maxY) maxY = lm.y
    }
    const pad = 0.02
    ctx.strokeStyle = FACE_BOX_COLOR
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(34,197,94,0.6)'
    ctx.shadowBlur = 10
    ctx.strokeRect(
      (minX - pad) * W,
      (minY - pad) * H,
      (maxX - minX + pad * 2) * W,
      (maxY - minY + pad * 2) * H
    )
    ctx.shadowBlur = 0
  }

  function clearCanvas(canvas) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (cameraState === 'denied') {
    return (
      <div className="scanner-page">
        <div className="error-state">
          <div className="error-icon">🚫</div>
          <div className="error-title">Camera Permission Denied</div>
          <div className="error-msg">
            Camera permission denied. Even the camera refuses to investigate this case. 😭
            <br /><br />
            Please allow camera access in your browser settings and try again.
          </div>
          <button className="btn-start" onClick={startCamera}>TRY AGAIN</button>
          <button className="btn-cancel" onClick={onCancel}>← BACK</button>
        </div>
      </div>
    )
  }

  if (cameraState === 'error') {
    return (
      <div className="scanner-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Camera Error</div>
          <div className="error-msg">
            Failed to access camera. Please ensure no other app is using it.
          </div>
          <button className="btn-start" onClick={startCamera}>TRY AGAIN</button>
          <button className="btn-cancel" onClick={onCancel}>← BACK</button>
        </div>
      </div>
    )
  }

  return (
    <div className="scanner-page">
      <p className="scanner-title">
        ▶ KOZHITHARAM INVESTIGATION IN PROGRESS ◀
      </p>

      <div className="scanner-container">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="camera-feed"
            playsInline
            muted
            aria-label="Live camera feed for face detection"
          />
          <canvas
            ref={canvasRef}
            className="landmark-canvas"
            aria-hidden="true"
          />
          <ScanOverlay faceCount={faceCount} statusMessage={statusMsg} />
        </div>
      </div>

      <AnalysisProgress
        currentStep={logStep}
        totalSteps={MESSAGES.length - 1}
      />

      <div style={{ display: 'flex', gap: 12 }}>
        {isAnalyzing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--neon-cyan)', fontSize: '0.85rem' }}>
            <div className="spinner" />
            Computing Kozhitharam Score...
          </div>
        )}
        {!isAnalyzing && (
          <button className="btn-cancel" onClick={() => { stopEverything(); onCancel() }}>
            ← CANCEL
          </button>
        )}
      </div>
    </div>
  )
}
