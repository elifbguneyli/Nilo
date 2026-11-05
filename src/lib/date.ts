export function todayKey(): string {
  return toKey(new Date())
}

export function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function lastNDays(n: number): string[] {
  const out: string[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    out.push(toKey(addDays(today, -i)))
  }
  return out
}

const WEEKDAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

export function weekdayLabel(key: string): string {
  const date = new Date(key + 'T00:00:00')
  return WEEKDAYS_TR[date.getDay()]
}

export function dayLabel(key: string): string {
  const date = new Date(key + 'T00:00:00')
  return String(date.getDate())
}
