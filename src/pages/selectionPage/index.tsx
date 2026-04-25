import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../../images'
import BabyFaceIcon from './BabyFaceIcon'

export default function SelectionPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center pt-8 px-5 pb-12">
      <header className="flex flex-col items-center gap-2.5 mb-9 text-center">
        <BabyFaceIcon />
        <h1 className="text-[clamp(1.1rem,3vw,1.6rem)] font-bold text-[#333] m-0">{t('selectionPage.title')}</h1>
        <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#bbb] m-0">{t('selectionPage.subtitle')}</p>
      </header>
      <main className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[18px] w-full max-w-[1000px] max-[480px]:grid-cols-2 max-[480px]:gap-3">
        {IMAGES.map((img) => (
          <button
            key={img.id}
            className="bg-white border-none rounded-[20px] shadow-[0_4px_18px_rgba(0,0,0,0.07)] pt-[18px] px-3 pb-3.5 cursor-pointer flex flex-col items-center gap-2.5 transition-[transform,box-shadow] duration-[150ms] active:scale-[0.95] active:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            onClick={() => navigate(`/draw/${img.id}`)}
            aria-label={t(`images.${img.id}`)}
          >
            <img src={img.src} alt={t(`images.${img.id}`)} className="w-full aspect-square object-contain pointer-events-none select-none" draggable={false} />
            <span className="text-[0.88rem] font-bold text-[#666]">{t(`images.${img.id}`)}</span>
          </button>
        ))}
      </main>
      <footer className="mt-10 flex flex-col items-center gap-1.5 text-[#ccc] text-[0.82rem]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#f9a8c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>{t('selectionPage.footer')}</span>
      </footer>
    </div>
  )
}
