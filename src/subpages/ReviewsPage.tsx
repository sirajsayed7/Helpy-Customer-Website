import { ArrowLeft, Star } from 'lucide-react'
import { useNav } from '../context/NavContext'

export default function ReviewsPage() {
  const { goBack, params } = useNav()
  const provider = params?.provider || 'This provider'
  return <div className="relative flex flex-1 flex-col overflow-hidden bg-[#eef7ff]">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fcff_0%,#eef7ff_55%,#f5f9ff_100%)]"/>
    <header className="relative z-10 flex items-center gap-3 px-4 pb-3 pt-3"><button onClick={goBack} className="grid h-11 w-11 place-items-center rounded-full bg-white text-gray-900 shadow-sm" aria-label="Go back"><ArrowLeft size={22}/></button><div className="min-w-0"><h1 className="truncate text-[24px] font-black text-gray-950">Customer Reviews</h1><p className="truncate text-[12px] font-semibold text-gray-500">{provider}</p></div></header>
    <main className="relative z-10 grid flex-1 place-items-center px-5 pb-20 text-center"><div className="max-w-xs rounded-[24px] bg-white p-7 shadow-sm"><Star size={34} className="mx-auto text-amber-400"/><h2 className="mt-4 text-[18px] font-black text-[#10152f]">Reviews will appear here</h2><p className="mt-2 text-[13px] leading-5 text-[#65708a]">Only verified reviews from the Helpy backend are shown. No sample reviews are displayed.</p><button onClick={goBack} className="mt-5 text-[13px] font-black text-[#0967ff]">Go back</button></div></main>
  </div>
}
