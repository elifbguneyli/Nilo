import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { AVATAR_OPTIONS } from '../components/ChildAvatar'
import { pickAvatarColor, useChildren } from '../context/ChildrenContext'

export function Onboarding() {
  const { addChild, children } = useChildren()
  const navigate = useNavigate()
  const [step, setStep] = useState<'welcome' | 'form'>('welcome')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const color = pickAvatarColor(children.length)
    const child = addChild(trimmed, avatar, color)
    navigate(`/home/${child.id}`)
  }

  if (step === 'welcome') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <Mascot mood="excited" size={160} />
        <h1 className="font-heading text-4xl font-extrabold text-mint-600">Nilo'ya Hoş Geldin!</h1>
        <p className="max-w-sm font-body text-lg text-slate-600">
          Dişlerini fırçalamayı eğlenceli bir maceraya çevirelim. Hazır mısın?
        </p>
        <button
          onClick={() => setStep('form')}
          className="rounded-full bg-mint-400 px-10 py-4 font-heading text-xl font-bold text-white shadow-lg shadow-mint-400/30 transition active:scale-95"
        >
          Başlayalım! 🎉
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h2 className="font-heading text-3xl font-bold text-slate-700">Sana ne diyelim?</h2>
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col items-center gap-6">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adını yaz..."
          maxLength={20}
          className="w-full rounded-2xl border-2 border-mint-200 bg-white px-5 py-4 text-center font-heading text-2xl text-slate-700 outline-none focus:border-mint-400"
        />
        <div>
          <p className="mb-3 text-center font-body font-semibold text-slate-500">
            Bir karakter seç
          </p>
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setAvatar(option)}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition ${
                  avatar === option
                    ? 'bg-mint-400 shadow-md shadow-mint-400/40 scale-105'
                    : 'bg-white hover:bg-mint-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-full bg-coral-500 px-10 py-4 font-heading text-xl font-bold text-white shadow-lg shadow-coral-500/30 transition active:scale-95 disabled:opacity-40"
        >
          Maceraya Başla! 🚀
        </button>
      </form>
    </div>
  )
}
