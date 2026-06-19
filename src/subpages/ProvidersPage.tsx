import { useState } from 'react'
import { ArrowLeft, Search, Star, BadgeCheck } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const PROVIDERS = [
  {cat:'Salon', name:'Glow Spa', full:'Glow Salon & Spa', rating:4.9, reviews:215, img:'/assets/ai-profile-glow-salon.jpg', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Digital', name:'PixelNest', full:'PixelNest Studio', rating:4.9, reviews:88, img:'/assets/ai-provider-pixelnest-studio.png', service:{provider:'PixelNest Studio',name:'Website Starter',price:'180.00',providerBg:'bg-violet-500',providerEmoji:'PN',providerImage:'/assets/ai-provider-pixelnest-studio.png',heroImg:'/assets/ai-provider-pixelnest-studio.png'}},
  {cat:'Education', name:'Summit Learning', full:'Summit Learning Hub', rating:4.9, reviews:76, img:'/assets/ai-provider-summit-learning.png', service:{provider:'Summit Learning Hub',name:'Exam Prep Session',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  {cat:'Support', name:'Helpy Support', full:'Helpy Support', rating:4.9, reviews:500, img:'/assets/helpy-logo-transparent.png', service:{provider:'Helpy Support',name:'Account Support',price:'0.00',providerBg:'bg-brand-500',providerEmoji:'HS',providerImage:'/assets/helpy-logo-transparent.png'}},
  {cat:'Home', name:'Scrubs', full:'Scrubs Cleaning', rating:4.8, reviews:230, img:'/assets/scrubs-leaf-logo-clean.png', service:{provider:'Scrubs Cleaning',name:'General Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {cat:'Home', name:'Happy Home', full:'Happy Home Services', rating:4.7, reviews:185, img:'/assets/ai-avatar-happyhome.jpg', service:{provider:'Happy Home Services',name:'Regular Clean',price:'140.00',providerBg:'bg-amber-400',providerEmoji:'HH',providerImage:'/assets/ai-avatar-happyhome.jpg'}},
  {cat:'Digital', name:'ByteCare', full:'ByteCare Digital', rating:4.8, reviews:134, img:'/assets/ai-provider-bytecare-digital.png', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {cat:'Education', name:'BrightPath', full:'BrightPath Tutors', rating:4.8, reviews:112, img:'/assets/ai-provider-brightpath-tutors.png', service:{provider:'BrightPath Tutors',name:'Math Tutoring',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
  {cat:'Laundry', name:'FreshFold', full:'FreshFold Laundry', rating:4.8, reviews:126, img:'/assets/ai-provider-freshfold-real-logo.png', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Maintenance', name:'QuickFix', full:'QuickFix Maintenance', rating:4.8, reviews:156, img:'/assets/ai-avatar-quickfix.jpg', service:{provider:'QuickFix Maintenance',name:'AC Service',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  {cat:'Salon', name:'Luxe Beauty', full:'Luxe Beauty Lounge', rating:4.8, reviews:143, img:'/assets/ai-avatar-luxe.jpg', service:{provider:'Luxe Beauty Lounge',name:'Hair Styling',price:'80.00',providerBg:'bg-rose-500',providerEmoji:'LB',providerImage:'/assets/ai-avatar-luxe.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {cat:'Travel', name:'The Heritage', full:'The Heritage', rating:4.8, reviews:164, img:'/assets/ai-banner-heritage.jpg', service:{provider:'The Heritage',name:'Flights & Hotels Package',price:'320.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
  {cat:'Car', name:'Sparkle Auto', full:'Sparkle Auto Wash', rating:4.7, reviews:98, img:'/assets/ai-profile-sparkle-carwash.jpg', service:{provider:'Sparkle Auto Wash',name:'Premium Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {cat:'Deliveries', name:'Doha Swift', full:'Doha Swift Delivery', rating:4.7, reviews:102, img:'/assets/ai-homecat-delivery.png', service:{provider:'Doha Swift Delivery',name:'Same-day Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
  {cat:'Laundry', name:'Pearl Laundry', full:'Pearl Laundry Care', rating:4.7, reviews:91, img:'/assets/ai-homecat-laundry-modern.png', service:{provider:'Pearl Laundry Care',name:'Dry Cleaning',price:'55.00',providerBg:'bg-blue-500',providerEmoji:'PL',providerImage:'/assets/ai-homecat-laundry-modern.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {cat:'Maintenance', name:'Fix It All', full:'Fix It All Repairs', rating:4.6, reviews:89, img:'/assets/ai-avatar-fixit.jpg', service:{provider:'Fix It All Repairs',name:'Plumbing Visit',price:'90.00',providerBg:'bg-cyan-500',providerEmoji:'FI',providerImage:'/assets/ai-avatar-fixit.jpg'}},
  {cat:'Home', name:'CleanPro', full:'CleanPro Services', rating:4.6, reviews:98, img:'/assets/ai-avatar-cleanpro.jpg', service:{provider:'CleanPro Services',name:'Deep Clean',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}},
]

const FILTERS = ['All','Home','Car','Salon','Digital','Education','Laundry','Maintenance','Deliveries','Travel','Support']

export default function ProvidersPage() {
  const { goBack, navigate } = useNav()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const providers = PROVIDERS
    .filter(p => filter === 'All' || p.cat === filter)
    .filter(p => !query.trim() || `${p.name} ${p.full} ${p.cat}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a,b) => b.rating - a.rating || b.reviews - a.reviews)

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
          <h1 className="text-[25px] leading-7 font-black text-black">Popular Providers</h1>
          <p className="text-[12px] font-semibold text-[#65708a]">Ranked by ratings and customer trust.</p>
        </div>
      </div>
      <div className="relative z-10 px-4">
        <div className="h-[46px] rounded-[23px] bg-white shadow-sm flex items-center gap-2.5 px-4">
          <Search size={19} className="text-[#111827]"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search providers..." className="flex-1 min-w-0 bg-transparent outline-none text-[14px] placeholder:text-[#73789b]" />
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
        <div className="grid grid-cols-3 gap-3">
          {providers.map((p)=>(
            <button key={p.full} onClick={()=>navigate('service-detail', p.service)} className="relative h-[126px] rounded-[20px] bg-white px-1.5 pt-2 pb-1 text-center shadow-sm active:scale-95 transition overflow-hidden">
              <div className="mx-auto flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-[18px] bg-[#f4faff] shadow-inner">
                <img src={p.img} className={`h-full w-full ${/\.(jpg|jpeg)$/i.test(p.img) ? 'object-cover' : 'object-contain scale-110'}`} />
              </div>
              <p className="mt-1 line-clamp-2 min-h-[17px] whitespace-normal px-0.5 text-[12px] leading-[12px] font-black text-[#10152f]">{p.name}</p>
              <p className="mt-0 flex items-center justify-center gap-0.5 text-[10.5px] font-bold leading-3 text-[#65708a]">
                <Star size={11} className="fill-yellow-400 text-yellow-400"/>{p.rating.toFixed(1)}
                <BadgeCheck size={11} className="ml-0.5 fill-[#0967ff] text-white"/>
              </p>
            </button>
          ))}
        </div>
        {providers.length === 0 && (
          <button onClick={()=>{setFilter('All'); setQuery('')}} className="mt-8 w-full rounded-[22px] bg-white py-8 text-center text-[14px] font-bold text-[#0967ff] shadow-sm">
            No providers found. Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
