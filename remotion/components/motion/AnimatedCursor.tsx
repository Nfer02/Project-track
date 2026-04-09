// remotion/components/motion/AnimatedCursor.tsx
import { useCurrentFrame, interpolate } from 'remotion'

interface Point { x: number; y: number }

interface AnimatedCursorProps {
  from: Point
  to: Point
  moveStartFrame: number
  moveDurationFrames: number
  clickFrame?: number
}

export const AnimatedCursor = ({
  from, to, moveStartFrame, moveDurationFrames, clickFrame,
}: AnimatedCursorProps) => {
  const frame = useCurrentFrame()

  const x = interpolate(
    frame, [moveStartFrame, moveStartFrame + moveDurationFrames], [from.x, to.x],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
  )
  const y = interpolate(
    frame, [moveStartFrame, moveStartFrame + moveDurationFrames], [from.y, to.y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
  )
  const scale = clickFrame
    ? interpolate(frame, [clickFrame, clickFrame + 6, clickFrame + 12], [1, 0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${scale})`,
      pointerEvents: 'none', zIndex: 100,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 4L13 24L17 17L24 13L4 4Z" fill="white" stroke="#0a0f1a" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
