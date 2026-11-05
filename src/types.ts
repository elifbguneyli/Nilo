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
  /** Lifetime stars ever earned. Used for badges/achievements and never decreases. */
  totalStars: number
  /** Spendable star currency. Increases with totalStars, decreases on purchases. */
  starBalance: number
  unlockedBadgeIds: string[]
  purchasedItemIds: string[]
  /** Subset of purchasedItemIds currently displayed/worn in Nilo's room. */
  placedItemIds: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  requirement: (progress: { streak: number; totalStars: number; totalSessions: number }) => boolean
}
