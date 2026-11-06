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

export interface BrushSessionState {
  /** yyyy-mm-dd this progress was saved on; a saved state from an earlier day is stale. */
  dateKey: string
  zoneIndex: number
  secondsLeft: number
}

function brushSessionKey(childId: string, session: string): string {
  return `nilo:brushSession:${childId}:${session}`
}

/** Lets a child leave mid-brush and resume from the same zone/second instead of restarting. */
export function loadBrushSessionState(childId: string, session: string): BrushSessionState | null {
  try {
    const raw = localStorage.getItem(brushSessionKey(childId, session))
    return raw ? (JSON.parse(raw) as BrushSessionState) : null
  } catch {
    return null
  }
}

export function saveBrushSessionState(childId: string, session: string, state: BrushSessionState): void {
  localStorage.setItem(brushSessionKey(childId, session), JSON.stringify(state))
}

export function clearBrushSessionState(childId: string, session: string): void {
  localStorage.removeItem(brushSessionKey(childId, session))
}
