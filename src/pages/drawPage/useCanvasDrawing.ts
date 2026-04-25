import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { BRUSH_SIZE, ERASER_SIZE } from './constants'

type DrawPoint = { x: number; y: number }
type Stroke = { tool: 'brush' | 'eraser'; color: string; points: DrawPoint[] }

function replayStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[]) {
  for (const stroke of strokes) {
    if (stroke.points.length === 0) continue
    if (stroke.points.length === 1) {
      const size = stroke.tool === 'eraser' ? ERASER_SIZE : BRUSH_SIZE
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.fillStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color
      ctx.beginPath()
      ctx.arc(stroke.points[0].x, stroke.points[0].y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.strokeStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color
      ctx.lineWidth = stroke.tool === 'eraser' ? ERASER_SIZE : BRUSH_SIZE
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    }
  }
}

export function useCanvasDrawing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  selectedColor: string,
  activeTool: 'brush' | 'eraser',
  imageId: string,
): { clearDrawing: () => void } {
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<Stroke[]>([])
  const storageKey = `colorbook:${imageId}`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        strokesRef.current = JSON.parse(saved)
        replayStrokes(canvas.getContext('2d')!, strokesRef.current)
      }
    } catch {
      strokesRef.current = []
    }

    function handleResize() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')!

      if (!offscreenRef.current) {
        offscreenRef.current = document.createElement('canvas')
      }
      const off = offscreenRef.current
      off.width = canvas.width
      off.height = canvas.height
      off.getContext('2d')!.drawImage(canvas, 0, 0)

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let drawing = false
    let hasMoved = false
    let downX = 0
    let downY = 0
    let currentPoints: DrawPoint[] = []

    function onPointerDown(e: PointerEvent) {
      drawing = true
      hasMoved = false
      downX = e.offsetX
      downY = e.offsetY
      currentPoints = [{ x: e.offsetX, y: e.offsetY }]
      canvas!.setPointerCapture(e.pointerId)
      ctx.beginPath()
      ctx.moveTo(e.offsetX, e.offsetY)
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawing) return
      hasMoved = true
      currentPoints.push({ x: e.offsetX, y: e.offsetY })
      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.lineWidth = ERASER_SIZE
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = selectedColor
        ctx.lineWidth = BRUSH_SIZE
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(e.offsetX, e.offsetY)
    }

    function onPointerUp() {
      if (drawing && !hasMoved) {
        const size = activeTool === 'eraser' ? ERASER_SIZE : BRUSH_SIZE
        ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over'
        ctx.fillStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor
        ctx.beginPath()
        ctx.arc(downX, downY, size / 2, 0, Math.PI * 2)
        ctx.fill()
        strokesRef.current.push({ tool: activeTool, color: selectedColor, points: [{ x: downX, y: downY }] })
      } else if (drawing && hasMoved) {
        strokesRef.current.push({ tool: activeTool, color: selectedColor, points: currentPoints })
      }
      if (drawing) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(strokesRef.current))
        } catch {
          // storage full, ignore
        }
      }
      drawing = false
      ctx.closePath()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
    }
  }, [activeTool, selectedColor])

  function clearDrawing() {
    strokesRef.current = []
    localStorage.removeItem(storageKey)
  }

  return { clearDrawing }
}
