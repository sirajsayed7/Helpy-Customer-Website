import { useMemo, useState } from 'react'
import { ArrowLeft, Search, Star, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const SERVICES = [
  {cat:'Home', provider:'Scrubs Cleaning', name:'General Cleaning', price:160, rating:4.8, reviews:230, dist:'2.27 KM', img:'/assets/scrubs-hero.png', fit:'object-cover object-top', badge:'Verified', service:{provider:'Scrubs Cleaning',name:'General Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {cat:'Home', provider:'CleanPro Services', name:'Deep Clean', price:160, rating:4.6, reviews:98, dist:'6.3 KM', img:'/assets/ai-banner-home-cleaning.jpg', fit:'object-cover object-center', badge:'20% OFF', service:{provider:'CleanPro Services',name:'Deep Clean',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}},
  {cat:'Home', provider:'Happy Home Services', name:'Regular Clean', price:140, rating:4.7, reviews:185, dist:'4.1 KM', img:'/assets/ai-avatar-happyhome.jpg', fit:'object-cover object-center', badge:'Available today', service:{provider:'Happy Home Services',name:'Regular Clean',price:'140.00',providerBg:'bg-amber-400',providerEmoji:'HH',providerImage:'/assets/ai-avatar-happyhome.jpg'}},
  {cat:'Car', provider:'Sparkle Auto Wash', name:'Premium Wash', price:75, rating:4.7, reviews:98, dist:'3.2 KM', img:'/assets/ai-profile-sparkle-carwash.jpg', fit:'object-cover object-center', badge:'30% OFF', service:{provider:'Sparkle Auto Wash',name:'Premium Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {cat:'Laundry', provider:'FreshFold Laundry', name:'Wash & Fold', price:35, rating:4.8, reviews:126, dist:'2.8 KM', img:'/assets/ai-provider-freshfold-real-wallpaper.png', fit:'object-cover object-center', badge:'Pickup', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Laundry', provider:'Pearl Laundry Care', name:'Dry Cleaning', price:55, rating:4.7, reviews:91, dist:'3.6 KM', img:'/assets/ai-homecat-laundry-modern.png', fit:'object-contain object-center', badge:'Premium care', service:{provider:'Pearl Laundry Care',name:'Dry Cleaning',price:'55.00',providerBg:'bg-blue-500',providerEmoji:'PL',providerImage:'/assets/ai-homecat-laundry-modern.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Salon', provider:'Glow Salon & Spa', name:'Salon & Spa Package', price:120, rating:4.9, reviews:215, dist:'5.1 KM', img:'/assets/ai-profile-glow-salon.jpg', fit:'object-cover object-top', badge:'15% OFF', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Salon', provider:'Luxe Beauty Lounge', name:'Hair Styling', price:80, rating:4.8, reviews:143, dist:'3.8 KM', img:'/assets/ai-avatar-luxe.jpg', fit:'object-cover object-center', badge:'Home visit', service:{provider:'Luxe Beauty Lounge',name:'Hair Styling',price:'80.00',providerBg:'bg-rose-500',providerEmoji:'LB',providerImage:'/assets/ai-avatar-luxe.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Maintenance', provider:'QuickFix Maintenance', name:'AC Service', price:120, rating:4.8, reviews:156, dist:'4.4 KM', img:'/assets/ai-avatar-quickfix.jpg', fit:'object-cover object-center', badge:'Verified', service:{provider:'QuickFix Maintenance',name:'AC Service',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  {cat:'Maintenance', provider:'Fix It All Repairs', name:'Plumbing Visit', price:90, rating:4.6, reviews:89, dist:'6.2 KM', img:'/assets/ai-avatar-fixit.jpg', fit:'object-cover object-center', badge:'Fast visit', service:{provider:'Fix It All Repairs',name:'Plumbing Visit',price:'90.00',providerBg:'bg-cyan-500',providerEmoji:'FI',providerImage:'/assets/ai-avatar-fixit.jpg'}},
  {cat:'Digital', provider:'ByteCare Digital', name:'Device Setup', price:65, rating:4.8, reviews:134, dist:'Online', img:'/assets/ai-provider-bytecare-digital.png', fit:'object-cover object-center', badge:'Online', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {cat:'Digital', provider:'PixelNest Studio', name:'Website Starter', price:180, rating:4.9, reviews:88, dist:'Online', img:'/assets/ai-provider-pixelnest-studio.png', fit:'object-cover object-center', badge:'Business', service:{provider:'PixelNest Studio',name:'Website Starter',price:'180.00',providerBg:'bg-violet-500',providerEmoji:'PN',providerImage:'/assets/ai-provider-pixelnest-studio.png',heroImg:'/assets/ai-provider-pixelnest-studio.png'}},
  {cat:'Education', provider:'BrightPath Tutors', name:'Math Tutoring', price:95, rating:4.8, reviews:112, dist:'Online', img:'/assets/ai-provider-brightpath-tutors.png', fit:'object-cover object-center', badge:'Online', service:{provider:'BrightPath Tutors',name:'Math Tutoring',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
  {cat:'Education', provider:'Summit Learning Hub', name:'Exam Prep Session', price:110, rating:4.9, reviews:76, dist:'Online', img:'/assets/ai-provider-summit-learning.png', fit:'object-cover object-center', badge:'Top rated', service:{provider:'Summit Learning Hub',name:'Exam Prep Session',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  {cat:'Deliveries', provider:'Doha Swift Delivery', name:'Same-day Delivery', price:40, rating:4.7, reviews:102, dist:'2.6 KM', img:'/assets/ai-homecat-delivery.png', fit:'object-contain object-center', badge:'Same-day', service:{provider:'Doha Swift Delivery',name:'Same-day Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
  {cat:'Travel', provider:'The Heritage', name:'Flights & Hotels Package', price:320, rating:4.8, reviews:164, dist:'Online', img:'/assets/ai-banner-heritage.jpg', fit:'object-cover object-center', badge:'30% OFF', service:{provider:'The Heritage',name:'Flights & Hotels Package',price:'320.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
]

const CATEGORIES = ['All','Home','Car','Laundry','Salon','Maintenance','Digital','Education','Deliveries','Travel']
const SORT_LABELS: Record<string, string> = {
  recommended: 'Recommended',
  'rating-high': 'Rating: High to Low',
  'rating-low': 'Rating: Low to High',
  'price-high': 'Pricing: High to Low',
  'price-low': 'Pricing: Low to High',
}

export default function AllServicesPage() {
  const { goBack, navigate } = useNav()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recommended')
  const [openSort, setOpenSort] = useState(false)
  const sortLabel = SORT_LABELS[sort] || 'Recommended'

  const services = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = SERVICES.filter(s => (category === 'All' || s.cat === category) && (!q || `${s.name} ${s.provider} ${s.cat}`.toLowerCase().includes(q)))
    return [...filtered].sort((a,b) => {
      if (sort === 'rating-high') return b.rating - a.rating || b.reviews - a.reviews
      if (sort === 'rating-low') return a.rating - b.rating || a.reviews - b.reviews
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'price-low') return a.price - b.price
      return (b.rating * 100 + b.reviews / 10) - (a.rating * 100 + a.reviews / 10)
    })
  }, [category, query, sort])

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
          <h1 className="text-[25px] leading-7 font-black text-black">All Services</h1>
          <p className="text-[12px] font-semibold text-[#65708a]">Browse, filter, sort, and book instantly.</p>
        </div>
      </div>

      <div className="relative z-20 px-4">
        <div className="h-[46px] rounded-[23px] bg-white shadow-sm flex items-center gap-2.5 px-4">
          <Search size={19} className="text-[#111827]"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search all services..." className="flex-1 min-w-0 bg-transparent outline-none text-[14px] placeholder:text-[#73789b]" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCategory(c)} className={`shrink-0 h-9 rounded-[17px] px-3.5 text-[12px] font-black shadow-sm transition ${category===c?'bg-[#0967ff] text-white':'bg-white text-[#10152f]'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative mt-1">
          <button onClick={()=>setOpenSort(v=>!v)} className="h-11 w-full rounded-[18px] bg-white px-4 shadow-sm flex items-center justify-between text-left">
            <span className="flex items-center gap-2 text-[13px] font-black text-[#10152f]"><SlidersHorizontal size={16} className="text-[#0967ff]"/>{sortLabel}</span>
            <ChevronDown size={17} className={`text-[#65708a] transition ${openSort?'rotate-180':''}`}/>
          </button>
          {openSort && (
            <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
              <button onClick={()=>{setSort('recommended'); setOpenSort(false)}} className={`w-full rounded-[14px] px-3 py-3 text-left text-[13px] font-black ${sort==='recommended'?'bg-blue-50 text-[#0967ff]':'text-[#10152f]'}`}>
                Recommended
              </button>
              {[
                {label:'Rating', high:'rating-high', low:'rating-low'},
                {label:'Pricing', high:'price-high', low:'price-low'},
              ].map(group=>(
                <div key={group.label} className="mt-2 rounded-[15px] bg-[#f7fbff] p-2">
                  <p className="px-1 pb-2 text-[12px] font-black text-[#10152f]">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={()=>{setSort(group.high); setOpenSort(false)}} className={`h-9 rounded-[13px] text-[12px] font-black ${sort===group.high?'bg-[#0967ff] text-white':'bg-white text-[#65708a]'}`}>
                      High to Low
                    </button>
                    <button onClick={()=>{setSort(group.low); setOpenSort(false)}} className={`h-9 rounded-[13px] text-[12px] font-black ${sort===group.low?'bg-[#0967ff] text-white':'bg-white text-[#65708a]'}`}>
                      Low to High
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-32 pt-4 space-y-3">
        <p className="text-[12px] font-black text-[#65708a]">{services.length} services found</p>
        {services.map(s=>(
          <button key={`${s.provider}-${s.name}`} onClick={()=>navigate('service-detail', s.service)} className="w-full rounded-[21px] bg-white p-2.5 text-left shadow-sm active:scale-[0.99] transition flex gap-3">
            <div className="relative h-[92px] w-[118px] shrink-0 overflow-hidden rounded-[17px] bg-blue-50">
              <img src={s.img} className={`h-full w-full ${s.fit}`} />
              <span className="absolute left-2 top-2 rounded-md bg-[#dfff2d] px-1.5 py-0.5 text-[9px] font-black text-[#1d2b00]">{s.badge}</span>
            </div>
            <div className="min-w-0 flex-1 py-1">
              <p className="truncate text-[11px] font-black text-[#0967ff]">{s.provider}</p>
              <p className="mt-0.5 line-clamp-2 text-[17px] leading-[19px] font-black text-[#10152f]">{s.name}</p>
              <p className="mt-1 text-[11px] font-bold text-[#65708a]"><Star size={11} className="inline fill-yellow-400 text-yellow-400"/> {s.rating} ({s.reviews}) <MapPin size={11} className="ml-1 inline"/> {s.dist}</p>
              <div className="mt-1.5 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] text-[#65708a]">from</p>
                  <p className="text-[18px] leading-5 font-black text-[#0967ff]">{s.price.toFixed(2)} QR</p>
                </div>
                <span className="rounded-[14px] bg-[#0967ff] px-4 py-2 text-[12px] font-black text-white">Book</span>
              </div>
            </div>
          </button>
        ))}
        {services.length === 0 && (
          <button onClick={()=>{setCategory('All'); setQuery(''); setSort('recommended')}} className="w-full rounded-[22px] bg-white py-8 text-center text-[14px] font-bold text-[#0967ff] shadow-sm">
            No services found. Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
