import { useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { IMAGES } from '../../images'
import { COLORS } from './constants'
import { useColoringImage } from './useColoringImage'
import { useDrawingCanvas } from './useDrawingCanvas'
import { useFitContainer } from './useFitContainer'
import DrawToolbar from './DrawToolbar'
import ColorPicker from './ColorPicker'
import type { Tool } from './types'

export default function DrawPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fitAreaRef = useRef<HTMLDivElement>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#E53935')
  const [activeTool, setActiveTool] = useState<Tool>('brush')

  const image = IMAGES.find((img) => img.id === id)
  const { imageSize, regionMap } = useColoringImage(id ?? '')
  const fit = useFitContainer(fitAreaRef, imageSize)
  const { clearDrawing } = useDrawingCanvas({
    canvasRef,
    imageId: id ?? '',
    imageSize,
    regionMap,
    selectedColor,
    activeTool,
  })

  if (!image) return <Navigate to="/" replace />

  return (
    <div className="fixed inset-0">
      <div
        ref={fitAreaRef}
        className="fixed top-[4.75rem] bottom-[5.5rem] left-0 right-0 flex items-center justify-center"
      >
        {imageSize && (
          <div
            className="relative"
            style={{ width: fit?.width ?? 0, height: fit?.height ?? 0 }}
          >
            <img
              src={image.src}
              alt={image.label}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              draggable={false}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            />
          </div>
        )}
      </div>

      <DrawToolbar
        activeTool={activeTool}
        onBack={() => navigate('/')}
        onToolToggle={setActiveTool}
        onClear={clearDrawing}
      />

      <ColorPicker
        colors={COLORS}
        selectedColor={selectedColor}
        activeTool={activeTool}
        onSelect={(hex) => { setSelectedColor(hex); setActiveTool('brush') }}
      />
    </div>
  )
}
