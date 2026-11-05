import { motion } from 'framer-motion'

export function StarBurst({ count = 16 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((i) => {
        const angle = (i / count) * Math.PI * 2
        const distance = 120 + Math.random() * 100
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance
        const emoji = ['⭐', '✨', '🌟'][i % 3]
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-2xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{ x, y, opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: i * 0.02 }}
          >
            {emoji}
          </motion.span>
        )
      })}
    </div>
  )
}
