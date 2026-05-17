export type Tool = 'brush' | 'eraser'

export type DrawPoint = { x: number; y: number }

export type Stroke = {
  tool: Tool
  color: string
  points: DrawPoint[]
}

export type ImageSize = { width: number; height: number }

export type StoredDrawing = {
  version: 2
  imageId: string
  imageSize: ImageSize
  strokes: Stroke[]
}

export type RegionMap = {
  width: number
  height: number
  ids: Uint32Array
  regionCount: number
}
