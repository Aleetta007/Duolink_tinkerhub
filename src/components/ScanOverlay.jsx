// Futuristic scanning overlay HUD elements on top of the video

export default function ScanOverlay({ faceCount, statusMessage }) {
  return (
    <>
      {/* Scanning line */}
      <div className="scan-line" aria-hidden="true" />

      {/* Corner brackets */}
      <div className="scan-corner tl" aria-hidden="true" />
      <div className="scan-corner tr" aria-hidden="true" />
      <div className="scan-corner bl" aria-hidden="true" />
      <div className="scan-corner br" aria-hidden="true" />

      {/* Status badge */}
      {statusMessage && (
        <div className="scan-status-badge" role="status" aria-live="polite">
          {statusMessage}
        </div>
      )}

      {/* Face count warnings */}
      {faceCount === 0 && (
        <div className="face-warning" role="alert">
          ⚠️ FACE NOT DETECTED — Position yourself in the frame
        </div>
      )}
      {faceCount > 1 && (
        <div className="face-warning" role="alert">
          🚨 MULTIPLE KOZHIS DETECTED — Only one suspect at a time, please
        </div>
      )}
    </>
  )
}
