import { useState } from 'react'
import { Search, ChevronRight, CalendarDays, MapPin, MessageCircle, Star } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

const DEFAULT_ORDERS = [
  {id:'o1',provider:'Scrubs Cleaning',service:'General Cleaning',date:'May 30, 2026',time:'12:00 PM',price:'160.00',status:'Confirmed',providerBg:'bg-red-500',providerEmoji:'SC',providerImage:'/assets/scrubs-leaf-logo-clean.png',location:'The Pearl-Qatar'},
  {id:'o2',provider:'QuickFix Maintenance',service:'AC Service',date:'Jun 5, 2026',time:'10:00 AM',price:'120.00',status:'Confirmed',providerBg:'bg-green-500',providerEmoji:'QF',providerImage:'/assets/ai-avatar-quickfix.jpg',location:'West Bay, Doha'},
  {id:'o3',provider:'Happy Home Services',service:'Deep Cleaning',date:'May 20, 2026',time:'09:00 AM',price:'220.00',status:'Completed',providerBg:'bg-amber-400',providerEmoji:'HH',providerImage:'/assets/ai-avatar-happyhome.jpg',location:'Lusail City'},
  {id:'o4',provider:'Sparkle Auto Wash',service:'Premium Wash',date:'May 15, 2026',time:'11:00 AM',price:'75.00',status:'Completed',providerBg:'bg-blue-500',providerEmoji:'SA',providerImage:'/assets/ai-profile-sparkle-carwash.jpg',location:'Al Sadd, Doha'},
]

const SC:Record<string,string> = {
  'Confirmed':'bg-green-100 text-green-600',
  'In Progress':'bg-amber-100 text-amber-600',
  'Completed':'bg-blue-100 text-blue-600'
}

function ProviderAvatar({image, bg, fallback}:{image?:string; bg:string; fallback:string}) {
  return (
    <div className={`w-12 h-12 rounded-full ${image ? 'bg-white' : bg} flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0 overflow-hidden`}>
      {image ? <img src={image} className="w-full h-full object-cover"/> : fallback}
    </div>
  )
}

export default function OrdersPage() {
  const { navigate, bookedServices } = useNav()
  const [tab, setTab] = useState<'active'|'completed'>('active')

  const all = [
    ...bookedServices.map(b=>({...b,location:'Doha, Qatar'})),
    ...DEFAULT_ORDERS
  ]
  const filtered = all.filter(o => tab==='active' ? o.status!=='Completed' : o.status==='Completed')

  return (
    <div className="relative flex flex-col flex-1 bg-[#edf7ff] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]" />
      <div className="absolute -top-24 -left-20 h-[210px] w-[360px] rounded-full bg-white/75 blur-2xl" />
      <div className="absolute top-20 -right-28 h-[170px] w-[320px] rounded-full bg-[#d6ecff]/80 blur-2xl" />
      <StatusBar/>
      <div className="relative z-10 flex items-center justify-between px-5 pt-2 pb-3">
        <div><h1 className="text-[24px] font-black text-gray-950">My Orders</h1><p className="text-[12px] text-gray-500 mt-0.5">Track bookings, payments, and provider updates.</p></div>
        <button onClick={()=>navigate('home')} className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center"><Search size={17} className="text-gray-500"/></button>
      </div>
      <div className="relative z-10 px-4 mb-4">
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          {(['active','completed'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${tab===t?'bg-white text-brand-500 shadow-sm':'text-gray-500'}`}>
              {t==='active'?'Active':'Completed'}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-36 space-y-3">
        {filtered.length===0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center"><CalendarDays className="text-brand-500"/></div>
            <p className="text-[14px] font-semibold text-gray-500">No orders here yet.</p>
            <button onClick={()=>navigate('home')} className="text-brand-500 text-[13px] font-bold">Browse services</button>
          </div>
        )}
        {filtered.map(o=>(
          <button key={o.id} onClick={()=>navigate('order-detail',o)} className="w-full bg-white rounded-2xl shadow-sm p-4 text-left active:scale-[0.99] transition-transform">
            <div className="flex items-start gap-3">
              <ProviderAvatar image={o.providerImage} bg={o.providerBg} fallback={o.providerEmoji}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] font-black text-gray-950 truncate">{o.provider}</p>
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${SC[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </div>
                <p className="text-[12px] text-brand-500 font-bold mt-0.5">{o.service}</p>
                <div className="flex items-center gap-1.5 mt-1.5"><CalendarDays size={12} className="text-gray-400"/><span className="text-[11px] text-gray-500">{o.date} at {o.time}</span></div>
                <div className="flex items-center gap-1.5 mt-0.5"><MapPin size={12} className="text-gray-400"/><span className="text-[11px] text-gray-500">{o.location}</span></div>
              </div>
              <ChevronRight size={15} className="text-gray-300 shrink-0 mt-1"/>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <p className="text-[15px] font-black text-gray-950">{o.price} QR</p>
              <div className="flex gap-2">
                <button onClick={e=>{e.stopPropagation();navigate('chat-thread',{id:o.id,name:o.provider,providerBg:o.providerBg,providerEmoji:o.providerEmoji,providerImage:o.providerImage})}}
                  className="flex items-center gap-1 text-[12px] font-bold text-brand-500 bg-blue-50 px-3 py-1.5 rounded-xl">
                  <MessageCircle size={13}/>Chat
                </button>
                {o.status==='Completed' && (
                  <button onClick={e=>e.stopPropagation()} className="flex items-center gap-1 text-[12px] font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl">
                    <Star size={13}/>Review
                  </button>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
