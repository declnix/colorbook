import { useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { IMAGES } from '../../images'
import { COLORS } from './constants'
import { useCanvasDrawing } from './useCanvasDrawing'
import DrawToolbar from './DrawToolbar'
import ColorPicker from './ColorPicker'

export default function DrawPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#E53935')
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('brush')

  const image = IMAGES.find((img) => img.id === id)

  useCanvasDrawing(canvasRef, selectedColor, activeTool)

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
  }

  if (!image) return <Navigate to="/" replace />

  return (
    <>
      <div className="fixed inset-0 bg-white z-[1] pointer-events-none" />
      <div className="fixed top-[4.75rem] bottom-[5.5rem] left-0 right-0 z-[2] flex items-center justify-center pointer-events-none">
        <img
          src={image.src}
          alt={image.label}
          className="max-w-full max-h-full w-auto h-auto select-none pointer-events-none"
          draggable={false}
        />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 z-[3] touch-none cursor-crosshair" />

      <DrawToolbar
        activeTool={activeTool}
        onBack={() => navigate('/')}
        onToolToggle={setActiveTool}
        onClear={clearCanvas}
      />

      <ColorPicker
        colors={COLORS}
        selectedColor={selectedColor}
        activeTool={activeTool}
        onSelect={(hex) => { setSelectedColor(hex); setActiveTool('brush') }}
      />
    </>
  )
}
