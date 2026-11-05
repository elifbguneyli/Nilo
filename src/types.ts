export type BrushSession = 'morning' | 'evening'

export interface Child {
  id: string
  name: string
  avatar: string
  color: string
  createdAt: string
}

export interface DayRecord {
  morning: boolean
  evening: boolean
}

export interface ChildProgress {
  history: Record<string, DayRecord>
  totalStars: number
  unlockedBadgeIds: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  requirement: (progress: { streak: number; totalStars: number; totalSessions: number }) => boolean
}
