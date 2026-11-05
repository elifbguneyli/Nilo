import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../context/ChildrenContext'
import { StarBurst } from '../components/StarBurst'
import { CATEGORY_LABELS, SHOP_ITEMS, type ShopCategory, type ShopItem } from '../lib/shopItems'
import type { ChildProgress } from '../types'

const CATEGORY_ORDER: ShopCategory[] = ['hat', 'glasses', 'flower', 'furniture', 'toy', 'decoration']

export function StarShop() {
  const { childId } = useParams<{ childId: string }>()
  const { children, getProgress, purchaseItem } = useChildren()
  const navigate = useNavigate()
  const [justPurchased, setJustPurchased] = useState<ShopItem | null>(null)
  const [shakeItemId, setShakeItemId] = useState<string | null>(null)
  const [notEnoughId, setNotEnoughId] = useState<string | null>(null)

  const child = children.find((c) => c.id === childId)
  if (!child) return <Navigate to="/" replace />

  const progress = getProgress(child.id)

  const handleBuy = (item: ShopItem) => {
    const result = purchaseItem(child.id, item.id)
    if (result.success) {
      setJustPurchased(item)
      setTimeout(() => setJustPurchased(null), 1600)
    } else if (result.reason === 'insufficient-balance') {
      setShakeItemId(item.id)
      setTimeout(() => setShakeItemId(null), 500)
      setNotEnoughId(item.id)
      setTimeout(() => setNotEnoughId(null), 1600)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-6 px-6 py-8">
      <div className="flex w-full max-w-md items-center justify-between">
        <button
          onClick={() => navigate(`/room/${child.id}`)}
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm"
        >
          ← Nilo'nun Evi
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="font-heading text-lg font-bold text-slate-700">{progress.starBalance}</span>
        </div>
      </div>

      <h1 className="font-heading text-2xl font-extrabold text-slate-700">Yıldız Mağazası 🛍️</h1>
      <p className="max-w-sm text-center font-body text-slate-500">
        Kazandığın yıldızlarla Nilo'nun evi için eşyalar satın al!
      </p>

      <div className="flex w-full max-w-md flex-col gap-6">
        {CATEGORY_ORDER.map((category) => {
          const items = SHOP_ITEMS.filter((item) => item.category === category)
          if (items.length === 0) return null
          return (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-bold text-slate-700">{CATEGORY_LABELS[category]}</h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    progress={progress}
                    shaking={shakeItemId === item.id}
                    showNotEnough={notEnoughId === item.id}
                    onBuy={() => handleBuy(item)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <AnimatePresence>
        {justPurchased && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex flex-col items-center gap-3 rounded-3xl bg-white px-8 py-10 text-center shadow-xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <StarBurst />
              <span className="text-6xl">{justPurchased.emoji}</span>
              <p className="font-heading text-xl font-extrabold text-mint-600">Harika!</p>
              <p className="font-body text-slate-600">{justPurchased.name} artık senin! 🎉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShopItemCard({
  item,
  progress,
  shaking,
  showNotEnough,
  onBuy,
}: {
  item: ShopItem
  progress: ChildProgress
  shaking: boolean
  showNotEnough: boolean
  onBuy: () => void
}) {
  const owned = progress.purchasedItemIds.includes(item.id)
  const affordable = progress.starBalance >= item.price
  const missing = item.price - progress.starBalance
  const isSpecial = item.category === 'decoration'

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 rounded-3xl bg-white p-4 text-center shadow-sm ${
        isSpecial ? 'border-2 border-sun-400' : ''
      }`}
      animate={shaking ? { x: [0, -6, 6, -6, 0] } : undefined}
      transition={{ duration: 0.4 }}
    >
      {isSpecial && <span className="font-body text-[10px] font-extrabold text-sun-500">✨ ÖZEL</span>}
      <span className="text-4xl">{item.emoji}</span>
      <span className="font-heading font-bold text-slate-700">{item.name}</span>
      <span className="flex items-center gap-1 font-body text-sm font-semibold text-slate-500">
        ⭐ {item.price}
      </span>

      {owned ? (
        <span className="w-full rounded-full bg-mint-100 px-4 py-2 font-heading text-sm font-bold text-mint-600">
          Sahipsin 🎉
        </span>
      ) : (
        <>
          <button
            onClick={onBuy}
            className={`w-full rounded-full px-4 py-2 font-heading text-sm font-bold text-white transition active:scale-95 ${
              affordable ? 'bg-coral-500 shadow-md shadow-coral-500/30' : 'bg-slate-300'
            }`}
          >
            Satın Al
          </button>
          {showNotEnough ? (
            <span className="font-body text-xs font-bold text-coral-500">
              Yeterli yıldızın yok 😊
            </span>
          ) : (
            !affordable && (
              <span className="font-body text-xs text-slate-400">{missing} yıldız daha lazım</span>
            )
          )}
        </>
      )}
    </motion.div>
  )
}
