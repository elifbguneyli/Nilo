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
  return { history: {}, totalStars: 0, unlockedBadgeIds: [] }
}
