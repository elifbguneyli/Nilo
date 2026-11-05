import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { Mascot } from '../components/Mascot'
import { ChildAvatar } from '../components/ChildAvatar'
import { todayKey } from '../lib/date'
import { calcStreak } from '../lib/progress'

export function Home() {
  const { childId } = useParams<{ childId: string }>()
  const { children, getProgress } = useChildren()
  const navigate = useNavigate()

  const child = children.find((c) => c.id === childId)
  if (!child) return <Navigate to="/" replace />

  const progress = getProgress(child.id)
  const today = progress.history[todayKey()] ?? { morning: false, evening: false }
  const streak = calcStreak(progress)
  const bothDone = today.morning && today.evening

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-md items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm"
        >
          ← Profiller
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="font-heading text-lg font-bold text-slate-700">{progress.totalStars}</span>
        </div>
      </div>

      <ChildAvatar avatar={child.avatar} color={child.color} size={88} />
      <h1 className="font-heading text-2xl font-extrabold text-slate-700">Merhaba, {child.name}!</h1>

      <div className="flex items-center gap-2 rounded-full bg-sun-300/60 px-5 py-2">
        <span className="text-xl">🔥</span>
        <span className="font-heading font-bold text-slate-700">{streak} günlük seri</span>
      </div>

      <Mascot mood={bothDone ? 'excited' : 'idle'} size={130} />

      <div className="flex w-full max-w-md flex-col gap-4">
        <SessionCard
          label="Sabah Fırçalama"
          emoji="☀️"
          done={today.morning}
          onClick={() => navigate(`/brush/${child.id}/morning`)}
        />
        <SessionCard
          label="Akşam Fırçalama"
          emoji="🌙"
          done={today.evening}
          onClick={() => navigate(`/brush/${child.id}/evening`)}
        />
      </div>

      <button
        onClick={() => navigate(`/rewards/${child.id}`)}
        className="mt-2 rounded-full bg-grape-400 px-8 py-3 font-heading text-lg font-bold text-white shadow-md shadow-grape-400/30 transition active:scale-95"
      >
        🏆 Ödüllerim
      </button>
    </div>
  )
}

function SessionCard({
  label,
  emoji,
  done,
  onClick,
}: {
  label: string
  emoji: string
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={done}
      className={`flex items-center gap-4 rounded-3xl p-5 text-left shadow-md transition active:scale-95 ${
        done ? 'bg-mint-100' : 'bg-white hover:-translate-y-0.5'
      }`}
    >
      <span className="text-4xl">{emoji}</span>
      <div className="flex-1">
        <p className="font-heading text-xl font-bold text-slate-700">{label}</p>
        <p className="font-body text-sm text-slate-500">
          {done ? 'Tamamlandı! Harikasın 🎉' : '2 dakikalık eğlenceli fırçalama'}
        </p>
      </div>
      {done && <span className="text-3xl">✅</span>}
    </button>
  )
}
