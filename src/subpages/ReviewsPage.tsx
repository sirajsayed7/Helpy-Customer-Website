import { useState } from 'react'
import { ArrowLeft, Check, ChevronDown, SlidersHorizontal, Star } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'
import { PROVIDERS } from '../pages/ServiceDetailPage'

type StarFilter = 'All' | 5 | 4 | 3 | 2 | 1

const REVIEWERS = [
  ['Mariam A.', 'MA'], ['Khalid R.', 'KR'], ['Noora S.', 'NS'], ['Ahmed M.', 'AM'],
  ['Layla H.', 'LH'], ['Fatima J.', 'FJ'], ['Omar T.', 'OT'], ['Sara B.', 'SB'],
]
const DATES = ['2 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '1 month ago', '2 months ago', '3 months ago']
const RATINGS = [5, 5, 4, 5, 3, 4, 2, 1]

function reviewText(category: string, provider: string, service: string, rating: number) {
  if (rating === 1) return `The ${service.toLowerCase()} did not fully meet my expectations, but ${provider} responded to my feedback.`
  if (rating === 2) return `The ${service.toLowerCase()} was acceptable, although the timing and final result could be improved.`
  if (rating === 3) return `A good ${service.toLowerCase()} overall. The team was polite, but there is still some room for improvement.`
  const categoryCopy: Record<string, string[]> = {
    'Home Services': ['The team was careful, thorough, and left everything looking refreshed.', 'Professional staff, excellent attention to detail, and a very smooth booking.'],
    'Car Services': ['My car looked clean and polished, and the team handled it with real care.', 'Fast, careful work with a noticeably better finish than I expected.'],
    'Salon & Spa': ['The specialist was attentive, professional, and made the whole experience relaxing.', 'Beautiful result, clean setup, and thoughtful service from start to finish.'],
    'Laundry': ['Everything came back fresh, neatly folded, and ready exactly when promised.', 'Excellent garment care with convenient pickup and clear communication.'],
    'Travel': ['The booking was organized clearly and every detail was confirmed without hassle.', 'Helpful planning, quick communication, and a smooth experience from start to finish.'],
    'Deliveries': ['The pickup was on time and the item arrived safely with useful status updates.', 'Quick, reliable delivery and clear communication throughout the trip.'],
    'Maintenance': ['The technician diagnosed the issue quickly and completed a clean, reliable repair.', 'Professional troubleshooting, clear pricing, and the problem was resolved properly.'],
    'Digital Services': ['Clear communication, thoughtful execution, and the final work matched the brief.', 'The work was delivered professionally with useful updates and attention to detail.'],
    'Education': ['The session was clear, patient, and tailored well to the learner’s needs.', 'A focused and encouraging lesson with practical explanations and useful feedback.'],
  }
  const options = categoryCopy[category] || ['Professional service, clear communication, and a result I was happy with.', 'The experience was smooth, reliable, and handled with care.']
  return `${service} was excellent. ${options[rating === 5 ? 0 : 1]}`
}

function buildReviews(provider: string, category: string, services: string[]) {
  return REVIEWERS.map(([name, initials], index) => {
    const service = services[index % services.length]
    const rating = RATINGS[index]
    return { id: index + 1, name, initials, rating, date: DATES[index], service, text: reviewText(category, provider, service, rating) }
  })
}

const FILTERS: StarFilter[] = ['All', 5, 4, 3, 2, 1]

export default function ReviewsPage() {
  const { goBack, params } = useNav()
  const provider = params?.provider || 'Scrubs Cleaning'
  const cfg = PROVIDERS[provider] || PROVIDERS['Scrubs Cleaning']
  const reviews = buildReviews(cfg.label, cfg.category, cfg.services.map(service => service.label))
  const [filter, setFilter] = useState<StarFilter>('All')
  const [serviceFilter, setServiceFilter] = useState('All services')
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)
  const services = Array.from(new Set(reviews.map(review => review.service)))
  const visible = reviews.filter(review =>
    (filter === 'All' || review.rating === filter) &&
    (serviceFilter === 'All services' || review.service === serviceFilter)
  )

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#eef7ff]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fcff_0%,#eef7ff_55%,#f5f9ff_100%)]" />
      <StatusBar />

      <header className="relative z-10 flex items-center gap-3 px-4 pb-3 pt-2">
        <button onClick={goBack} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm" aria-label="Go back">
          <ArrowLeft size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[24px] font-black text-gray-950">Customer Reviews</h1>
          <p className="truncate text-[12px] font-semibold text-gray-500">{cfg.label}</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        <section className="rounded-[24px] border border-white bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-[42px] font-black leading-none text-gray-950">{cfg.rating}</p>
              <div className="mt-2 flex justify-center gap-0.5">
                {[1,2,3,4,5].map(star => <Star key={star} size={15} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="mt-1 text-[11px] font-semibold text-gray-500">{cfg.reviews} reviews</p>
            </div>
            <div className="h-20 w-px bg-gray-100" />
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map(star => {
                const width = {5:82,4:12,3:4,2:1,1:1}[star]
                return <div key={star} className="flex items-center gap-2"><span className="w-2 text-[11px] font-bold text-gray-500">{star}</span><Star size={11} className="fill-amber-400 text-amber-400"/><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-amber-400" style={{width:`${width}%`}} /></div></div>
              })}
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-20 -mx-4 mt-2 space-y-3 bg-[#eef7ff]/95 px-4 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto">
            {FILTERS.map(item => (
              <button key={item} onClick={() => setFilter(item)} className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12px] font-black transition ${filter === item ? 'bg-brand-500 text-white shadow-sm' : 'border border-gray-100 bg-white text-gray-600'}`}>
                {item !== 'All' && <Star size={12} className={filter === item ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'} />}
                {item === 'All' ? 'All reviews' : item}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setServiceMenuOpen(open => !open)}
              className={`flex h-12 w-full items-center gap-3 rounded-2xl border bg-white px-4 text-left shadow-sm transition ${serviceMenuOpen ? 'border-brand-500 ring-2 ring-blue-100' : 'border-gray-100'}`}
              aria-expanded={serviceMenuOpen}
              aria-haspopup="listbox"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-500"><SlidersHorizontal size={15}/></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">Filter by service</span>
                <span className="block truncate text-[13px] font-black text-gray-900">{serviceFilter}</span>
              </span>
              <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform ${serviceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {serviceMenuOpen && (
              <div className="absolute left-0 right-0 top-[56px] z-30 overflow-hidden rounded-[20px] border border-gray-100 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)]" role="listbox">
                {['All services', ...services].map(service => {
                  const selected = serviceFilter === service
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => { setServiceFilter(service); setServiceMenuOpen(false) }}
                      className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition ${selected ? 'bg-blue-50 text-brand-500' : 'text-gray-700 active:bg-gray-50'}`}
                      role="option"
                      aria-selected={selected}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-brand-500 text-white' : 'border border-gray-200 bg-white'}`}>{selected && <Check size={13}/>}</span>
                      <span className="flex-1 text-[13px] font-bold">{service}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {visible.map(review => (
            <article key={review.id} className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] font-black text-brand-500">{review.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-[14px] font-black text-gray-950">{review.name}</p><p className="text-[11px] text-gray-400">{review.date}</p></div>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(star => <Star key={star} size={13} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'} />)}</div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-brand-500"><Check size={11}/>{review.service}</div>
                  <p className="mt-2 text-[13px] leading-5 text-gray-600">{review.text}</p>
                </div>
              </div>
            </article>
          ))}
          {visible.length === 0 && <div className="rounded-[22px] bg-white p-8 text-center text-[13px] font-semibold text-gray-500">No reviews match these filters.</div>}
        </div>
      </main>
    </div>
  )
}
