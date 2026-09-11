import { useState } from 'react'
import { generateCertificate } from '../utils/certificate'

export default function CertificateForm({ score, category }) {
  const [name, setName]         = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated]   = useState(false)

  async function handleGenerate() {
    if (!name.trim()) return
    setGenerating(true)
    try {
      await generateCertificate({
        name: name.trim(),
        score,
        categoryTitle: category.title,
        categoryEmoji: category.emoji,
      })
      setGenerated(true)
    } catch (err) {
      console.error('Certificate generation failed:', err)
      alert('Certificate generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="cert-panel fade-in">
      <h3>🏆 DOWNLOAD KOZHITHARAM CERTIFICATE</h3>
      <p>
        Get your official, completely fictional, 100% meaningless certificate of Kozhitharam.
        Impress your friends. Confuse your relatives.
      </p>

      <div className="cert-input-row">
        <input
          type="text"
          className="cert-input"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          aria-label="Your name for the certificate"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          className="btn-cert"
          onClick={handleGenerate}
          disabled={generating || !name.trim()}
          aria-label="Generate and download Kozhitharam certificate"
        >
          {generating
            ? '⏳ Generating...'
            : generated
            ? '✓ Download Again'
            : '📜 GENERATE CERTIFICATE'}
        </button>
      </div>

      {generated && (
        <p style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--neon-green)' }}>
          ✓ Certificate downloaded! Frame it. Treasure it. It means nothing.
        </p>
      )}
    </div>
  )
}
