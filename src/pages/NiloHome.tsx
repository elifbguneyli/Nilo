import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { Mascot } from '../components/Mascot'
import { isWearableCategory, ROOM_DECOR_SLOTS, SHOP_ITEMS, type ShopItem } from '../lib/shopItems'

export function NiloHome() {
  const { childId } = useParams<{ childId: string }>()
  const { children, getProgress, togglePlacedItem } = useChildren()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)

  const child = children.find((c) => c.id === childId)
  if (!child) return <Navigate to="/" replace />

  const progress = getProgress(child.id)
  const ownedItems = SHOP_ITEMS.filter((item) => progress.purchasedItemIds.includes(item.id))
  const placedItems = progress.placedItemIds
    .map((id) => SHOP_ITEMS.find((item) => item.id === id))
    .filter((item): item is ShopItem => Boolean(item))

  const equippedHat = placedItems.find((item) => item.category === 'hat')
  const equippedGlasses = placedItems.find((item) => item.category === 'glasses')
  const placedDecor = placedItems.filter((item) => !isWearableCategory(item.category))

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 1800)
  }

  const handleToggle = (itemId: string) => {
    const result = togglePlacedItem(child.id, itemId)
    if (!result.success && result.reason === 'room-full') {
      showToast('Oda dolu! Önce bir eşya kaldır 😊')
    }
  }

  const decorSlots = Array.from({ length: ROOM_DECOR_SLOTS }, (_, i) => placedDecor[i] ?? null)

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-md items-center justify-between">
        <button
          onClick={() => navigate(`/home/${child.id}`)}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm"
        >
          ← Ana Sayfa
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="font-heading text-lg font-bold text-slate-700">{progress.starBalance}</span>
        </div>
      </div>

      <h1 className="font-heading text-2xl font-extrabold text-slate-700">Nilo'nun Evi 🏡</h1>

      <div className="flex w-full max-w-md flex-col items-center">
        {/* Roof */}
        <div
          className="h-0 w-0"
          style={{
            borderLeft: '95px solid transparent',
            borderRight: '95px solid transparent',
            borderBottom: '46px solid var(--color-coral-400)',
          }}
          aria-hidden
        />
        {/* Walls */}
        <div className="relative flex w-full flex-col items-center gap-6 rounded-b-[2rem] border-x-8 border-b-8 border-coral-400/40 bg-gradient-to-b from-mint-100 to-mint-50 p-6 pt-8 shadow-inner">
          <span className="absolute left-4 top-4 text-xl" aria-hidden>
            🪟
          </span>
          <span className="absolute right-4 top-4 text-xl" aria-hidden>
            🪟
          </span>

          <Mascot mood="happy" size={150} hatEmoji={equippedHat?.emoji} glassesEmoji={equippedGlasses?.emoji} />

          <div className="grid w-full grid-cols-4 gap-3">
            {decorSlots.map((item, i) =>
              item ? (
                <button
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  aria-label={`${item.name} eşyasını odadan kaldır`}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl bg-white text-3xl shadow-md transition active:scale-90 ${
                    item.category === 'decoration' ? 'ring-4 ring-sun-400' : ''
                  }`}
                >
                  {item.emoji}
                </button>
              ) : (
                <div
                  key={`empty-${i}`}
                  className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-mint-300 text-mint-300"
                  aria-hidden
                >
                  +
                </div>
              ),
            )}
          </div>
        </div>
        {/* Doorstep */}
        <div className="h-3 w-2/3 rounded-b-xl bg-coral-400/40" aria-hidden />
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        <h2 className="font-heading text-lg font-bold text-slate-700">Eşyalarım</h2>
        {ownedItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
            <span className="text-4xl">🛍️</span>
            <p className="font-body text-slate-500">
              Henüz hiç eşyan yok. Yıldız Mağazası'ndan eğlenceli şeyler alabilirsin!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {ownedItems.map((item) => {
              const placed = progress.placedItemIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl p-3 shadow-sm transition active:scale-95 ${
                    placed ? 'bg-mint-400 text-white' : 'bg-white text-slate-700'
                  } ${item.category === 'decoration' ? 'ring-2 ring-sun-400' : ''}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="truncate font-body text-xs font-bold">{item.name}</span>
                  <span className="font-body text-[10px] opacity-80">
                    {placed ? (isWearableCategory(item.category) ? 'Takılı' : 'Odada') : 'Dokun'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/shop/${child.id}`)}
        className="rounded-full bg-coral-500 px-8 py-3 font-heading text-lg font-bold text-white shadow-md shadow-coral-500/30 transition active:scale-95"
      >
        🛍️ Yıldız Mağazası
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-8 left-1/2 rounded-full bg-slate-700 px-5 py-3 font-body font-semibold text-white shadow-lg"
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
