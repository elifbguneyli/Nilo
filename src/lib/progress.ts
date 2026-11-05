import type { ChildProgress } from '../types'
import { addDays, toKey, todayKey } from './date'

export function calcStreak(progress: ChildProgress): number {
  let streak = 0
  let cursor = new Date()
  // Allow today to be empty without breaking a streak earned through yesterday.
  const todaysRecord = progress.history[todayKey()]
  if (!todaysRecord || (!todaysRecord.morning && !todaysRecord.evening)) {
    cursor = addDays(cursor, -1)
  }
  while (true) {
    const key = toKey(cursor)
    const record = progress.history[key]
    if (record && (record.morning || record.evening)) {
      streak += 1
      cursor = addDays(cursor, -1)
    } else {
      break
    }
  }
  return streak
}

export function calcTotalSessions(progress: ChildProgress): number {
  return Object.values(progress.history).reduce(
    (sum, day) => sum + (day.morning ? 1 : 0) + (day.evening ? 1 : 0),
    0,
  )
}

export function emptyProgress(): ChildProgress {
  return {
    history: {},
    totalStars: 0,
    starBalance: 0,
    unlockedBadgeIds: [],
    purchasedItemIds: [],
    placedItemIds: [],
  }
}

/**
 * Fills in fields missing from progress saved before the star-shop feature existed.
 * Existing users get a starBalance equal to their lifetime totalStars, exactly once —
 * `wasMigrated` tells the caller whether this record actually needed that one-time fill
 * so it can persist the result and never re-run it on a later load.
 */
export function migrateProgress(raw: Partial<ChildProgress> | undefined): {
  progress: ChildProgress
  wasMigrated: boolean
} {
  const totalStars = raw?.totalStars ?? 0
  const existingBalance = raw?.starBalance
  const hadBalance = typeof existingBalance === 'number'
  return {
    progress: {
      history: raw?.history ?? {},
      totalStars,
      starBalance: hadBalance ? existingBalance : totalStars,
      unlockedBadgeIds: raw?.unlockedBadgeIds ?? [],
      purchasedItemIds: raw?.purchasedItemIds ?? [],
      placedItemIds: raw?.placedItemIds ?? [],
    },
    wasMigrated: !hadBalance,
  }
}
