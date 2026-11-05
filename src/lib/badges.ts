import type { Badge } from '../types'

export const BADGES: Badge[] = [
  {
    id: 'ilk-adim',
    name: 'İlk Adım',
    description: 'İlk fırçalamanı tamamladın!',
    emoji: '🌱',
    requirement: ({ totalSessions }) => totalSessions >= 1,
  },
  {
    id: 'uc-gun',
    name: '3 Günlük Seri',
    description: '3 gün üst üste fırçaladın!',
    emoji: '🔥',
    requirement: ({ streak }) => streak >= 3,
  },
  {
    id: 'bir-hafta',
    name: 'Haftanın Kahramanı',
    description: '7 gün üst üste fırçaladın!',
    emoji: '🏆',
    requirement: ({ streak }) => streak >= 7,
  },
  {
    id: 'iki-hafta',
    name: 'Süper Seri',
    description: '14 gün üst üste fırçaladın!',
    emoji: '⭐',
    requirement: ({ streak }) => streak >= 14,
  },
  {
    id: 'bir-ay',
    name: 'Diş Ustası',
    description: '30 gün üst üste fırçaladın!',
    emoji: '👑',
    requirement: ({ streak }) => streak >= 30,
  },
  {
    id: 'yirmi-yildiz',
    name: 'Yıldız Koleksiyoncusu',
    description: '20 yıldız topladın!',
    emoji: '🌟',
    requirement: ({ totalStars }) => totalStars >= 20,
  },
  {
    id: 'elli-yildiz',
    name: 'Yıldız Ustası',
    description: '50 yıldız topladın!',
    emoji: '💫',
    requirement: ({ totalStars }) => totalStars >= 50,
  },
  {
    id: 'onbes-firca',
    name: 'Parlayan Gülüş',
    description: '15 fırçalama tamamladın!',
    emoji: '😁',
    requirement: ({ totalSessions }) => totalSessions >= 15,
  },
]
