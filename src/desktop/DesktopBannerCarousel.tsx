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
] as const

const LOOP_BANNERS = [...BANNERS, ...BANNERS, ...BANNERS, ...BANNERS, ...BANNERS]

export default function DesktopBannerCarousel({ navigate }: { navigate: Navigate }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const [active, setActive] = useState(BANNERS.length * 2)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches ? 3 : typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches ? 2 : 1)
  const normalizeIndex = (index: number) => BANNERS.length * 2 + (((index % BANNERS.length) + BANNERS.length) % BANNERS.length)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const tablet = window.matchMedia('(min-width: 1024px)')
    const sync = () => setVisible(desktop.matches ? 3 : tablet.matches ? 2 : 1)
    sync()
    desktop.addEventListener('change', sync)
    tablet.addEventListener('change', sync)
    return () => {
      desktop.removeEventListener('change', sync)
      tablet.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    BANNERS.forEach(banner => { const image = new Image(); image.src = banner.image })
  }, [])

  const scrollToBanner = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollerRef.current
    const target = scroller?.children[index] as HTMLElement | undefined
    if (!scroller || !target) return
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current)

    if (behavior === 'auto' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scroller.scrollLeft = target.offsetLeft
      setActive(index)
      return
    }

    const start = scroller.scrollLeft
    const end = target.offsetLeft
    const distance = end - start
    const duration = 720
    const startedAt = performance.now()
    isAnimatingRef.current = true

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      scroller.scrollLeft = start + distance * eased

      if (progress < 1) {
        animationRef.current = window.requestAnimationFrame(animate)
        return
      }

      const reset = index < BANNERS.length || index >= BANNERS.length * 4 ? normalizeIndex(index) : index
      scroller.scrollLeft = (scroller.children[reset] as HTMLElement).offsetLeft
      setActive(reset)
      isAnimatingRef.current = false
      animationRef.current = null
    }

    setActive(index)
    animationRef.current = window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    scrollToBanner(BANNERS.length * 2, 'auto')
    return () => { if (animationRef.current) window.cancelAnimationFrame(animationRef.current) }
  }, [])

  useEffect(() => {
    const normalized = normalizeIndex(active)
    window.requestAnimationFrame(() => scrollToBanner(normalized, 'auto'))
  }, [visible])

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => scrollToBanner(active + 1), 3600)
    return () => window.clearTimeout(timer)
  }, [active, paused])

  const move = (direction: number) => {
    if (!isAnimatingRef.current) scrollToBanner(active + direction)
  }

  const open = (banner: typeof BANNERS[number]) => {
    const [screen, params] = banner.target
    navigate(screen, params)
  }

  return <section
    className="group/carousel relative h-[230px] overflow-hidden sm:h-[250px] lg:h-[230px] xl:h-[236px]"
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
    <div ref={scrollerRef} className="banner-carousel-scroller grid h-full grid-flow-col auto-cols-[100%] gap-4 overflow-x-hidden bg-transparent lg:auto-cols-[calc((100%-1rem)/2)] xl:auto-cols-[calc((100%-2rem)/3)]">
      {LOOP_BANNERS.map((banner, index) => <button
        key={`${banner.id}-${index}`}
        onClick={() => open(banner)}
        className="group/banner relative h-full min-w-0 overflow-hidden rounded-[24px] bg-[#071b52] text-left shadow-lg shadow-blue-200/50"
        aria-label={`${banner.alt}. Open offer.`}
        aria-current={index === active ? 'true' : undefined}
        tabIndex={index >= active && index < active + visible ? 0 : -1}
      >
        <img
          src={banner.image}
          alt={banner.alt}
          draggable={false}
          fetchPriority={index >= BANNERS.length * 2 && index < BANNERS.length * 2 + 3 ? 'high' : 'auto'}
          className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none group-hover/banner:scale-[1.025]"
        />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15"/>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover/banner:opacity-100"/>
      </button>)}
    </div>

    <button onClick={() => move(-1)} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#071b52]/55 text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-[#071b52]/80 focus:opacity-100 group-hover/carousel:opacity-100" aria-label="Previous banner"><ChevronLeft size={22}/></button>
    <button onClick={() => move(1)} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#071b52]/55 text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-[#071b52]/80 focus:opacity-100 group-hover/carousel:opacity-100" aria-label="Next banner"><ChevronRight size={22}/></button>

  </section>
}
