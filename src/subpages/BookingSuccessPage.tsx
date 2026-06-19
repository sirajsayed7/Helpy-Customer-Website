import { CheckCircle2, CalendarDays, MapPin, MessageCircle } from 'lucide-react'
import { useNav } from '../context/NavContext'

export default function BookingSuccessPage() {
  const { params, setActiveTab, navigate } = useNav()
  const b = params || {}
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-8 bg-[#F0F6FF] gap-6">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={48} className="text-green-500"/>
      </div>
      <div className="text-center">
        <p className="text-[24px] font-bold text-gray-900">Booking Confirmed! 🎉</p>
        <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">Your booking with <strong>{b.provider}</strong> is confirmed. You'll receive a confirmation message shortly.</p>
      </div>
      <div className="w-full bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><span className="text-xl">{b.providerEmoji||'🧹'}</span></div><div><p className="text-[13px] font-bold text-gray-900">{b.provider}</p><p className="text-[12px] text-brand-500 font-semibold">{b.service}</p></div></div>
        <div className="flex items-center gap-2"><CalendarDays size={14} className="text-gray-400"/><span className="text-[13px] text-gray-700">{b.date} • {b.time}</span></div>
        <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400"/><span className="text-[13px] text-gray-700">Doha, Qatar</span></div>
        <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="text-[14px] font-bold text-gray-900">Total Paid</span><span className="text-[14px] font-bold text-brand-500">{b.price} QR</span></div>
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={()=>navigate('chat-thread',{name:b.provider,providerBg:b.providerBg,providerEmoji:b.providerEmoji,id:b.id})}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-brand-500 text-brand-500 text-[13px] font-bold">
          <MessageCircle size={16}/> Chat Provider
        </button>
        <button onClick={()=>setActiveTab('orders')} className="flex-1 py-3.5 rounded-2xl bg-brand-500 text-white text-[13px] font-bold shadow-sm">
          View Orders
        </button>
      </div>
    </div>
  )
}
