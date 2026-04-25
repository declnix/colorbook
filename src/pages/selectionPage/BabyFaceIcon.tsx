export default function BabyFaceIcon() {
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
