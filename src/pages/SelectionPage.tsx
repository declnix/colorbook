import { useNavigate } from 'react-router-dom'
import { IMAGES } from '../images'

function BabyFaceIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-[72px] h-[72px]" aria-hidden="true" stroke="#3d3d5c" strokeLinecap="round" strokeLinejoin="round">
      {/* ears drawn first so face masks their inner half */}
      <circle cx="15" cy="57" r="11" fill="white" strokeWidth="3.2"/>
      <circle cx="85" cy="57" r="11" fill="white" strokeWidth="3.2"/>
      {/* head with white fill to cover inner ear arcs */}
      <circle cx="50" cy="57" r="35" fill="white" strokeWidth="3.2"/>
      {/* spiral: 2 turns, starts on head circle, stays in upper half with gap above eyes */}
      <path d="M53 22 Q66 12 62 27 Q58 40 50 36 Q43 32 46 24 Q48 16 53 21" fill="none" strokeWidth="3"/>
      {/* eyes */}
      <circle cx="37" cy="51" r="3" fill="#3d3d5c" stroke="none"/>
      <circle cx="63" cy="51" r="3" fill="#3d3d5c" stroke="none"/>
      {/* mouth */}
      <path d="M36 68 Q50 80 64 68" fill="none" strokeWidth="3"/>
    </svg>
  )
}

export default function SelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center pt-8 px-5 pb-12">
      <header className="flex flex-col items-center gap-2.5 mb-9 text-center">
        <BabyFaceIcon />
        <h1 className="text-[clamp(1.1rem,3vw,1.6rem)] font-bold text-[#333] m-0">Wybierz obrazek do pokolorowania</h1>
        <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#bbb] m-0">Wybierz ulubiony obrazek i zacznij kolorować!</p>
      </header>
      <main className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[18px] w-full max-w-[1000px] max-[480px]:grid-cols-2 max-[480px]:gap-3">
        {IMAGES.map((img) => (
          <button
            key={img.id}
            className="bg-white border-none rounded-[20px] shadow-[0_4px_18px_rgba(0,0,0,0.07)] pt-[18px] px-3 pb-3.5 cursor-pointer flex flex-col items-center gap-2.5 transition-[transform,box-shadow] duration-[150ms] active:scale-[0.95] active:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            onClick={() => navigate(`/draw/${img.id}`)}
            aria-label={img.label}
          >
            <img src={img.src} alt={img.label} className="w-full aspect-square object-contain pointer-events-none select-none" draggable={false} />
            <span className="text-[0.88rem] font-bold text-[#666]">{img.label}</span>
          </button>
        ))}
      </main>
      <footer className="mt-10 flex flex-col items-center gap-1.5 text-[#ccc] text-[0.82rem]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#f9a8c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>Stworzone z myślą o najmłodszych</span>
      </footer>
    </div>
  )
}
