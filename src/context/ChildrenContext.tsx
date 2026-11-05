import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { BrushSession, Child, ChildProgress } from '../types'
import {
  loadAllProgress,
  loadChildren,
  saveAllProgress,
  saveChildren,
} from '../lib/storage'
import { emptyProgress, migrateProgress } from '../lib/progress'
import { todayKey } from '../lib/date'
import { BADGES } from '../lib/badges'
import { calcStreak, calcTotalSessions } from '../lib/progress'
import { findShopItem, isWearableCategory, ROOM_DECOR_SLOTS } from '../lib/shopItems'

export type PurchaseFailureReason = 'not-found' | 'already-owned' | 'insufficient-balance'
export type ToggleFailureReason = 'not-owned' | 'room-full'

interface ChildrenContextValue {
  children: Child[]
  progressByChild: Record<string, ChildProgress>
  addChild: (name: string, avatar: string, color: string) => Child
  removeChild: (id: string) => void
  getProgress: (childId: string) => ChildProgress
  completeSession: (childId: string, session: BrushSession) => { starsEarned: number; newBadgeIds: string[] }
  purchaseItem: (
    childId: string,
    itemId: string,
  ) => { success: boolean; reason?: PurchaseFailureReason }
  togglePlacedItem: (
    childId: string,
    itemId: string,
  ) => { success: boolean; reason?: ToggleFailureReason }
}

const ChildrenContext = createContext<ChildrenContextValue | null>(null)

const AVATAR_COLORS = ['#ff9f6b', '#6bc7ff', '#9b7bff', '#ffd66b', '#6bffb3', '#ff6ba3']

export function pickAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export function ChildrenProvider({ children: reactChildren }: { children: ReactNode }) {
  const [childList, setChildList] = useState<Child[]>(() => loadChildren())
  const [progressByChild, setProgressByChild] = useState<Record<string, ChildProgress>>(() => {
    const raw = loadAllProgress()
    const migrated: Record<string, ChildProgress> = {}
    let anyMigrated = false
    for (const [id, value] of Object.entries(raw)) {
      const { progress, wasMigrated } = migrateProgress(value)
      migrated[id] = progress
      anyMigrated = anyMigrated || wasMigrated
    }
    if (anyMigrated) saveAllProgress(migrated)
    return migrated
  })

  function addChild(name: string, avatar: string, color: string): Child {
    const child: Child = {
      id: crypto.randomUUID(),
      name,
      avatar,
      color,
      createdAt: new Date().toISOString(),
    }
    const next = [...childList, child]
    setChildList(next)
    saveChildren(next)
    const nextProgress = { ...progressByChild, [child.id]: emptyProgress() }
    setProgressByChild(nextProgress)
    saveAllProgress(nextProgress)
    return child
  }

  function removeChild(id: string) {
    const next = childList.filter((c) => c.id !== id)
    setChildList(next)
    saveChildren(next)
    const nextProgress = { ...progressByChild }
    delete nextProgress[id]
    setProgressByChild(nextProgress)
    saveAllProgress(nextProgress)
  }

  function getProgress(childId: string): ChildProgress {
    return progressByChild[childId] ?? emptyProgress()
  }

  function completeSession(childId: string, session: BrushSession) {
    const current = progressByChild[childId] ?? emptyProgress()
    const key = todayKey()
    const day = current.history[key] ?? { morning: false, evening: false }
    if (day[session]) {
      return { starsEarned: 0, newBadgeIds: [] }
    }
    const updatedDay = { ...day, [session]: true }
    const bothDoneNow = updatedDay.morning && updatedDay.evening
    const starsEarned = bothDoneNow ? 2 : 1
    const updatedProgress: ChildProgress = {
      ...current,
      history: { ...current.history, [key]: updatedDay },
      totalStars: current.totalStars + starsEarned,
      starBalance: current.starBalance + starsEarned,
    }

    const streak = calcStreak(updatedProgress)
    const totalSessions = calcTotalSessions(updatedProgress)
    const newlyUnlocked = BADGES.filter(
      (badge) =>
        !updatedProgress.unlockedBadgeIds.includes(badge.id) &&
        badge.requirement({ streak, totalStars: updatedProgress.totalStars, totalSessions }),
    ).map((b) => b.id)

    const finalProgress: ChildProgress = {
      ...updatedProgress,
      unlockedBadgeIds: [...updatedProgress.unlockedBadgeIds, ...newlyUnlocked],
    }

    const nextAll = { ...progressByChild, [childId]: finalProgress }
    setProgressByChild(nextAll)
    saveAllProgress(nextAll)

    return { starsEarned, newBadgeIds: newlyUnlocked }
  }

  function purchaseItem(childId: string, itemId: string) {
    const item = findShopItem(itemId)
    if (!item) {
      return { success: false, reason: 'not-found' as const }
    }
    const current = progressByChild[childId] ?? emptyProgress()
    if (current.purchasedItemIds.includes(itemId)) {
      return { success: false, reason: 'already-owned' as const }
    }
    if (current.starBalance < item.price) {
      return { success: false, reason: 'insufficient-balance' as const }
    }
    const updated: ChildProgress = {
      ...current,
      starBalance: current.starBalance - item.price,
      purchasedItemIds: [...current.purchasedItemIds, itemId],
    }
    const nextAll = { ...progressByChild, [childId]: updated }
    setProgressByChild(nextAll)
    saveAllProgress(nextAll)
    return { success: true }
  }

  function togglePlacedItem(childId: string, itemId: string) {
    const item = findShopItem(itemId)
    const current = progressByChild[childId] ?? emptyProgress()
    if (!item || !current.purchasedItemIds.includes(itemId)) {
      return { success: false, reason: 'not-owned' as const }
    }

    const isPlaced = current.placedItemIds.includes(itemId)
    let nextPlaced: string[]

    if (isPlaced) {
      nextPlaced = current.placedItemIds.filter((id) => id !== itemId)
    } else if (isWearableCategory(item.category)) {
      // Only one hat and one pair of glasses can be worn at a time.
      nextPlaced = [
        ...current.placedItemIds.filter((id) => findShopItem(id)?.category !== item.category),
        itemId,
      ]
    } else {
      const placedDecorCount = current.placedItemIds.filter((id) => {
        const other = findShopItem(id)
        return other && !isWearableCategory(other.category)
      }).length
      if (placedDecorCount >= ROOM_DECOR_SLOTS) {
        return { success: false, reason: 'room-full' as const }
      }
      nextPlaced = [...current.placedItemIds, itemId]
    }

    const updated: ChildProgress = { ...current, placedItemIds: nextPlaced }
    const nextAll = { ...progressByChild, [childId]: updated }
    setProgressByChild(nextAll)
    saveAllProgress(nextAll)
    return { success: true }
  }

  const value = useMemo<ChildrenContextValue>(
    () => ({
      children: childList,
      progressByChild,
      addChild,
      removeChild,
      getProgress,
      completeSession,
      purchaseItem,
      togglePlacedItem,
    }),
    [childList, progressByChild],
  )

  return <ChildrenContext.Provider value={value}>{reactChildren}</ChildrenContext.Provider>
}

export function useChildren(): ChildrenContextValue {
  const ctx = useContext(ChildrenContext)
  if (!ctx) throw new Error('useChildren must be used within ChildrenProvider')
  return ctx
}
