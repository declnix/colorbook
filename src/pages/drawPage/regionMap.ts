import {
  BORDER_ALPHA_THRESHOLD,
  BORDER_LUMINANCE_THRESHOLD,
} from './constants'
import type { RegionMap } from './types'

function isBorder(r: number, g: number, b: number, a: number): boolean {
  if (a < BORDER_ALPHA_THRESHOLD) return false
  const lum = (r * 299 + g * 587 + b * 114) / 1000
  return lum < BORDER_LUMINANCE_THRESHOLD
}

function scanlineFill(
  ids: Uint32Array,
  borderMask: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
  fillId: number,
): void {
  const stack: number[] = [startX, startY]
  while (stack.length > 0) {
    const sy = stack.pop()!
    const sx = stack.pop()!
    const rowOffset = sy * width

    let lx = sx
    while (lx >= 0 && borderMask[rowOffset + lx] === 0 && ids[rowOffset + lx] === 0) lx--
    lx++

    let rx = sx
    while (rx < width && borderMask[rowOffset + rx] === 0 && ids[rowOffset + rx] === 0) rx++
    rx--

    if (lx > rx) continue

    for (let x = lx; x <= rx; x++) ids[rowOffset + x] = fillId

    if (sy > 0) {
      const above = rowOffset - width
      let inRun = false
      for (let x = lx; x <= rx; x++) {
        const fillable = borderMask[above + x] === 0 && ids[above + x] === 0
        if (fillable && !inRun) {
          stack.push(x, sy - 1)
          inRun = true
        } else if (!fillable) {
          inRun = false
        }
      }
    }

    if (sy < height - 1) {
      const below = rowOffset + width
      let inRun = false
      for (let x = lx; x <= rx; x++) {
        const fillable = borderMask[below + x] === 0 && ids[below + x] === 0
        if (fillable && !inRun) {
          stack.push(x, sy + 1)
          inRun = true
        } else if (!fillable) {
          inRun = false
        }
      }
    }
  }
}

export function buildRegionMap(
  img: HTMLImageElement,
  width: number,
  height: number,
): RegionMap {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  // White background so SVG-transparent pixels classify as interior
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  const { data } = ctx.getImageData(0, 0, width, height)
  const total = width * height
  const borderMask = new Uint8Array(total)
  for (let i = 0, p = 0; i < total; i++, p += 4) {
    if (isBorder(data[p], data[p + 1], data[p + 2], data[p + 3])) borderMask[i] = 1
  }

  const ids = new Uint32Array(total)
  let nextId = 1
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      const i = row + x
      if (ids[i] === 0 && borderMask[i] === 0) {
        scanlineFill(ids, borderMask, width, height, x, y, nextId)
        nextId++
      }
    }
  }

  return { width, height, ids, regionCount: nextId - 1 }
}

export function regionAt(map: RegionMap, x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  if (ix < 0 || iy < 0 || ix >= map.width || iy >= map.height) return 0
  return map.ids[iy * map.width + ix]
}
