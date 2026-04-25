import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { BRUSH_SIZE, ERASER_SIZE } from './constants'

export function useCanvasDrawing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  selectedColor: string,
  activeTool: 'brush' | 'eraser',
) {
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

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

    function onPointerDown(e: PointerEvent) {
      drawing = true
      hasMoved = false
      downX = e.offsetX
      downY = e.offsetY
      canvas!.setPointerCapture(e.pointerId)
      ctx.beginPath()
      ctx.moveTo(e.offsetX, e.offsetY)
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawing) return
      hasMoved = true
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
        // tap without drag — draw a dot
        const size = activeTool === 'eraser' ? ERASER_SIZE : BRUSH_SIZE
        ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over'
        ctx.fillStyle = activeTool === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor
        ctx.beginPath()
        ctx.arc(downX, downY, size / 2, 0, Math.PI * 2)
        ctx.fill()
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
}
