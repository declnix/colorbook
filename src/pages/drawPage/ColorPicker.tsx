type Color = { hex: string; label: string }

type Props = {
  colors: readonly Color[]
  selectedColor: string
  activeTool: 'brush' | 'eraser'
  onSelect: (hex: string) => void
}

export default function ColorPicker({ colors, selectedColor, activeTool, onSelect }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 [padding-bottom:env(safe-area-inset-bottom,0px)] bg-white/88 backdrop-blur-[10px]">
      <div
        className="flex overflow-x-auto gap-2.5 pt-3.5 px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Kolory"
      >
        {colors.map((c) => (
          <button
            key={c.hex}
            className={`shrink-0 w-[54px] h-[54px] rounded-full border-3 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.14)] transition-[transform,border-color,box-shadow] duration-[120ms] outline-none active:scale-[0.9] ${selectedColor === c.hex && activeTool === 'brush' ? 'border-[#333] scale-[1.18] shadow-[0_3px_12px_rgba(0,0,0,0.22)]' : 'border-transparent'}`}
            style={{ background: c.hex }}
            onClick={() => onSelect(c.hex)}
            aria-label={c.label}
            aria-selected={selectedColor === c.hex && activeTool === 'brush'}
            role="option"
          />
        ))}
      </div>
    </div>
  )
}
