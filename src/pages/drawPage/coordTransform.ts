import type { DrawPoint } from './types'

export function pointerToImageSpace(
  e: PointerEvent,
  canvas: HTMLCanvasElement,
): DrawPoint {
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 }
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  }
}
