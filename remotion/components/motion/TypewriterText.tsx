// remotion/components/motion/TypewriterText.tsx
import { useCurrentFrame } from 'remotion'
import { CSSProperties } from 'react'

interface TypewriterTextProps {
  text: string
  startFrame: number
  charsPerFrame?: number
  style?: CSSProperties
  cursorChar?: string
  showCursor?: boolean
}

export const TypewriterText = ({
  text,
  startFrame,
  charsPerFrame = 1.5,
  style,
  cursorChar = '|',
  showCursor = true,
}: TypewriterTextProps) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - startFrame)
  const charsToShow = Math.min(text.length, Math.floor(elapsed * charsPerFrame))
  const isComplete = charsToShow >= text.length
  const showingCursor = showCursor && !isComplete && elapsed >= 0

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {showingCursor && (
        <span style={{ opacity: Math.floor(elapsed / 8) % 2 === 0 ? 1 : 0 }}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}
