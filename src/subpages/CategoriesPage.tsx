import { useState } from 'react'
import { ArrowLeft, Smartphone, GraduationCap, HeartPulse } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

const CATS = [
  {id:'cleaning', label:'Cleaning Services', img:'/assets/cat-uniform-cleaning.png', cardImg:'/assets/ref-card-cleaning.png'},
  {id:'craft', label:'Handyman Services', img:'/assets/cat-uniform-handyman.png', cardImg:'/assets/ref-card-craft.png'},
  {id:'design', label:'Design & Branding', img:'/assets/cat-uniform-design.png', cardImg:'/assets/ref-card-design.png'},
  {id:'gift', label:'Gifts', img:'/assets/cat-uniform-gifts.png', cardImg:'/assets/ref-card-gift.png'},
  {id:'gov', label:'Government Services', img:'/assets/cat-uniform-government.png', cardImg:'/assets/ref-card-gov.png'},
  {id:'hardware', label:'Tech Support', img:'/assets/cat-tech-support-clean-cutout.png', cardImg:'/assets/ref-card-hardware.png'},
  {id:'language', label:'Language Services', img:'/assets/cat-uniform-language.png', cardImg:'/assets/ref-card-language.png'},
  {id:'maintenance', label:'Maintenance Services', img:'/assets/cat-uniform-maintenance.png', cardImg:'/assets/ref-card-maintenance.png'},
  {id:'health', label:'Health & Wellness', img:'/assets/cat-uniform-health-wellness.png', cardImg:'/assets/ref-card-health.png'},
  {id:'treatment', label:'Healthcare Services', img:'/assets/cat-uniform-healthcare.png', cardImg:'/assets/ref-card-treatment.png'},
  {id:'tutoring', label:'Tutoring Services', img:'/assets/cat-tutoring-clean-cutout.png', cardImg:'/assets/ref-card-tutoring.png'},
  {id:'visuals', label:'Media Services', img:'/assets/cat-uniform-media.png', cardImg:'/assets/ref-card-visuals.png'},
  {id:'digital', label:'Digital', img:'/assets/cat-uniform-digital.png'},
  {id:'car', label:'Car Services', img:'/assets/cat-car-services-user-exact.png'},
  {id:'home', label:'Home Services', img:'/assets/cat-uniform-home-services.png'},
  {id:'laundry', label:'Laundry', img:'/assets/cat-uniform-laundry.png'},
  {id:'delivery', label:'Deliveries', img:'/assets/cat-uniform-delivery.png'},
  {id:'salon', label:'Salon & Spa', img:'/assets/cat-uniform-salon.png'},
  {id:'marketplace', label:'Marketplace', img:'/assets/cat-uniform-marketplace.png'},
]

export default function CategoriesPage() {
  const { goBack, navigate } = useNav()
  const [tab,setTab] = useState('All')
  const tabs = ['All','Digital','Education','Health Care']
  const filtered = CATS.filter(c => tab==='All' || (tab==='Digital' && ['digital','hardware','visuals','design'].includes(c.id)) || (tab==='Education' && ['education','tutoring','language'].includes(c.id)) || (tab==='Health Care' && ['health','treatment'].includes(c.id)))

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

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`shrink-0 h-11 px-4 rounded-[19px] border text-[14px] font-bold flex items-center gap-2 ${tab===t?'bg-[#0b4edb] text-white border-[#0b4edb] shadow-md':'bg-white text-black border-[#e5e7eb] shadow-sm'}`}>
              {t==='Digital'&&<Smartphone size={18}/>}
              {t==='Education'&&<GraduationCap size={19}/>}
              {t==='Health Care'&&<HeartPulse size={19}/>}
              {t}
            </button>
          ))}
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
        </div>
      </div>
    </div>
  )
}
