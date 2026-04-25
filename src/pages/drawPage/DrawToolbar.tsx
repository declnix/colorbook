import { useTranslation } from 'react-i18next'

type Props = {
  activeTool: 'brush' | 'eraser'
  onBack: () => void
  onToolToggle: (tool: 'brush' | 'eraser') => void
  onClear: () => void
}

export default function DrawToolbar({ activeTool, onBack, onToolToggle, onClear }: Props) {
  const { t } = useTranslation()

  return (
    <div className="fixed top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur-[10px] rounded-full py-1.5 px-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
      <button
        className="border-none bg-transparent text-xl cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-[background] duration-[120ms] shrink-0 active:bg-black/7"
        onClick={onBack}
        aria-label={t('toolbar.back')}
      >
        ←
      </button>
      <div className="flex rounded-full overflow-hidden bg-[#f4f4f4] p-1 gap-0.5">
        <button
          className={`border-none p-0 cursor-pointer w-12 h-10 rounded-full flex items-center justify-center text-[1.15rem] transition-[background] duration-[150ms] shrink-0 active:bg-[#f8bbd0] ${activeTool === 'brush' ? 'bg-[#fce4ec]' : 'bg-transparent'}`}
          onClick={() => onToolToggle('brush')}
          aria-label={t('toolbar.brush')}
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
          onClick={() => onToolToggle('eraser')}
          aria-label={t('toolbar.eraser')}
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
        onClick={onClear}
        aria-label={t('toolbar.clear')}
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
  )
}
