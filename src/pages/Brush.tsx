import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { Mascot } from '../components/Mascot'
import { StarBurst } from '../components/StarBurst'
import { ToothShine } from '../components/ToothShine'
import { BADGES } from '../lib/badges'
import { todayKey } from '../lib/date'
import { clearBrushSessionState, loadBrushSessionState, saveBrushSessionState } from '../lib/storage'
import type { BrushSession } from '../types'

const ZONE_SECONDS = 20

const ZONES = [
  { label: 'Üst Sağ Azı Dişler', icon: '↖️' },
  { label: 'Üst Ön Dişler', icon: '⬆️' },
  { label: 'Üst Sol Azı Dişler', icon: '↗️' },
  { label: 'Alt Sol Azı Dişler', icon: '↙️' },
  { label: 'Alt Ön Dişler', icon: '⬇️' },
  { label: 'Alt Sağ Azı Dişler', icon: '↘️' },
]

type Phase = 'ready' | 'brushing' | 'done'

export function Brush() {
  const { childId, session } = useParams<{ childId: string; session: string }>()
  const { children, completeSession } = useChildren()
  const navigate = useNavigate()

  const child = children.find((c) => c.id === childId)
  const validSession = session === 'morning' || session === 'evening'

  const [resumable] = useState(() => {
    if (!childId || !validSession) return null
    const saved = loadBrushSessionState(childId, session)
    return saved && saved.dateKey === todayKey() ? saved : null
  })

  const [phase, setPhase] = useState<Phase>('ready')
  const [zoneIndex, setZoneIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(ZONE_SECONDS)
  const [paused, setPaused] = useState(false)
  const [result, setResult] = useState<{ stars: number; badges: string[] } | null>(null)
  const [zoneCelebration, setZoneCelebration] = useState(false)
  const finishedRef = useRef(false)
  const prevZoneRef = useRef(0)

  useEffect(() => {
    if (zoneIndex !== prevZoneRef.current) {
      prevZoneRef.current = zoneIndex
      setZoneCelebration(true)
      const timeout = setTimeout(() => setZoneCelebration(false), 700)
      return () => clearTimeout(timeout)
    }
  }, [zoneIndex])

  useEffect(() => {
    if (phase !== 'brushing' || paused) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setZoneIndex((zi) => {
            if (zi + 1 >= ZONES.length) {
              setPhase('done')
              return zi
            }
            return zi + 1
          })
          return ZONE_SECONDS
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, paused])

  useEffect(() => {
    if (phase === 'done' && !finishedRef.current && child && validSession) {
      finishedRef.current = true
      const { starsEarned, newBadgeIds } = completeSession(child.id, session as BrushSession)
      setResult({ stars: starsEarned, badges: newBadgeIds })
      clearBrushSessionState(child.id, session)
    }
  }, [phase, child, validSession, session, completeSession])

  // Keep progress on disk while brushing so leaving mid-session and coming back
  // today resumes from the same zone/second instead of restarting from scratch.
  useEffect(() => {
    if (phase !== 'brushing' || !child || !validSession) return
    saveBrushSessionState(child.id, session, { dateKey: todayKey(), zoneIndex, secondsLeft })
  }, [phase, child, validSession, session, zoneIndex, secondsLeft])

  function handleExit() {
    if (child) navigate(`/home/${child.id}`)
  }

  if (!child || !validSession) return <Navigate to="/" replace />

  const totalElapsed = zoneIndex * ZONE_SECONDS + (ZONE_SECONDS - secondsLeft)
  const totalSeconds = ZONES.length * ZONE_SECONDS
  const overallPct = Math.min(100, (totalElapsed / totalSeconds) * 100)

  if (phase === 'ready') {
    function handleStart() {
      if (resumable) {
        setZoneIndex(resumable.zoneIndex)
        setSecondsLeft(resumable.secondsLeft)
      }
      setPhase('brushing')
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <Mascot mood="idle" size={160} />
        <h1 className="font-heading text-3xl font-extrabold text-slate-700">
          {session === 'morning' ? 'Sabah Fırçalama Zamanı! ☀️' : 'Akşam Fırçalama Zamanı! 🌙'}
        </h1>
        <p className="max-w-sm font-body text-lg text-slate-600">
          {resumable
            ? 'Kaldığın yerden devam edelim! Fırçanı al, hazır olunca devam et.'
            : '2 dakika boyunca dişlerinin her bölgesini fırçalayacağız. Fırçanı al, hazır olunca başla!'}
        </p>
        <button
          onClick={handleStart}
          className="rounded-full bg-mint-400 px-10 py-4 font-heading text-xl font-bold text-white shadow-lg shadow-mint-400/30 transition active:scale-95"
        >
          {resumable ? 'Devam Et! 🪥' : 'Başla! 🪥'}
        </button>
        <button onClick={handleExit} className="font-body text-sm font-semibold text-slate-400 underline">
          Vazgeç
        </button>
      </div>
    )
  }

  if (phase === 'brushing') {
    const zone = ZONES[zoneIndex]
    const zoneProgress = (ZONE_SECONDS - secondsLeft) / ZONE_SECONDS
    return (
      <div className="relative flex min-h-screen flex-col items-center gap-6 px-6 py-8">
        <div className="flex w-full max-w-md items-center justify-between">
          <button
            onClick={handleExit}
            className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm"
          >
            ← Ana Sayfa
          </button>
          <p className="font-body font-semibold text-slate-400">
            Bölge {zoneIndex + 1} / {ZONES.length}
          </p>
        </div>

        <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-mint-100">
          <div
            className="h-full rounded-full bg-mint-400 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>

        <div className="relative flex flex-col items-center gap-2">
          <Mascot mood="excited" size={130} />
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-white px-6 py-4 shadow-md">
          <span className="text-3xl">{zone.icon}</span>
          <h2 className="font-heading text-2xl font-bold text-slate-700">{zone.label}</h2>
        </div>

        <ToothShine progress={zoneProgress} />

        <TimerRing seconds={secondsLeft} total={ZONE_SECONDS} />

        <button
          onClick={() => setPaused((p) => !p)}
          className="rounded-full bg-white px-6 py-2 font-body font-semibold text-slate-500 shadow-sm"
        >
          {paused ? '▶️ Devam Et' : '⏸️ Duraklat'}
        </button>

        <AnimatePresence>
          {zoneCelebration && (
            <motion.div
              className="pointer-events-none absolute top-24 left-1/2 flex items-center gap-2 rounded-full bg-sun-300 px-5 py-2 shadow-md"
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: -10, x: '-50%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xl">✨</span>
              <span className="font-heading font-bold text-slate-700">Süper gidiyorsun!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const unlockedBadges = BADGES.filter((b) => result?.badges.includes(b.id))

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <StarBurst />
      <Mascot mood="excited" size={170} />
      <h1 className="font-heading text-3xl font-extrabold text-mint-600">Harikasın! 🎉</h1>
      <p className="font-body text-lg text-slate-600">Dişlerini tertemiz fırçaladın.</p>
      <div className="flex items-center gap-2 rounded-full bg-sun-300/70 px-6 py-3">
        <span className="text-2xl">⭐</span>
        <span className="font-heading text-xl font-bold text-slate-700">+{result?.stars ?? 0} yıldız</span>
      </div>

      {unlockedBadges.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="font-heading font-bold text-grape-500">Yeni rozet kazandın!</p>
          <div className="flex gap-3">
            {unlockedBadges.map((b) => (
              <div
                key={b.id}
                className="flex w-24 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-md"
              >
                <span className="text-3xl">{b.emoji}</span>
                <span className="text-center font-body text-xs font-bold text-slate-600">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(`/home/${child.id}`)}
        className="mt-2 rounded-full bg-mint-400 px-10 py-4 font-heading text-xl font-bold text-white shadow-lg shadow-mint-400/30 transition active:scale-95"
      >
        Ana Sayfaya Dön 🏠
      </button>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/room/${child.id}`)}
          className="rounded-full bg-grape-400 px-5 py-3 font-heading font-bold text-white shadow-md shadow-grape-400/30 transition active:scale-95"
        >
          Nilo'nun Evi 🏡
        </button>
        <button
          onClick={() => navigate(`/shop/${child.id}`)}
          className="rounded-full bg-coral-500 px-5 py-3 font-heading font-bold text-white shadow-md shadow-coral-500/30 transition active:scale-95"
        >
          Yıldız Mağazası 🛍️
        </button>
      </div>
    </div>
  )
}

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const pct = seconds / total
  const offset = circumference * (1 - pct)

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg width="128" height="128" className="rotate-[-90deg]">
        <circle cx="64" cy="64" r={radius} stroke="#c7fff2" strokeWidth="10" fill="none" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#2fd4c0"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s linear' }}
        />
      </svg>
      <span className="absolute font-heading text-3xl font-extrabold text-slate-700">{seconds}</span>
    </div>
  )
}
