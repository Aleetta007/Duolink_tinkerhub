import { getDialogue } from '../data/dialogues'

export default function VerdictCard({ category }) {
  const dialogue = getDialogue(category.id)

  return (
    <div
      className="verdict-card scale-in"
      style={{
        background: category.gradient,
        borderColor: category.color,
        boxShadow: `0 0 40px ${category.glowColor}, inset 0 0 30px rgba(0,0,0,0.3)`,
        color: category.color,
      }}
    >
      <span className="verdict-emoji" role="img" aria-label={category.title}>
        {category.emoji}
      </span>

      <h2 className="verdict-title">{category.title}</h2>

      <p className="verdict-malayalam-title">{category.malayalamTitle}</p>

      <p className="verdict-description" style={{ color: '#cbd5e1' }}>
        {category.description}
      </p>

      <blockquote
        className="verdict-dialogue"
        lang="ml"
        style={{ borderColor: category.color, color: '#f1f5f9' }}
      >
        {dialogue}
      </blockquote>
    </div>
  )
}
