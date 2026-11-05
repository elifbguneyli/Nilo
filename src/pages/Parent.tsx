import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { ChildAvatar } from '../components/ChildAvatar'
import { lastNDays, dayLabel, weekdayLabel } from '../lib/date'
import { calcStreak } from '../lib/progress'

function randomInt(max: number) {
  return Math.floor(Math.random() * max) + 1
}

export function Parent() {
  const navigate = useNavigate()
  const [unlocked, setUnlocked] = useState(false)
  const [a, setA] = useState(() => randomInt(8))
  const [b, setB] = useState(() => randomInt(8))
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(false)

  function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (Number(answer) === a + b) {
      setUnlocked(true)
    } else {
      setError(true)
      setA(randomInt(8))
      setB(randomInt(8))
      setAnswer('')
    }
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-slate-700">Ebeveyn Alanı</h1>
        <p className="font-body text-slate-500">Devam etmek için işlemi çöz:</p>
        <form onSubmit={handleCheck} className="flex flex-col items-center gap-4">
          <p className="font-heading text-3xl font-bold text-slate-700">
            {a} + {b} = ?
          </p>
          <input
            autoFocus
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-28 rounded-xl border-2 border-mint-200 bg-white px-4 py-2 text-center font-heading text-xl outline-none focus:border-mint-400"
          />
          {error && <p className="font-body text-sm text-coral-500">Tekrar dene.</p>}
          <button
            type="submit"
            className="rounded-full bg-mint-400 px-8 py-3 font-heading font-bold text-white shadow-md active:scale-95"
          >
            Onayla
          </button>
        </form>
        <button onClick={() => navigate('/')} className="font-body text-sm text-slate-400 underline">
          Vazgeç
        </button>
      </div>
    )
  }

  return <ParentDashboard onBack={() => navigate('/')} />
}

function ParentDashboard({ onBack }: { onBack: () => void }) {
  const { children, getProgress, removeChild, addTestStars } = useChildren()
  const days = useMemo(() => lastNDays(7), [])

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-lg items-center justify-between">
        <button onClick={onBack} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm">
          ← Geri
        </button>
        <h1 className="font-heading text-xl font-extrabold text-slate-700">Ebeveyn Paneli</h1>
      </div>

      {children.length === 0 && (
        <p className="font-body text-slate-500">Henüz bir çocuk profili eklenmedi.</p>
      )}

      <div className="w-full max-w-lg rounded-2xl border-2 border-dashed border-grape-400/40 bg-grape-400/5 p-4">
        <p className="font-body text-xs font-semibold text-grape-500">
          🧪 Test aracı — sadece geliştirme/deneme amaçlı. Gerçek kullanıcıların yıldız kazanması
          hâlâ fırçalama yaparak olur; bu buton sadece Nilo'nun Evi ve Mağaza'yı hızlıca
          deneyebilmen için.
        </p>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-5">
        {children.map((child) => {
          const progress = getProgress(child.id)
          const streak = calcStreak(progress)
          return (
            <div key={child.id} className="rounded-3xl bg-white p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChildAvatar avatar={child.avatar} color={child.color} size={52} />
                  <div>
                    <p className="font-heading text-lg font-bold text-slate-700">{child.name}</p>
                    <p className="font-body text-sm text-slate-500">
                      🔥 {streak} gün · ⭐ {progress.totalStars} yıldız
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => addTestStars(child.id, 50)}
                    className="rounded-full bg-grape-400 px-3 py-1.5 font-body text-xs font-bold text-white shadow-sm transition active:scale-95"
                  >
                    🧪 +50 Yıldız
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`${child.name} profilini silmek istediğine emin misin? Tüm ilerleme silinecek.`)) {
                        removeChild(child.id)
                      }
                    }}
                    className="font-body text-xs font-semibold text-coral-500 underline"
                  >
                    Sil
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between gap-1">
                {days.map((key) => {
                  const record = progress.history[key]
                  const full = record?.morning && record?.evening
                  const partial = (record?.morning || record?.evening) && !full
                  return (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <span className="font-body text-[10px] font-semibold text-slate-400">
                        {weekdayLabel(key)}
                      </span>
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                          full
                            ? 'bg-mint-400 text-white'
                            : partial
                              ? 'bg-sun-300 text-slate-700'
                              : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {dayLabel(key)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
