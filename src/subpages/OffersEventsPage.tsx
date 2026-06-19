import { useState } from 'react'
import { ArrowLeft, Search, Sparkles, Star, CalendarDays, ChevronRight } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const ITEMS = [
  {cat:'Home', kicker:'Available today', title:'Home care bundles', desc:'Cleaning, laundry, and AC support in one smooth plan.', offer:'Save up to 20%', img:'/assets/ai-banner-home-cleaning.jpg', rating:'4.8', service:{provider:'Scrubs Cleaning',name:'General Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {cat:'Car', kicker:'Verified pros', title:'Car refresh week', desc:'Foam wash, polish, and interior care from Sparkle Auto.', offer:'From 45 QR', img:'/assets/ai-banner-sparkle-carwash.jpg', rating:'4.7', service:{provider:'Sparkle Auto Wash',name:'Premium Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {cat:'Digital', kicker:'Online help', title:'Digital setup desk', desc:'Device setup, backups, and website launch support.', offer:'15% OFF', img:'/assets/ai-provider-bytecare-digital.png', rating:'4.8', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {cat:'Laundry', kicker:'Pickup support', title:'Laundry care weekend', desc:'Wash, fold, dry cleaning, and ironing with easy pickup.', offer:'10% OFF', img:'/assets/ai-provider-freshfold-real-wallpaper.png', rating:'4.8', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Salon', kicker:'Beauty event', title:'Glow day packages', desc:'Hair styling, facial care, and spa refresh packages.', offer:'15% OFF', img:'/assets/ai-banner-glow-salon.jpg', rating:'4.9', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Education', kicker:'Study week', title:'Exam confidence sessions', desc:'Focused tutoring and exam prep for school and IELTS.', offer:'From 95 QR', img:'/assets/ai-provider-summit-learning.png', rating:'4.9', service:{provider:'Summit Learning Hub',name:'Exam Prep Session',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  {cat:'Maintenance', kicker:'Seasonal check', title:'AC comfort campaign', desc:'Book cooling checks and urgent home repair visits.', offer:'18% OFF', img:'/assets/ai-avatar-quickfix.jpg', rating:'4.8', service:{provider:'QuickFix Maintenance',name:'AC Service',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  {cat:'Deliveries', kicker:'Same-day', title:'Doha express errands', desc:'Fast parcel, document, and small item delivery across Doha.', offer:'From 40 QR', img:'/assets/ai-homecat-delivery.png', rating:'4.7', service:{provider:'Doha Swift Delivery',name:'Same-day Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
  {cat:'Travel', kicker:'City escape', title:'Heritage travel picks', desc:'Hotel stays, transfers, and Qatar weekend travel support.', offer:'30% OFF', img:'/assets/ai-banner-heritage.jpg', rating:'4.8', service:{provider:'The Heritage',name:'Flights & Hotels Package',price:'320.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
]

const FILTERS = ['All','Home','Car','Digital','Laundry','Salon','Education','Maintenance','Deliveries','Travel']

export default function OffersEventsPage() {
  const { goBack, navigate } = useNav()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = ITEMS.filter(item => {
    const byFilter = filter === 'All' || item.cat === filter
    const q = query.trim().toLowerCase()
    const byQuery = !q || `${item.title} ${item.desc} ${item.cat} ${item.kicker}`.toLowerCase().includes(q)
    return byFilter && byQuery
  })

  return (
    <div className="relative flex flex-col flex-1 bg-[#eaf6ff] overflow-hidden">
      <img src="/assets/home-wave-background-extra-light-preview.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" aria-hidden="true" />
      <div className="absolute inset-0 bg-white/20" aria-hidden="true" />
      <StatusBar />
      <div className="relative z-10 flex items-center gap-3 px-4 pt-2 pb-3">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0967ff]">
          <ArrowLeft size={21}/>
        </button>
        <div className="min-w-0">
          <h1 className="text-[25px] leading-7 font-black text-black">Offers & Events</h1>
          <p className="text-[12px] font-semibold text-[#65708a]">Seasonal promos, bundles, and provider campaigns.</p>
        </div>
      </div>
      <div className="relative z-10 px-4">
        <div className="h-[46px] rounded-[23px] bg-white shadow-sm flex items-center gap-2.5 px-4">
          <Search size={19} className="text-[#111827]"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search offers and events..." className="flex-1 min-w-0 bg-transparent outline-none text-[14px] placeholder:text-[#73789b]" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`shrink-0 h-9 rounded-[17px] px-3.5 text-[12px] font-black shadow-sm transition ${filter===f?'bg-[#0967ff] text-white':'bg-white text-[#10152f]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-32 pt-1 space-y-3">
        {filtered.map(item=>(
          <button key={`${item.cat}-${item.title}`} onClick={()=>navigate('service-detail', item.service)} className="w-full overflow-hidden rounded-[22px] bg-white text-left shadow-sm active:scale-[0.99] transition">
            <div className="relative h-[142px] overflow-hidden">
              <img src={item.img} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/18" />
              <div className="relative h-full p-4">
                <div className="max-w-[215px]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#dfff2d] px-2.5 py-1 text-[10px] font-black text-[#1d2b00]">
                    <Sparkles size={12}/>{item.kicker}
                  </span>
                  <h2 className="mt-3 text-[21px] leading-[23px] font-black text-[#07133d]">{item.title}</h2>
                  <p className="mt-1.5 text-[11px] leading-[14px] font-black text-[#3f4a63]">{item.desc}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[11px] font-bold text-[#65708a]">{item.cat}</p>
                <p className="text-[17px] font-black text-[#0967ff]">{item.offer}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-[#65708a]"><Star size={11} className="inline fill-yellow-400 text-yellow-400"/> {item.rating}</p>
                <p className="mt-1 inline-flex items-center gap-1 rounded-[13px] bg-[#0967ff] px-3 py-1.5 text-[11px] font-black text-white">View <ChevronRight size={13}/></p>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <button onClick={()=>{setFilter('All'); setQuery('')}} className="mt-8 w-full rounded-[22px] bg-white py-8 text-center text-[14px] font-bold text-[#0967ff] shadow-sm">
            No offers found. Clear filters <ChevronRight size={16} className="inline"/>
          </button>
        )}
      </div>
    </div>
  )
}
