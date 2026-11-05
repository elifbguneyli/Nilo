import { AnimatePresence, motion } from 'framer-motion'

const TOOTH_PATH =
  'M50 8c-16 0-26 10.5-26 25 0 11 3.5 19.6 5.6 31 1.7 9.4 3 20 10 20 6.5 0 7.4-12.2 8.7-20.3.6-4.3 2.1-7.8 2.4-7.8.3 0 1.8 3.5 2.4 7.8 1.3 8.1 2.2 20.3 8.7 20.3 7 0 8.3-10.6 10-20 2.1-11.4 5.6-20 5.6-31C76 18.5 66 8 50 8z'

const SPARKLE_POSITIONS = [
  { top: '12%', left: '18%' },
  { top: '8%', left: '68%' },
  { top: '46%', left: '78%' },
  { top: '58%', left: '12%' },
]

/**
 * Shows a tooth that visibly gets cleaner and shinier as `progress` (0 to 1) advances
 * through the current 20-second brushing zone. Purely decorative — it does not measure
 * any real brushing motion, it just reflects the zone's countdown.
 */
export function ToothShine({ progress }: { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress))
  const sparkleCount = Math.round(clamped * SPARKLE_POSITIONS.length)

  return (
    <div className="relative" style={{ width: 100, height: 100 }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d={TOOTH_PATH} fill="#ffffff" stroke="#8ff5e4" strokeWidth="2" />
        <motion.path
          d={TOOTH_PATH}
          fill="#d8c6a1"
          animate={{ opacity: 0.6 * (1 - clamped) }}
          transition={{ duration: 0.4 }}
        />
      </svg>
      <AnimatePresence>
        {SPARKLE_POSITIONS.slice(0, sparkleCount).map((pos, i) => (
          <motion.span
            key={i}
            className="absolute text-lg"
            style={{ top: pos.top, left: pos.left }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.3, 1] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
          >
            ✨
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
