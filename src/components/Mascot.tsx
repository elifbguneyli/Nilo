import { motion } from 'framer-motion'

type Mood = 'idle' | 'happy' | 'excited' | 'sleepy'

export function Mascot({ mood = 'idle', size = 140 }: { mood?: Mood; size?: number }) {
  const eyesClosed = mood === 'sleepy'
  const bigSmile = mood === 'happy' || mood === 'excited'

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={
        mood === 'excited'
          ? { y: [0, -14, 0], rotate: [-4, 4, -4] }
          : mood === 'sleepy'
            ? { y: [0, 3, 0] }
            : { y: [0, -6, 0] }
      }
      transition={{
        duration: mood === 'excited' ? 0.6 : 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <ellipse cx="60" cy="112" rx="34" ry="5" fill="#1cb8a6" opacity="0.15" />
        <path
          d="M60 14c-22 0-37 14.5-37 34.5 0 15 4.8 27 7.8 43 2.4 13 4.2 27.7 13.8 27.7 9 0 10.2-16.8 12-28 .9-6 3-10.8 3.4-10.8.4 0 2.5 4.8 3.4 10.8 1.8 11.2 3 28 12 28 9.6 0 11.4-14.7 13.8-27.7 3-16 7.8-28 7.8-43C97 28.5 82 14 60 14z"
          fill="#ffffff"
          stroke="#8ff5e4"
          strokeWidth="2"
        />
        {eyesClosed ? (
          <>
            <path d="M40 50q6-6 12 0" stroke="#1f2a37" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M68 50q6-6 12 0" stroke="#1f2a37" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="46" cy="50" r="4.5" fill="#1f2a37" />
            <circle cx="74" cy="50" r="4.5" fill="#1f2a37" />
          </>
        )}
        <circle cx="33" cy="60" r="6" fill="#ff9170" opacity="0.5" />
        <circle cx="87" cy="60" r="6" fill="#ff9170" opacity="0.5" />
        {bigSmile ? (
          <path
            d="M44 64c4 8 12 12 16 12s12-4 16-12"
            stroke="#1f2a37"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path d="M48 66q12 8 24 0" stroke="#1f2a37" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  )
}
