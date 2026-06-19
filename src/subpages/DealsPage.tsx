import { useState } from 'react'
import { ArrowLeft, Search, Star, MapPin, ChevronRight, BadgePercent } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const DEALS = [
  {cat:'Home', title:'Deep Cleaning', provider:'Scrubs Cleaning', offer:'25% OFF', price:'180 QR', oldPrice:'240 QR', rating:'4.7', reviews:'128', dist:'2.27 KM', img:'/assets/ai-banner-home-cleaning.jpg', service:{provider:'Scrubs Cleaning',name:'Deep Cleaning',price:'240.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {cat:'Car', title:'Car Wash', provider:'Sparkle Auto Wash', offer:'30% OFF', price:'35 QR', oldPrice:'45 QR', rating:'4.6', reviews:'98', dist:'3.2 KM', img:'/assets/ai-banner-sparkle-carwash.jpg', service:{provider:'Sparkle Auto Wash',name:'Basic Wash',price:'45.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {cat:'Education', title:'Tutoring Session', provider:'BrightPath Tutors', offer:'20% OFF', price:'120 QR', oldPrice:'150 QR', rating:'4.8', reviews:'215', dist:'Online', img:'/assets/ai-provider-brightpath-tutors.png', service:{provider:'BrightPath Tutors',name:'Math Tutoring',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
  {cat:'Salon', title:'Salon Package', provider:'Glow Salon & Spa', offer:'15% OFF', price:'120 QR', oldPrice:'140 QR', rating:'4.9', reviews:'215', dist:'5.1 KM', img:'/assets/ai-banner-glow-salon.jpg', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Digital', title:'Device Setup', provider:'ByteCare Digital', offer:'15% OFF', price:'65 QR', oldPrice:'80 QR', rating:'4.8', reviews:'134', dist:'Online', img:'/assets/ai-provider-bytecare-digital.png', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {cat:'Laundry', title:'Wash & Fold', provider:'FreshFold Laundry', offer:'10% OFF', price:'35 QR', oldPrice:'40 QR', rating:'4.8', reviews:'126', dist:'2.8 KM', img:'/assets/ai-provider-freshfold-real-wallpaper.png', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Maintenance', title:'AC Service Visit', provider:'QuickFix Maintenance', offer:'18% OFF', price:'99 QR', oldPrice:'120 QR', rating:'4.8', reviews:'156', dist:'4.4 KM', img:'/assets/ai-avatar-quickfix.jpg', service:{provider:'QuickFix Maintenance',name:'AC Service',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  {cat:'Salon', title:'Hair Styling', provider:'Luxe Beauty Lounge', offer:'12% OFF', price:'70 QR', oldPrice:'80 QR', rating:'4.8', reviews:'143', dist:'3.8 KM', img:'/assets/ai-avatar-luxe.jpg', service:{provider:'Luxe Beauty Lounge',name:'Hair Styling',price:'80.00',providerBg:'bg-rose-500',providerEmoji:'LB',providerImage:'/assets/ai-avatar-luxe.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Digital', title:'Website Starter', provider:'PixelNest Studio', offer:'20% OFF', price:'180 QR', oldPrice:'225 QR', rating:'4.9', reviews:'88', dist:'Online', img:'/assets/ai-provider-pixelnest-studio.png', service:{provider:'PixelNest Studio',name:'Website Starter',price:'180.00',providerBg:'bg-violet-500',providerEmoji:'PN',providerImage:'/assets/ai-provider-pixelnest-studio.png',heroImg:'/assets/ai-provider-pixelnest-studio.png'}},
  {cat:'Education', title:'Exam Prep Session', provider:'Summit Learning Hub', offer:'15% OFF', price:'110 QR', oldPrice:'130 QR', rating:'4.9', reviews:'76', dist:'Online', img:'/assets/ai-provider-summit-learning.png', service:{provider:'Summit Learning Hub',name:'Exam Prep Session',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  {cat:'Deliveries', title:'Same-day Delivery', provider:'Doha Swift Delivery', offer:'10% OFF', price:'40 QR', oldPrice:'45 QR', rating:'4.7', reviews:'102', dist:'2.6 KM', img:'/assets/ai-homecat-delivery.png', service:{provider:'Doha Swift Delivery',name:'Same-day Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
]

const FILTERS = ['All','Home','Car','Salon','Digital','Education','Laundry','Maintenance','Deliveries']

export default function DealsPage() {
  const { goBack, navigate } = useNav()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = DEALS.filter(d => {
    const byFilter = filter === 'All' || d.cat === filter
    const q = query.trim().toLowerCase()
    const byQuery = !q || `${d.title} ${d.provider} ${d.cat}`.toLowerCase().includes(q)
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
          <h1 className="text-[25px] leading-7 font-black text-black">Deals for you</h1>
          <p className="text-[12px] font-semibold text-[#65708a]">Fresh offers from verified Helpy providers.</p>
        </div>
      </div>
      <div className="relative z-10 px-4">
        <div className="h-[46px] rounded-[23px] bg-white shadow-sm flex items-center gap-2.5 px-4">
          <Search size={19} className="text-[#111827]"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search deals..." className="flex-1 min-w-0 bg-transparent outline-none text-[14px] placeholder:text-[#73789b]" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`shrink-0 h-9 rounded-[17px] px-3.5 text-[12px] font-black shadow-sm transition ${filter===f?'bg-[#0967ff] text-white':'bg-white text-[#10152f]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-32 pt-1">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(d=>(
            <button key={`${d.provider}-${d.title}`} onClick={()=>navigate('service-detail', d.service)} className="overflow-hidden rounded-[20px] bg-white text-left shadow-sm active:scale-[0.99] transition">
              <div className="relative h-[104px] overflow-hidden bg-blue-50">
                <img src={d.img} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-[#dfff2d] px-2 py-1 text-[10px] font-black text-[#1d2b00] shadow-sm">
                  <BadgePercent size={12}/>{d.offer}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-[14px] font-black text-[#10152f]">{d.title}</p>
                <p className="mt-0.5 truncate text-[11px] font-bold text-[#0967ff]">{d.provider}</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-[#65708a]">from</p>
                    <p className="text-[16px] leading-5 font-black text-[#0967ff]">{d.price}</p>
                    <p className="text-[10px] font-bold text-[#9aa3b5] line-through">{d.oldPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#65708a]"><Star size={10} className="inline fill-yellow-400 text-yellow-400"/> {d.rating} ({d.reviews})</p>
                    <p className="mt-0.5 text-[10px] text-[#65708a]"><MapPin size={10} className="inline"/> {d.dist}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <button onClick={()=>{setFilter('All'); setQuery('')}} className="mt-8 w-full rounded-[22px] bg-white py-8 text-center text-[14px] font-bold text-[#0967ff] shadow-sm">
            No deals found. Clear filters <ChevronRight size={16} className="inline"/>
          </button>
        )}
      </div>
    </div>
  )
}
