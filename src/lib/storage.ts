import type { Child, ChildProgress } from '../types'

const CHILDREN_KEY = 'nilo:children'
const PROGRESS_KEY = 'nilo:progress'
const ACTIVE_CHILD_KEY = 'nilo:activeChildId'

export function loadChildren(): Child[] {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY)
    return raw ? (JSON.parse(raw) as Child[]) : []
  } catch {
    return []
  }
}

export function saveChildren(children: Child[]): void {
  localStorage.setItem(CHILDREN_KEY, JSON.stringify(children))
}

/**
 * Returns raw saved progress, which may predate fields added after a user's first save
 * (e.g. starBalance). Callers should run each entry through migrateProgress before use.
 */
export function loadAllProgress(): Record<string, Partial<ChildProgress>> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Partial<ChildProgress>>) : {}
  } catch {
    return {}
  }
}

export function saveAllProgress(progress: Record<string, ChildProgress>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function loadActiveChildId(): string | null {
  return localStorage.getItem(ACTIVE_CHILD_KEY)
}

export function saveActiveChildId(id: string | null): void {
  if (id) localStorage.setItem(ACTIVE_CHILD_KEY, id)
  else localStorage.removeItem(ACTIVE_CHILD_KEY)
}
