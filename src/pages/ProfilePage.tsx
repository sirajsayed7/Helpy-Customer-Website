import { Bell, ChevronRight, Wallet, Globe, Heart, MapPin, MessageCircle, FileText, Shield, LogOut, PenLine } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

export default function ProfilePage() {
  const { navigate } = useNav()
  const ACC = [
    {Icon:Wallet, bg:'bg-blue-50',color:'text-blue-500',label:'My Wallet',        sub:'View balance, payments & history',screen:'wallet'   ,right:null},
    {Icon:Globe,  bg:'bg-blue-50',color:'text-blue-500',label:'Language',          sub:'Choose your preferred language',  screen:null,       right:'English'},
    {Icon:Heart,  bg:'bg-blue-50',color:'text-blue-500',label:'My Favorites',      sub:'Saved places, services & stores', screen:'favorites',right:null},
    {Icon:MapPin, bg:'bg-blue-50',color:'text-blue-500',label:'Manage Addresses',  sub:'Your saved delivery addresses',  screen:'addresses',right:null},
  ]
  const MORE = [
    {Icon:MessageCircle,bg:'bg-blue-50',color:'text-blue-500',label:'Contact Us',       sub:"We're here to help",          screen:'contact-us'},
    {Icon:FileText,     bg:'bg-blue-50',color:'text-blue-500',label:'Terms of Services',sub:'Read our terms and conditions',screen:'terms'},
    {Icon:Shield,       bg:'bg-blue-50',color:'text-blue-500',label:'Privacy Policy',   sub:'How we protect your data',    screen:'privacy'},
  ]
  return (
    <div className="relative flex flex-col flex-1 bg-[#edf7ff] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]" />
      <div className="absolute -top-24 -left-20 h-[210px] w-[360px] rounded-full bg-white/75 blur-2xl" />
      <div className="absolute top-20 -right-28 h-[170px] w-[320px] rounded-full bg-[#d6ecff]/80 blur-2xl" />
      <StatusBar/>
      <div className="relative z-10 flex items-center justify-between px-5 pt-2 pb-3">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-[24px] font-bold text-gray-900">Profile</h1><span className="w-2 h-2 rounded-full bg-brand-500"/></div>
          <p className="text-[12px] text-gray-400 mt-0.5">Manage your account and preferences</p>
        </div>
        <button onClick={()=>navigate('notifications')} className="relative w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
          <Bell size={19} className="text-gray-600"/>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500"/>
        </button>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-32 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center shadow-md"><span className="text-3xl">👤</span></div>
            <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center border-2 border-white"><PenLine size={11} className="text-white"/></button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[18px] font-bold text-gray-900">Siraj Sayed</p>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L11.06 3.26L14.07 2.75L14.93 5.63L17.66 6.9L16.75 9.87L17.66 12.84L14.93 14.1L14.07 16.98L11.06 16.47L9 18.73L6.94 16.47L3.93 16.98L3.07 14.1L0.34 12.84L1.25 9.87L0.34 6.9L3.07 5.63L3.93 2.75L6.94 3.26L9 1Z" fill="#2563EB"/>
                <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[12px] text-gray-500">sirajsayed7@gmail.com</p>
            <div className="flex items-center gap-1 mt-1.5 bg-blue-50 rounded-full px-2.5 py-1 w-fit">
              <span className="text-brand-500 text-[11px]">✦</span>
              <span className="text-[11px] font-semibold text-brand-500">Helpy Member</span>
            </div>
          </div>
          <button><ChevronRight size={18} className="text-gray-300"/></button>
        </div>
        {/* Account section */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-0.5"><div className="w-1 h-4 rounded-full bg-brand-500"/><p className="text-[14px] font-bold text-gray-800">Account</p></div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {ACC.map(i=>(
              <button key={i.label} onClick={()=>i.screen&&navigate(i.screen as any)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50">
                <div className={`w-9 h-9 rounded-xl ${i.bg} flex items-center justify-center shrink-0`}><i.Icon size={17} className={i.color}/></div>
                <div className="flex-1 text-left"><p className="text-[13px] font-semibold text-gray-800">{i.label}</p><p className="text-[11px] text-gray-400 mt-0.5">{i.sub}</p></div>
                {i.right ? <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-3 py-1.5"><span className="text-[12px] font-semibold text-gray-700">{i.right}</span><ChevronRight size={12} className="text-gray-400"/></div>
                          : <ChevronRight size={15} className="text-gray-300 shrink-0"/>}
              </button>
            ))}
          </div>
        </div>
        {/* More section */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-0.5"><div className="w-1 h-4 rounded-full bg-brand-500"/><p className="text-[14px] font-bold text-gray-800">More</p></div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {MORE.map(i=>(
              <button key={i.label} onClick={()=>navigate(i.screen as any)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50">
                <div className={`w-9 h-9 rounded-xl ${i.bg} flex items-center justify-center shrink-0`}><i.Icon size={17} className={i.color}/></div>
                <div className="flex-1 text-left"><p className="text-[13px] font-semibold text-gray-800">{i.label}</p><p className="text-[11px] text-gray-400 mt-0.5">{i.sub}</p></div>
                <ChevronRight size={15} className="text-gray-300 shrink-0"/>
              </button>
            ))}
          </div>
        </div>
        {/* Sign out */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-4 active:bg-red-50">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0"><LogOut size={17} className="text-red-500"/></div>
            <p className="flex-1 text-left text-[14px] font-bold text-red-500">Sign Out</p>
            <ChevronRight size={15} className="text-gray-300 shrink-0"/>
          </button>
        </div>
      </div>
    </div>
  )
}
