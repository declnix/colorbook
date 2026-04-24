import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { IMAGES } from '../images'

const COLORS = [
  { hex: '#E53935', label: 'Czerwony' },
  { hex: '#FF7043', label: 'Pomarańczowy' },
  { hex: '#FDD835', label: 'Żółty' },
  { hex: '#43A047', label: 'Zielony' },
  { hex: '#1E88E5', label: 'Niebieski' },
  { hex: '#29B6F6', label: 'Błękitny' },
  { hex: '#8E24AA', label: 'Fioletowy' },
  { hex: '#F06292', label: 'Różowy' },
  { hex: '#6D4C41', label: 'Brązowy' },
  { hex: '#FFCC80', label: 'Beżowy' },
  { hex: '#212121', label: 'Czarny' },
  { hex: '#CE93D8', label: 'Lawendowy' },
] as const

const BRUSH_SIZE = 18
const ERASER_SIZE = 36

export default function DrawPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#E53935')
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('brush')

  const image = IMAGES.find((img) => img.id === id)

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

    function onPointerDown(e: PointerEvent) {
      drawing = true
      canvas!.setPointerCapture(e.pointerId)
      ctx.beginPath()
      ctx.moveTo(e.offsetX, e.offsetY)
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawing) return
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

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
  }

  if (!image) return <Navigate to="/" replace />

  return (
    <>
      <div className="fixed inset-0 bg-white z-[1] pointer-events-none" />
      <div className="fixed inset-0 z-[2] flex items-center justify-center pointer-events-none">
        <img
          src={image.src}
          alt={image.label}
          className="max-w-[min(75vw,68vh)] max-h-[min(75vw,68vh)] w-auto h-auto select-none pointer-events-none"
          draggable={false}
        />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 z-[3] touch-none cursor-crosshair" />

      <div className="fixed top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur-[10px] rounded-full py-1.5 px-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <button
          className="border-none bg-transparent text-xl cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-[background] duration-[120ms] shrink-0 active:bg-black/7"
          onClick={() => navigate('/')}
          aria-label="Wróć"
        >
          ←
        </button>
        <div className="flex rounded-full overflow-hidden bg-[#f4f4f4] p-1 gap-0.5">
          <button
            className={`border-none p-0 cursor-pointer w-12 h-10 rounded-full flex items-center justify-center text-[1.15rem] transition-[background] duration-[150ms] shrink-0 active:bg-[#f8bbd0] ${activeTool === 'brush' ? 'bg-[#fce4ec]' : 'bg-transparent'}`}
            onClick={() => setActiveTool('brush')}
            aria-label="Pędzel"
            aria-pressed={activeTool === 'brush'}
          >
            {/* Lucide "brush" icon */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 10 3 3"/>
              <path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/>
              <path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/>
            </svg>
          </button>
          <button
            className={`border-none p-0 cursor-pointer w-12 h-10 rounded-full flex items-center justify-center text-[1.15rem] transition-[background] duration-[150ms] shrink-0 active:bg-[#f8bbd0] ${activeTool === 'eraser' ? 'bg-[#fce4ec]' : 'bg-transparent'}`}
            onClick={() => setActiveTool('eraser')}
            aria-label="Gumka"
            aria-pressed={activeTool === 'eraser'}
          >
            {/* Lucide "eraser" icon */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/>
              <path d="m5.082 11.09 8.828 8.828"/>
            </svg>
          </button>
        </div>
        <button
          className="border-none bg-transparent text-xl cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-[background] duration-[120ms] shrink-0 active:bg-black/7"
          onClick={clearCanvas}
          aria-label="Wyczyść"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 [padding-bottom:env(safe-area-inset-bottom,0px)] bg-white/88 backdrop-blur-[10px]">
        <div
          className="flex overflow-x-auto gap-2.5 pt-3.5 px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Kolory"
        >
          {COLORS.map((c) => (
            <button
              key={c.hex}
              className={`shrink-0 w-[54px] h-[54px] rounded-full border-3 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.14)] transition-[transform,border-color,box-shadow] duration-[120ms] outline-none active:scale-[0.9] ${selectedColor === c.hex && activeTool === 'brush' ? 'border-[#333] scale-[1.18] shadow-[0_3px_12px_rgba(0,0,0,0.22)]' : 'border-transparent'}`}
              style={{ background: c.hex }}
              onClick={() => { setSelectedColor(c.hex); setActiveTool('brush') }}
              aria-label={c.label}
              aria-selected={selectedColor === c.hex && activeTool === 'brush'}
              role="option"
            />
          ))}
        </div>
      </div>
    </>
  )
}
