import { BRUSH_RADIUS_IMG, ERASER_RADIUS_IMG } from './constants'
import { regionAt } from './regionMap'
import type { DrawPoint, RegionMap, Stroke, Tool } from './types'

export function drawStrokeSegment(
  mainCtx: CanvasRenderingContext2D,
  scratchCtx: CanvasRenderingContext2D,
  regionMap: RegionMap,
  p0: DrawPoint,
  p1: DrawPoint,
  tool: Tool,
  color: string,
  radius: number,
): void {
  const { width: rmW, height: rmH, ids } = regionMap

  const cx = Math.floor(p1.x)
  const cy = Math.floor(p1.y)
  if (cx < 0 || cy < 0 || cx >= rmW || cy >= rmH) return
  const toolRegion = ids[cy * rmW + cx]
  if (toolRegion === 0) return

  const canvasW = mainCtx.canvas.width
  const canvasH = mainCtx.canvas.height
  const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x) - radius))
  const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y) - radius))
  const maxX = Math.min(canvasW, Math.ceil(Math.max(p0.x, p1.x) + radius))
  const maxY = Math.min(canvasH, Math.ceil(Math.max(p0.y, p1.y) + radius))
  const dw = maxX - minX
  const dh = maxY - minY
  if (dw <= 0 || dh <= 0) return

  scratchCtx.globalCompositeOperation = 'source-over'
  scratchCtx.strokeStyle = tool === 'eraser' ? '#000000' : color
  scratchCtx.fillStyle = tool === 'eraser' ? '#000000' : color
  scratchCtx.lineWidth = 2 * radius
  scratchCtx.lineCap = 'round'
  scratchCtx.lineJoin = 'round'

  if (p0.x === p1.x && p0.y === p1.y) {
    scratchCtx.beginPath()
    scratchCtx.arc(p1.x, p1.y, radius, 0, Math.PI * 2)
    scratchCtx.fill()
  } else {
    scratchCtx.beginPath()
    scratchCtx.moveTo(p0.x, p0.y)
    scratchCtx.lineTo(p1.x, p1.y)
    scratchCtx.stroke()
  }

  const img = scratchCtx.getImageData(minX, minY, dw, dh)
  const pixels = img.data
  for (let y = 0; y < dh; y++) {
    const rowPx = y * dw * 4
    const rowMap = (minY + y) * rmW + minX
    for (let x = 0; x < dw; x++) {
      if (ids[rowMap + x] !== toolRegion) {
        pixels[rowPx + x * 4 + 3] = 0
      }
    }
  }
  scratchCtx.putImageData(img, minX, minY)

  mainCtx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
  mainCtx.drawImage(scratchCtx.canvas, minX, minY, dw, dh, minX, minY, dw, dh)
  mainCtx.globalCompositeOperation = 'source-over'

  scratchCtx.clearRect(minX, minY, dw, dh)
}

export function replayStrokes(
  mainCtx: CanvasRenderingContext2D,
  scratchCtx: CanvasRenderingContext2D,
  regionMap: RegionMap,
  strokes: Stroke[],
): void {
  for (const stroke of strokes) {
    replayStroke(mainCtx, scratchCtx, regionMap, stroke)
  }
}

function replayStroke(
  mainCtx: CanvasRenderingContext2D,
  scratchCtx: CanvasRenderingContext2D,
  regionMap: RegionMap,
  stroke: Stroke,
): void {
  const { points, tool, color } = stroke
  if (points.length === 0) return
  const radius = tool === 'eraser' ? ERASER_RADIUS_IMG : BRUSH_RADIUS_IMG

  let group: DrawPoint[] = []
  let groupRegion = 0
  for (const p of points) {
    const r = regionAt(regionMap, p.x, p.y)
    if (r === 0) {
      if (group.length > 0) {
        drawPolylineInRegion(mainCtx, scratchCtx, regionMap, group, groupRegion, tool, color, radius)
        group = []
      }
      continue
    }
    if (r !== groupRegion) {
      if (group.length > 0) {
        drawPolylineInRegion(mainCtx, scratchCtx, regionMap, group, groupRegion, tool, color, radius)
      }
      group = [p]
      groupRegion = r
    } else {
      group.push(p)
    }
  }
  if (group.length > 0) {
    drawPolylineInRegion(mainCtx, scratchCtx, regionMap, group, groupRegion, tool, color, radius)
  }
}

function drawPolylineInRegion(
  mainCtx: CanvasRenderingContext2D,
  scratchCtx: CanvasRenderingContext2D,
  regionMap: RegionMap,
  points: DrawPoint[],
  toolRegion: number,
  tool: Tool,
  color: string,
  radius: number,
): void {
  const { width: rmW, ids } = regionMap

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  const canvasW = mainCtx.canvas.width
  const canvasH = mainCtx.canvas.height
  minX = Math.max(0, Math.floor(minX - radius))
  minY = Math.max(0, Math.floor(minY - radius))
  maxX = Math.min(canvasW, Math.ceil(maxX + radius))
  maxY = Math.min(canvasH, Math.ceil(maxY + radius))
  const dw = maxX - minX
  const dh = maxY - minY
  if (dw <= 0 || dh <= 0) return

  scratchCtx.globalCompositeOperation = 'source-over'
  scratchCtx.strokeStyle = tool === 'eraser' ? '#000000' : color
  scratchCtx.fillStyle = tool === 'eraser' ? '#000000' : color
  scratchCtx.lineWidth = 2 * radius
  scratchCtx.lineCap = 'round'
  scratchCtx.lineJoin = 'round'

  if (points.length === 1) {
    scratchCtx.beginPath()
    scratchCtx.arc(points[0].x, points[0].y, radius, 0, Math.PI * 2)
    scratchCtx.fill()
  } else {
    scratchCtx.beginPath()
    scratchCtx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      scratchCtx.lineTo(points[i].x, points[i].y)
    }
    scratchCtx.stroke()
  }

  const img = scratchCtx.getImageData(minX, minY, dw, dh)
  const pixels = img.data
  for (let y = 0; y < dh; y++) {
    const rowPx = y * dw * 4
    const rowMap = (minY + y) * rmW + minX
    for (let x = 0; x < dw; x++) {
      if (ids[rowMap + x] !== toolRegion) {
        pixels[rowPx + x * 4 + 3] = 0
      }
    }
  }
  scratchCtx.putImageData(img, minX, minY)

  mainCtx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
  mainCtx.drawImage(scratchCtx.canvas, minX, minY, dw, dh, minX, minY, dw, dh)
  mainCtx.globalCompositeOperation = 'source-over'

  scratchCtx.clearRect(minX, minY, dw, dh)
}
