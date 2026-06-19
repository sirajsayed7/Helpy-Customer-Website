import { useState } from 'react'
import { Search, PenSquare, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const BASE_CONVOS = [
  {id:'scrubs',name:'Scrubs Cleaning',verified:true,tag:'General Cleaning',meta:'May 30, 12:00 PM',preview:'Your booking for May 30 at 12:00 PM is confirmed. Our team will arrive a few minutes early.',time:'10:30 AM',unread:2,online:true,providerBg:'bg-red-500',emoji:'SC',image:'/assets/scrubs-leaf-logo-clean.png'},
  {id:'happy',name:'Happy Home Services',verified:true,tag:'Deep Cleaning',meta:'Jun 1, 10:00 AM',preview:"Thank you for booking. We'll bring all cleaning supplies and confirm access before arrival.",time:'Yesterday',unread:1,online:true,providerBg:'bg-amber-400',emoji:'HH',image:'/assets/ai-avatar-happyhome.jpg'},
  {id:'support',name:'Helpy Support',verified:false,tag:'Support',meta:null,preview:'Need help with a booking, wallet, or provider? Our support team is here.',time:'Yesterday',unread:0,online:false,providerBg:'bg-brand-500',emoji:'HS',image:'/assets/ai-avatar-support.jpg'},
  {id:'sparkle',name:'Sparkle Auto Wash',verified:true,tag:'Car Services',meta:null,preview:'Your premium wash slot is available tomorrow. Tap to confirm or choose another time.',time:'May 28',unread:0,online:false,providerBg:'bg-blue-500',emoji:'SA',image:'/assets/ai-profile-sparkle-carwash.jpg'},
  {id:'freshfold',name:'FreshFold Laundry',verified:true,tag:'Laundry',meta:null,preview:'Wash & Fold, dry cleaning, and ironing slots are available with pickup support.',time:'May 28',unread:0,online:true,providerBg:'bg-sky-500',emoji:'FL',image:'/assets/ai-provider-freshfold-real-logo.png'},
  {id:'bytecare',name:'ByteCare Digital',verified:true,tag:'Digital',meta:null,preview:'We can help with device setup, backups, and troubleshooting whenever you are ready.',time:'May 28',unread:0,online:true,providerBg:'bg-cyan-500',emoji:'BD',image:'/assets/ai-provider-bytecare-digital.png'},
  {id:'brightpath',name:'BrightPath Tutors',verified:true,tag:'Education',meta:null,preview:'Your tutor can prepare a focused lesson plan after you choose the subject and time.',time:'May 27',unread:0,online:true,providerBg:'bg-amber-500',emoji:'BT',image:'/assets/ai-provider-brightpath-tutors.png'},
  {id:'quickfix',name:'QuickFix Maintenance',verified:true,tag:'Maintenance',meta:null,preview:"We've received your AC service request. A technician will contact you shortly.",time:'May 27',unread:0,online:true,providerBg:'bg-green-500',emoji:'QF',image:'/assets/ai-avatar-quickfix.jpg'},
  {id:'luxe',name:'Luxe Beauty Lounge',verified:true,tag:'Salon & Spa',meta:null,preview:'Hair styling and makeup slots are available this week with home visit support.',time:'May 27',unread:0,online:true,providerBg:'bg-rose-500',emoji:'LB',image:'/assets/ai-avatar-luxe.jpg'},
  {id:'doha-swift',name:'Doha Swift Delivery',verified:true,tag:'Deliveries',meta:null,preview:'Same-day parcel and document delivery is available across Doha today.',time:'May 27',unread:0,online:true,providerBg:'bg-blue-500',emoji:'DS',image:'/assets/ai-homecat-delivery.png'},
  {id:'pixelnest',name:'PixelNest Studio',verified:true,tag:'Digital',meta:null,preview:'Send your business details and we will shape a clean starter website plan.',time:'May 26',unread:0,online:false,providerBg:'bg-violet-500',emoji:'PN',image:'/assets/ai-provider-pixelnest-studio.png'},
  {id:'summit',name:'Summit Learning Hub',verified:true,tag:'Education',meta:null,preview:'Exam prep slots are available this week for IELTS, math, and science coaching.',time:'May 26',unread:0,online:false,providerBg:'bg-emerald-500',emoji:'SL',image:'/assets/ai-provider-summit-learning.png'},
  {id:'offers',name:'Helpy Offers',verified:false,tag:'Offer',meta:null,preview:'A fresh offer is ready for your next home, car, or salon booking.',time:'May 25',unread:0,online:false,providerBg:'bg-pink-400',emoji:'%',image:'/assets/helpy-logo-transparent.png'},
]
const FTABS = [{id:'all',label:'All'},{id:'bookings',label:'Bookings'},{id:'offers',label:'Offers'},{id:'support',label:'Support'}]

function ProviderAvatar({image, bg, fallback}:{image?:string; bg:string; fallback:string}) {
  return (
    <div className={`w-12 h-12 rounded-full ${image ? 'bg-white' : bg} flex items-center justify-center text-white text-sm font-black shadow-sm overflow-hidden`}>
      {image ? <img src={image} className="w-full h-full object-cover"/> : fallback}
    </div>
  )
}

export default function ChatPage() {
  const { navigate, bookedServices } = useNav()
  const [ft, setFt] = useState('all')
  const [q, setQ] = useState('')

  const bookedConvos = bookedServices.map(b => ({
    id: b.id, name: b.provider, verified: true, tag: b.service,
    meta: `${b.date}, ${b.time}`, preview: `Your ${b.service} booking is confirmed for ${b.date} at ${b.time}.`,
    time: 'Just now', unread: 1, online: true,
    emoji: b.providerEmoji, providerBg: b.providerBg, image: b.providerImage
  }))
  const allConvos = [...bookedConvos, ...BASE_CONVOS]
  const filtered = allConvos.filter(c => {
    const mq = c.name.toLowerCase().includes(q.toLowerCase()) || c.preview.toLowerCase().includes(q.toLowerCase())
    const mf = ft === 'all' || (ft === 'bookings' && !['Offer','Support'].includes(c.tag)) || (ft === 'offers' && c.tag === 'Offer') || (ft === 'support' && c.tag === 'Support')
    return mq && mf
  })

  const countFor = (id:string) => allConvos.filter(c => id === 'all' || (id === 'bookings' && !['Offer','Support'].includes(c.tag)) || (id === 'offers' && c.tag === 'Offer') || (id === 'support' && c.tag === 'Support')).length

  return (
    <div className="relative flex flex-col flex-1 bg-[#edf7ff] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]" />
      <div className="absolute -top-24 -left-20 h-[210px] w-[360px] rounded-full bg-white/75 blur-2xl" />
      <div className="absolute top-20 -right-28 h-[170px] w-[320px] rounded-full bg-[#d6ecff]/80 blur-2xl" />
      <StatusBar/>
      <div className="relative z-10 flex items-center justify-between px-5 pt-2 pb-1">
        <div>
          <h1 className="text-[24px] font-black text-gray-950">Messages</h1>
          <p className="text-[12px] text-gray-500 mt-0.5">Provider updates, support, and booking replies.</p>
        </div>
        <button onClick={()=>navigate('contact-us')} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
          <PenSquare size={18} className="text-brand-500"/>
        </button>
      </div>
      <div className="relative z-10 flex items-center gap-2 px-4 mt-3">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-3 shadow-sm">
          <Search size={16} className="text-gray-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search messages..." className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"/>
        </div>
        <button onClick={()=>setFt('all')} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
          <SlidersHorizontal size={17} className="text-gray-500"/>
        </button>
      </div>
      <div className="relative z-10 flex gap-2 px-4 mt-3 overflow-x-auto pb-1">
        {FTABS.map(f=>(
          <button key={f.id} onClick={()=>setFt(f.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${ft===f.id?'bg-brand-500 text-white':'bg-white text-gray-600 shadow-sm'}`}>
            {f.label} <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ft===f.id?'bg-white/20':'bg-gray-100'}`}>{countFor(f.id)}</span>
          </button>
        ))}
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 mt-3 pb-36">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {filtered.map(c=>(
            <button key={c.id} onClick={()=>navigate('chat-thread',{...c,providerImage:c.image,providerEmoji:c.emoji})}
              className="w-full flex items-start gap-3 p-4 active:bg-gray-50 text-left">
              <div className="relative shrink-0">
                <ProviderAvatar image={c.image} bg={c.providerBg} fallback={c.emoji}/>
                {c.online&&<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-[13px] font-black text-gray-950 truncate">{c.name}</p>
                    {c.verified && (
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="shrink-0">
                        <path d="M9 1L11.06 3.26L14.07 2.75L14.93 5.63L17.66 6.9L16.75 9.87L17.66 12.84L14.93 14.1L14.07 16.98L11.06 16.47L9 18.73L6.94 16.47L3.93 16.98L3.07 14.1L0.34 12.84L1.25 9.87L0.34 6.9L3.07 5.63L3.93 2.75L6.94 3.26L9 1Z" fill="#2563EB"/>
                        <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">{c.time}</span>
                </div>
                {c.meta&&<div className="flex items-center gap-1 mt-0.5"><span className="text-[10px] font-bold text-brand-500 bg-blue-50 px-2 py-0.5 rounded-full">{c.tag}</span><span className="text-[10px] text-gray-400">{c.meta}</span></div>}
                <p className="text-[12px] text-gray-500 mt-1 line-clamp-2 leading-snug">{c.preview}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {c.unread?<span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>:<ChevronRight size={15} className="text-gray-300"/>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
