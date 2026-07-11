import { useEffect, useRef, useState } from 'react'
import { Search, Bell, ChevronRight, MapPin, Star, Bookmark, Wallet, ChevronDown, User, X, Check, ArrowDownUp } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const ADS = [
  {id:'city', img:'/assets/doha-katara-crescent-hero.png', brand:'Helpy', title:'Your City,', sub:'Our Services', desc:'Book trusted professionals for every need.', service:{provider:'Scrubs Cleaning',name:'General Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {id:'heritage', img:'/assets/ai-banner-heritage.jpg', brand:'The Heritage', title:'Up to', sub:'30% OFF', desc:'Flights & Hotels', service:{provider:'The Heritage',name:'Flights & Hotels Package',price:'320.00',providerBg:'bg-indigo-500',providerEmoji:'TH',providerImage:'/assets/ai-banner-heritage.jpg',heroImg:'/assets/ai-banner-heritage.jpg'}},
  {id:'carwash', img:'/assets/ai-banner-sparkle-carwash.jpg', brand:'Sparkle Auto', title:'Premium Wash', sub:'10% OFF', desc:'Foam wash and interior care', service:{provider:'Sparkle Auto Wash',name:'Premium Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {id:'salon', img:'/assets/ai-banner-glow-salon.jpg', brand:'Glow Salon & Spa', title:'Beauty Day', sub:'15% OFF', desc:'Salon and spa treatments', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {id:'cleaning', img:'/assets/ai-banner-home-cleaning.jpg', brand:'CleanPro Services', title:'Fresh Home', sub:'20% OFF', desc:'Professional home care', service:{provider:'CleanPro Services',name:'Deep Clean',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}},
]
const LOOP_ADS = [...ADS, ...ADS, ...ADS, ...ADS, ...ADS]

const HOME_OVERLAY_AD = {
  eyebrow: 'Today only',
  title: 'Fresh Home Reset',
  desc: 'Book CleanPro deep cleaning and get 20% off professional home care.',
  cta: 'Book Deep Clean',
  img: '/assets/ai-banner-home-cleaning.jpg',
  service: {provider:'CleanPro Services',name:'Deep Clean',price:'160.00',providerBg:'bg-teal-500',providerEmoji:'CP',providerImage:'/assets/ai-avatar-cleanpro.jpg',heroImg:'/assets/ai-banner-home-cleaning.jpg'}
}

const HOME_CATS = [
  {id:'digital', label:'Digital', img:'/assets/ai-homecat-digital.png'},
  {id:'education', label:'Education', img:'/assets/ai-homecat-education.png'},
  {id:'car', label:'Car', img:'/assets/cat-car-services-user-exact.png'},
  {id:'home', label:'Home', img:'/assets/ai-homecat-home_services.png'},
  {id:'delivery', label:'Deliveries', img:'/assets/ai-homecat-delivery.png'},
  {id:'pets', label:'Pets', img:'/assets/ai-homecat-pets.png'},
  {id:'salon', label:'Salon & Spa', img:'/assets/ai-homecat-salon.png'},
  {id:'marketplace', label:'Marketplace', img:'/assets/ai-homecat-market.png'},
  {id:'more', label:'More', img:'/assets/ai-homecat-more-v2.svg'},
]

const FEATURED = [
  {provider:'Scrubs', name:'Scrubs Cleaning', tag:'Home Services', from:'160.00 QR', rating:'4.8', reviews:'120', dist:'11.84 KM', img:'/assets/scrubs-hero.png', bg:'bg-red-50', imgFit:'object-cover object-top', service:{provider:'Scrubs Cleaning',name:'General Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {provider:'Sparkle Auto', name:'Sparkle Car Wash', tag:'Car Services', from:'45.00 QR', rating:'4.7', reviews:'98', dist:'3.2 KM', img:'/assets/ai-profile-sparkle-carwash.jpg', bg:'bg-blue-50', imgFit:'object-cover object-center', service:{provider:'Sparkle Auto Wash',name:'Premium Wash',price:'75.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {provider:'Glow Spa', name:'Glow Salon & Spa', tag:'Salon & Spa', from:'120.00 QR', rating:'4.9', reviews:'215', dist:'5.1 KM', img:'/assets/ai-profile-glow-salon.jpg', bg:'bg-pink-50', imgFit:'object-cover object-top', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {provider:'FreshFold', name:'FreshFold Laundry', tag:'Laundry', from:'35.00 QR', rating:'4.8', reviews:'126', dist:'2.8 KM', img:'/assets/ai-provider-freshfold-real-wallpaper.png', bg:'bg-sky-50', imgFit:'object-cover object-center', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
  {provider:'ByteCare', name:'ByteCare Digital', tag:'Digital', from:'65.00 QR', rating:'4.8', reviews:'134', dist:'Online', img:'/assets/ai-provider-bytecare-digital.png', bg:'bg-cyan-50', imgFit:'object-cover object-center', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {provider:'PixelNest', name:'PixelNest Studio', tag:'Digital', from:'180.00 QR', rating:'4.9', reviews:'88', dist:'Online', img:'/assets/ai-provider-pixelnest-studio.png', bg:'bg-violet-50', imgFit:'object-cover object-center', service:{provider:'PixelNest Studio',name:'Website Starter',price:'180.00',providerBg:'bg-violet-500',providerEmoji:'PN',providerImage:'/assets/ai-provider-pixelnest-studio.png',heroImg:'/assets/ai-provider-pixelnest-studio.png'}},
  {provider:'BrightPath', name:'BrightPath Tutors', tag:'Education', from:'95.00 QR', rating:'4.8', reviews:'112', dist:'Online', img:'/assets/ai-provider-brightpath-tutors.png', bg:'bg-amber-50', imgFit:'object-cover object-center', service:{provider:'BrightPath Tutors',name:'Math Tutoring',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
  {provider:'Summit Learning', name:'Summit Learning Hub', tag:'Education', from:'110.00 QR', rating:'4.9', reviews:'76', dist:'Online', img:'/assets/ai-provider-summit-learning.png', bg:'bg-emerald-50', imgFit:'object-cover object-center', service:{provider:'Summit Learning Hub',name:'Exam Prep Session',price:'110.00',providerBg:'bg-emerald-500',providerEmoji:'SL',providerImage:'/assets/ai-provider-summit-learning.png',heroImg:'/assets/ai-provider-summit-learning.png'}},
  {provider:'QuickFix', name:'QuickFix Maintenance', tag:'Maintenance', from:'90.00 QR', rating:'4.8', reviews:'156', dist:'4.4 KM', img:'/assets/ai-avatar-quickfix.jpg', bg:'bg-emerald-50', imgFit:'object-cover object-center', service:{provider:'QuickFix Maintenance',name:'Plumbing Visit',price:'90.00',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg'}},
  {provider:'Luxe Beauty', name:'Luxe Beauty Lounge', tag:'Salon & Spa', from:'80.00 QR', rating:'4.8', reviews:'143', dist:'3.8 KM', img:'/assets/ai-avatar-luxe.jpg', bg:'bg-rose-50', imgFit:'object-cover object-center', service:{provider:'Luxe Beauty Lounge',name:'Hair Styling',price:'80.00',providerBg:'bg-rose-500',providerEmoji:'LB',providerImage:'/assets/ai-avatar-luxe.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {provider:'Doha Swift', name:'Doha Swift Delivery', tag:'Deliveries', from:'40.00 QR', rating:'4.7', reviews:'102', dist:'2.6 KM', img:'/assets/ai-homecat-delivery.png', bg:'bg-blue-50', imgFit:'object-contain object-center', service:{provider:'Doha Swift Delivery',name:'Same-day Delivery',price:'40.00',providerBg:'bg-blue-500',providerEmoji:'DS',providerImage:'/assets/ai-homecat-delivery.png',heroImg:'/assets/ai-homecat-delivery.png'}},
]

const DEALS = [
  {title:'Deep Cleaning', provider:'Scrubs', offer:'25% OFF', price:'180 QR', rating:'4.7 (128)', img:'/assets/ai-banner-home-cleaning.jpg', service:{provider:'Scrubs Cleaning',name:'Deep Cleaning',price:'240.00',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',heroImg:'/assets/scrubs-booking-hero-clean.png'}},
  {title:'Car Wash', provider:'Sparkle Auto', offer:'30% OFF', price:'35 QR', rating:'4.6 (98)', img:'/assets/ai-banner-sparkle-carwash.jpg', service:{provider:'Sparkle Auto Wash',name:'Basic Wash',price:'45.00',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',heroImg:'/assets/ai-banner-sparkle-carwash.jpg'}},
  {title:'Tutoring', provider:'BrightPath', offer:'20% OFF', price:'120 QR', rating:'4.8 (215)', img:'/assets/ai-provider-brightpath-tutors.png', service:{provider:'BrightPath Tutors',name:'Math Tutoring',price:'95.00',providerBg:'bg-amber-500',providerEmoji:'BT',providerImage:'/assets/ai-provider-brightpath-tutors.png',heroImg:'/assets/ai-provider-brightpath-tutors.png'}},
  {title:'Salon Package', provider:'Glow Spa', offer:'15% OFF', price:'120 QR', rating:'4.9 (215)', img:'/assets/ai-banner-glow-salon.jpg', service:{provider:'Glow Salon & Spa',name:'Salon & Spa Package',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'GS',providerImage:'/assets/ai-profile-glow-salon.jpg',heroImg:'/assets/ai-banner-glow-salon.jpg'}},
  {title:'Device Setup', provider:'ByteCare', offer:'15% OFF', price:'65 QR', rating:'4.8 (134)', img:'/assets/ai-provider-bytecare-digital.png', service:{provider:'ByteCare Digital',name:'Device Setup',price:'65.00',providerBg:'bg-cyan-500',providerEmoji:'BD',providerImage:'/assets/ai-provider-bytecare-digital.png',heroImg:'/assets/ai-provider-bytecare-digital.png'}},
  {title:'Wash & Fold', provider:'FreshFold', offer:'10% OFF', price:'35 QR', rating:'4.8 (126)', img:'/assets/ai-provider-freshfold-real-wallpaper.png', service:{provider:'FreshFold Laundry',name:'Wash & Fold',price:'35.00',providerBg:'bg-sky-500',providerEmoji:'FL',providerImage:'/assets/ai-provider-freshfold-real-logo.png',heroImg:'/assets/ai-provider-freshfold-real-wallpaper.png'}},
]

const POPULAR_PROVIDERS = [
  {name:'Scrubs', rating:'4.8', img:'/assets/scrubs-leaf-logo-clean.png', service:FEATURED[0].service},
  {name:'Sparkle Auto', rating:'4.7', img:'/assets/ai-profile-sparkle-carwash.jpg', service:FEATURED[1].service},
  {name:'Glow Spa', rating:'4.9', img:'/assets/ai-profile-glow-salon.jpg', service:FEATURED[2].service},
  {name:'FreshFold', rating:'4.8', img:'/assets/ai-provider-freshfold-real-logo.png', service:FEATURED[3].service},
  {name:'ByteCare', rating:'4.8', img:'/assets/ai-provider-bytecare-digital.png', service:FEATURED[4].service},
  {name:'BrightPath', rating:'4.8', img:'/assets/ai-provider-brightpath-tutors.png', service:FEATURED[6].service},
  {name:'QuickFix', rating:'4.8', img:'/assets/ai-avatar-quickfix.jpg', service:FEATURED[8].service},
  {name:'Luxe Beauty', rating:'4.8', img:'/assets/ai-avatar-luxe.jpg', service:FEATURED[9].service},
  {name:'Doha Swift', rating:'4.7', img:'/assets/ai-homecat-delivery.png', service:FEATURED[10].service},
]

const DISCOVERY_FILTERS = ['Available today','Verified','Brings equipment']

const OFFER_EVENTS = [
  {kicker:'Available today', title:'Home care bundles', desc:'Cleaning, laundry, and AC support in one smooth plan.', img:'/assets/ai-banner-home-cleaning.jpg', service:FEATURED[0].service},
  {kicker:'Verified pros', title:'Car refresh week', desc:'Foam wash, polish, and interior care from Sparkle Auto.', img:'/assets/ai-banner-sparkle-carwash.jpg', service:FEATURED[1].service},
  {kicker:'Online help', title:'Digital setup desk', desc:'Device setup, backups, and website launch support.', img:'/assets/ai-provider-bytecare-digital.png', service:FEATURED[4].service},
]

const HOME_AD_SESSION_KEY = 'helpy_home_overlay_ad_seen'
const SEARCH_PROMPTS = ['Cleaning Services', 'Car Wash', 'Salon & Spa', 'Laundry', 'Digital Help', 'Tutoring']

export default function HomePage() {
  const { navigate, pendingReview, clearPendingReview } = useNav()
  const [activeDiscoveryFilters, setActiveDiscoveryFilters] = useState<string[]>([])
  const [ratingSort, setRatingSort] = useState<'none' | 'desc' | 'asc'>('none')
  const [priceSort, setPriceSort] = useState<'none' | 'desc' | 'asc'>('none')
  const [showDiscoverySort, setShowDiscoverySort] = useState(false)
  const [showOverlayAd, setShowOverlayAd] = useState(false)
  const [activeAd, setActiveAd] = useState(ADS.length * 2)
  const [searchPrompt, setSearchPrompt] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement | null>(null)
  const adScrollerRef = useRef<HTMLDivElement | null>(null)
  const adAnimationRef = useRef<number | null>(null)
  const isAnimatingAdRef = useRef(false)
  const realActiveAd = ((activeAd % ADS.length) + ADS.length) % ADS.length

  const normalizeAdIndex = (index: number) => ADS.length * 2 + (((index % ADS.length) + ADS.length) % ADS.length)

  const syncAdFromScroll = () => {
    const scroller = adScrollerRef.current
    if (!scroller?.children.length) return activeAd
    const children = Array.from(scroller.children) as HTMLElement[]
    const nearest = children.reduce((best, child, index) => {
      const currentDistance = Math.abs(child.offsetLeft - scroller.scrollLeft)
      const bestDistance = Math.abs(children[best].offsetLeft - scroller.scrollLeft)
      return currentDistance < bestDistance ? index : best
    }, 0)
    setActiveAd(nearest)
    return nearest
  }

  const scrollToAd = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = adScrollerRef.current
    const target = scroller?.children[index] as HTMLElement | undefined
    if (!scroller || !target) return

    if (adAnimationRef.current) window.cancelAnimationFrame(adAnimationRef.current)

    if (behavior === 'auto') {
      scroller.scrollLeft = target.offsetLeft
      setActiveAd(index)
      return
    }

    const start = scroller.scrollLeft
    const end = target.offsetLeft
    const distance = end - start
    const duration = 720
    const startedAt = performance.now()
    isAnimatingAdRef.current = true

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      scroller.scrollLeft = start + distance * eased
      syncAdFromScroll()

      if (progress < 1) {
        adAnimationRef.current = window.requestAnimationFrame(animate)
        return
      }

      const reset = index < ADS.length || index >= ADS.length * 4 ? normalizeAdIndex(index) : index
      scroller.scrollLeft = (scroller.children[reset] as HTMLElement).offsetLeft
      setActiveAd(reset)
      isAnimatingAdRef.current = false
      adAnimationRef.current = null
    }

    adAnimationRef.current = window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    const closeSortOnOutsideClick = (event: MouseEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setShowDiscoverySort(false)
      }
    }
    document.addEventListener('mousedown', closeSortOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeSortOnOutsideClick)
  }, [])

  useEffect(() => {
    if (window.sessionStorage.getItem(HOME_AD_SESSION_KEY)) return
    window.sessionStorage.setItem(HOME_AD_SESSION_KEY, 'true')
    setShowOverlayAd(true)
  }, [])

  useEffect(() => {
    if (!pendingReview) return
    setShowOverlayAd(false)
    setReviewRating(0)
    setReviewComment('')
    setReviewSubmitted(false)
  }, [pendingReview])

  useEffect(() => {
    scrollToAd(ADS.length * 2, 'auto')
  }, [])

  useEffect(() => {
    const delay = ADS[realActiveAd]?.id === 'city' ? 3000 : 1500
    const timer = window.setTimeout(() => {
      const next = activeAd + 1
      scrollToAd(next)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [activeAd, realActiveAd])

  useEffect(() => {
    let promptIndex = 0
    let charIndex = 0
    let deleting = false
    let timeout: number

    const tick = () => {
      const current = SEARCH_PROMPTS[promptIndex]
      setSearchPrompt(current.slice(0, charIndex))

      if (!deleting && charIndex < current.length) {
        charIndex += 1
        timeout = window.setTimeout(tick, 72)
        return
      }

      if (!deleting && charIndex === current.length) {
        deleting = true
        timeout = window.setTimeout(tick, 950)
        return
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1
        timeout = window.setTimeout(tick, 38)
        return
      }

      deleting = false
      promptIndex = (promptIndex + 1) % SEARCH_PROMPTS.length
      timeout = window.setTimeout(tick, 240)
    }

    timeout = window.setTimeout(tick, 250)
    return () => window.clearTimeout(timeout)
  }, [])
  const toggleDiscoveryFilter = (filter: string) => {
    setActiveDiscoveryFilters(filters =>
      filters.includes(filter) ? filters.filter(item => item !== filter) : [...filters, filter]
    )
  }

  const visibleFeatured = FEATURED.filter(f => {
    if (activeDiscoveryFilters.includes('Available today') && f.dist === 'Online') return false
    if (activeDiscoveryFilters.includes('Verified') && Number.parseFloat(f.rating) < 4.8) return false
    if (activeDiscoveryFilters.includes('Brings equipment') && !['Scrubs Cleaning','FreshFold Laundry','Sparkle Car Wash'].includes(f.name)) return false
    return true
  }).sort((a,b) => {
    if (ratingSort !== 'none') {
      const diff = Number.parseFloat(a.rating) - Number.parseFloat(b.rating)
      if (diff !== 0) return ratingSort === 'desc' ? -diff : diff
    }
    if (priceSort !== 'none') {
      const diff = Number.parseFloat(a.from) - Number.parseFloat(b.from)
      if (diff !== 0) return priceSort === 'desc' ? -diff : diff
    }
    return 0
  })

  const activeSortCount = Number(ratingSort !== 'none') + Number(priceSort !== 'none')
  const submitServiceReview = () => {
    if (!reviewRating || !pendingReview) return
    setReviewSubmitted(true)
    window.setTimeout(() => clearPendingReview(), 900)
  }

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[#d8edff]">
      <img
        src="/assets/home-wave-background-extra-light-preview.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
      />
      <StatusBar />
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-28">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#ffd34d] to-[#f7b90f] flex items-center justify-center shadow-sm shrink-0">
              <User size={28} className="text-[#0967ff]" fill="#0967ff" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] leading-4 font-bold text-[#6d7192]">Hi, Siraj Sayed</p>
              <h1 className="text-[23px] leading-6 font-black text-black truncate">Welcome to Helpy</h1>
            </div>
          </div>
          <button onClick={()=>navigate('notifications')} className="relative w-10 h-10 rounded-[16px] bg-white shadow-md flex items-center justify-center shrink-0">
            <Bell size={20}/>
            <span className="absolute right-2.5 top-2.5 w-2 h-2 bg-[#0967ff] rounded-full"/>
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
          <button onClick={()=>navigate('location')} className="min-w-0 h-[42px] rounded-[21px] bg-white shadow-sm flex items-center gap-2.5 px-3.5 text-left">
            <span className="relative w-7 h-7 rounded-full bg-[#fff3bf] flex items-center justify-center shrink-0 shadow-sm">
              <MapPin size={19} className="text-[#0967ff] fill-[#0967ff]"/>
              <span className="absolute top-[8px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ffd43b] border border-white"/>
            </span>
            <span className="flex-1 truncate text-[14px] font-semibold">Viva Bahriya 10, The Pearl-Qatar</span>
            <ChevronDown size={18} className="shrink-0"/>
          </button>
          <button onClick={()=>navigate('wallet')} className="h-[42px] rounded-[21px] bg-white border border-[#8cbcff] text-[#0967ff] font-black text-[12px] flex items-center gap-2 px-3.5 whitespace-nowrap">
            <Wallet size={17}/>Wallet
          </button>
        </div>

        <div className="mt-3">
          <div className="h-[42px] rounded-[21px] bg-white shadow-sm flex items-center gap-2.5 px-4 min-w-0">
            <Search size={21} className="shrink-0 text-[#111827]"/>
            <input className="bg-transparent outline-none flex-1 min-w-0 text-[14px] placeholder:text-[#73789b]" placeholder={searchPrompt ? `Search for ${searchPrompt}...` : 'Search for...'}/>
          </div>
        </div>

        <div
          ref={adScrollerRef}
          onScroll={(e)=>{
            const el = e.currentTarget
            if (isAnimatingAdRef.current) return
            const next = syncAdFromScroll()
            if (next < ADS.length || next >= ADS.length * 4) {
              const reset = normalizeAdIndex(next)
              window.requestAnimationFrame(()=>scrollToAd(reset, 'auto'))
            }
          }}
          className="mt-3 overflow-x-auto snap-x snap-mandatory flex gap-3 no-scrollbar"
        >
          {LOOP_ADS.map((ad,index)=> (
            <button key={`${ad.id}-${index}`} onClick={()=>navigate(ad.id === 'city' ? 'all-services' : 'service-detail', ad.id === 'city' ? undefined : ad.service)} className="relative shrink-0 snap-center w-full h-[166px] max-[360px]:h-[150px] rounded-[20px] overflow-hidden text-left shadow-sm bg-white">
              <img
                src={ad.img}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: ad.id === 'city' ? 'center' : 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/76 to-white/5"/>
              <div className="relative h-full p-4 text-[#07133d]">
                <p className="text-[23px] max-[360px]:text-[21px] leading-[26px] max-[360px]:leading-[23px] font-black">{ad.title}</p>
                <p className="text-[23px] max-[360px]:text-[21px] leading-[26px] max-[360px]:leading-[23px] font-black">{ad.sub}</p>
                <p className="mt-2 max-w-[185px] text-[13px] max-[360px]:text-[12px] leading-[17px] font-bold text-[#36415c]">{ad.desc}</p>
                <span className="absolute left-4 bottom-3 inline-flex px-3.5 py-1.5 rounded-[14px] bg-[#0967ff] text-white text-[12px] font-black shadow-lg shadow-blue-200">Book Now</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {ADS.map((ad,i)=>(
            <button
              key={ad.id}
              onClick={()=>{
                const target = ADS.length * 2 + i
                scrollToAd(target)
              }}
              className={`${realActiveAd===i?'w-2.5 bg-[#0967ff]':'w-2.5 bg-white'} h-2.5 rounded-full transition-all`}
              aria-label={`Show banner ${i+1}`}
            />
          ))}
        </div>

        <SectionTitle title="Categories" onClick={()=>navigate('categories')} compact />
        <div className="grid grid-cols-4 gap-2.5 max-[360px]:gap-2">
          {HOME_CATS.map(c=>(
            <button key={c.id} onClick={()=>c.id==='more'?navigate('categories'):navigate('category-services',{id:c.id,label:c.label})} className="h-[94px] max-[360px]:h-[86px] bg-white rounded-[18px] shadow-sm flex flex-col items-center justify-center gap-1.5 max-[360px]:gap-1 px-1 active:scale-95 transition overflow-hidden">
              <div className="w-[92px] h-[68px] max-[360px]:w-[72px] max-[360px]:h-[56px] flex items-center justify-center overflow-hidden">
                <img src={c.img} className="w-full h-full object-contain"/>
              </div>
              <p className="text-[12px] max-[360px]:text-[11px] leading-[14px] max-[360px]:leading-[12px] font-bold text-center text-[#111827] line-clamp-2">{c.label}</p>
            </button>
          ))}
        </div>

        <SectionTitle title="Deals for you" onClick={()=>navigate('deals')} />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {DEALS.map(deal=>(
            <button key={deal.title} onClick={()=>navigate('service-detail',deal.service)} className="relative h-[118px] w-[142px] shrink-0 overflow-hidden rounded-[18px] bg-white text-left shadow-sm active:scale-[0.99] transition">
              <img src={deal.img} className="absolute left-0 top-0 h-[62px] w-full object-cover"/>
              <div className="absolute inset-x-0 top-0 h-[72px] bg-gradient-to-b from-white/0 via-white/15 to-white"/>
              <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-[#dfff2d] px-1.5 py-0.5 text-[9px] font-black text-[#1d2b00] shadow-sm">{deal.offer}</span>
              <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
                <p className="truncate text-[12px] font-black text-[#10152f]">{deal.title}</p>
                <p className="text-[10px] text-[#65708a]">from <span className="font-black text-[#0967ff]">{deal.price}</span></p>
                <p className="mt-0.5 text-[10px] font-bold text-[#65708a]"><Star size={10} className="inline fill-yellow-400 text-yellow-400"/> {deal.rating}</p>
              </div>
            </button>
          ))}
        </div>

        <SectionTitle title="Offers & Events" onClick={()=>navigate('offers-events')} />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {OFFER_EVENTS.map(item=>(
            <button key={item.title} onClick={()=>navigate('service-detail',item.service)} className="relative h-[116px] w-[252px] shrink-0 overflow-hidden rounded-[20px] bg-white text-left shadow-sm active:scale-[0.99] transition">
              <img src={item.img} className="absolute inset-0 h-full w-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/16"/>
              <div className="relative h-full p-3.5">
                <div className="max-w-[160px]">
                  <p className="inline-flex rounded-full bg-[#dfff2d] px-2 py-0.5 text-[9px] font-black text-[#1d2b00]">{item.kicker}</p>
                  <p className="mt-2 text-[16px] leading-[18px] font-black text-[#07133d]">{item.title}</p>
                  <p className="mt-1 text-[10px] leading-[13px] font-black text-[#3f4a63]">{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <SectionTitle title="Popular providers" onClick={()=>navigate('providers')} />
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {POPULAR_PROVIDERS.map(p=>(
            <button key={p.name} onClick={()=>navigate('service-detail',p.service)} className="w-[88px] shrink-0 rounded-[18px] bg-white p-2 text-center shadow-sm active:scale-95 transition">
              <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#f4faff]">
                <img src={p.img} className="h-full w-full object-contain"/>
              </div>
              <p className="mt-1.5 truncate text-[11px] font-black text-[#10152f]">{p.name}</p>
              <p className="text-[10px] font-bold text-[#65708a]"><Star size={10} className="inline fill-yellow-400 text-yellow-400"/> {p.rating}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 mb-2 flex items-center justify-between gap-3">
          <h2 className="min-w-0 whitespace-nowrap text-[23px] max-[360px]:text-[21px] font-black text-black">Featured Services</h2>
          <div ref={sortMenuRef} className="relative shrink-0">
            <button
              onClick={()=>setShowDiscoverySort(v=>!v)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[17px] bg-white px-3 max-[360px]:px-2.5 text-[12px] max-[360px]:text-[11px] font-black text-[#10152f] shadow-sm active:scale-95 transition"
            >
              <ArrowDownUp size={15} className="text-[#0967ff]" />
              Sort
              <span className="max-w-[62px] truncate text-[#65708a]">
                {activeSortCount === 0 ? 'Default' : `${activeSortCount} active`}
              </span>
              <ChevronDown size={15} className={`transition ${showDiscoverySort ? 'rotate-180' : ''}`} />
            </button>
          {showDiscoverySort && (
            <div className="absolute right-0 top-11 z-30 w-[292px] rounded-[20px] bg-white p-3 shadow-xl ring-1 ring-black/5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-black text-[#10152f]">Sort featured services</p>
                <button
                  onClick={()=>{
                    setRatingSort('none')
                    setPriceSort('none')
                    setShowDiscoverySort(false)
                  }}
                  className="text-[12px] font-black text-[#0967ff]"
                >
                  Reset
                </button>
              </div>
              <SortOption
                title="Rating"
                value={ratingSort}
                onChange={setRatingSort}
                highLabel="High to Low"
                lowLabel="Low to High"
              />
              <SortOption
                title="Pricing"
                value={priceSort}
                onChange={setPriceSort}
                highLabel="High to Low"
                lowLabel="Low to High"
              />
              <button
                onClick={()=>setShowDiscoverySort(false)}
                className="mt-2 h-9 w-full rounded-[15px] bg-[#0967ff] text-[12px] font-black text-white shadow-sm active:scale-[0.98] transition"
              >
                Done
              </button>
            </div>
          )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {DISCOVERY_FILTERS.map(filter=>(
            <button key={filter} onClick={()=>toggleDiscoveryFilter(filter)} className={`shrink-0 h-9 rounded-[17px] px-3.5 text-[12px] font-black shadow-sm transition ${activeDiscoveryFilters.includes(filter)?'bg-[#0967ff] text-white':'bg-white text-[#10152f]'}`}>
              {(filter === 'Verified' || filter === 'Brings equipment') && (
                <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-[5px] align-[-3px] ${activeDiscoveryFilters.includes(filter) ? 'bg-white text-[#0967ff]' : 'bg-[#eef5ff] text-transparent ring-1 ring-[#c9dcff]'}`}>
                  <Check size={12} strokeWidth={3}/>
                </span>
              )}
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3 mt-1">
          {visibleFeatured.map(f=>(
            <button key={f.name} onClick={()=>navigate('service-detail',f.service)} className="w-full bg-white rounded-[20px] shadow-sm p-2 flex items-center text-left active:scale-[0.99] transition">
              <div className={`relative w-[116px] h-[88px] max-[360px]:w-[102px] max-[360px]:h-[78px] rounded-[16px] shrink-0 ${f.bg} flex items-center justify-center overflow-hidden`}>
                <img src={f.img} className={`w-full h-full ${f.imgFit}`}/>
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
                  <Bookmark size={15}/>
                </span>
              </div>
              <div className="flex-1 pl-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] max-[360px]:text-[14px] leading-5 font-black text-[#10152f]">{f.name}</p>
                    <span className="mt-1 inline-block rounded-lg bg-[#e8f2ff] px-2.5 py-0.5 text-[#0967ff] text-[11px] font-bold">{f.tag}</span>
                  </div>
                  <span className="shrink-0 rounded-[14px] bg-[#0967ff] px-4 max-[360px]:px-3 py-2 text-[12px] font-black text-white">Book</span>
                </div>
                <p className="mt-1.5 text-[11px] text-[#65708a]"><Star size={12} className="inline fill-yellow-400 text-yellow-400"/> {f.rating} ({f.reviews}) <MapPin size={11} className="ml-1 inline"/> {f.dist}</p>
                <p className="mt-1 text-[11px] text-[#65708a]">from</p>
                <p className="text-[18px] leading-5 font-black text-[#0967ff]">{f.from}</p>
                </div>
            </button>
          ))}
          {visibleFeatured.length === 0 && (
            <button onClick={()=>setActiveDiscoveryFilters([])} className="w-full rounded-[22px] bg-white py-8 text-center text-[14px] font-bold text-[#0967ff] shadow-sm">
              No matches. Clear filter
            </button>
          )}
        </div>
      </div>
      {pendingReview && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-[3px]">
          <div className="relative w-full max-w-[360px] rounded-[30px] bg-white p-5 text-center shadow-[0_28px_70px_rgba(15,23,42,0.32)]">
            <button
              onClick={clearPendingReview}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f8ff] text-[#10152f]"
              aria-label="Close review prompt"
            >
              <X size={18}/>
            </button>

            <div className={`mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] ${pendingReview.providerBg || 'bg-[#0967ff]'} text-white shadow-lg shadow-blue-100`}>
              {pendingReview.providerImage ? (
                <img src={pendingReview.providerImage} alt="" className="h-full w-full object-cover"/>
              ) : (
                <span className="text-2xl font-black">{pendingReview.providerEmoji || 'H'}</span>
              )}
            </div>

            <p className="mt-4 text-[12px] font-black uppercase tracking-[0.18em] text-[#0967ff]">Service completed</p>
            <h3 className="mt-1 text-[25px] leading-7 font-black text-[#07133d]">Review your service</h3>
            <p className="mt-2 text-[13px] leading-5 font-semibold text-[#65708a]">
              How was your {pendingReview.service} with <span className="text-[#10152f]">{pendingReview.provider}</span>?
            </p>

            <div className="mt-5 flex justify-center gap-2">
              {[1,2,3,4,5].map(star=>(
                <button
                  key={star}
                  onClick={()=>setReviewRating(star)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition active:scale-95 ${reviewRating >= star ? 'bg-yellow-50 text-yellow-400' : 'bg-[#f4f8ff] text-[#c6d2e5]'}`}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star size={26} className={reviewRating >= star ? 'fill-yellow-400' : ''}/>
                </button>
              ))}
            </div>

            <textarea
              value={reviewComment}
              onChange={(e)=>setReviewComment(e.target.value)}
              placeholder="Leave a comment optional"
              className="mt-5 h-24 w-full resize-none rounded-[20px] bg-[#f4f8ff] px-4 py-3 text-left text-[13px] font-semibold text-[#10152f] outline-none placeholder:text-[#8a95aa]"
            />

            <button
              onClick={submitServiceReview}
              disabled={!reviewRating || reviewSubmitted}
              className={`mt-4 h-12 w-full rounded-[18px] text-[14px] font-black shadow-sm transition active:scale-[0.98] ${reviewRating && !reviewSubmitted ? 'bg-[#0967ff] text-white shadow-blue-200' : 'bg-[#dbe6f7] text-[#8a95aa]'}`}
            >
              {reviewSubmitted ? 'Thanks for your review' : 'Submit review'}
            </button>
            <button
              onClick={clearPendingReview}
              className="mt-3 text-[13px] font-black text-[#65708a]"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
      {showOverlayAd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 backdrop-blur-[2px]">
          <div
            role="button"
            tabIndex={0}
            onClick={()=>navigate('service-detail', HOME_OVERLAY_AD.service)}
            onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') navigate('service-detail', HOME_OVERLAY_AD.service) }}
            className="relative w-full max-w-[360px] overflow-hidden rounded-[28px] bg-white text-left shadow-[0_24px_60px_rgba(15,23,42,0.30)] active:scale-[0.99] transition"
          >
            <button
              onClick={(e)=>{e.stopPropagation(); setShowOverlayAd(false)}}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md"
              aria-label="Close ad"
            >
              <X size={19}/>
            </button>
            <div className="relative h-[190px] overflow-hidden">
              <img src={HOME_OVERLAY_AD.img} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-14 text-white">
                <p className="inline-flex rounded-full bg-[#0967ff] px-3 py-1 text-[11px] font-black uppercase tracking-wide">{HOME_OVERLAY_AD.eyebrow}</p>
                <h3 className="mt-2 text-[25px] leading-7 font-black">{HOME_OVERLAY_AD.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[13px] leading-5 font-semibold text-[#5f6780]">{HOME_OVERLAY_AD.desc}</p>
              <span className="mt-4 flex h-12 items-center justify-center rounded-[17px] bg-[#0967ff] text-[15px] font-black text-white shadow-lg shadow-blue-200">
                {HOME_OVERLAY_AD.cta}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SortOption({
  title,
  value,
  onChange,
  highLabel,
  lowLabel
}: {
  title: string
  value: 'none' | 'desc' | 'asc'
  onChange: (value: 'none' | 'desc' | 'asc') => void
  highLabel: string
  lowLabel: string
}) {
  const enabled = value !== 'none'

  return (
    <div className="mb-2 rounded-[16px] bg-[#f5f9ff] p-2">
      <button
        onClick={()=>onChange(enabled ? 'none' : 'desc')}
        className="flex w-full items-center justify-between px-1 pb-2 text-left"
      >
        <span className="text-[13px] font-black text-[#10152f]">{title}</span>
        <span className={`flex h-5 w-5 items-center justify-center rounded-[7px] ${enabled ? 'bg-[#0967ff] text-white' : 'bg-white text-transparent ring-1 ring-[#c9dcff]'}`}>
          <Check size={13} strokeWidth={3}/>
        </span>
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={()=>onChange('desc')}
          className={`h-8 rounded-[12px] text-[11px] font-black transition ${value === 'desc' ? 'bg-[#0967ff] text-white shadow-sm' : 'bg-white text-[#65708a]'}`}
        >
          {highLabel}
        </button>
        <button
          onClick={()=>onChange('asc')}
          className={`h-8 rounded-[12px] text-[11px] font-black transition ${value === 'asc' ? 'bg-[#0967ff] text-white shadow-sm' : 'bg-white text-[#65708a]'}`}
        >
          {lowLabel}
        </button>
      </div>
    </div>
  )
}

function SectionTitle({title,onClick,compact=false,hideAction=false}:{title:string;onClick:()=>void;compact?:boolean;hideAction?:boolean}) {
  return (
    <div className={`flex items-center justify-between ${compact ? 'mt-1.5 mb-2.5' : 'mt-3 mb-3'}`}>
      <h2 className="text-[23px] font-black text-black">{title}</h2>
      {!hideAction && <button onClick={onClick} className="flex items-center gap-1 text-[#0967ff] text-[15px] font-bold">View all <ChevronRight size={18}/></button>}
    </div>
  )
}
