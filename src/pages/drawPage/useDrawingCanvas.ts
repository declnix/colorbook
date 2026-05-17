import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { BRUSH_RADIUS_IMG, ERASER_RADIUS_IMG } from './constants'
import { pointerToImageSpace } from './coordTransform'
import { drawStrokeSegment, replayStrokes } from './drawStroke'
import {
  clearDrawing as clearStoredDrawing,
  loadDrawing,
  saveDrawing,
} from './coloringStorage'
import type { DrawPoint, ImageSize, RegionMap, Stroke, Tool } from './types'

type Args = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  imageId: string
  imageSize: ImageSize | null
  regionMap: RegionMap | null
  selectedColor: string
  activeTool: Tool
}

export function useDrawingCanvas(args: Args): { clearDrawing: () => void } {
  const { canvasRef, imageId, imageSize, regionMap, selectedColor, activeTool } = args

  const strokesRef = useRef<Stroke[]>([])
  const scratchRef = useRef<HTMLCanvasElement | null>(null)
  const lastPointRef = useRef<DrawPoint | null>(null)
  const currentPointsRef = useRef<DrawPoint[]>([])
  const activePointerRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageSize || !regionMap) return

    canvas.width = imageSize.width
    canvas.height = imageSize.height

    if (!scratchRef.current) scratchRef.current = document.createElement('canvas')
    const scratch = scratchRef.current
    scratch.width = imageSize.width
    scratch.height = imageSize.height

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scratchCtx = scratch.getContext('2d', { willReadFrequently: true })!
    scratchCtx.clearRect(0, 0, scratch.width, scratch.height)

    const strokes = loadDrawing(imageId, imageSize)
    strokesRef.current = strokes
    if (strokes.length > 0) {
      replayStrokes(ctx, scratchCtx, regionMap, strokes)
    }
  }, [imageId, imageSize, regionMap, canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageSize || !regionMap) return
    const scratch = scratchRef.current
    if (!scratch) return
    const ctx = canvas.getContext('2d')!
    const scratchCtx = scratch.getContext('2d', { willReadFrequently: true })!

    const radius = activeTool === 'eraser' ? ERASER_RADIUS_IMG : BRUSH_RADIUS_IMG

    function onPointerDown(e: PointerEvent) {
      if (activePointerRef.current !== null) return
      activePointerRef.current = e.pointerId
      const p = pointerToImageSpace(e, canvas!)
      lastPointRef.current = p
      currentPointsRef.current = [p]
      try { canvas!.setPointerCapture(e.pointerId) } catch { /* ignore */ }
      drawStrokeSegment(ctx, scratchCtx, regionMap!, p, p, activeTool, selectedColor, radius)
    }

    function onPointerMove(e: PointerEvent) {
      if (activePointerRef.current !== e.pointerId) return
      const p = pointerToImageSpace(e, canvas!)
      const last = lastPointRef.current
      if (!last) return
      currentPointsRef.current.push(p)
      drawStrokeSegment(ctx, scratchCtx, regionMap!, last, p, activeTool, selectedColor, radius)
      lastPointRef.current = p
    }

    function endStroke(e: PointerEvent) {
      if (activePointerRef.current !== e.pointerId) return
      activePointerRef.current = null
      try { canvas!.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
      const pts = currentPointsRef.current
      if (pts.length > 0) {
        strokesRef.current.push({
          tool: activeTool,
          color: selectedColor,
          points: pts,
        })
        saveDrawing(imageId, imageSize!, strokesRef.current)
      }
      currentPointsRef.current = []
      lastPointRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', endStroke)
    canvas.addEventListener('pointercancel', endStroke)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', endStroke)
      canvas.removeEventListener('pointercancel', endStroke)
    }
  }, [activeTool, selectedColor, imageId, imageSize, regionMap, canvasRef])

  function clearDrawing() {
    strokesRef.current = []
    clearStoredDrawing(imageId)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return { clearDrawing }
}
