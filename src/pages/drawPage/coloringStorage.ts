import type { ImageSize, Stroke, StoredDrawing } from './types'

const STORAGE_VERSION = 2

function storageKey(imageId: string): string {
  return `colorbook:${imageId}`
}

export function loadDrawing(imageId: string, expected: ImageSize): Stroke[] {
  try {
    const raw = localStorage.getItem(storageKey(imageId))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!isStoredDrawing(parsed) || parsed.version !== STORAGE_VERSION) return []

    if (
      parsed.imageSize.width === expected.width &&
      parsed.imageSize.height === expected.height
    ) {
      return parsed.strokes
    }

    const sx = expected.width / parsed.imageSize.width
    const sy = expected.height / parsed.imageSize.height
    return parsed.strokes.map((s) => ({
      ...s,
      points: s.points.map((p) => ({ x: p.x * sx, y: p.y * sy })),
    }))
  } catch {
    return []
  }
}

export function saveDrawing(imageId: string, imageSize: ImageSize, strokes: Stroke[]): void {
  const payload: StoredDrawing = {
    version: STORAGE_VERSION,
    imageId,
    imageSize,
    strokes,
  }
  try {
    localStorage.setItem(storageKey(imageId), JSON.stringify(payload))
  } catch {
    // storage full or unavailable; ignore
  }
}

export function clearDrawing(imageId: string): void {
  try {
    localStorage.removeItem(storageKey(imageId))
  } catch {
    // ignore
  }
}

function isStoredDrawing(value: unknown): value is StoredDrawing {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.version === 'number' &&
    typeof v.imageId === 'string' &&
    !!v.imageSize &&
    typeof (v.imageSize as ImageSize).width === 'number' &&
    typeof (v.imageSize as ImageSize).height === 'number' &&
    Array.isArray(v.strokes)
  )
}
