import { ArrowRight, CheckCircle2, Clock3, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNav } from '../context/NavContext'

type Service = {
  provider: string
  name: string
  price: string
  providerBg: string
  providerEmoji: string
  providerImage?: string
  heroImg?: string
}

const categories = [
  { label: 'Home services', image: '/assets/ai-homecat-home_services.png', id: 'home' },
  { label: 'Cleaning', image: '/assets/cat-uniform-cleaning.png', id: 'cleaning' },
  { label: 'Car services', image: '/assets/cat-car-services-user-exact.png', id: 'car' },
  { label: 'Salon & spa', image: '/assets/ai-homecat-salon.png', id: 'salon' },
  { label: 'Laundry', image: '/assets/cat-uniform-laundry.png', id: 'laundry' },
  { label: 'Deliveries', image: '/assets/ai-homecat-delivery.png', id: 'delivery' },
]

const providers: Array<{ name: string; category: string; price: string; rating: string; image: string; service: Service }> = [
  { name: 'Scrubs Cleaning', category: 'Home Services', price: 'from QAR 160', rating: '4.8', image: '/assets/scrubs-booking-hero-clean.png', service: { provider: 'Scrubs Cleaning', name: 'General Cleaning', price: '160.00', providerBg: 'bg-red-500', providerEmoji: 'SC', providerImage: '/assets/scrubs-leaf-logo-clean.png', heroImg: '/assets/scrubs-booking-hero-clean.png' } },
  { name: 'Sparkle Auto Wash', category: 'Car Services', price: 'from QAR 45', rating: '4.7', image: '/assets/ai-profile-sparkle-carwash.jpg', service: { provider: 'Sparkle Auto Wash', name: 'Premium Wash', price: '75.00', providerBg: 'bg-blue-500', providerEmoji: 'SA', providerImage: '/assets/ai-profile-sparkle-carwash.jpg', heroImg: '/assets/ai-banner-sparkle-carwash.jpg' } },
  { name: 'Glow Salon & Spa', category: 'Salon & Spa', price: 'from QAR 120', rating: '4.9', image: '/assets/ai-profile-glow-salon.jpg', service: { provider: 'Glow Salon & Spa', name: 'Salon & Spa Package', price: '120.00', providerBg: 'bg-pink-500', providerEmoji: 'GS', providerImage: '/assets/ai-profile-glow-salon.jpg', heroImg: '/assets/ai-banner-glow-salon.jpg' } },
]

const searchSuggestions = ['Home cleaning', 'Car wash', 'Salon & spa', 'Laundry']

export default function WebsiteLanding() {
  const { navigate } = useNav()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const findService = () => navigate('all-services', { query })
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="website-shell min-h-screen overflow-x-hidden bg-[#fbfcff] text-[#111a38]">
      <header className="sticky top-0 z-40 border-b border-blue-100/70 bg-white/90 backdrop-blur-xl">
        <div className="website-wrap flex h-[76px] items-center justify-between gap-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-black tracking-tight text-[#0967ff]" aria-label="Helpy home">
            helpy<span className="text-[#111a38]">.</span>
          </button>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-bold text-slate-600 xl:flex">
            <button onClick={() => scrollTo('categories')} className="transition hover:text-[#0967ff]">Categories</button>
            <button onClick={() => scrollTo('providers')} className="transition hover:text-[#0967ff]">Top providers</button>
            <button onClick={() => navigate('deals')} className="transition hover:text-[#0967ff]">Deals</button>
            <button onClick={() => navigate('contact-us')} className="transition hover:text-[#0967ff]">Help centre</button>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <button onClick={() => navigate('login')} className="rounded-xl px-4 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50">Sign in</button>
            <button onClick={() => navigate('login')} className="rounded-xl bg-[#0967ff] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]">Get started</button>
          </div>
          <button onClick={() => setMenuOpen(open => !open)} className="rounded-xl p-2 text-[#111a38] xl:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && <div className="website-wrap flex flex-col gap-2 border-t border-blue-100 py-4 text-sm font-bold xl:hidden">
          <button onClick={() => { scrollTo('categories'); setMenuOpen(false) }} className="rounded-lg px-3 py-2 text-left">Categories</button>
          <button onClick={() => { scrollTo('providers'); setMenuOpen(false) }} className="rounded-lg px-3 py-2 text-left">Top providers</button>
          <button onClick={() => navigate('deals')} className="rounded-lg px-3 py-2 text-left">Deals</button>
          <button onClick={() => navigate('login')} className="rounded-lg bg-blue-50 px-3 py-2 text-left text-[#0967ff]">Sign in</button>
        </div>}
      </header>

      <main>
        <section className="website-wrap grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0967ff]"><MapPin size={14} /> Trusted services across Qatar</div>
            <h1 className="text-4xl font-black leading-[1.04] tracking-[-.05em] text-[#0a1537] sm:text-5xl xl:text-6xl">Everything you need, <span className="text-[#0967ff]">sorted.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Book trusted local professionals for home, car, beauty and everyday life—without the runaround.</p>
            <div className="mt-8 flex max-w-xl items-center rounded-2xl bg-white p-2 shadow-[0_16px_45px_rgba(36,101,207,.15)] ring-1 ring-blue-100 focus-within:ring-2 focus-within:ring-[#0967ff]">
              <Search className="ml-3 shrink-0 text-[#0967ff]" size={21} aria-hidden="true" />
              <input value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === 'Enter' && findService()} placeholder="What do you need help with?" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-slate-400" aria-label="Search services" />
              <button onClick={findService} className="rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0759df] sm:px-5">Search</button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><span>Popular:</span>{searchSuggestions.map(suggestion => <button key={suggestion} onClick={() => { setQuery(suggestion); navigate('all-services', { query: suggestion }) }} className="rounded-full border border-blue-100 bg-white px-3 py-1.5 transition hover:border-blue-300 hover:text-[#0967ff]">{suggestion}</button>)}</div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-600"><span className="flex items-center gap-1.5"><CheckCircle2 size={17} className="text-[#0967ff]" />Verified providers</span><span className="flex items-center gap-1.5"><CheckCircle2 size={17} className="text-[#0967ff]" />Clear pricing</span><span className="flex items-center gap-1.5"><CheckCircle2 size={17} className="text-[#0967ff]" />Simple booking</span></div>
          </div>
          <div className="relative overflow-hidden rounded-[30px] bg-[#dcecff] shadow-2xl shadow-blue-200/50">
            <img src="/assets/doha-katara-crescent-hero.png" alt="Doha waterfront" className="h-[380px] w-full object-cover lg:h-[470px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071b52]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-white"><p className="text-xs font-black uppercase tracking-[.17em] text-blue-200">One app. Every day.</p><p className="mt-2 max-w-sm text-2xl font-black leading-tight">Professionals you can count on.</p><button onClick={() => navigate('all-services')} className="mt-5 inline-flex items-center gap-2 text-sm font-black transition hover:gap-3">Explore services <ArrowRight size={17} /></button></div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-white"><div className="website-wrap grid grid-cols-2 divide-x divide-blue-100 py-6 sm:grid-cols-4"><Metric icon={<Star size={18} fill="currentColor" />} value="4.8 / 5" label="average rating" /><Metric icon={<ShieldCheck size={18} />} value="Verified" label="service providers" /><Metric icon={<Clock3 size={18} />} value="Easy" label="booking in minutes" /><Metric icon={<Sparkles size={18} />} value="All-in-one" label="everyday help" /></div></section>

        <section id="categories" className="border-b border-blue-100 bg-white py-16"><div className="website-wrap"><div className="flex items-end justify-between gap-4"><div><p className="website-kicker">Browse by need</p><h2 className="website-title">How can we help today?</h2></div><button onClick={() => navigate('categories')} className="hidden items-center gap-1 text-sm font-black text-[#0967ff] sm:flex">See all <ArrowRight size={16} /></button></div><div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{categories.map(category => <button key={category.id} onClick={() => navigate('category-services', { id: category.id, label: category.label })} className="group rounded-2xl bg-[#f6f9ff] p-4 transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100"><img src={category.image} alt="" className="mx-auto h-24 w-full object-contain transition duration-300 group-hover:scale-105"/><p className="mt-3 text-center text-sm font-black">{category.label}</p></button>)}</div></div></section>

        <section id="providers" className="website-wrap py-16"><div className="flex items-end justify-between gap-4"><div><p className="website-kicker">Handpicked for you</p><h2 className="website-title">Popular near you</h2></div><button onClick={() => navigate('providers')} className="hidden items-center gap-1 text-sm font-black text-[#0967ff] sm:flex">View all <ArrowRight size={16} /></button></div><div className="mt-9 grid gap-6 md:grid-cols-3">{providers.map(provider => <article key={provider.name} className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_34px_rgba(30,75,150,.10)] ring-1 ring-blue-50 transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,75,150,.16)]"><img src={provider.image} alt="" className="h-52 w-full object-cover"/><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black">{provider.name}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{provider.category}</p></div><span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-black text-amber-600"><Star size={13} fill="currentColor" />{provider.rating}</span></div><div className="mt-5 flex items-center justify-between"><span className="text-sm font-black text-[#0967ff]">{provider.price}</span><button onClick={() => setSelectedService(provider.service)} className="rounded-xl bg-[#0967ff] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0759df]">Book now</button></div></div></article>)}</div></section>

        <section className="website-wrap pb-16"><div className="grid overflow-hidden rounded-[30px] bg-[#0967ff] text-white md:grid-cols-[1.1fr_.9fr]"><div className="p-8 sm:p-12"><p className="text-sm font-black uppercase tracking-[.16em] text-blue-200">Made for everyday life</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">A better way to get things done.</h2><p className="mt-4 max-w-md leading-7 text-blue-100">Find the right provider, select a time that works, and keep every booking in one place.</p><button onClick={() => navigate('login')} className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0967ff] shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5">Create your account</button></div><div className="hidden bg-[url('/assets/ai-banner-home-cleaning.jpg')] bg-cover bg-center md:block"/></div></section>
      </main>

      <footer className="border-t border-blue-100 bg-white"><div className="website-wrap flex flex-col justify-between gap-4 py-7 text-sm font-semibold text-slate-500 sm:flex-row"><p><span className="font-black text-[#0967ff]">helpy.</span> Your everyday services, made simple.</p><div className="flex gap-5"><button onClick={() => navigate('terms')} className="hover:text-[#0967ff]">Terms</button><button onClick={() => navigate('privacy')} className="hover:text-[#0967ff]">Privacy</button><button onClick={() => navigate('contact-us')} className="hover:text-[#0967ff]">Contact</button></div></div></footer>

      {selectedService && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091737]/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="booking-title"><div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="website-kicker">Ready when you are</p><h2 id="booking-title" className="mt-1 text-2xl font-black">Book {selectedService.name}</h2></div><button onClick={() => setSelectedService(null)} className="rounded-full bg-slate-100 p-2 text-slate-600" aria-label="Close booking dialog"><X size={18} /></button></div><p className="mt-4 text-sm leading-6 text-slate-600">You’re booking with <span className="font-black text-[#111a38]">{selectedService.provider}</span>. Choose a time and complete the details in the next step.</p><div className="mt-5 flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3"><span className="text-sm font-bold text-slate-600">Starting from</span><span className="text-lg font-black text-[#0967ff]">QAR {selectedService.price}</span></div><button onClick={() => navigate('service-detail', selectedService)} className="mt-5 w-full rounded-xl bg-[#0967ff] py-3.5 text-sm font-black text-white transition hover:bg-[#0759df]">Choose a time <ArrowRight size={16} className="ml-1 inline" /></button></div></div>}
    </div>
  )
}

function Metric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <div className="flex min-w-0 items-center gap-2 px-3 py-2 text-[#0967ff] sm:justify-center"><span className="hidden sm:block">{icon}</span><div className="min-w-0"><p className="truncate text-sm font-black text-[#111a38]">{value}</p><p className="truncate text-[10px] font-bold text-slate-500 sm:text-xs">{label}</p></div></div>
}
