import { ArrowLeft, Star, MapPin, Heart, Search } from 'lucide-react'
import { useState } from 'react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

const SERVICES_BY_CAT: Record<string, any[]> = {
  cleaning: [
    {name:'Scrubs Cleaning',tag:'General Cleaning',from:'160.00',rating:'4.8',reviews:'230',dist:'2.27',image:'/assets/scrubs-hero.png',service:{name:'General Cleaning',provider:'Scrubs Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
    {name:'CleanPro Services',tag:'Deep Cleaning',from:'160.00',rating:'4.6',reviews:'98',dist:'6.3',image:'/assets/ai-avatar-cleanpro.jpg',service:{name:'Deep Clean',provider:'CleanPro Services',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}},
    {name:'Happy Home Services',tag:'Weekly Home Care',from:'140.00',rating:'4.7',reviews:'185',dist:'4.1',image:'/assets/ai-avatar-happyhome.jpg',service:{name:'Regular Clean',provider:'Happy Home Services',price:'140.00',providerBg:'bg-amber-400',providerEmoji:'HH',providerImage:'/assets/ai-avatar-happyhome.jpg'}},
  ],
  home: [
    {name:'Scrubs Cleaning',tag:'General Cleaning',from:'160.00',rating:'4.8',reviews:'230',dist:'2.27',image:'/assets/scrubs-hero.png',service:{name:'General Cleaning',provider:'Scrubs Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
    {name:'QuickFix Maintenance',tag:'AC Service',from:'120.00',rating:'4.8',reviews:'156',dist:'4.4',image:'/assets/ai-avatar-quickfix.jpg',service:{name:'AC Service',provider:'QuickFix Maintenance',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
    {name:'CleanPro Services',tag:'Deep Cleaning',from:'160.00',rating:'4.6',reviews:'98',dist:'6.3',image:'/assets/ai-avatar-cleanpro.jpg',service:{name:'Deep Clean',provider:'CleanPro Services',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}},
  ],
  laundry: [
    {name:'FreshFold Laundry',tag:'Wash & Fold',from:'35.00',rating:'4.8',reviews:'126',dist:'2.8',image:'/assets/ai-provider-freshfold-real-wallpaper.png',service:{name:'Wash & Fold',provider:'FreshFold Laundry',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
    {name:'Pearl Laundry Care',tag:'Dry Cleaning',from:'55.00',rating:'4.7',reviews:'91',dist:'3.6',image:'/assets/ai-provider-freshfold-real-wallpaper.png',service:{name:'Dry Cleaning',provider:'Pearl Laundry Care',price:'55.00',providerBg:'bg-blue-500',providerEmoji:'PL',providerImage:'/assets/ai-homecat-laundry-modern.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  ],
  car: [
    {name:'Sparkle Auto Wash',tag:'Premium Wash',from:'75.00',rating:'4.7',reviews:'98',dist:'3.2',image:'/assets/ai-profile-sparkle-carwash.jpg',service:{name:'Premium Wash',provider:'Sparkle Auto Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
    {name:'QuickFix Maintenance',tag:'General Repair',from:'110.00',rating:'4.8',reviews:'156',dist:'4.4',image:'/assets/ai-avatar-quickfix.jpg',service:{name:'General Repair',provider:'QuickFix Maintenance',price:'110.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  ],
  salon: [
    {name:'Glow Salon & Spa',tag:'Salon & Spa Package',from:'120.00',rating:'4.9',reviews:'215',dist:'5.1',image:'/assets/ai-profile-glow-salon.jpg',service:{name:'Salon & Spa Package',provider:'Glow Salon & Spa',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
    {name:'Luxe Beauty Lounge',tag:'Hair Styling',from:'80.00',rating:'4.8',reviews:'143',dist:'3.8',image:'/assets/ai-avatar-luxe.jpg',service:{name:'Hair Styling',provider:'Luxe Beauty Lounge',price:'80.00',providerBg:'bg-rose-500',providerEmoji:'LB',providerImage:'/assets/ai-avatar-luxe.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  ],
  maintenance: [
    {name:'QuickFix Maintenance',tag:'AC Service',from:'120.00',rating:'4.8',reviews:'156',dist:'4.4',image:'/assets/ai-avatar-quickfix.jpg',service:{name:'AC Service',provider:'QuickFix Maintenance',price:'120.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
    {name:'Fix It All',tag:'Plumbing Visit',from:'90.00',rating:'4.6',reviews:'89',dist:'6.2',image:'/assets/ai-avatar-fixit.jpg',service:{name:'Plumbing Visit',provider:'Fix It All Repairs',price:'90.00',providerBg:'bg-cyan-500',providerEmoji:'FI',providerImage:'/assets/ai-avatar-fixit.jpg'}},
  ],
  digital: [
    {name:'Helpy Support',tag:'Account Support',from:'0.00',rating:'4.9',reviews:'500',dist:'Online',image:'/assets/ai-avatar-support.jpg',service:{name:'Account Support',provider:'Helpy Support',price:'0.00',providerBg:'bg-brand-500',providerEmoji:'HS',providerImage:'/assets/ai-avatar-support.jpg'}},
    {name:'ByteCare Digital',tag:'Device Setup',from:'65.00',rating:'4.8',reviews:'134',dist:'Online',image:'/assets/ai-provider-bytecare-digital.png',service:{name:'Device Setup',provider:'ByteCare Digital',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
    {name:'PixelNest Studio',tag:'Website Starter',from:'180.00',rating:'4.9',reviews:'88',dist:'Online',image:'/assets/ai-provider-pixelnest-studio.png',service:{name:'Website Starter',provider:'PixelNest Studio',price:'180.00',providerBg:'bg-violet-500',providerEmoji:'PN',providerImage:'/assets/ai-provider-pixelnest-studio.png',heroImg:'/assets/ai-provider-pixelnest-studio.png'}},
  ],
  education: [
    {name:'BrightPath Tutors',tag:'Math Tutoring',from:'95.00',rating:'4.8',reviews:'112',dist:'Online',image:'/assets/ai-provider-brightpath-tutors.png',service:{name:'Math Tutoring',provider:'BrightPath Tutors',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
    {name:'Summit Learning Hub',tag:'Exam Prep Session',from:'110.00',rating:'4.9',reviews:'76',dist:'Online',image:'/assets/ai-provider-summit-learning.png',service:{name:'Exam Prep Session',provider:'Summit Learning Hub',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  ],
  marketplace: [
    {name:'The Heritage',tag:'Flights & Hotels',from:'320.00',rating:'4.8',reviews:'164',dist:'Online',image:'/assets/ai-banner-heritage.jpg',service:{name:'Flights & Hotels Package',provider:'The Heritage',price:'320.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
  ],
  delivery: [
    {name:'Doha Swift Delivery',tag:'Same-day Delivery',from:'40.00',rating:'4.7',reviews:'102',dist:'2.6',image:'/assets/ai-homecat-delivery.png',service:{name:'Same-day Delivery',provider:'Doha Swift Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
    {name:'The Heritage',tag:'Airport Transfer',from:'90.00',rating:'4.8',reviews:'164',dist:'Online',image:'/assets/ai-banner-heritage.jpg',service:{name:'Airport Transfer',provider:'The Heritage',price:'90.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
  ],
}

const DEFAULT_SERVICES = SERVICES_BY_CAT.home

export default function CategoryServicesPage() {
  const { goBack, navigate, params } = useNav()
  const id = params?.id || 'home'
  const label = params?.label || 'Services'
  const services = SERVICES_BY_CAT[id] || DEFAULT_SERVICES
  const [liked, setLiked] = useState<string[]>([])

  return (
    <div className="flex flex-col flex-1 bg-[#F4F6FF] overflow-hidden">
      <StatusBar/>
      <div className="flex items-center gap-3 px-4 pt-1 pb-3">
        <button onClick={goBack} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><ArrowLeft size={20} className="text-gray-600"/></button>
        <div>
          <h1 className="text-[20px] font-black text-gray-950">{label}</h1>
          <p className="text-[12px] text-gray-500">Choose a verified provider and book instantly.</p>
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-sm">
          <Search size={16} className="text-gray-400"/>
          <input placeholder={`Search ${label}...`} className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"/>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">
        <p className="text-[13px] font-bold text-gray-500">{services.length} providers found</p>
        {services.map((s,i)=>(
          <button key={i} onClick={()=>navigate('service-detail',s.service)}
            className="w-full bg-white rounded-2xl shadow-sm overflow-hidden flex text-left active:scale-[0.99] transition-transform">
            <div className="w-28 bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden" style={{minHeight:116}}>
              <img src={s.image} className="w-full h-full object-cover"/>
            </div>
            <div className="flex-1 p-4 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-gray-950 truncate">{s.name}</p>
                  <span className="inline-block text-[11px] font-bold text-brand-500 bg-blue-50 px-2.5 py-0.5 rounded-full mt-0.5">{s.tag}</span>
                </div>
                <button onClick={e=>{e.stopPropagation();setLiked(p=>p.includes(s.name)?p.filter(x=>x!==s.name):[...p,s.name])}}
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Heart size={14} className={liked.includes(s.name)?'text-red-500 fill-red-500':'text-gray-400'}/>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div><p className="text-[10px] text-gray-400">from</p><p className="text-[15px] font-black text-brand-500">{s.from} QR</p></div>
                <div className="text-right">
                  <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/><span className="text-[12px] font-semibold text-gray-700">{s.rating} ({s.reviews})</span></div>
                  <div className="flex items-center gap-1 mt-0.5"><MapPin size={11} className="text-gray-400"/><span className="text-[11px] text-gray-400">{s.dist} away</span></div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
