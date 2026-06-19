import { useState } from 'react'
import { ArrowLeft, Star, Heart, MapPin, Shield, Users, Clock, ChevronUp, ChevronDown, Check, Home, Sparkles, Sofa, Refrigerator, Shirt, CalendarDays, Info, ArrowRight, Car, Plane, Hotel, Luggage, Droplets, Scissors, Flower2, Wind, Wrench, Headphones } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

type ServiceOption = { label: string; desc: string; price: number; icon: any }
type ExtraOption = { label: string; price: number; icon: any }
type ProviderConfig = {
  label: string
  category: string
  desc: string
  heroImg?: string
  logoImg?: string
  providerImage?: string
  rating: string
  reviews: string
  distance: string
  duration: string
  services: ServiceOption[]
  extras: ExtraOption[]
}

const PROVIDERS: Record<string, ProviderConfig> = {
  'Scrubs Cleaning': {
    label: 'Scrubs Cleaning',
    category: 'Home Services',
    desc: 'Professional scrubs-grade cleaning you can trust.',
    heroImg: '/assets/scrubs-booking-hero-clean.png',
    logoImg: '/assets/scrubs-logo-clean.png',
    providerImage: '/assets/scrubs-leaf-logo-clean.png',
    rating: '4.8',
    reviews: '230',
    distance: '2.27 KM',
    duration: '~3 to 4 hours',
    services: [
      { label: 'General Cleaning', desc: 'Regular home cleaning and maintenance', price: 160, icon: Home },
      { label: 'Deep Cleaning', desc: 'Detailed kitchen, bath, and living area care', price: 240, icon: Sparkles },
      { label: 'Move-in / Move-out', desc: 'Complete cleaning for new or empty spaces', price: 280, icon: Sofa },
    ],
    extras: [
      { label: 'Inside Fridge', price: 30, icon: Refrigerator },
      { label: 'Inside Oven', price: 30, icon: CalendarDays },
      { label: 'Laundry Wash & Fold', price: 25, icon: Shirt },
    ],
  },
  'Sparkle Auto Wash': {
    label: 'Sparkle Auto Wash',
    category: 'Car Services',
    desc: 'Premium car wash and detailing for a showroom-fresh finish.',
    heroImg: '/assets/ai-banner-sparkle-carwash.jpg',
    providerImage: '/assets/ai-profile-sparkle-carwash.jpg',
    rating: '4.7',
    reviews: '98',
    distance: '3.20 KM',
    duration: '~45 to 90 minutes',
    services: [
      { label: 'Basic Wash', desc: 'Exterior rinse, foam wash, and dry', price: 45, icon: Droplets },
      { label: 'Premium Wash', desc: 'Exterior wash with interior vacuum', price: 75, icon: Car },
      { label: 'Full Detail', desc: 'Interior detailing and exterior polish', price: 120, icon: Sparkles },
    ],
    extras: [
      { label: 'Wax Protection', price: 25, icon: Shield },
      { label: 'Interior Sanitizing', price: 20, icon: Sparkles },
      { label: 'Tire Shine', price: 15, icon: Car },
    ],
  },
  'Glow Salon & Spa': {
    label: 'Glow Salon & Spa',
    category: 'Salon & Spa',
    desc: 'Beauty and wellness treatments delivered by trusted professionals.',
    heroImg: '/assets/ai-banner-glow-salon.jpg',
    providerImage: '/assets/ai-profile-glow-salon.jpg',
    rating: '4.9',
    reviews: '215',
    distance: '5.10 KM',
    duration: '~60 to 120 minutes',
    services: [
      { label: 'Hair Styling', desc: 'Wash, blow dry, and polished styling', price: 80, icon: Scissors },
      { label: 'Salon & Spa Package', desc: 'Relaxing beauty and wellness bundle', price: 120, icon: Flower2 },
      { label: 'Facial Treatment', desc: 'Cleanse, exfoliate, and hydration care', price: 95, icon: Sparkles },
    ],
    extras: [
      { label: 'Manicure Add-on', price: 35, icon: Sparkles },
      { label: 'Hot Oil Treatment', price: 45, icon: Droplets },
      { label: 'Express Massage', price: 55, icon: Flower2 },
    ],
  },
  'CleanPro Services': {
    label: 'CleanPro Services',
    category: 'Home Services',
    desc: 'Deep home cleaning, disinfecting, and practical organization.',
    heroImg: '/assets/ai-banner-home-cleaning.jpg',
    providerImage: '/assets/ai-avatar-cleanpro.jpg',
    rating: '4.6',
    reviews: '98',
    distance: '6.30 KM',
    duration: '~3 to 5 hours',
    services: [
      { label: 'Standard Clean', desc: 'Essential cleaning for everyday upkeep', price: 120, icon: Home },
      { label: 'Deep Clean', desc: 'Detailed cleaning for high-touch areas', price: 160, icon: Sparkles },
      { label: 'Move-out Clean', desc: 'Empty-space cleaning before handover', price: 200, icon: Sofa },
    ],
    extras: [
      { label: 'Window Cleaning', price: 40, icon: Sparkles },
      { label: 'Cabinet Interior', price: 35, icon: Home },
      { label: 'Balcony Wash', price: 30, icon: Droplets },
    ],
  },
  'Happy Home Services': {
    label: 'Happy Home Services',
    category: 'Home Services',
    desc: 'Friendly home care for weekly cleaning and deeper resets.',
    providerImage: '/assets/ai-avatar-happyhome.jpg',
    rating: '4.7',
    reviews: '185',
    distance: '4.10 KM',
    duration: '~2 to 4 hours',
    services: [
      { label: 'Regular Clean', desc: 'Kitchen, bathrooms, floors, and dusting', price: 140, icon: Home },
      { label: 'Deep Cleaning', desc: 'A fuller reset for busy homes', price: 220, icon: Sparkles },
      { label: 'Office Clean', desc: 'Desk, floor, pantry, and meeting-room care', price: 180, icon: Wrench },
    ],
    extras: [
      { label: 'Ironing', price: 20, icon: Shirt },
      { label: 'Inside Fridge', price: 30, icon: Refrigerator },
      { label: 'Storage Tidy-up', price: 35, icon: Home },
    ],
  },
  'The Heritage': {
    label: 'The Heritage',
    category: 'Travel',
    desc: 'Curated Qatar travel packages with flight, hotel, and transfer support.',
    heroImg: '/assets/ai-banner-heritage.jpg',
    providerImage: '/assets/ai-banner-heritage.jpg',
    rating: '4.8',
    reviews: '164',
    distance: 'Online',
    duration: 'Instant confirmation',
    services: [
      { label: 'Flights & Hotels Package', desc: 'Bundled flight and hotel booking support', price: 320, icon: Plane },
      { label: 'Weekend Staycation', desc: 'Hotel stay with breakfast and late checkout', price: 420, icon: Hotel },
      { label: 'Airport Transfer', desc: 'Private pickup or drop-off in Doha', price: 90, icon: Luggage },
    ],
    extras: [
      { label: 'Travel Insurance', price: 45, icon: Shield },
      { label: 'VIP Airport Assist', price: 85, icon: Users },
      { label: 'Extra Baggage Help', price: 35, icon: Luggage },
    ],
  },
  'QuickFix Maintenance': {
    label: 'QuickFix Maintenance',
    category: 'Maintenance',
    desc: 'Fast maintenance support for AC, plumbing, and everyday repairs.',
    providerImage: '/assets/ai-avatar-quickfix.jpg',
    rating: '4.8',
    reviews: '156',
    distance: '4.40 KM',
    duration: '~60 to 120 minutes',
    services: [
      { label: 'AC Service', desc: 'Inspection, filter cleaning, and cooling check', price: 120, icon: Wind },
      { label: 'Plumbing Visit', desc: 'Leak checks and basic plumbing fixes', price: 90, icon: Wrench },
      { label: 'General Repair', desc: 'Small home repairs by a technician', price: 110, icon: Shield },
    ],
    extras: [
      { label: 'Urgent Visit', price: 40, icon: Clock },
      { label: 'Extra Unit Check', price: 30, icon: Wind },
      { label: 'Parts Pickup', price: 25, icon: Wrench },
    ],
  },
  'Helpy Support': {
    label: 'Helpy Support',
    category: 'Support',
    desc: 'Customer support for bookings, payments, and account questions.',
    providerImage: '/assets/ai-avatar-support.jpg',
    rating: '4.9',
    reviews: '500',
    distance: 'Online',
    duration: 'Usually replies in minutes',
    services: [
      { label: 'Booking Help', desc: 'Get help changing or tracking a booking', price: 0, icon: CalendarDays },
      { label: 'Payment Support', desc: 'Wallet, refund, and payment assistance', price: 0, icon: Shield },
      { label: 'Account Support', desc: 'Profile, address, and app guidance', price: 0, icon: Headphones },
    ],
    extras: [],
  },
}

const DATES = [
  {label:'Today', day:'May 30'},
  {label:'Sun', day:'May 31'},
  {label:'Mon', day:'Jun 1'},
  {label:'Tue', day:'Jun 2'},
  {label:'Wed', day:'Jun 3'},
]

const TIMES = ['08:00 AM','10:00 AM','12:00 PM','02:00 PM','04:00 PM','06:00 PM','08:00 PM','10:00 PM']

export default function ServiceDetailPage() {
  const { goBack, navigate, params, addBooking } = useNav()
  const provider = params?.provider || 'Scrubs Cleaning'
  const cfg = PROVIDERS[provider] || PROVIDERS['Scrubs Cleaning']
  const initialService = cfg.services.find(s => s.label === params?.name)?.label || ''

  const [selSvc, setSelSvc] = useState(initialService)
  const [selDate, setSelDate] = useState(1)
  const [selTime, setSelTime] = useState('12:00 PM')
  const [extras, setExtras] = useState<string[]>([])
  const [liked, setLiked] = useState(false)
  const [showTotal, setShowTotal] = useState(false)

  const active = cfg.services.find(s => s.label === selSvc) || cfg.services[0]
  const extrasTotal = extras.reduce((s,e)=>s+(cfg.extras.find(x=>x.label===e)?.price||0),0)
  const total = active.price + extrasTotal
  const hasSelectedService = Boolean(selSvc)
  const providerImage = params?.providerImage || cfg.logoImg || cfg.providerImage

  const toggleExtra = (e: string) => setExtras(prev => prev.includes(e) ? prev.filter(x=>x!==e) : [...prev,e])

  const book = () => {
    if (!hasSelectedService) return
    const booking = {
      id: Date.now().toString(),
      provider,
      service: selSvc,
      date: DATES[selDate].day + ', 2026',
      time: selTime,
      price: total.toFixed(2),
      status: 'Confirmed' as const,
      providerBg: params?.providerBg || 'bg-blue-500',
      providerEmoji: params?.providerEmoji || cfg.label.slice(0, 2).toUpperCase(),
      providerImage,
    }
    addBooking(booking)
    navigate('booking-success', booking)
  }

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-white pb-8">
        <div className="relative h-[300px] shrink-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url('${params?.heroImg || cfg.heroImg || providerImage || '/assets/ai-banner-home-cleaning.jpg'}')`}} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/82" />
          <StatusBar />
          <div className="absolute top-14 left-4 right-4 flex items-center justify-between">
            <button onClick={goBack} className="w-11 h-11 bg-white/95 rounded-full shadow-md flex items-center justify-center">
              <ArrowLeft size={22} className="text-gray-800"/>
            </button>
            <button onClick={()=>setLiked(v=>!v)} className="w-11 h-11 bg-white/95 rounded-full shadow-md flex items-center justify-center">
              <Heart size={22} className={liked?'text-red-500 fill-red-500':'text-gray-900'}/>
            </button>
          </div>
          <div className="absolute left-5 right-5 bottom-3 flex items-center gap-4">
            <div className="w-[84px] h-[84px] rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden p-2">
              {providerImage ? <img src={providerImage} className={`w-full h-full ${provider === 'Scrubs Cleaning' ? 'object-contain' : 'object-cover rounded-full'}`}/> : <span className="text-[15px] font-black text-brand-500">{cfg.label.slice(0,2)}</span>}
            </div>
            <div className="flex-1 pt-5 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[25px] font-black text-white drop-shadow truncate">{cfg.label}</h1>
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center"><Check size={13}/></span>
              </div>
              <span className="mt-1 inline-block rounded-lg bg-white/90 px-3 py-1 text-brand-500 text-[13px] font-bold">{cfg.category}</span>
              <div className="mt-3 flex items-center gap-4 text-white drop-shadow">
                <span className="flex items-center gap-1 text-[15px] font-semibold"><Star size={19} className="fill-brand-500 text-brand-500"/>{cfg.rating} ({cfg.reviews})</span>
                <span className="w-px h-5 bg-white/50"/>
                <span className="flex items-center gap-1 text-[15px] font-semibold"><MapPin size={17}/>{cfg.distance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-1 space-y-6">
          <div className="rounded-[22px] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.10)] p-4 flex items-center gap-4">
            <div className="min-w-[110px]">
              <p className="text-[12px] text-[#667085]">Starting from</p>
              <p className="text-[26px] font-black text-brand-500">{Math.min(...cfg.services.map(s=>s.price)).toFixed(2)} QR</p>
            </div>
            <div className="h-12 w-px bg-gray-100"/>
            <div className="flex-1 grid grid-cols-3 gap-2">
              {[{Icon:Shield,label:'Verified\nProvider'},{Icon:Users,label:'Trusted\nPros'},{Icon:Clock,label:'On-time\nService'}].map(({Icon,label})=>(
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Icon size={17} className="text-brand-500"/></div>
                  <p className="text-[9px] leading-[11px] text-gray-700 text-center font-semibold whitespace-pre-line">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <section>
            <p className="text-[16px] font-black text-gray-950 mb-3">1. Select Service</p>
            <div className="grid grid-cols-3 gap-3">
              {cfg.services.map(s=>{
                const Icon = s.icon
                const selected = selSvc === s.label
                return (
                  <button key={s.label} onClick={()=>setSelSvc(s.label)}
                    className={`relative min-h-[146px] rounded-[18px] p-3 border text-center shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                    <span className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300 bg-white'}`}>
                      {selected&&<Check size={14} className="text-white"/>}
                    </span>
                    <div className="mt-2 mx-auto w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon size={25} className="text-brand-500"/>
                    </div>
                    <p className="mt-4 text-[13px] leading-4 font-black text-gray-950">{s.label}</p>
                    <p className="mt-2 text-[11px] leading-4 text-gray-600">{s.desc}</p>
                    <p className="mt-3 text-[14px] font-black text-brand-500">{s.price.toFixed(2)} QR</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <p className="text-[16px] font-black text-gray-950 mb-3">2. Select Date & Time</p>
            <div className="grid grid-cols-6 gap-2">
              {DATES.map((d,i)=>(
                <button key={i} onClick={()=>setSelDate(i)}
                  className={`h-[62px] rounded-[15px] shadow-sm flex flex-col items-center justify-center text-[12px] font-bold ${selDate===i?'bg-brand-500 text-white':'bg-white text-gray-900'}`}>
                  <span>{d.label}</span>
                  <span className={selDate===i?'text-white/85':'text-gray-500'}>{d.day}</span>
                </button>
              ))}
              <button onClick={()=>setSelDate(0)} className="h-[62px] rounded-[15px] bg-white shadow-sm flex items-center justify-center"><CalendarDays size={22}/></button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {TIMES.map(t=>(
                <button key={t} onClick={()=>t!=='10:00 PM'&&setSelTime(t)}
                  className={`h-11 rounded-[14px] text-[13px] font-black shadow-sm transition ${selTime===t?'bg-brand-500 text-white':'bg-white text-gray-900'} ${t==='10:00 PM'?'opacity-35 pointer-events-none':''}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 bg-blue-50 rounded-[18px] px-4 py-3">
              <Clock size={21} className="text-brand-500 shrink-0"/>
              <div className="flex-1">
                <p className="text-[13px] text-brand-500 font-black">Service duration: {cfg.duration}</p>
                <p className="text-[12px] text-gray-600">{cfg.desc}</p>
              </div>
              <Info size={20} className="text-brand-500"/>
            </div>
          </section>

          {cfg.extras.length > 0 && (
            <section className={hasSelectedService?'pb-28':'pb-4'}>
              <p className="text-[16px] font-black text-gray-950 mb-3">3. Add Extras (Optional)</p>
              <div className="grid grid-cols-3 gap-3">
                {cfg.extras.map(({label, price, icon: Icon})=>{
                  const selected = extras.includes(label)
                  return (
                    <button key={label} onClick={()=>toggleExtra(label)}
                      className={`relative min-h-[112px] rounded-[18px] p-3 text-left border shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                      <span className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300'}`}>
                        {selected&&<Check size={12} className="text-white"/>}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Icon size={20} className="text-brand-500"/></div>
                      <p className="mt-3 text-[13px] leading-4 font-black text-gray-950">{label}</p>
                      <p className="mt-2 text-[13px] font-black text-brand-500">+ {price.toFixed(2)} QR</p>
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {hasSelectedService && (
        <div className="shrink-0 bg-white/96 backdrop-blur border-t border-gray-100 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] rounded-t-[22px]">
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowTotal(v=>!v)} className="flex items-center gap-3 min-w-[145px] text-left">
              <div>
                <p className="text-[12px] text-gray-400">Total Price</p>
                <p className="text-[24px] font-black text-brand-500">{total.toFixed(2)} QR</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {showTotal?<ChevronDown size={18}/>:<ChevronUp size={18}/>}
              </span>
            </button>
            <button onClick={book} className="flex-1 h-[56px] rounded-[18px] bg-brand-500 text-white text-[16px] font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              Continue to Details <ArrowRight size={21}/>
            </button>
          </div>
          {showTotal&&(
            <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-1.5">
              <div className="flex justify-between text-[12px]"><span className="text-gray-500">{selSvc}</span><span className="font-semibold">{active.price.toFixed(2)} QR</span></div>
              {extras.map(e=><div key={e} className="flex justify-between text-[12px]"><span className="text-gray-500">{e}</span><span className="font-semibold">+{cfg.extras.find(x=>x.label===e)?.price.toFixed(2)} QR</span></div>)}
              <div className="border-t border-gray-200 pt-1.5 flex justify-between text-[13px] font-bold"><span>Total</span><span className="text-brand-500">{total.toFixed(2)} QR</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
