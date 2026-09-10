import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Screen } from '../context/NavContext'

type Navigate = (screen: Screen, params?: any) => void

const BANNERS = [
  {
    id: 'foot-champz',
    image: '/assets/banner-foot-champz.jpeg',
    alt: 'Foot Champz football game and pitch booking',
    target: ['all-services', { query: 'football game' }],
  },
  {
    id: 'bubbleit',
    image: '/assets/banner-bubbleit-car-care.jpeg',
    alt: 'Bubbleit premium mobile car care',
    target: ['service-detail', { provider: 'Sparkle Auto Wash', name: 'Premium Wash', price: '75.00', providerBg: 'bg-blue-500', providerEmoji: 'SA', providerImage: '/assets/ai-profile-sparkle-carwash.jpg', heroImg: '/assets/ai-banner-sparkle-carwash.jpg' }],
  },
  {
    id: 'heritage-luxury',
    image: '/assets/banner-heritage-luxury.jpeg',
    alt: 'The Heritage luxury chauffeur, private aviation and concierge',
    target: ['service-detail', { provider: 'The Heritage', name: 'Flights & Hotels Package', price: '320.00', providerBg: 'bg-indigo-500', providerEmoji: 'TH', providerImage: '/assets/ai-banner-heritage.jpg', heroImg: '/assets/ai-banner-heritage.jpg' }],
  },
  {
    id: 'trendy-media',
    image: '/assets/banner-trendy-media.jpeg',
    alt: 'Trendy social media and production services',
    target: ['category-services', { id: 'visuals', label: 'Media' }],
  },
  {
    id: 'helpy-city',
    image: '/assets/doha-katara-crescent-hero.png',
    alt: 'Helpy services across Doha',
    target: ['all-services'],
  },
  {
    id: 'pwa-heritage',
    image: '/assets/ai-banner-heritage.jpg',
    alt: 'The Heritage travel offer',
    target: ['service-detail', { provider: 'The Heritage', name: 'Flights & Hotels Package', price: '320.00', providerBg: 'bg-indigo-500', providerEmoji: 'TH', providerImage: '/assets/ai-banner-heritage.jpg', heroImg: '/assets/ai-banner-heritage.jpg' }],
  },
  {
    id: 'pwa-carwash',
    image: '/assets/ai-banner-sparkle-carwash.jpg',
    alt: 'Sparkle Auto premium car wash offer',
    target: ['service-detail', { provider: 'Sparkle Auto Wash', name: 'Premium Wash', price: '75.00', providerBg: 'bg-blue-500', providerEmoji: 'SA', providerImage: '/assets/ai-profile-sparkle-carwash.jpg', heroImg: '/assets/ai-banner-sparkle-carwash.jpg' }],
  },
  {
    id: 'pwa-salon',
    image: '/assets/ai-banner-glow-salon.jpg',
    alt: 'Glow Salon and Spa beauty offer',
    target: ['service-detail', { provider: 'Glow Salon & Spa', name: 'Salon & Spa Package', price: '120.00', providerBg: 'bg-pink-500', providerEmoji: 'GS', providerImage: '/assets/ai-profile-glow-salon.jpg', heroImg: '/assets/ai-banner-glow-salon.jpg' }],
  },
  {
    id: 'pwa-cleaning',
    image: '/assets/ai-banner-home-cleaning.jpg',
    alt: 'CleanPro fresh home cleaning offer',
    target: ['service-detail', { provider: 'CleanPro Services', name: 'Deep Clean', price: '160.00', providerBg: 'bg-teal-500', providerEmoji: 'CP', providerImage: '/assets/ai-avatar-cleanpro.jpg', heroImg: '/assets/ai-banner-home-cleaning.jpg' }],
  },
] as const

export default function DesktopBannerCarousel({ navigate }: { navigate: Navigate }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches ? 2 : 1)
  const maxIndex = Math.max(0, BANNERS.length - visible)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const sync = () => setVisible(media.matches ? 2 : 1)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setActive(current => Math.min(current, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    BANNERS.forEach(banner => { const image = new Image(); image.src = banner.image })
  }, [])

  useEffect(() => {
    const target = scrollerRef.current?.children[active] as HTMLElement | undefined
    if (!target || !scrollerRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollerRef.current.scrollTo({ left: target.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [active, visible])

  useEffect(() => {
    if (paused || maxIndex === 0) return
    const timer = window.setInterval(() => setActive(current => current >= maxIndex ? 0 : current + 1), 5200)
    return () => window.clearInterval(timer)
  }, [maxIndex, paused])

  const move = (direction: number) => setActive(current => {
    const next = current + direction
    if (next < 0) return maxIndex
    if (next > maxIndex) return 0
    return next
  })

  const open = (banner: typeof BANNERS[number]) => {
    const [screen, params] = banner.target
    navigate(screen, params)
  }

  return <section
    className="group/carousel relative h-[250px] overflow-hidden rounded-[30px] bg-[#071b52] shadow-xl shadow-blue-200 sm:h-[285px] xl:h-[320px]"
    aria-roledescription="carousel"
    aria-label="Featured services and offers"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }}
  >
    <div ref={scrollerRef} className="banner-carousel-scroller grid h-full grid-flow-col auto-cols-[100%] gap-4 overflow-x-hidden lg:auto-cols-[calc((100%-1rem)/2)]">
      {BANNERS.map((banner, index) => <button
        key={banner.id}
        onClick={() => open(banner)}
        className="group/banner relative h-full min-w-0 overflow-hidden bg-[#071b52] text-left"
        aria-label={`${banner.alt}. Open offer.`}
        aria-current={index === active ? 'true' : undefined}
        tabIndex={index >= active && index < active + visible ? 0 : -1}
      >
        <img
          src={banner.image}
          alt={banner.alt}
          draggable={false}
          fetchPriority={index < 2 ? 'high' : 'auto'}
          className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none group-hover/banner:scale-[1.025]"
        />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15"/>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover/banner:opacity-100"/>
      </button>)}
    </div>

    <button onClick={() => move(-1)} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#071b52]/55 text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-[#071b52]/80 focus:opacity-100 group-hover/carousel:opacity-100" aria-label="Previous banner"><ChevronLeft size={22}/></button>
    <button onClick={() => move(1)} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#071b52]/55 text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-[#071b52]/80 focus:opacity-100 group-hover/carousel:opacity-100" aria-label="Next banner"><ChevronRight size={22}/></button>

    <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#071b52]/55 px-3 py-2 shadow-lg backdrop-blur-md" role="tablist" aria-label="Choose a banner">
      {Array.from({ length: maxIndex + 1 }, (_, index) => <button key={index} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all duration-500 ${active === index ? 'w-7 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`} role="tab" aria-selected={active === index} aria-label={`Show banner ${index + 1}`}/>)}
    </div>
    <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/15 bg-[#071b52]/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-white/90 opacity-0 backdrop-blur-md transition duration-300 group-hover/carousel:opacity-100">{paused ? 'Paused' : 'Featured'}</span>
  </section>
}
