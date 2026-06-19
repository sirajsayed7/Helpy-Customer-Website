import { useState } from 'react'
import { ArrowLeft, Phone, Video, Send, Paperclip, Smile } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

const INIT_MSGS: Record<string, {from:string;text:string;time:string}[]> = {
  'Scrubs Cleaning': [
    {from:'provider',text:'Hi la santi. Your booking for May 30 at 12:00 PM is confirmed.',time:'10:30 AM'},
    {from:'provider',text:'Our team will arrive 10 minutes early to set up. Please ensure access to all rooms.',time:'10:31 AM'},
    {from:'me',text:"Great, thank you. I'll make sure everything is ready.",time:'10:35 AM'},
    {from:'provider',text:'Perfect. See you on May 30.',time:'10:36 AM'},
  ],
  'Happy Home Services': [
    {from:'provider',text:"Thanks for your feedback. We're glad you're happy with our service.",time:'Yesterday'},
    {from:'me',text:'The team did an amazing job. Very thorough.',time:'Yesterday'},
  ],
  default: [
    {from:'provider',text:'Hello. How can I help you today?',time:'Just now'},
  ]
}

const QUICK = ['On my way','When do you arrive?','Job completed','Confirm address','Thank you']

export default function ChatThreadPage() {
  const { goBack, params } = useNav()
  const name = params?.name || 'Service Provider'
  const emoji = params?.providerEmoji || 'SP'
  const bg = params?.providerBg || 'bg-brand-500'
  const image = params?.providerImage

  const initKey = Object.keys(INIT_MSGS).find(k => name.includes(k.split(' ')[0])) || 'default'
  const [msgs, setMsgs] = useState(INIT_MSGS[initKey] || INIT_MSGS.default)
  const [text, setText] = useState('')

  const send = (t: string) => {
    if (!t.trim()) return
    setMsgs(m => [...m, {from:'me',text:t.trim(),time:'now'}])
    setText('')
    setTimeout(() => {
      setMsgs(m => [...m, {from:'provider',text:"Thanks for your message. We'll get back to you shortly.",time:'now'}])
    }, 1500)
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F4F6FF] overflow-hidden">
      <StatusBar/>
      <div className="bg-white shadow-sm px-4 pt-1 pb-3 flex items-center gap-3 shrink-0">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={19} className="text-gray-600"/>
        </button>
        <div className={`w-10 h-10 rounded-full ${image ? 'bg-white' : bg} flex items-center justify-center text-white text-sm font-black shrink-0 overflow-hidden`}>
          {image ? <img src={image} className="w-full h-full object-cover"/> : emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-gray-900 truncate">{name}</p>
          <p className="text-[11px] text-green-500 font-semibold">Online</p>
        </div>
        <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Phone size={17} className="text-brand-500"/></button>
        <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Video size={17} className="text-brand-500"/></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="text-center"><span className="text-[11px] text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">Today</span></div>
        {msgs.map((m,i)=>(
          <div key={i} className={`flex ${m.from==='me'?'justify-end':'justify-start'}`}>
            {m.from==='provider'&&<div className={`w-8 h-8 rounded-full ${image ? 'bg-white' : bg} flex items-center justify-center text-white text-xs font-black mr-2 self-end shrink-0 overflow-hidden`}>
              {image ? <img src={image} className="w-full h-full object-cover"/> : emoji}
            </div>}
            <div className={`max-w-[74%] px-4 py-2.5 rounded-2xl shadow-sm ${m.from==='me'?'bg-brand-500 text-white rounded-br-sm':'bg-white text-gray-800 rounded-bl-sm'}`}>
              <p className="text-[13px] leading-5">{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.from==='me'?'text-white/65':'text-gray-400'}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pb-2 flex gap-2 overflow-x-auto shrink-0">
        {QUICK.map(q=>(
          <button key={q} onClick={()=>send(q)} className="shrink-0 text-[11px] font-semibold text-brand-500 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full whitespace-nowrap">{q}</button>
        ))}
      </div>
      <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-center gap-2 shrink-0">
        <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><Paperclip size={16} className="text-gray-400"/></button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-3 py-2 gap-2 min-w-0">
          <input className="flex-1 min-w-0 bg-transparent text-[13px] outline-none placeholder:text-gray-400" placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(text)}/>
          <Smile size={16} className="text-gray-400 shrink-0"/>
        </div>
        <button onClick={()=>send(text)} className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm"><Send size={15} className="text-white"/></button>
      </div>
    </div>
  )
}
