import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { BADGES } from '../lib/badges'
import { ChildAvatar } from '../components/ChildAvatar'

export function Rewards() {
  const { childId } = useParams<{ childId: string }>()
  const { children, getProgress } = useChildren()
  const navigate = useNavigate()

  const child = children.find((c) => c.id === childId)
  if (!child) return <Navigate to="/" replace />

  const progress = getProgress(child.id)

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-md items-center justify-between">
        <button
          onClick={() => navigate(`/home/${child.id}`)}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm"
        >
          ← Geri
        </button>
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-4 py-2 shadow-sm">
          <span className="flex items-center gap-1 font-heading text-lg font-bold text-slate-700">
            ⭐ {progress.totalStars}
          </span>
          <span className="font-body text-[10px] text-slate-400">toplam kazanılan</span>
        </div>
      </div>

      <ChildAvatar avatar={child.avatar} color={child.color} size={72} />
      <h1 className="font-heading text-2xl font-extrabold text-slate-700">{child.name}'nin Rozetleri</h1>

      <div className="grid w-full max-w-md grid-cols-2 gap-4 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const unlocked = progress.unlockedBadgeIds.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1 rounded-3xl p-4 text-center shadow-sm ${
                unlocked ? 'bg-white' : 'bg-slate-100 opacity-60'
              }`}
            >
              <span className="text-4xl">{unlocked ? badge.emoji : '🔒'}</span>
              <span className="font-heading text-sm font-bold text-slate-700">{badge.name}</span>
              <span className="font-body text-xs text-slate-500">{badge.description}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
