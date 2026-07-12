import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Search } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

const CATS = [
  {id:'cleaning', label:'Cleaning', img:'/assets/cat-uniform-cleaning.png', cardImg:'/assets/ref-card-cleaning.png'},
  {id:'maintenance', label:'Maintenance', img:'/assets/cat-uniform-handyman.png', cardImg:'/assets/ref-card-craft.png'},
  {id:'design', label:'Design & Branding', img:'/assets/cat-uniform-design.png', cardImg:'/assets/ref-card-design.png'},
  {id:'gift', label:'Gifts', img:'/assets/cat-uniform-gifts.png', cardImg:'/assets/ref-card-gift.png'},
  {id:'gov', label:'Government', img:'/assets/cat-uniform-government.png', cardImg:'/assets/ref-card-gov.png'},
  {id:'hardware', label:'Tech Support', img:'/assets/cat-tech-support-clean-cutout.png', cardImg:'/assets/ref-card-hardware.png'},
  {id:'language', label:'Language', img:'/assets/cat-uniform-language.png', cardImg:'/assets/ref-card-language.png'},
  {id:'health', label:'Health & Wellness', img:'/assets/cat-uniform-health-wellness.png', cardImg:'/assets/ref-card-health.png'},
  {id:'tutoring', label:'Tutoring & Training', img:'/assets/cat-tutoring-clean-cutout.png', cardImg:'/assets/ref-card-tutoring.png'},
  {id:'visuals', label:'Media', img:'/assets/cat-uniform-media.png', cardImg:'/assets/ref-card-visuals.png'},
  {id:'digital', label:'Digital', img:'/assets/cat-uniform-digital.png'},
  {id:'car', label:'Car Services', img:'/assets/cat-car-services-user-exact.png'},
  {id:'home', label:'Home', img:'/assets/cat-uniform-home-services.png'},
  {id:'laundry', label:'Laundry', img:'/assets/cat-uniform-laundry.png'},
  {id:'pets', label:'Pets', img:'/assets/cat-pets-dog-cat-food.png'},
  {id:'delivery', label:'Deliveries', img:'/assets/cat-uniform-delivery.png'},
  {id:'salon', label:'Salon & Spa', img:'/assets/cat-uniform-salon.png'},
  {id:'marketplace', label:'Marketplace', img:'/assets/cat-uniform-marketplace.png'},
]

export default function CategoriesPage() {
  const { goBack, navigate } = useNav()
  const [categoryType,setCategoryType] = useState('All categories')
  const [showCategoryFilter,setShowCategoryFilter] = useState(false)
  const [search,setSearch] = useState('')
  const categoryFilterRef = useRef<HTMLDivElement | null>(null)
  const categoryTypes = ['All categories','Digital','Education','Health Care','Home Services','Car Services','Lifestyle']
  const normalizedSearch = search.trim().toLowerCase()
  const filtered = CATS.filter(c => {
    const matchesType =
      categoryType === 'All categories' ||
      (categoryType === 'Digital' && ['digital','hardware','visuals','design'].includes(c.id)) ||
      (categoryType === 'Education' && ['tutoring','language'].includes(c.id)) ||
      (categoryType === 'Health Care' && c.id === 'health') ||
      (categoryType === 'Home Services' && ['cleaning','maintenance','home','laundry'].includes(c.id)) ||
      (categoryType === 'Car Services' && c.id === 'car') ||
      (categoryType === 'Lifestyle' && ['gift','salon','marketplace','delivery','pets'].includes(c.id))
    const matchesSearch = !normalizedSearch || c.label.toLowerCase().includes(normalizedSearch)
    return matchesType && matchesSearch
  })

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!categoryFilterRef.current?.contains(event.target as Node)) {
        setShowCategoryFilter(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const openCategory = (c: typeof CATS[number]) => {
    const isCleaning = c.id === 'cleaning' || c.id === 'home'
    navigate(isCleaning ? 'service-detail' : 'category-services', isCleaning ? {
      provider:'Scrubs Cleaning',
      name:'General Cleaning',
      price:'160.00',
      providerBg:'bg-red-500',
      providerEmoji:'SC',
    } : {id:c.id,label:c.label})
  }

  return (
    <div className="relative flex flex-col flex-1 bg-[#eef7ff] overflow-hidden">
      <img
        src="/assets/home-wave-background.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top opacity-30"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#f6fbff]/35" aria-hidden="true" />
      <StatusBar time="11:07" />

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-28">
        <button onClick={goBack} className="mt-3 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#0c57d8]">
          <ArrowLeft size={23}/>
        </button>

        <h1 className="mt-5 text-[34px] font-black tracking-tight text-black">Categories</h1>

        <div className="mt-5 h-12 rounded-[24px] bg-white px-4 shadow-sm ring-1 ring-[#dbeafe] flex items-center gap-3">
          <Search size={20} className="shrink-0 text-[#0967ff]" />
          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search categories"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[#10152f] outline-none placeholder:text-[#8490a8]"
          />
        </div>

        <div ref={categoryFilterRef} className="relative mt-3">
          <button
            onClick={()=>setShowCategoryFilter(v=>!v)}
            className="flex h-12 w-full items-center justify-between rounded-[24px] bg-white px-4 text-left shadow-sm ring-1 ring-[#dbeafe] active:scale-[0.99] transition"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#7b88a2]">Category type</span>
              <span className="block truncate text-[15px] font-black text-[#10152f]">{categoryType}</span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#0967ff]">
              <ChevronDown size={20} className={`transition ${showCategoryFilter ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {showCategoryFilter && (
            <div className="absolute left-0 right-0 top-[58px] z-30 overflow-hidden rounded-[24px] bg-white p-2 shadow-xl ring-1 ring-black/5">
              {categoryTypes.map(type=>(
                <button
                  key={type}
                  onClick={()=>{
                    setCategoryType(type)
                    setShowCategoryFilter(false)
                  }}
                  className={`flex h-11 w-full items-center justify-between rounded-[18px] px-3 text-left text-[14px] font-black transition ${categoryType === type ? 'bg-[#0967ff] text-white' : 'text-[#10152f] hover:bg-[#f4f8ff]'}`}
                >
                  {type}
                  {categoryType === type && <Check size={17} strokeWidth={3}/>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {filtered.map(c=>(
            <button
              key={c.id}
              onClick={()=>openCategory(c)}
              className="h-[126px] rounded-[22px] bg-gradient-to-b from-white via-[#fbfdff] to-[#eef7ff] border border-white/90 px-2 pt-2 pb-2 text-center shadow-[0_10px_24px_rgba(18,92,170,0.12)] flex flex-col items-center justify-between active:scale-95 transition overflow-visible"
            >
              <div className="relative h-[80px] w-full flex items-center justify-center overflow-visible">
                <img
                  src={c.img}
                  alt=""
                  className={`relative z-10 object-contain ${
                    c.id === 'car' ? 'h-[90px] w-[114px]' :
                    c.id === 'maintenance' ? 'h-[82px] w-[114px]' :
                    ['hardware','tutoring'].includes(c.id) ? 'h-[86px] w-[112px]' :
                    'h-[82px] w-[104px]'
                  }`}
                />
              </div>
              <p className="min-h-[32px] max-w-full flex items-center justify-center text-center text-[15px] leading-[16px] font-semibold tracking-[-0.01em] text-[#202124] whitespace-pre-line break-normal">
                {c.label}
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <button
              onClick={()=>{
                setSearch('')
                setCategoryType('All categories')
              }}
              className="col-span-3 rounded-[22px] bg-white py-8 text-center text-[14px] font-black text-[#0967ff] shadow-sm"
            >
              No categories found. Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
